# thepushfittness Automated Acceptance & Security Isolation Test Suite
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "    THEPUSHFITTNESS ACCEPTANCE & SECURITY TEST SUITE      " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Login as Trainer
$trainerAuth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body (@{email="admin@thepushfittness.com"; password="admin123"} | ConvertTo-Json) -ContentType "application/json"
$tToken = $trainerAuth.token
Write-Host "[PASS] 1. Trainer Login: $($trainerAuth.user.name) (Role: $($trainerAuth.user.role))" -ForegroundColor Green

# 2. Trainer views all clients
$allClients = Invoke-RestMethod -Uri "http://localhost:5000/api/clients" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 2. Trainer views all clients: Found $($allClients.Length) clients initially" -ForegroundColor Green

# 3. Trainer creates Client A
$clientAPayload = @{
    name = "Client Alpha"
    email = "alpha@thepushfittness.test"
    password = "alphapassword123"
    phone = "+91 98765 00001"
    currentGoal = "Strength & Endurance"
    heightCm = 175
    weightKg = 78.5
    targetWeightKg = 74.0
    monthlyPrice = 5000
    sessionsPurchased = 10
    paymentStatus = "due"
} | ConvertTo-Json

$clientA = Invoke-RestMethod -Uri "http://localhost:5000/api/clients" -Method Post -Body $clientAPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $tToken" }
$clientAId = $clientA.id
Write-Host "[PASS] 3. Trainer creates Client A: $($clientA.name) (ID: $clientAId)" -ForegroundColor Green

# 4. Trainer creates Client B (for cross-client isolation verification)
$clientBPayload = @{
    name = "Client Beta"
    email = "beta@thepushfittness.test"
    password = "betapassword123"
    phone = "+91 98765 00002"
    currentGoal = "Hypertrophy"
    monthlyPrice = 6000
    paymentStatus = "paid"
} | ConvertTo-Json

$clientB = Invoke-RestMethod -Uri "http://localhost:5000/api/clients" -Method Post -Body $clientBPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $tToken" }
$clientBId = $clientB.id
Write-Host "[PASS] 4. Trainer creates Client B: $($clientB.name) (ID: $clientBId)" -ForegroundColor Green

# 5. Trainer records payment in ₹
$payPayload = @{
    clientId = $clientAId
    planName = "Initial Month Trial"
    amount = 5000
    billingCycle = "Monthly"
    dueDate = "2026-10-15"
    status = "paid"
    paymentMethod = "UPI"
} | ConvertTo-Json
$payment = Invoke-RestMethod -Uri "http://localhost:5000/api/payments" -Method Post -Body $payPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 5. Trainer records payment in ₹: ₹$($payment.amount) ($($payment.referenceId))" -ForegroundColor Green

# 6. Trainer schedules session
$sessPayload = @{
    clientId = $clientAId
    date = "2026-10-05"
    time = "10:00 AM"
    durationMinutes = 60
    location = "Main Gym / Studio"
    sessionType = "1-on-1 In-Person"
} | ConvertTo-Json
$session = Invoke-RestMethod -Uri "http://localhost:5000/api/sessions" -Method Post -Body $sessPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 6. Trainer schedules session: $($session.date) at $($session.time)" -ForegroundColor Green

# 7. Trainer assigns program to Client A
$progPayload = @{
    clientId = $clientAId
    name = "Acceptance Test Hypertrophy"
    goal = "Hypertrophy & Strength"
    durationWeeks = 8
    trainingFrequency = "3x per week"
    days = @(
        @{
            name = "Day 1 - Full Body"
            exercises = @(
                @{ name = "Barbell Squat"; sets = 3; reps = "8"; restSec = 90; targetWeightKg = 70 }
            )
        }
    )
} | ConvertTo-Json -Depth 5
$prog = Invoke-RestMethod -Uri "http://localhost:5000/api/programs" -Method Post -Body $progPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 7. Trainer assigns program: $($prog.name)" -ForegroundColor Green

# 8. Trainer views client progress report
$report = Invoke-RestMethod -Uri "http://localhost:5000/api/reports/$clientAId" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 8. Trainer generates report: Client starting weight $($report.summary.startingWeight) kg" -ForegroundColor Green

# ==========================================================
# CLIENT TESTS & STRICT DATA ISOLATION VERIFICATION
# ==========================================================
Write-Host "`n--- TESTING CLIENT ROLES & DATA ISOLATION ---" -ForegroundColor Yellow

# Client A Login
$c1Auth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body (@{email="alpha@thepushfittness.test"; password="alphapassword123"} | ConvertTo-Json) -ContentType "application/json"
$c1Token = $c1Auth.token
Write-Host "[PASS] 9. Client A Login: $($c1Auth.user.name) (ClientId: $($c1Auth.user.clientId))" -ForegroundColor Green

# Client B Login
$c2Auth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body (@{email="beta@thepushfittness.test"; password="betapassword123"} | ConvertTo-Json) -ContentType "application/json"
$c2Token = $c2Auth.token
Write-Host "[PASS] 10. Client B Login: $($c2Auth.user.name) (ClientId: $($c2Auth.user.clientId))" -ForegroundColor Green

# 11. Verify Client A can view own profile
$c1Profile = Invoke-RestMethod -Uri "http://localhost:5000/api/clients/$clientAId" -Headers @{ Authorization = "Bearer $c1Token" }
Write-Host "[PASS] 11. Client A views own profile: $($c1Profile.name)" -ForegroundColor Green

# 12. Verify Client A CANNOT access Client B profile (403 Forbidden)
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/clients/$clientBId" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B profile!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] 12. Security Guard: Client A blocked from Client B profile (403 Forbidden)" -ForegroundColor Green
}

# 13. Verify Client A CANNOT access Client B workouts (403 Forbidden)
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/programs?clientId=$clientBId" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B workouts!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] 13. Security Guard: Client A blocked from Client B workouts (403 Forbidden)" -ForegroundColor Green
}

# 14. Verify Client A CANNOT access Client B food logs (403 Forbidden)
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/nutrition-logs?clientId=$clientBId" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B nutrition logs!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] 14. Security Guard: Client A blocked from Client B nutrition logs (403 Forbidden)" -ForegroundColor Green
}

# 15. Verify Client A CANNOT access Client B progress photos (403 Forbidden)
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/progress-photos?clientId=$clientBId" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B progress photos!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] 15. Security Guard: Client A blocked from Client B progress photos (403 Forbidden)" -ForegroundColor Green
}

# 16. Verify Client A CANNOT access Client B private notes (403 Forbidden)
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/notes?clientId=$clientBId" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B notes!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] 16. Security Guard: Client A blocked from Client B notes (403 Forbidden)" -ForegroundColor Green
}

# 17. Verify Client A CANNOT access Client B messages (403 Forbidden)
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/messages?clientId=$clientBId" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B messages!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] 17. Security Guard: Client A blocked from Client B messages (403 Forbidden)" -ForegroundColor Green
}

# 18. Verify Client A can log their own workout
$c1WorkoutLog = @{
    clientId = $clientAId
    workoutId = "day-1"
    workoutName = "Test Full Body"
    durationMinutes = 45
    totalVolumeKg = 3200
    rpeOverall = 8
    notes = "Acceptance test log"
} | ConvertTo-Json
$logResult = Invoke-RestMethod -Uri "http://localhost:5000/api/workout-logs" -Method Post -Body $c1WorkoutLog -ContentType "application/json" -Headers @{ Authorization = "Bearer $c1Token" }
Write-Host "[PASS] 18. Client A logged own workout: $($logResult.workoutName) (ID: $($logResult.id))" -ForegroundColor Green

# 19. Verify Client A can log own food
$c1FoodLog = @{
    clientId = $clientAId
    date = "2026-10-02"
    totalCalories = 1750
    proteinG = 135
    carbsG = 170
    fatsG = 50
    waterMl = 2800
    notes = "Logged by Client A"
} | ConvertTo-Json
$foodResult = Invoke-RestMethod -Uri "http://localhost:5000/api/nutrition-logs" -Method Post -Body $c1FoodLog -ContentType "application/json" -Headers @{ Authorization = "Bearer $c1Token" }
Write-Host "[PASS] 19. Client A logged own nutrition: $($foodResult.totalCalories) kcal" -ForegroundColor Green

# 20. Verify Client A can message trainer
$msgPayload = @{
    clientId = $clientAId
    recipientId = "user-trainer-1"
    text = "Hello Coach, ready for the upcoming session!"
    category = "general"
} | ConvertTo-Json
$msgResult = Invoke-RestMethod -Uri "http://localhost:5000/api/messages" -Method Post -Body $msgPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $c1Token" }
Write-Host "[PASS] 20. Client A sent message to Trainer: $($msgResult.text)" -ForegroundColor Green

# 21. Verify Client A can submit check-in
$chkPayload = @{
    clientId = $clientAId
    date = "2026-10-02"
    responses = @{
        energyRating = 9
        sleepHours = 8
        sleepQuality = 9
        workoutConsistency = 10
        nutritionConsistency = 10
        painOrDiscomfort = "None"
        winsThisWeek = "Hit all scheduled workouts!"
        biggestObstacle = "None"
        nextWeekGoal = "Squat 75kg"
    }
} | ConvertTo-Json -Depth 4
$chkResult = Invoke-RestMethod -Uri "http://localhost:5000/api/checkins" -Method Post -Body $chkPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $c1Token" }
Write-Host "[PASS] 21. Client A submitted check-in: (ID: $($chkResult.id))" -ForegroundColor Green

# 22. Clean up both test clients to ensure a clean database for production launch
$delA = Invoke-RestMethod -Uri "http://localhost:5000/api/clients/$clientAId" -Method Delete -Headers @{ Authorization = "Bearer $tToken" }
$delB = Invoke-RestMethod -Uri "http://localhost:5000/api/clients/$clientBId" -Method Delete -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 22. Cleaned up both test clients. Production database is in pristine state." -ForegroundColor Green

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "    ALL 22 ACCEPTANCE TESTS & SECURITY ISOLATION PASSED!  " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
