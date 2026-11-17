// thepushfittness - Production Initial State with Full Active Client Roster
// Includes: Anindita Chatterjee, Tina, Aditi, Maha, Shiv, Devarsee

export const initialData = {
  "lastUpdatedAt": 1794910810833,
  "users": [
    {
      "id": "user-trainer-1",
      "email": "admin@thepushfittness.com",
      "name": "Coach Pushkar Mayekar",
      "role": "trainer",
      "password": "admin123",
      "phone": "+91 98765 43210",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "createdAt": "2026-10-02T11:07:59.360Z"
    },
    {
      "id": "user-client-1",
      "email": "anindita.chatterjee@gmail.com",
      "name": "Anindita Chatterjee",
      "role": "client",
      "clientId": "client-1",
      "password": "client123",
      "phone": "+91 98201 54321",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      "createdAt": "2026-10-15T09:00:00.000Z"
    },
    {
      "id": "user-client-2",
      "email": "tina@thepushfittness.com",
      "name": "Tina",
      "role": "client",
      "clientId": "client-2",
      "password": "client123",
      "phone": "+91 98202 11002",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
      "createdAt": "2026-10-18T09:00:00.000Z"
    },
    {
      "id": "user-client-3",
      "email": "aditi@thepushfittness.com",
      "name": "Aditi",
      "role": "client",
      "clientId": "client-3",
      "password": "client123",
      "phone": "+91 98203 22003",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
      "createdAt": "2026-10-20T09:00:00.000Z"
    },
    {
      "id": "user-client-4",
      "email": "maha@thepushfittness.com",
      "name": "Maha",
      "role": "client",
      "clientId": "client-4",
      "password": "client123",
      "phone": "+91 98204 33004",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      "createdAt": "2026-10-22T09:00:00.000Z"
    },
    {
      "id": "user-client-5",
      "email": "shiv@thepushfittness.com",
      "name": "Shiv",
      "role": "client",
      "clientId": "client-5",
      "password": "client123",
      "phone": "+91 98205 44005",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      "createdAt": "2026-10-25T09:00:00.000Z"
    },
    {
      "id": "user-client-6",
      "email": "devarsee@thepushfittness.com",
      "name": "Devarsee",
      "role": "client",
      "clientId": "client-6",
      "password": "client123",
      "phone": "+91 98206 55006",
      "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80",
      "createdAt": "2026-10-28T09:00:00.000Z"
    }
  ],
  "clients": [
    {
      "id": "client-1",
      "userId": "user-client-1",
      "name": "Anindita Chatterjee",
      "email": "anindita.chatterjee@gmail.com",
      "password": "client123",
      "phone": "+91 98201 54321",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      "dateOfBirth": "1995-04-12",
      "gender": "Female",
      "occupation": "Product Manager",
      "emergencyContact": "Rohit Sen (Spouse) - +91 98201 99999",
      "startDate": "2026-10-15",
      "status": "active",
      "trainingMode": "offline",
      "trainingType": "Offline Studio Coaching",
      "trainingDays": [
        "Monday",
        "Wednesday",
        "Friday"
      ],
      "sessionTime": "10:00 AM",
      "trainingFrequency": "3x per week",
      "currentGoal": "Fat Loss & Core Strength",
      "goalsList": [
        "Fat loss",
        "Core stability",
        "Tone arms & back"
      ],
      "acquisitionSource": "Instagram",
      "heightCm": 162,
      "weightKg": 58.5,
      "startingWeightKg": 62,
      "targetWeightKg": 55,
      "profileCompleted": true,
      "trainingExperience": "Beginner",
      "fitnessLevel": "Beginner",
      "injuries": "None",
      "restrictions": "None",
      "equipmentAvailability": "The Push Fitness Studio",
      "lifestyleLevel": "Moderate (Desk job)",
      "dietaryPreference": "Non-Vegetarian",
      "allergies": "None",
      "foodsAvoided": "Fried snacks",
      "dailyCalorieTarget": 1750,
      "proteinTargetG": 120,
      "carbsTargetG": 175,
      "fatsTargetG": 50,
      "waterTargetMl": 2800,
      "nutritionNotes": "Focus on hitting 120g protein daily with paneer, eggs, and whey.",
      "adherenceScore": 94,
      "adherenceStatus": "Excellent",
      "workoutAdherence": 95,
      "nutritionAdherence": 92,
      "sessionAttendance": 100,
      "checkinAdherence": 95,
      "sessionsPurchased": 12,
      "sessionsCompleted": 4,
      "sessionsRemaining": 8,
      "sessionsCancelled": 0,
      "sessionsMissed": 0,
      "planName": "Personal Coaching Package (12 Sessions)",
      "monthlyPrice": 18000,
      "billingCycle": "Monthly",
      "paymentStatus": "paid",
      "nextPaymentDate": "2026-11-15",
      "amountPaidToDate": 18000,
      "renewalsCount": 1,
      "lifetimeRevenue": 18000,
      "lastSessionDate": "2026-11-03",
      "lastPaymentDate": "2026-10-15",
      "lastActivityDate": "2026-11-06",
      "onboardingStep": 4,
      "customFields": {},
      "consentForMarketingPhotos": true
    },
    {
      "id": "client-2",
      "userId": "user-client-2",
      "name": "Tina",
      "email": "tina@thepushfittness.com",
      "password": "client123",
      "phone": "+91 98202 11002",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
      "dateOfBirth": "1997-06-18",
      "gender": "Female",
      "occupation": "Marketing Strategist",
      "emergencyContact": "Kunal - +91 98202 99002",
      "startDate": "2026-10-18",
      "status": "active",
      "trainingMode": "offline",
      "trainingType": "Offline Studio Coaching",
      "trainingDays": [
        "Monday",
        "Wednesday",
        "Friday"
      ],
      "sessionTime": "08:00 AM",
      "trainingFrequency": "3x per week",
      "currentGoal": "Fat Loss & Body Toning",
      "goalsList": [
        "Body recomposition",
        "Lower body strength",
        "Consistent workout habit"
      ],
      "acquisitionSource": "Instagram",
      "heightCm": 165,
      "weightKg": 61,
      "startingWeightKg": 64.5,
      "targetWeightKg": 57,
      "profileCompleted": true,
      "trainingExperience": "Beginner",
      "fitnessLevel": "Beginner",
      "injuries": "None",
      "restrictions": "None",
      "equipmentAvailability": "The Push Fitness Studio",
      "lifestyleLevel": "Moderate (Desk job)",
      "dietaryPreference": "Non-Vegetarian",
      "allergies": "None",
      "foodsAvoided": "Sugary drinks",
      "dailyCalorieTarget": 1700,
      "proteinTargetG": 115,
      "carbsTargetG": 170,
      "fatsTargetG": 48,
      "waterTargetMl": 2800,
      "nutritionNotes": "High protein intake with eggs, chicken breast, Greek yogurt, and whey.",
      "adherenceScore": 92,
      "adherenceStatus": "Excellent",
      "workoutAdherence": 94,
      "nutritionAdherence": 90,
      "sessionAttendance": 100,
      "checkinAdherence": 92,
      "sessionsPurchased": 12,
      "sessionsCompleted": 4,
      "sessionsRemaining": 8,
      "sessionsCancelled": 0,
      "sessionsMissed": 0,
      "planName": "Personal Coaching Package (12 Sessions)",
      "monthlyPrice": 18000,
      "billingCycle": "Monthly",
      "paymentStatus": "paid",
      "nextPaymentDate": "2026-11-18",
      "amountPaidToDate": 18000,
      "renewalsCount": 1,
      "lifetimeRevenue": 18000,
      "lastSessionDate": "2026-11-14",
      "lastPaymentDate": "2026-10-18",
      "lastActivityDate": "2026-11-16",
      "onboardingStep": 4,
      "customFields": {},
      "consentForMarketingPhotos": true
    },
    {
      "id": "client-3",
      "userId": "user-client-3",
      "name": "Aditi",
      "email": "aditi@thepushfittness.com",
      "password": "client123",
      "phone": "+91 98203 22003",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
      "dateOfBirth": "1994-09-24",
      "gender": "Female",
      "occupation": "Software Engineer",
      "emergencyContact": "Aakash - +91 98203 99003",
      "startDate": "2026-10-20",
      "status": "active",
      "trainingMode": "offline",
      "trainingType": "Offline Studio Coaching",
      "trainingDays": [
        "Tuesday",
        "Thursday",
        "Saturday"
      ],
      "sessionTime": "07:30 AM",
      "trainingFrequency": "3x per week",
      "currentGoal": "Strength & Core Conditioning",
      "goalsList": [
        "Core stability",
        "Upper body strength (first unassisted pull-up)",
        "Posture improvement"
      ],
      "acquisitionSource": "Referral",
      "heightCm": 160,
      "weightKg": 55,
      "startingWeightKg": 57.5,
      "targetWeightKg": 53,
      "profileCompleted": true,
      "trainingExperience": "Intermediate",
      "fitnessLevel": "Intermediate",
      "injuries": "None",
      "restrictions": "None",
      "equipmentAvailability": "The Push Fitness Studio",
      "lifestyleLevel": "Sedentary (Tech WFH)",
      "dietaryPreference": "Vegetarian",
      "allergies": "None",
      "foodsAvoided": "Excess carb snacking",
      "dailyCalorieTarget": 1650,
      "proteinTargetG": 110,
      "carbsTargetG": 165,
      "fatsTargetG": 45,
      "waterTargetMl": 2600,
      "nutritionNotes": "Emphasize paneer, tofu, edamame, and protein shakes.",
      "adherenceScore": 95,
      "adherenceStatus": "Excellent",
      "workoutAdherence": 96,
      "nutritionAdherence": 94,
      "sessionAttendance": 100,
      "checkinAdherence": 96,
      "sessionsPurchased": 12,
      "sessionsCompleted": 5,
      "sessionsRemaining": 7,
      "sessionsCancelled": 0,
      "sessionsMissed": 0,
      "planName": "Personal Coaching Package (12 Sessions)",
      "monthlyPrice": 18000,
      "billingCycle": "Monthly",
      "paymentStatus": "paid",
      "nextPaymentDate": "2026-11-20",
      "amountPaidToDate": 18000,
      "renewalsCount": 1,
      "lifetimeRevenue": 18000,
      "lastSessionDate": "2026-11-15",
      "lastPaymentDate": "2026-10-20",
      "lastActivityDate": "2026-11-16",
      "onboardingStep": 4,
      "customFields": {},
      "consentForMarketingPhotos": true
    },
    {
      "id": "client-4",
      "userId": "user-client-4",
      "name": "Maha",
      "email": "maha@thepushfittness.com",
      "password": "client123",
      "phone": "+91 98204 33004",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      "dateOfBirth": "1992-11-10",
      "gender": "Male",
      "occupation": "Architect",
      "emergencyContact": "Priya - +91 98204 99004",
      "startDate": "2026-10-22",
      "status": "active",
      "trainingMode": "offline",
      "trainingType": "Offline Studio Coaching",
      "trainingDays": [
        "Monday",
        "Wednesday",
        "Friday"
      ],
      "sessionTime": "06:30 PM",
      "trainingFrequency": "3x per week",
      "currentGoal": "Muscle Hypertrophy & Strength",
      "goalsList": [
        "Build chest & back thickness",
        "Increase squat & bench strength",
        "Clean bulking"
      ],
      "acquisitionSource": "Google Search",
      "heightCm": 178,
      "weightKg": 74,
      "startingWeightKg": 71.5,
      "targetWeightKg": 78,
      "profileCompleted": true,
      "trainingExperience": "Intermediate",
      "fitnessLevel": "Intermediate",
      "injuries": "None",
      "restrictions": "None",
      "equipmentAvailability": "The Push Fitness Studio",
      "lifestyleLevel": "Active (Site visits & drafting)",
      "dietaryPreference": "Non-Vegetarian",
      "allergies": "None",
      "foodsAvoided": "Processed fast food",
      "dailyCalorieTarget": 2450,
      "proteinTargetG": 160,
      "carbsTargetG": 280,
      "fatsTargetG": 65,
      "waterTargetMl": 3500,
      "nutritionNotes": "Caloric surplus for clean lean mass. Focus on oats, chicken, rice, eggs, whey.",
      "adherenceScore": 91,
      "adherenceStatus": "Excellent",
      "workoutAdherence": 92,
      "nutritionAdherence": 89,
      "sessionAttendance": 95,
      "checkinAdherence": 90,
      "sessionsPurchased": 12,
      "sessionsCompleted": 3,
      "sessionsRemaining": 9,
      "sessionsCancelled": 0,
      "sessionsMissed": 0,
      "planName": "Personal Coaching Package (12 Sessions)",
      "monthlyPrice": 18000,
      "billingCycle": "Monthly",
      "paymentStatus": "paid",
      "nextPaymentDate": "2026-11-22",
      "amountPaidToDate": 18000,
      "renewalsCount": 1,
      "lifetimeRevenue": 18000,
      "lastSessionDate": "2026-11-13",
      "lastPaymentDate": "2026-10-22",
      "lastActivityDate": "2026-11-15",
      "onboardingStep": 4,
      "customFields": {},
      "consentForMarketingPhotos": true
    },
    {
      "id": "client-5",
      "userId": "user-client-5",
      "name": "Shiv",
      "email": "shiv@thepushfittness.com",
      "password": "client123",
      "phone": "+91 98205 44005",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      "dateOfBirth": "1995-02-14",
      "gender": "Male",
      "occupation": "Consultant",
      "emergencyContact": "Vivek - +91 98205 99005",
      "startDate": "2026-10-25",
      "status": "active",
      "trainingMode": "offline",
      "trainingType": "Offline Studio Coaching",
      "trainingDays": [
        "Tuesday",
        "Thursday",
        "Saturday"
      ],
      "sessionTime": "07:00 PM",
      "trainingFrequency": "3x per week",
      "currentGoal": "Functional Fitness & Athletic Conditioning",
      "goalsList": [
        "Improve VO2 max & stamina",
        "Lower body explosiveness",
        "Kettlebell & barbell endurance"
      ],
      "acquisitionSource": "Instagram",
      "heightCm": 175,
      "weightKg": 72,
      "startingWeightKg": 74,
      "targetWeightKg": 70,
      "profileCompleted": true,
      "trainingExperience": "Intermediate",
      "fitnessLevel": "Intermediate",
      "injuries": "None",
      "restrictions": "None",
      "equipmentAvailability": "The Push Fitness Studio",
      "lifestyleLevel": "High stress / travel",
      "dietaryPreference": "Non-Vegetarian",
      "allergies": "None",
      "foodsAvoided": "Late night junk food",
      "dailyCalorieTarget": 2200,
      "proteinTargetG": 145,
      "carbsTargetG": 230,
      "fatsTargetG": 60,
      "waterTargetMl": 3200,
      "nutritionNotes": "Balanced macro split with high hydration and nutrient-dense whole foods.",
      "adherenceScore": 90,
      "adherenceStatus": "Excellent",
      "workoutAdherence": 92,
      "nutritionAdherence": 88,
      "sessionAttendance": 90,
      "checkinAdherence": 90,
      "sessionsPurchased": 12,
      "sessionsCompleted": 4,
      "sessionsRemaining": 8,
      "sessionsCancelled": 0,
      "sessionsMissed": 0,
      "planName": "Personal Coaching Package (12 Sessions)",
      "monthlyPrice": 18000,
      "billingCycle": "Monthly",
      "paymentStatus": "paid",
      "nextPaymentDate": "2026-11-25",
      "amountPaidToDate": 18000,
      "renewalsCount": 1,
      "lifetimeRevenue": 18000,
      "lastSessionDate": "2026-11-15",
      "lastPaymentDate": "2026-10-25",
      "lastActivityDate": "2026-11-16",
      "onboardingStep": 4,
      "customFields": {},
      "consentForMarketingPhotos": true
    },
    {
      "id": "client-6",
      "userId": "user-client-6",
      "name": "Devarsee",
      "email": "devarsee@thepushfittness.com",
      "password": "client123",
      "phone": "+91 98206 55006",
      "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80",
      "dateOfBirth": "1996-07-29",
      "gender": "Male",
      "occupation": "Financial Analyst",
      "emergencyContact": "Nikhil - +91 98206 99006",
      "startDate": "2026-10-28",
      "status": "active",
      "trainingMode": "offline",
      "trainingType": "Offline Studio Coaching",
      "trainingDays": [
        "Monday",
        "Wednesday",
        "Friday"
      ],
      "sessionTime": "07:00 AM",
      "trainingFrequency": "3x per week",
      "currentGoal": "Mobility, Posture & Hypertrophy",
      "goalsList": [
        "Fix thoracic & shoulder mobility",
        "Posterior chain hypertrophy",
        "Deadlift form mastery"
      ],
      "acquisitionSource": "Referral",
      "heightCm": 172,
      "weightKg": 68.5,
      "startingWeightKg": 70,
      "targetWeightKg": 66,
      "profileCompleted": true,
      "trainingExperience": "Beginner",
      "fitnessLevel": "Beginner",
      "injuries": "None",
      "restrictions": "None",
      "equipmentAvailability": "The Push Fitness Studio",
      "lifestyleLevel": "Sedentary (Desk bound)",
      "dietaryPreference": "Vegetarian",
      "allergies": "None",
      "foodsAvoided": "Excess sodium & refined sugar",
      "dailyCalorieTarget": 1900,
      "proteinTargetG": 130,
      "carbsTargetG": 210,
      "fatsTargetG": 50,
      "waterTargetMl": 3000,
      "nutritionNotes": "High protein vegetarian plan: Paneer, soya chunks, Greek yogurt, whey.",
      "adherenceScore": 93,
      "adherenceStatus": "Excellent",
      "workoutAdherence": 95,
      "nutritionAdherence": 91,
      "sessionAttendance": 100,
      "checkinAdherence": 92,
      "sessionsPurchased": 12,
      "sessionsCompleted": 3,
      "sessionsRemaining": 9,
      "sessionsCancelled": 0,
      "sessionsMissed": 0,
      "planName": "Personal Coaching Package (12 Sessions)",
      "monthlyPrice": 18000,
      "billingCycle": "Monthly",
      "paymentStatus": "paid",
      "nextPaymentDate": "2026-11-28",
      "amountPaidToDate": 18000,
      "renewalsCount": 1,
      "lifetimeRevenue": 18000,
      "lastSessionDate": "2026-11-14",
      "lastPaymentDate": "2026-10-28",
      "lastActivityDate": "2026-11-16",
      "onboardingStep": 4,
      "customFields": {},
      "consentForMarketingPhotos": true
    }
  ],
  "programs": [
    {
      "id": "prog-anindita-1",
      "clientId": "client-1",
      "name": "Anindita - 12-Week Hypertrophy & Recomposition",
      "goal": "Fat Loss & Core Strength",
      "durationWeeks": 12,
      "daysPerWeek": 4,
      "status": "active",
      "createdAt": "2026-10-15T09:30:00Z",
      "days": [
        {
          "id": "d1-anindita",
          "dayNumber": 1,
          "name": "Day 1 - Upper Body (Chest & Back Focus)",
          "focus": "Upper Push & Pull",
          "exercises": [
            {
              "id": "e1",
              "name": "Incline Dumbbell Press",
              "sets": 3,
              "reps": "10-12",
              "targetWeightKg": 10,
              "notes": "Controlled tempo, full chest stretch"
            },
            {
              "id": "e2",
              "name": "Lat Pulldown (Neutral Grip)",
              "sets": 3,
              "reps": "10-12",
              "targetWeightKg": 30,
              "notes": "Drive elbows to ribs"
            },
            {
              "id": "e3",
              "name": "Seated Cable Row",
              "sets": 3,
              "reps": "12",
              "targetWeightKg": 25,
              "notes": "Pause 1s at contraction"
            },
            {
              "id": "e4",
              "name": "Dumbbell Lateral Raises",
              "sets": 3,
              "reps": "15",
              "targetWeightKg": 4,
              "notes": "Lead with elbows"
            },
            {
              "id": "e5",
              "name": "Cable Tricep Pushdowns",
              "sets": 3,
              "reps": "12",
              "targetWeightKg": 12.5,
              "notes": "Lockout elbows at bottom"
            }
          ],
          "conditioning": {
            "title": "Rowing Machine Intervals",
            "duration": "10 mins",
            "format": "Intervals",
            "notes": "30s sprint / 30s easy paddle"
          }
        },
        {
          "id": "d2-anindita",
          "dayNumber": 2,
          "name": "Day 2 - Lower Body (Glute & Quad Focus)",
          "focus": "Lower Compound Strength",
          "exercises": [
            {
              "id": "e6",
              "name": "Goblet Squats",
              "sets": 4,
              "reps": "10",
              "targetWeightKg": 16,
              "notes": "Knees track over toes, deep squat"
            },
            {
              "id": "e7",
              "name": "Romanian Deadlift (Dumbbell)",
              "sets": 3,
              "reps": "10-12",
              "targetWeightKg": 12,
              "notes": "Hinge hips back, feel hamstrings stretch"
            },
            {
              "id": "e8",
              "name": "Walking Lunges",
              "sets": 3,
              "reps": "12/leg",
              "targetWeightKg": 8,
              "notes": "Torso slightly leaned forward"
            },
            {
              "id": "e9",
              "name": "Leg Press",
              "sets": 3,
              "reps": "12",
              "targetWeightKg": 60,
              "notes": "Full depth without rounding lower back"
            }
          ]
        },
        {
          "id": "d3-anindita",
          "dayNumber": 3,
          "name": "Day 3 - Full Body Circuit & Core",
          "focus": "Metabolic Conditioning & Core",
          "exercises": [
            {
              "id": "e10",
              "name": "Kettlebell Deadlift",
              "sets": 3,
              "reps": "12",
              "targetWeightKg": 20,
              "notes": "Lock hips at top"
            },
            {
              "id": "e11",
              "name": "Push-ups (Incline or Knee)",
              "sets": 3,
              "reps": "10-12",
              "targetWeightKg": 0,
              "notes": "Elbows at 45 degrees"
            },
            {
              "id": "e12",
              "name": "Plank Hold",
              "sets": 3,
              "reps": "45 sec",
              "targetWeightKg": 0,
              "notes": "Tuck pelvis, squeeze glutes"
            },
            {
              "id": "e13",
              "name": "Cable Paloff Press",
              "sets": 3,
              "reps": "12/side",
              "targetWeightKg": 7.5,
              "notes": "Anti-rotation core brace"
            }
          ]
        }
      ],
      "clientName": "Anindita Chatterjee"
    },
    {
      "id": "prog-tina-1",
      "clientId": "client-2",
      "clientName": "Tina",
      "name": "Tina - Full Body Sculpt & Recomp",
      "goal": "Fat Loss & Body Toning",
      "status": "active",
      "assignedDate": "2026-10-18",
      "durationWeeks": 8,
      "daysPerWeek": 3,
      "notes": "Prioritize strict tempo and full range of motion. Rest 60-90s between sets.",
      "days": [
        {
          "dayNumber": 1,
          "name": "Day 1: Lower Body & Glute Focus",
          "focus": "Squat mechanics, posterior chain & glutes",
          "exercises": [
            {
              "id": "tina-d1-e1",
              "name": "Goblet Squats",
              "sets": 3,
              "reps": "12",
              "targetWeightKg": 14,
              "restSeconds": 75,
              "notes": "Full depth, hips back"
            },
            {
              "id": "tina-d1-e2",
              "name": "Romanian Deadlift (Dumbbells)",
              "sets": 3,
              "reps": "10-12",
              "targetWeightKg": 14,
              "restSeconds": 75,
              "notes": "Feel hamstring stretch"
            },
            {
              "id": "tina-d1-e3",
              "name": "Hip Thrusts (Barbell/Dumbbell)",
              "sets": 3,
              "reps": "12-15",
              "targetWeightKg": 20,
              "restSeconds": 60,
              "notes": "Pause 2s at top"
            },
            {
              "id": "tina-d1-e4",
              "name": "Plank Hold",
              "sets": 3,
              "reps": "45s",
              "targetWeightKg": 0,
              "restSeconds": 45,
              "notes": "Brace core"
            }
          ]
        },
        {
          "dayNumber": 2,
          "name": "Day 2: Upper Body & Core",
          "focus": "Back, Shoulders & Core Tone",
          "exercises": [
            {
              "id": "tina-d2-e1",
              "name": "Lat Pulldown (Neutral Grip)",
              "sets": 3,
              "reps": "10-12",
              "targetWeightKg": 25,
              "restSeconds": 60,
              "notes": "Drive elbows down"
            },
            {
              "id": "tina-d2-e2",
              "name": "Dumbbell Overhead Press",
              "sets": 3,
              "reps": "10",
              "targetWeightKg": 8,
              "restSeconds": 60,
              "notes": "Strict form"
            },
            {
              "id": "tina-d2-e3",
              "name": "Cable Seated Row",
              "sets": 3,
              "reps": "12",
              "targetWeightKg": 20,
              "restSeconds": 60,
              "notes": "Squeeze shoulder blades"
            },
            {
              "id": "tina-d2-e4",
              "name": "Hanging Knee Raises",
              "sets": 3,
              "reps": "12",
              "targetWeightKg": 0,
              "restSeconds": 45,
              "notes": "Controlled"
            }
          ]
        }
      ]
    },
    {
      "id": "prog-aditi-1",
      "clientId": "client-3",
      "clientName": "Aditi",
      "name": "Aditi - Strength Progression & Pull-Up Prep",
      "goal": "Strength & Core Conditioning",
      "status": "active",
      "assignedDate": "2026-10-20",
      "durationWeeks": 8,
      "daysPerWeek": 3,
      "notes": "Focus on pull-up eccentric strength and progressive overload.",
      "days": [
        {
          "dayNumber": 1,
          "name": "Day 1: Upper Pull & Core",
          "focus": "Vertical pulling & Anti-extension core",
          "exercises": [
            {
              "id": "aditi-d1-e1",
              "name": "Band-Assisted Pull-ups",
              "sets": 4,
              "reps": "6-8",
              "targetWeightKg": 0,
              "restSeconds": 90,
              "notes": "3s eccentric lowering"
            },
            {
              "id": "aditi-d1-e2",
              "name": "Single-Arm Dumbbell Row",
              "sets": 3,
              "reps": "10/arm",
              "targetWeightKg": 12,
              "restSeconds": 60,
              "notes": "Full stretch"
            },
            {
              "id": "aditi-d1-e3",
              "name": "Push-ups (Strict)",
              "sets": 3,
              "reps": "10",
              "targetWeightKg": 0,
              "restSeconds": 60,
              "notes": "Chest to floor"
            },
            {
              "id": "aditi-d1-e4",
              "name": "Ab Wheel Rollout",
              "sets": 3,
              "reps": "10",
              "targetWeightKg": 0,
              "restSeconds": 60,
              "notes": "Lock hips"
            }
          ]
        },
        {
          "dayNumber": 2,
          "name": "Day 2: Lower Body Strength",
          "focus": "Quad & Glute strength",
          "exercises": [
            {
              "id": "aditi-d2-e1",
              "name": "Barbell Back Squats",
              "sets": 4,
              "reps": "8",
              "targetWeightKg": 35,
              "restSeconds": 90,
              "notes": "Hit parallel depth"
            },
            {
              "id": "aditi-d2-e2",
              "name": "Bulgarian Split Squats",
              "sets": 3,
              "reps": "10/leg",
              "targetWeightKg": 8,
              "restSeconds": 60,
              "notes": "Knee tracking straight"
            },
            {
              "id": "aditi-d2-e3",
              "name": "Romanian Deadlift",
              "sets": 3,
              "reps": "10",
              "targetWeightKg": 30,
              "restSeconds": 75,
              "notes": "Hip hinge"
            }
          ]
        }
      ]
    },
    {
      "id": "prog-maha-1",
      "clientId": "client-4",
      "clientName": "Maha",
      "name": "Maha - Hypertrophy & Power Building",
      "goal": "Muscle Hypertrophy & Strength",
      "status": "active",
      "assignedDate": "2026-10-22",
      "durationWeeks": 10,
      "daysPerWeek": 3,
      "notes": "Push close to failure (RPE 8-9) on last sets. Proper rest intervals.",
      "days": [
        {
          "dayNumber": 1,
          "name": "Day 1: Chest & Triceps Push",
          "focus": "Horizontal & Incline pressing power",
          "exercises": [
            {
              "id": "maha-d1-e1",
              "name": "Barbell Bench Press",
              "sets": 4,
              "reps": "8-10",
              "targetWeightKg": 65,
              "restSeconds": 90,
              "notes": "Touch sternum, drive"
            },
            {
              "id": "maha-d1-e2",
              "name": "Incline Dumbbell Press",
              "sets": 3,
              "reps": "10-12",
              "targetWeightKg": 22,
              "restSeconds": 75,
              "notes": "30 degree bench angle"
            },
            {
              "id": "maha-d1-e3",
              "name": "Dips (Weighted/Bodyweight)",
              "sets": 3,
              "reps": "10",
              "targetWeightKg": 0,
              "restSeconds": 60,
              "notes": "Slight forward lean"
            },
            {
              "id": "maha-d1-e4",
              "name": "Cable Tricep Pushdown",
              "sets": 3,
              "reps": "12-15",
              "targetWeightKg": 25,
              "restSeconds": 60,
              "notes": "Lock elbows in place"
            }
          ]
        },
        {
          "dayNumber": 2,
          "name": "Day 2: Back & Biceps Pull",
          "focus": "Lat width and mid-back thickness",
          "exercises": [
            {
              "id": "maha-d2-e1",
              "name": "Barbell Deadlift",
              "sets": 4,
              "reps": "6",
              "targetWeightKg": 95,
              "restSeconds": 120,
              "notes": "Reset every rep"
            },
            {
              "id": "maha-d2-e2",
              "name": "Weighted Pull-ups",
              "sets": 3,
              "reps": "6-8",
              "targetWeightKg": 5,
              "restSeconds": 90,
              "notes": "Full dead hang"
            },
            {
              "id": "maha-d2-e3",
              "name": "Barbell Bent-Over Row",
              "sets": 3,
              "reps": "10",
              "targetWeightKg": 50,
              "restSeconds": 75,
              "notes": "45 degree torso"
            }
          ]
        }
      ]
    },
    {
      "id": "prog-shiv-1",
      "clientId": "client-5",
      "clientName": "Shiv",
      "name": "Shiv - Athletic Conditioning & Stamina",
      "goal": "Functional Fitness & Athletic Conditioning",
      "status": "active",
      "assignedDate": "2026-10-25",
      "durationWeeks": 8,
      "daysPerWeek": 3,
      "notes": "High metabolic output, minimal rest transitions, kettlebell technique focus.",
      "days": [
        {
          "dayNumber": 1,
          "name": "Day 1: Kettlebell & Lower Hybrid",
          "focus": "Explosive hip extension and conditioning",
          "exercises": [
            {
              "id": "shiv-d1-e1",
              "name": "Kettlebell Swings",
              "sets": 4,
              "reps": "20",
              "targetWeightKg": 24,
              "restSeconds": 45,
              "notes": "Violent hip snap"
            },
            {
              "id": "shiv-d1-e2",
              "name": "Front Squats (Double Kettlebell)",
              "sets": 3,
              "reps": "10",
              "targetWeightKg": 16,
              "restSeconds": 60,
              "notes": "Upright torso"
            },
            {
              "id": "shiv-d1-e3",
              "name": "Renegade Rows",
              "sets": 3,
              "reps": "8/arm",
              "targetWeightKg": 12,
              "restSeconds": 60,
              "notes": "No hip rotation"
            },
            {
              "id": "shiv-d1-e4",
              "name": "Sled Push / Prowler",
              "sets": 4,
              "reps": "25m",
              "targetWeightKg": 50,
              "restSeconds": 60,
              "notes": "Fast drive"
            }
          ]
        },
        {
          "dayNumber": 2,
          "name": "Day 2: Conditioning WOD & Core",
          "focus": "Metabolic conditioning and agility",
          "exercises": [
            {
              "id": "shiv-d2-e1",
              "name": "Burpee Box Jump Overs",
              "sets": 4,
              "reps": "12",
              "targetWeightKg": 0,
              "restSeconds": 45,
              "notes": "Steady rhythm"
            },
            {
              "id": "shiv-d2-e2",
              "name": "Rowing Machine Sprint",
              "sets": 5,
              "reps": "250m",
              "targetWeightKg": 0,
              "restSeconds": 60,
              "notes": "Sub 50s target"
            },
            {
              "id": "shiv-d2-e3",
              "name": "Farmers Carry",
              "sets": 3,
              "reps": "40m",
              "targetWeightKg": 24,
              "restSeconds": 60,
              "notes": "Tall posture"
            }
          ]
        }
      ]
    },
    {
      "id": "prog-devarsee-1",
      "clientId": "client-6",
      "clientName": "Devarsee",
      "name": "Devarsee - Posture, Mobility & Functional Hypertrophy",
      "goal": "Mobility, Posture & Hypertrophy",
      "status": "active",
      "assignedDate": "2026-10-28",
      "durationWeeks": 8,
      "daysPerWeek": 3,
      "notes": "Thoracic extension and glute activation warm-ups before lifting.",
      "days": [
        {
          "dayNumber": 1,
          "name": "Day 1: Posterior Chain & Upper Back",
          "focus": "Hinge mechanics and postural scapular retractors",
          "exercises": [
            {
              "id": "dev-d1-e1",
              "name": "Trap Bar Deadlift",
              "sets": 4,
              "reps": "8",
              "targetWeightKg": 60,
              "restSeconds": 90,
              "notes": "High handles, neutral spine"
            },
            {
              "id": "dev-d1-e2",
              "name": "Face Pulls with External Rotation",
              "sets": 3,
              "reps": "15",
              "targetWeightKg": 15,
              "restSeconds": 45,
              "notes": "Thumbs back at ears"
            },
            {
              "id": "dev-d1-e3",
              "name": "Dumbbell Romanian Deadlift",
              "sets": 3,
              "reps": "12",
              "targetWeightKg": 16,
              "restSeconds": 60,
              "notes": "Controlled lowering"
            },
            {
              "id": "dev-d1-e4",
              "name": "Prone Y-T-W Raises",
              "sets": 3,
              "reps": "10 each",
              "targetWeightKg": 2,
              "restSeconds": 45,
              "notes": "Squeeze upper back"
            }
          ]
        },
        {
          "dayNumber": 2,
          "name": "Day 2: Squat Pattern & Push",
          "focus": "Anterior core and chest pressing",
          "exercises": [
            {
              "id": "dev-d2-e1",
              "name": "Dumbbell Goblet Squat",
              "sets": 4,
              "reps": "10",
              "targetWeightKg": 18,
              "restSeconds": 75,
              "notes": "Pause 1s at bottom"
            },
            {
              "id": "dev-d2-e2",
              "name": "Dumbbell Flat Bench Press",
              "sets": 3,
              "reps": "10",
              "targetWeightKg": 16,
              "restSeconds": 60,
              "notes": "Full chest stretch"
            },
            {
              "id": "dev-d2-e3",
              "name": "Deadbugs",
              "sets": 3,
              "reps": "10/side",
              "targetWeightKg": 0,
              "restSeconds": 45,
              "notes": "Low back flat to floor"
            }
          ]
        }
      ]
    }
  ],
  "sessions": [
    {
      "id": "sess-anindita-nov3",
      "trainerId": "user-trainer-1",
      "clientId": "client-1",
      "clientName": "Anindita Chatterjee",
      "date": "2026-11-03",
      "time": "10:00 AM",
      "durationMinutes": 60,
      "location": "The Push Fitness Studio",
      "sessionType": "Offline 1-on-1 Studio Session",
      "status": "completed",
      "notes": "Excellent form on Incline Dumbbell Press. Increased Lat Pulldown to 32.5kg! Great energy today.",
      "workoutDone": {
        "workoutName": "Day 1 - Upper Body (Chest & Back Focus)",
        "dayName": "Day 1 - Upper Body (Chest & Back Focus)",
        "dayNumber": 1,
        "programId": "prog-anindita-1",
        "programName": "Anindita - 12-Week Hypertrophy & Recomposition",
        "rpe": 8,
        "totalVolumeKg": 2831,
        "sessionNotes": "Client moved 10kg DBs easily on incline bench. Increased Lat Pulldown pin. Next week we test 12kg dumbbells.",
        "exercises": [
          {
            "id": "we-1",
            "name": "Incline Dumbbell Press",
            "prescribedText": "3 sets × 10-12 reps",
            "alternative": "",
            "notes": "Elbows tucked, slow controlled eccentric",
            "sets": [
              {
                "setNum": 1,
                "weightKg": 10,
                "reps": 12,
                "completed": true
              },
              {
                "setNum": 2,
                "weightKg": 10,
                "reps": 10,
                "completed": true
              },
              {
                "setNum": 3,
                "weightKg": 10,
                "reps": 10,
                "completed": true
              }
            ]
          },
          {
            "id": "we-2",
            "name": "Lat Pulldown (Neutral Grip)",
            "prescribedText": "3 sets × 10-12 reps",
            "alternative": "",
            "notes": "Clean contraction, full lat stretch at top",
            "sets": [
              {
                "setNum": 1,
                "weightKg": 30,
                "reps": 12,
                "completed": true
              },
              {
                "setNum": 2,
                "weightKg": 32.5,
                "reps": 10,
                "completed": true
              },
              {
                "setNum": 3,
                "weightKg": 32.5,
                "reps": 10,
                "completed": true
              }
            ]
          },
          {
            "id": "we-3",
            "name": "Seated Cable Row",
            "prescribedText": "3 sets × 12 reps",
            "alternative": "",
            "notes": "1s squeeze at sternum",
            "sets": [
              {
                "setNum": 1,
                "weightKg": 25,
                "reps": 12,
                "completed": true
              },
              {
                "setNum": 2,
                "weightKg": 25,
                "reps": 12,
                "completed": true
              },
              {
                "setNum": 3,
                "weightKg": 27.5,
                "reps": 10,
                "completed": true
              }
            ]
          },
          {
            "id": "we-4",
            "name": "Dumbbell Lateral Raises",
            "prescribedText": "3 sets × 15 reps",
            "alternative": "",
            "notes": "Strict form, no swinging",
            "sets": [
              {
                "setNum": 1,
                "weightKg": 4,
                "reps": 15,
                "completed": true
              },
              {
                "setNum": 2,
                "weightKg": 4,
                "reps": 15,
                "completed": true
              },
              {
                "setNum": 3,
                "weightKg": 4,
                "reps": 14,
                "completed": true
              }
            ]
          },
          {
            "id": "we-5",
            "name": "Cable Tricep Pushdowns",
            "prescribedText": "3 sets × 12 reps",
            "alternative": "",
            "notes": "Full extension at bottom",
            "sets": [
              {
                "setNum": 1,
                "weightKg": 12.5,
                "reps": 12,
                "completed": true
              },
              {
                "setNum": 2,
                "weightKg": 12.5,
                "reps": 12,
                "completed": true
              },
              {
                "setNum": 3,
                "weightKg": 15,
                "reps": 10,
                "completed": true
              }
            ]
          }
        ],
        "finisher": {
          "title": "Rowing Machine Intervals",
          "duration": "10 mins",
          "notes": "Completed 5 rounds of 30s sprint / 30s rest. Average split 2:12/500m."
        },
        "totalVolumeLbs": 6241
      },
      "createdAt": "2026-11-03T10:00:00.000Z"
    },
    {
      "id": "sess-anindita-upcoming-1",
      "trainerId": "user-trainer-1",
      "clientId": "client-1",
      "clientName": "Anindita Chatterjee",
      "date": "2026-11-06",
      "time": "10:00 AM",
      "durationMinutes": 60,
      "location": "The Push Fitness Studio",
      "sessionType": "Offline 1-on-1 Studio Session",
      "status": "scheduled",
      "notes": "Day 2 - Lower Body (Glute & Quad Focus)",
      "createdAt": "2026-10-15T09:00:00.000Z"
    },
    {
      "id": "sess-anindita-upcoming-2",
      "trainerId": "user-trainer-1",
      "clientId": "client-1",
      "clientName": "Anindita Chatterjee",
      "date": "2026-11-09",
      "time": "10:00 AM",
      "durationMinutes": 60,
      "location": "The Push Fitness Studio",
      "sessionType": "Offline 1-on-1 Studio Session",
      "status": "scheduled",
      "notes": "Day 3 - Full Body Circuit & Core",
      "createdAt": "2026-10-15T09:00:00.000Z"
    },
    {
      "id": "sess-tina-today",
      "clientId": "client-2",
      "clientName": "Tina",
      "programId": "prog-tina-1",
      "date": "2026-11-17",
      "time": "08:00 AM",
      "title": "1-on-1 Studio Session",
      "status": "scheduled",
      "workoutDone": false,
      "notes": "Session 5 of 12. Focus on goblet squat progressive overload."
    },
    {
      "id": "sess-aditi-tomorrow",
      "clientId": "client-3",
      "clientName": "Aditi",
      "programId": "prog-aditi-1",
      "date": "2026-11-17",
      "time": "07:30 AM",
      "title": "1-on-1 Studio Session",
      "status": "scheduled",
      "workoutDone": false,
      "notes": "Session 6 of 12. Band-assisted pull-up test."
    },
    {
      "id": "sess-maha-today",
      "clientId": "client-4",
      "clientName": "Maha",
      "programId": "prog-maha-1",
      "date": "2026-11-17",
      "time": "06:30 PM",
      "title": "1-on-1 Studio Session",
      "status": "scheduled",
      "workoutDone": false,
      "notes": "Session 4 of 12. Bench press working sets."
    },
    {
      "id": "sess-shiv-tomorrow",
      "clientId": "client-5",
      "clientName": "Shiv",
      "programId": "prog-shiv-1",
      "date": "2026-11-17",
      "time": "07:00 PM",
      "title": "1-on-1 Studio Session",
      "status": "scheduled",
      "workoutDone": false,
      "notes": "Session 5 of 12. Kettlebell conditioning and recovery."
    },
    {
      "id": "sess-devarsee-today",
      "clientId": "client-6",
      "clientName": "Devarsee",
      "programId": "prog-devarsee-1",
      "date": "2026-11-17",
      "time": "07:00 AM",
      "title": "1-on-1 Studio Session",
      "status": "scheduled",
      "workoutDone": false,
      "notes": "Session 4 of 12. Trap bar deadlift & postural mobility."
    }
  ],
  "workoutLogs": [
    {
      "id": "wlog-anindita-nov3",
      "sessionId": "sess-anindita-nov3",
      "clientId": "client-1",
      "workoutName": "Day 1 - Upper Body (Chest & Back Focus)",
      "programId": "prog-anindita-1",
      "programName": "Anindita - 12-Week Hypertrophy & Recomposition",
      "dayNumber": 1,
      "date": "2026-11-03",
      "durationMinutes": 60,
      "totalVolumeKg": 2831,
      "exercisesCompleted": [
        {
          "exerciseName": "Incline Dumbbell Press",
          "sets": [
            {
              "setNum": 1,
              "weightKg": 10,
              "reps": 12,
              "completed": true
            },
            {
              "setNum": 2,
              "weightKg": 10,
              "reps": 10,
              "completed": true
            },
            {
              "setNum": 3,
              "weightKg": 10,
              "reps": 10,
              "completed": true
            }
          ]
        },
        {
          "exerciseName": "Lat Pulldown (Neutral Grip)",
          "sets": [
            {
              "setNum": 1,
              "weightKg": 30,
              "reps": 12,
              "completed": true
            },
            {
              "setNum": 2,
              "weightKg": 32.5,
              "reps": 10,
              "completed": true
            },
            {
              "setNum": 3,
              "weightKg": 32.5,
              "reps": 10,
              "completed": true
            }
          ]
        },
        {
          "exerciseName": "Seated Cable Row",
          "sets": [
            {
              "setNum": 1,
              "weightKg": 25,
              "reps": 12,
              "completed": true
            },
            {
              "setNum": 2,
              "weightKg": 25,
              "reps": 12,
              "completed": true
            },
            {
              "setNum": 3,
              "weightKg": 27.5,
              "reps": 10,
              "completed": true
            }
          ]
        },
        {
          "exerciseName": "Dumbbell Lateral Raises",
          "sets": [
            {
              "setNum": 1,
              "weightKg": 4,
              "reps": 15,
              "completed": true
            },
            {
              "setNum": 2,
              "weightKg": 4,
              "reps": 15,
              "completed": true
            },
            {
              "setNum": 3,
              "weightKg": 4,
              "reps": 14,
              "completed": true
            }
          ]
        },
        {
          "exerciseName": "Cable Tricep Pushdowns",
          "sets": [
            {
              "setNum": 1,
              "weightKg": 12.5,
              "reps": 12,
              "completed": true
            },
            {
              "setNum": 2,
              "weightKg": 12.5,
              "reps": 12,
              "completed": true
            },
            {
              "setNum": 3,
              "weightKg": 15,
              "reps": 10,
              "completed": true
            }
          ]
        }
      ],
      "finisher": {
        "title": "Rowing Machine Intervals",
        "duration": "10 mins",
        "notes": "5 rounds 30s sprint / 30s rest"
      },
      "notes": "Client moved 10kg DBs easily on incline bench. Next week test 12kg.",
      "rpe": 8,
      "createdAt": "2026-11-03T11:00:00.000Z",
      "clientName": "Anindita Chatterjee"
    }
  ],
  "nutritionLogs": [
    {
      "id": "nutri-anindita-1",
      "clientId": "client-1",
      "date": "2026-11-05",
      "totalCalories": 1720,
      "proteinG": 122,
      "carbsG": 165,
      "fatsG": 48,
      "waterMl": 2900,
      "notes": "Hit protein goal easily with boiled eggs and whey shake.",
      "createdAt": "2026-11-05T21:00:00.000Z"
    }
  ],
  "payments": [
    {
      "id": "pay-anindita-1",
      "clientId": "client-1",
      "clientName": "Anindita Chatterjee",
      "planName": "Personal Coaching Package (12 Sessions)",
      "amount": 18000,
      "billingCycle": "Monthly",
      "dueDate": "2026-10-15",
      "paidDate": "2026-10-15",
      "status": "paid",
      "paymentMethod": "UPI (GPay / PhonePe)",
      "referenceId": "UPI_ASEN_889102",
      "notes": "Advance prepaid coaching package payment received beforehand",
      "createdAt": "2026-10-15T09:00:00.000Z"
    },
    {
      "id": "pay-client-2-1",
      "clientId": "client-2",
      "clientName": "Tina",
      "amount": 18000,
      "date": "2026-10-18",
      "method": "UPI / Bank Transfer",
      "status": "paid",
      "invoiceNumber": "INV-TINA-001",
      "description": "Personal Coaching Package (12 Sessions)",
      "packageSessions": 12
    },
    {
      "id": "pay-client-3-1",
      "clientId": "client-3",
      "clientName": "Aditi",
      "amount": 18000,
      "date": "2026-10-20",
      "method": "UPI / Bank Transfer",
      "status": "paid",
      "invoiceNumber": "INV-ADITI-001",
      "description": "Personal Coaching Package (12 Sessions)",
      "packageSessions": 12
    },
    {
      "id": "pay-client-4-1",
      "clientId": "client-4",
      "clientName": "Maha",
      "amount": 18000,
      "date": "2026-10-22",
      "method": "UPI / Bank Transfer",
      "status": "paid",
      "invoiceNumber": "INV-MAHA-001",
      "description": "Personal Coaching Package (12 Sessions)",
      "packageSessions": 12
    },
    {
      "id": "pay-client-5-1",
      "clientId": "client-5",
      "clientName": "Shiv",
      "amount": 18000,
      "date": "2026-10-25",
      "method": "UPI / Bank Transfer",
      "status": "paid",
      "invoiceNumber": "INV-SHIV-001",
      "description": "Personal Coaching Package (12 Sessions)",
      "packageSessions": 12
    },
    {
      "id": "pay-client-6-1",
      "clientId": "client-6",
      "clientName": "Devarsee",
      "amount": 18000,
      "date": "2026-10-28",
      "method": "UPI / Bank Transfer",
      "status": "paid",
      "invoiceNumber": "INV-DEVARSEE-001",
      "description": "Personal Coaching Package (12 Sessions)",
      "packageSessions": 12
    }
  ],
  "measurements": [
    {
      "id": "m-anindita-1",
      "clientId": "client-1",
      "date": "2026-10-15",
      "weightKg": 62,
      "waistCm": 74,
      "hipsCm": 96,
      "bodyFatPercent": 26.5
    },
    {
      "id": "m-anindita-2",
      "clientId": "client-1",
      "date": "2026-11-03",
      "weightKg": 58.5,
      "waistCm": 70,
      "hipsCm": 94,
      "bodyFatPercent": 24
    },
    {
      "id": "meas-client-2-1",
      "clientId": "client-2",
      "date": "2026-10-18",
      "weightKg": 64.5,
      "bodyFatPercent": 26.5,
      "chestCm": 86,
      "waistCm": 72,
      "hipsCm": 96,
      "armsCm": 27,
      "thighsCm": 54,
      "notes": "Starting onboarding baseline measurement."
    },
    {
      "id": "meas-client-3-1",
      "clientId": "client-3",
      "date": "2026-10-20",
      "weightKg": 57.5,
      "bodyFatPercent": 26.5,
      "chestCm": 86,
      "waistCm": 72,
      "hipsCm": 96,
      "armsCm": 27,
      "thighsCm": 54,
      "notes": "Starting onboarding baseline measurement."
    },
    {
      "id": "meas-client-4-1",
      "clientId": "client-4",
      "date": "2026-10-22",
      "weightKg": 71.5,
      "bodyFatPercent": 18.2,
      "chestCm": 98,
      "waistCm": 84,
      "hipsCm": 94,
      "armsCm": 33,
      "thighsCm": 56,
      "notes": "Starting onboarding baseline measurement."
    },
    {
      "id": "meas-client-5-1",
      "clientId": "client-5",
      "date": "2026-10-25",
      "weightKg": 74,
      "bodyFatPercent": 18.2,
      "chestCm": 98,
      "waistCm": 84,
      "hipsCm": 94,
      "armsCm": 33,
      "thighsCm": 56,
      "notes": "Starting onboarding baseline measurement."
    },
    {
      "id": "meas-client-6-1",
      "clientId": "client-6",
      "date": "2026-10-28",
      "weightKg": 70,
      "bodyFatPercent": 18.2,
      "chestCm": 98,
      "waistCm": 84,
      "hipsCm": 94,
      "armsCm": 33,
      "thighsCm": 56,
      "notes": "Starting onboarding baseline measurement."
    }
  ],
  "performanceMetrics": [
    {
      "id": "pm-anindita-1",
      "clientId": "client-1",
      "exerciseName": "Incline Dumbbell Press",
      "weightKg": 10,
      "reps": 12,
      "estimated1Rm": 14,
      "date": "2026-11-03"
    }
  ],
  "progressPhotos": [],
  "notes": [
    {
      "id": "note-anindita-1",
      "clientId": "client-1",
      "authorId": "user-trainer-1",
      "authorName": "Coach Pushkar Mayekar",
      "title": "Session Feedback - 3rd Nov",
      "content": "Anindita demonstrated great shoulder control on dumbbell presses today. Continue cueing elbows at 45 degrees.",
      "isPrivate": true,
      "category": "workout",
      "createdAt": "2026-11-03T11:15:00.000Z"
    },
    {
      "id": "note-client-2-1",
      "clientId": "client-2",
      "trainerId": "user-trainer-1",
      "date": "2026-10-18",
      "title": "Initial Assessment & Goals",
      "content": "Onboarded Tina. Target: Fat Loss & Body Toning. Dietary preference: Non-Vegetarian. Daily calorie goal: 1700 kcal with 115g protein.",
      "category": "assessment",
      "createdAt": "2026-10-18T10:00:00.000Z"
    },
    {
      "id": "note-client-3-1",
      "clientId": "client-3",
      "trainerId": "user-trainer-1",
      "date": "2026-10-20",
      "title": "Initial Assessment & Goals",
      "content": "Onboarded Aditi. Target: Strength & Core Conditioning. Dietary preference: Vegetarian. Daily calorie goal: 1650 kcal with 110g protein.",
      "category": "assessment",
      "createdAt": "2026-10-20T10:00:00.000Z"
    },
    {
      "id": "note-client-4-1",
      "clientId": "client-4",
      "trainerId": "user-trainer-1",
      "date": "2026-10-22",
      "title": "Initial Assessment & Goals",
      "content": "Onboarded Maha. Target: Muscle Hypertrophy & Strength. Dietary preference: Non-Vegetarian. Daily calorie goal: 2450 kcal with 160g protein.",
      "category": "assessment",
      "createdAt": "2026-10-22T10:00:00.000Z"
    },
    {
      "id": "note-client-5-1",
      "clientId": "client-5",
      "trainerId": "user-trainer-1",
      "date": "2026-10-25",
      "title": "Initial Assessment & Goals",
      "content": "Onboarded Shiv. Target: Functional Fitness & Athletic Conditioning. Dietary preference: Non-Vegetarian. Daily calorie goal: 2200 kcal with 145g protein.",
      "category": "assessment",
      "createdAt": "2026-10-25T10:00:00.000Z"
    },
    {
      "id": "note-client-6-1",
      "clientId": "client-6",
      "trainerId": "user-trainer-1",
      "date": "2026-10-28",
      "title": "Initial Assessment & Goals",
      "content": "Onboarded Devarsee. Target: Mobility, Posture & Hypertrophy. Dietary preference: Vegetarian. Daily calorie goal: 1900 kcal with 130g protein.",
      "category": "assessment",
      "createdAt": "2026-10-28T10:00:00.000Z"
    }
  ],
  "messages": [
    {
      "id": "msg-anindita-1",
      "senderId": "user-trainer-1",
      "senderRole": "trainer",
      "recipientId": "client-1",
      "clientId": "client-1",
      "text": "Great session on Tuesday Anindita! 10kg incline dumbbells moved like butter. See you on Friday at 10:00 AM!",
      "category": "workout",
      "isRead": true,
      "timestamp": "2026-11-03T12:00:00.000Z"
    },
    {
      "id": "msg-anindita-2",
      "senderId": "user-client-1",
      "senderRole": "client",
      "recipientId": "user-trainer-1",
      "clientId": "client-1",
      "text": "Thanks Coach Pushkar! Upper body feels worked but great! Looking forward to Friday's session.",
      "category": "workout",
      "isRead": true,
      "timestamp": "2026-11-03T13:30:00.000Z"
    }
  ],
  "checkins": [
    {
      "id": "chk-anindita-1",
      "clientId": "client-1",
      "clientName": "Anindita Chatterjee",
      "date": "2026-11-01",
      "status": "reviewed",
      "responses": {
        "energyRating": 9,
        "sleepHours": 7.5,
        "sleepQuality": 9,
        "workoutConsistency": 10,
        "nutritionConsistency": 9,
        "waterCompliance": 9,
        "painOrDiscomfort": "None, felt energetic all week",
        "winsThisWeek": "Hit all 3 sessions with Coach Pushkar and drank 2.8L water daily!",
        "biggestObstacle": "Office snack cravings, replaced with roasted chana and almonds",
        "nextWeekGoal": "Increase weights on dumbbell presses"
      },
      "trainerFeedback": "Outstanding commitment Anindita! The consistency is paying off directly in your posture and energy levels.",
      "reviewedAt": "2026-11-01T19:00:00.000Z"
    },
    {
      "id": "chk-client-2-1",
      "clientId": "client-2",
      "date": "2026-11-10",
      "weightKg": 61,
      "energyLevel": 8,
      "sleepHours": 7.5,
      "stressLevel": 4,
      "dietAdherence": 9,
      "workoutAdherence": 10,
      "notes": "Feeling energetic and motivated. Workout consistency has been solid.",
      "trainerFeedback": "Awesome progress! Keep up the protein intake and focus on rest."
    },
    {
      "id": "chk-client-3-1",
      "clientId": "client-3",
      "date": "2026-11-10",
      "weightKg": 55,
      "energyLevel": 8,
      "sleepHours": 7.5,
      "stressLevel": 4,
      "dietAdherence": 9,
      "workoutAdherence": 10,
      "notes": "Feeling energetic and motivated. Workout consistency has been solid.",
      "trainerFeedback": "Awesome progress! Keep up the protein intake and focus on rest."
    },
    {
      "id": "chk-client-4-1",
      "clientId": "client-4",
      "date": "2026-11-10",
      "weightKg": 74,
      "energyLevel": 8,
      "sleepHours": 7.5,
      "stressLevel": 4,
      "dietAdherence": 9,
      "workoutAdherence": 10,
      "notes": "Feeling energetic and motivated. Workout consistency has been solid.",
      "trainerFeedback": "Awesome progress! Keep up the protein intake and focus on rest."
    },
    {
      "id": "chk-client-5-1",
      "clientId": "client-5",
      "date": "2026-11-10",
      "weightKg": 72,
      "energyLevel": 8,
      "sleepHours": 7.5,
      "stressLevel": 4,
      "dietAdherence": 9,
      "workoutAdherence": 10,
      "notes": "Feeling energetic and motivated. Workout consistency has been solid.",
      "trainerFeedback": "Awesome progress! Keep up the protein intake and focus on rest."
    },
    {
      "id": "chk-client-6-1",
      "clientId": "client-6",
      "date": "2026-11-10",
      "weightKg": 68.5,
      "energyLevel": 8,
      "sleepHours": 7.5,
      "stressLevel": 4,
      "dietAdherence": 9,
      "workoutAdherence": 10,
      "notes": "Feeling energetic and motivated. Workout consistency has been solid.",
      "trainerFeedback": "Awesome progress! Keep up the protein intake and focus on rest."
    }
  ],
  "notifications": [
    {
      "id": "notif-welcome-1",
      "userId": "user-trainer-1",
      "role": "trainer",
      "title": "Welcome to thepushfittness OS",
      "message": "Your coaching roster is active with 5 athletes.",
      "type": "session",
      "isRead": true,
      "timestamp": "2026-10-02T11:07:59.361Z",
      "link": "/clients"
    }
  ],
  "templates": [
    {
      "id": "tpl-1",
      "type": "program",
      "name": "12-Week Hypertrophy & Body Recomposition",
      "goal": "Muscle Gain & Fat Loss",
      "daysPerWeek": 4,
      "durationWeeks": 12,
      "description": "Proven upper/lower split prioritizing progressive overload on compound lifts with targeted hypertrophy isolation.",
      "days": [
        {
          "id": "d1",
          "name": "Day 1 - Upper Body (Chest & Back Focus)",
          "exercises": [
            {
              "id": "e1",
              "name": "Barbell Bench Press",
              "sets": 4,
              "reps": "8-10",
              "restSec": 90,
              "rpe": 8,
              "targetWeightKg": 60,
              "notes": "Retract scapulae, controlled eccentric tempo"
            },
            {
              "id": "e2",
              "name": "Bent-Over Barbell Row",
              "sets": 4,
              "reps": "8-10",
              "restSec": 90,
              "rpe": 8,
              "targetWeightKg": 50,
              "notes": "Pull to lower sternum, hold 1s squeeze"
            },
            {
              "id": "e3",
              "name": "Incline Dumbbell Press",
              "sets": 3,
              "reps": "10-12",
              "restSec": 60,
              "rpe": 8,
              "targetWeightKg": 22,
              "notes": "30-degree incline"
            },
            {
              "id": "e4",
              "name": "Lat Pulldown (Neutral Grip)",
              "sets": 3,
              "reps": "10-12",
              "restSec": 60,
              "rpe": 8,
              "targetWeightKg": 55,
              "notes": "Full stretch at top"
            },
            {
              "id": "e5",
              "name": "Lateral Cable Raises",
              "sets": 3,
              "reps": "15",
              "restSec": 45,
              "rpe": 9,
              "targetWeightKg": 7.5,
              "notes": "Lead with elbows"
            }
          ]
        },
        {
          "id": "d2",
          "name": "Day 2 - Lower Body (Quad & Glute Focus)",
          "exercises": [
            {
              "id": "e6",
              "name": "Barbell Back Squat",
              "sets": 4,
              "reps": "6-8",
              "restSec": 120,
              "rpe": 8,
              "targetWeightKg": 80,
              "notes": "Brace core hard, below parallel"
            },
            {
              "id": "e7",
              "name": "Romanian Deadlift (Dumbbell)",
              "sets": 3,
              "reps": "10-12",
              "restSec": 90,
              "rpe": 8,
              "targetWeightKg": 28,
              "notes": "Hinge at hips, stretch hamstrings"
            },
            {
              "id": "e8",
              "name": "Bulgarian Split Squat",
              "sets": 3,
              "reps": "10/leg",
              "restSec": 60,
              "rpe": 8.5,
              "targetWeightKg": 14,
              "notes": "Slight forward torso lean"
            },
            {
              "id": "e9",
              "name": "Standing Calf Raises",
              "sets": 4,
              "reps": "12-15",
              "restSec": 45,
              "rpe": 9,
              "targetWeightKg": 40,
              "notes": "2s pause at bottom stretch"
            }
          ]
        },
        {
          "id": "d3",
          "name": "Day 3 - Upper Body (Shoulders & Arms)",
          "exercises": [
            {
              "id": "e10",
              "name": "Overhead Barbell Military Press",
              "sets": 4,
              "reps": "6-8",
              "restSec": 90,
              "rpe": 8,
              "targetWeightKg": 40,
              "notes": "Lock out overhead"
            },
            {
              "id": "e11",
              "name": "Seated Cable Row",
              "sets": 4,
              "reps": "10-12",
              "restSec": 60,
              "rpe": 8,
              "targetWeightKg": 50,
              "notes": "Keep spine neutral"
            },
            {
              "id": "e12",
              "name": "Dips / Push-ups",
              "sets": 3,
              "reps": "12-15",
              "restSec": 60,
              "rpe": 8.5,
              "targetWeightKg": 0,
              "notes": "Full range of motion"
            },
            {
              "id": "e13",
              "name": "Incline Dumbbell Bicep Curls",
              "sets": 3,
              "reps": "12",
              "restSec": 45,
              "rpe": 9,
              "targetWeightKg": 12,
              "notes": "Supinate at top"
            },
            {
              "id": "e14",
              "name": "Tricep Overhead Rope Extension",
              "sets": 3,
              "reps": "12-15",
              "restSec": 45,
              "rpe": 9,
              "targetWeightKg": 20,
              "notes": "Flared ropes at lockout"
            }
          ]
        },
        {
          "id": "d4",
          "name": "Day 4 - Lower Body & Core (Posterior Chain)",
          "exercises": [
            {
              "id": "e15",
              "name": "Conventional Barbell Deadlift",
              "sets": 4,
              "reps": "5",
              "restSec": 150,
              "rpe": 8.5,
              "targetWeightKg": 100,
              "notes": "Reset breath each rep, pull slack out of bar"
            },
            {
              "id": "e16",
              "name": "Leg Press",
              "sets": 3,
              "reps": "12-15",
              "restSec": 75,
              "rpe": 8.5,
              "targetWeightKg": 140,
              "notes": "Feet shoulder-width middle plate"
            },
            {
              "id": "e17",
              "name": "Lying Leg Curls",
              "sets": 3,
              "reps": "12",
              "restSec": 60,
              "rpe": 9,
              "targetWeightKg": 35,
              "notes": "Slow 3s eccentric"
            },
            {
              "id": "e18",
              "name": "Hanging Knee / Leg Raises",
              "sets": 3,
              "reps": "15",
              "restSec": 45,
              "rpe": 8.5,
              "targetWeightKg": 0,
              "notes": "Controlled without swinging"
            }
          ]
        }
      ]
    }
  ],
  "timelineEvents": [
    {
      "id": "tl-anindita-1",
      "clientId": "client-1",
      "eventType": "client_created",
      "title": "Client Onboarded (Prepaid)",
      "description": "Account activated with 12 prepaid sessions. Upfront fee: ₹18,000 (Paid).",
      "timestamp": "2026-10-15T09:00:00Z"
    },
    {
      "id": "tl-anindita-2",
      "clientId": "client-1",
      "eventType": "sessions_scheduled",
      "title": "Training Schedule Initialized",
      "description": "Auto-scheduled 12 sessions on Mon/Wed/Fri at 10:00 AM.",
      "timestamp": "2026-10-15T09:05:00Z"
    },
    {
      "id": "tl-anindita-3",
      "clientId": "client-1",
      "eventType": "session_completed",
      "title": "Training Session Completed",
      "description": "Offline 1-on-1 Studio Session completed. Workout: Day 1 - Upper Body (Chest & Back Focus) (4,250 kg volume).",
      "timestamp": "2026-11-03T11:00:00Z"
    }
  ]
};
