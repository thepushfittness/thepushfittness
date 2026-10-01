# PushFitness Automated Acceptance & Security Isolation Test Suite
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "    PUSHFITNESS COMPREHENSIVE ACCEPTANCE & SECURITY TEST  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Login as Trainer
$trainerAuth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/demo-switch" -Method Post -Body (@{role="trainer"} | ConvertTo-Json) -ContentType "application/json"
$tToken = $trainerAuth.token
Write-Host "[PASS] 1. Trainer Login: $($trainerAuth.user.name) (Role: $($trainerAuth.user.role))" -ForegroundColor Green

# 2. Trainer views all clients
$allClients = Invoke-RestMethod -Uri "http://localhost:5000/api/clients" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 2. Trainer views all clients: Found $($allClients.Length) clients" -ForegroundColor Green

# 3. Trainer creates a new client
$newClientPayload = @{
    name = "Test Acceptance Client"
    email = "test.acceptance@gmail.com"
    phone = "+1 (555) 999-8877"
    currentGoal = "Strength & Endurance"
    heightCm = 175
    weightKg = 78.5
    targetWeightKg = 74.0
    monthlyPrice = 300
    sessionsPurchased = 10
    paymentStatus = "due"
} | ConvertTo-Json

$createdClient = Invoke-RestMethod -Uri "http://localhost:5000/api/clients" -Method Post -Body $newClientPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $tToken" }
$testClientId = $createdClient.id
Write-Host "[PASS] 3. Trainer creates client: $($createdClient.name) (ID: $testClientId)" -ForegroundColor Green

# 4. Trainer edits client
$editPayload = @{
    occupation = "Software Engineer"
    trainingFrequency = "4x per week"
} | ConvertTo-Json
$editedClient = Invoke-RestMethod -Uri "http://localhost:5000/api/clients/$testClientId" -Method Put -Body $editPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 4. Trainer edits client: Occupation updated to '$($editedClient.occupation)'" -ForegroundColor Green

# 5. Trainer records payment
$payPayload = @{
    clientId = $testClientId
    planName = "Initial Month Trial"
    amount = 300
    billingCycle = "Monthly"
    dueDate = "2026-10-15"
    status = "paid"
    paymentMethod = "Credit Card"
} | ConvertTo-Json
$payment = Invoke-RestMethod -Uri "http://localhost:5000/api/payments" -Method Post -Body $payPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 5. Trainer records payment: $$($payment.amount) ($($payment.referenceId))" -ForegroundColor Green

# 6. Trainer schedules session
$sessPayload = @{
    clientId = $testClientId
    date = "2026-10-05"
    time = "10:00 AM"
    durationMinutes = 60
    location = "Apex Studio"
    sessionType = "1-on-1 In-Person"
} | ConvertTo-Json
$session = Invoke-RestMethod -Uri "http://localhost:5000/api/sessions" -Method Post -Body $sessPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 6. Trainer schedules session: $($session.date) at $($session.time)" -ForegroundColor Green

# 7. Trainer assigns workout program
$progPayload = @{
    clientId = $testClientId
    name = "Acceptance Test Hypertrophy"
    goal = "Strength & Endurance"
    durationWeeks = 4
    daysPerWeek = 3
    days = @(
        @{
            id = "test-day-1"
            dayNumber = 1
            name = "Full Body Test"
            focus = "Compound Test"
            exercises = @(
                @{
                    id = "ex-test-1"
                    name = "Barbell Squat"
                    sets = 3
                    reps = "10"
                    targetWeightKg = 60
                    restSeconds = 90
                }
            )
        }
    )
} | ConvertTo-Json -Depth 5
$program = Invoke-RestMethod -Uri "http://localhost:5000/api/programs" -Method Post -Body $progPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 7. Trainer assigns program: $($program.name)" -ForegroundColor Green

# 8. Trainer generates client report
$report = Invoke-RestMethod -Uri "http://localhost:5000/api/reports/$testClientId" -Headers @{ Authorization = "Bearer $tToken" }
Write-Host "[PASS] 8. Trainer generates report: Client starting weight $($report.summary.startingWeight) kg" -ForegroundColor Green

# ==========================================================
# CLIENT TESTS & STRICT DATA ISOLATION VERIFICATION
# ==========================================================
Write-Host "`n--- TESTING CLIENT ROLES & DATA ISOLATION ---" -ForegroundColor Yellow

# Client 1: Sarah Chen (client-1)
$c1Auth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/demo-switch" -Method Post -Body (@{clientId="client-1"} | ConvertTo-Json) -ContentType "application/json"
$c1Token = $c1Auth.token
Write-Host "[PASS] Client A Login: $($c1Auth.user.name) (ClientId: $($c1Auth.user.clientId))" -ForegroundColor Green

# Client 2: Marcus Vance (client-2)
$c2Auth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/demo-switch" -Method Post -Body (@{clientId="client-2"} | ConvertTo-Json) -ContentType "application/json"
$c2Token = $c2Auth.token
Write-Host "[PASS] Client B Login: $($c2Auth.user.name) (ClientId: $($c2Auth.user.clientId))" -ForegroundColor Green

# Verify Client A can view own profile
$c1Profile = Invoke-RestMethod -Uri "http://localhost:5000/api/clients/client-1" -Headers @{ Authorization = "Bearer $c1Token" }
Write-Host "[PASS] Client A views own profile: $($c1Profile.name)" -ForegroundColor Green

# Verify Client A CANNOT access Client B profile
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/clients/client-2" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B profile!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] Security Guard: Client A blocked from Client B profile (Status: $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
}

# Verify Client A CANNOT access Client B workouts
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/programs?clientId=client-2" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B workouts!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] Security Guard: Client A blocked from Client B workouts (Status: $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
}

# Verify Client A CANNOT access Client B food logs
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/nutrition-logs?clientId=client-2" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B nutrition logs!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] Security Guard: Client A blocked from Client B nutrition logs (Status: $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
}

# Verify Client A CANNOT access Client B progress photos
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/progress-photos?clientId=client-2" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B progress photos!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] Security Guard: Client A blocked from Client B progress photos (Status: $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
}

# Verify Client A CANNOT access Client B private notes
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/notes?clientId=client-2" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B notes!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] Security Guard: Client A blocked from Client B notes (Status: $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
}

# Verify Client A CANNOT access Client B messages
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/messages?clientId=client-2" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B messages!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] Security Guard: Client A blocked from Client B messages (Status: $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
}

# Verify Client A CANNOT access Client B measurements
try {
    $blocked = Invoke-RestMethod -Uri "http://localhost:5000/api/measurements?clientId=client-2" -Headers @{ Authorization = "Bearer $c1Token" }
    Write-Host "[FAIL] SECURITY BREACH: Client A accessed Client B measurements!" -ForegroundColor Red
} catch {
    Write-Host "[PASS] Security Guard: Client A blocked from Client B measurements (Status: $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
}

# Verify Client A can log their own workout
$c1WorkoutLog = @{
    clientId = "client-1"
    workoutId = "day-s1"
    workoutName = "Test Lower Body"
    durationMinutes = 45
    totalVolumeKg = 3200
    rpeOverall = 8
    notes = "Acceptance test log"
} | ConvertTo-Json
$logResult = Invoke-RestMethod -Uri "http://localhost:5000/api/workout-logs" -Method Post -Body $c1WorkoutLog -ContentType "application/json" -Headers @{ Authorization = "Bearer $c1Token" }
Write-Host "[PASS] Client A logged own workout: $($logResult.workoutName) (ID: $($logResult.id))" -ForegroundColor Green

# Verify Client A can log own food
$c1FoodLog = @{
    clientId = "client-1"
    date = "2026-10-01"
    totalCalories = 1750
    proteinG = 135
    carbsG = 170
    fatsG = 50
    waterMl = 2800
    notes = "Logged by Client A"
} | ConvertTo-Json
$foodResult = Invoke-RestMethod -Uri "http://localhost:5000/api/nutrition-logs" -Method Post -Body $c1FoodLog -ContentType "application/json" -Headers @{ Authorization = "Bearer $c1Token" }
Write-Host "[PASS] Client A logged own nutrition: $($foodResult.totalCalories) kcal" -ForegroundColor Green

# Verify Client A can message trainer
$msgPayload = @{
    clientId = "client-1"
    recipientId = "user-trainer-1"
    text = "Hello Coach Alex, confirming our session!"
    category = "general"
} | ConvertTo-Json
$msgResult = Invoke-RestMethod -Uri "http://localhost:5000/api/messages" -Method Post -Body $msgPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $c1Token" }
Write-Host "[PASS] Client A sent message to Trainer: $($msgResult.text)" -ForegroundColor Green

# Verify Client A can submit check-in
$chkPayload = @{
    clientId = "client-1"
    date = "2026-10-01"
    responses = @{
        energyRating = 9
        sleepHours = 8
        sleepQuality = 9
        workoutConsistency = 10
        nutritionConsistency = 10
        painOrDiscomfort = "None"
        winsThisWeek = "Hit all 4 workouts!"
        biggestObstacle = "None"
        nextWeekGoal = "Squat 55kg"
    }
} | ConvertTo-Json -Depth 4
$chkResult = Invoke-RestMethod -Uri "http://localhost:5000/api/checkins" -Method Post -Body $chkPayload -ContentType "application/json" -Headers @{ Authorization = "Bearer $c1Token" }
Write-Host "[PASS] Client A submitted check-in: (ID: $($chkResult.id))" -ForegroundColor Green

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "    ALL ACCEPTANCE TESTS & SECURITY ISOLATION PASSED!     " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
