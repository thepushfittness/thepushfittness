// Initial Realistic Seed Data for PushFitness
export const initialData = {
  users: [
    {
      id: "user-trainer-1",
      email: "alex.trainer@pushfitness.io",
      name: "Coach Alex Rivera",
      role: "trainer",
      phone: "+1 (555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      createdAt: "2026-01-10T08:00:00Z"
    },
    {
      id: "user-client-1",
      email: "sarah.chen@gmail.com",
      name: "Sarah Chen",
      role: "client",
      clientId: "client-1",
      phone: "+1 (555) 345-6789",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      createdAt: "2026-04-15T09:30:00Z"
    },
    {
      id: "user-client-2",
      email: "marcus.vance@gmail.com",
      name: "Marcus Vance",
      role: "client",
      clientId: "client-2",
      phone: "+1 (555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      createdAt: "2026-03-01T11:00:00Z"
    },
    {
      id: "user-client-3",
      email: "david.miller@gmail.com",
      name: "David Miller",
      role: "client",
      clientId: "client-3",
      phone: "+1 (555) 567-8901",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      createdAt: "2026-05-12T14:20:00Z"
    },
    {
      id: "user-client-4",
      email: "elena.rostova@gmail.com",
      name: "Elena Rostova",
      role: "client",
      clientId: "client-4",
      phone: "+1 (555) 678-9012",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      createdAt: "2026-09-24T16:00:00Z"
    },
    {
      id: "user-client-5",
      email: "jordan.taylor@gmail.com",
      name: "Jordan Taylor",
      role: "client",
      clientId: "client-5",
      phone: "+1 (555) 789-0123",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
      createdAt: "2026-02-18T10:15:00Z"
    },
    {
      id: "user-client-6",
      email: "rachel.adams@gmail.com",
      name: "Rachel Adams",
      role: "client",
      clientId: "client-6",
      phone: "+1 (555) 890-1234",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      createdAt: "2026-06-05T13:45:00Z"
    }
  ],

  clients: [
    {
      id: "client-1",
      userId: "user-client-1",
      name: "Sarah Chen",
      email: "sarah.chen@gmail.com",
      phone: "+1 (555) 345-6789",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      dateOfBirth: "1994-08-14",
      gender: "Female",
      occupation: "Senior Product Designer",
      emergencyContact: "Kevin Chen (Brother) - +1 (555) 998-1122",
      startDate: "2026-04-15",
      status: "active", // lead, onboarding, active, paused, expired, inactive, archived
      trainingType: "Hybrid (1-on-1 + App Coaching)",
      trainingFrequency: "4x per week",
      currentGoal: "Fat Loss & Mobility",
      goalsList: ["Fat loss", "Mobility", "General fitness"],
      acquisitionSource: "Instagram",
      heightCm: 165,
      weightKg: 64.2,
      startingWeightKg: 71.5,
      targetWeightKg: 61.0,
      trainingExperience: "Intermediate (2 years)",
      fitnessLevel: "Intermediate",
      injuries: "Mild right hamstring tightness after prolonged sitting",
      restrictions: "Avoid excessive straight-leg deadlifts with heavy loads",
      equipmentAvailability: "Commercial Gym (Full access)",
      lifestyleLevel: "Moderate (Desk job, walks 7k steps/day)",
      
      // Nutrition
      dietaryPreference: "Flexible / Omnivore",
      allergies: "Shellfish",
      foodsAvoided: "Deep-fried foods on weekdays",
      dailyCalorieTarget: 1750,
      proteinTargetG: 135,
      carbsTargetG: 170,
      fatsTargetG: 50,
      waterTargetMl: 2800,
      nutritionNotes: "Prefers high protein breakfast to prevent mid-afternoon energy crashes.",

      // Adherence metrics
      adherenceScore: 92,
      adherenceStatus: "Excellent", // Excellent, Good, Needs Attention
      workoutAdherence: 94,
      nutritionAdherence: 89,
      sessionAttendance: 100,
      checkinAdherence: 90,

      // Sessions
      sessionsPurchased: 12,
      sessionsCompleted: 10,
      sessionsRemaining: 2,
      sessionsCancelled: 0,
      sessionsMissed: 0,

      // Billing & Plan
      planName: "Performance Hybrid Coaching",
      monthlyPrice: 380,
      billingCycle: "Monthly",
      paymentStatus: "paid", // paid, due, overdue, partially_paid, cancelled
      nextPaymentDate: "2026-10-15",
      amountPaidToDate: 2280,
      renewalsCount: 5,
      lifetimeRevenue: 2280,
      lastSessionDate: "2026-09-30",
      lastPaymentDate: "2026-09-15",
      lastActivityDate: "2026-10-01",

      customFields: {
        "Target Body Fat %": "21%",
        "Preferred Workout Time": "7:00 AM",
        "Shoe Size": "7.5 US"
      },

      consentForMarketingPhotos: true
    },
    {
      id: "client-2",
      userId: "user-client-2",
      name: "Marcus Vance",
      email: "marcus.vance@gmail.com",
      phone: "+1 (555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      dateOfBirth: "1990-11-22",
      gender: "Male",
      occupation: "Software Architect",
      emergencyContact: "Jessica Vance (Spouse) - +1 (555) 441-2200",
      startDate: "2026-03-01",
      status: "active",
      trainingType: "Powerbuilding & Strength Coaching",
      trainingFrequency: "4x per week",
      currentGoal: "Strength & Muscle Gain",
      goalsList: ["Strength", "Muscle gain", "Performance"],
      acquisitionSource: "Referral",
      heightCm: 182,
      weightKg: 85.0,
      startingWeightKg: 80.2,
      targetWeightKg: 87.0,
      trainingExperience: "Advanced (6 years)",
      fitnessLevel: "Advanced",
      injuries: "Old shoulder AC joint sprain (fully rehabbed)",
      restrictions: "Proper warm-up required before heavy benching",
      equipmentAvailability: "Barbell club gym (Squat racks, calibrated plates, dumbbells to 120lbs)",
      lifestyleLevel: "Active (Walks dog 10k steps/day, gym 4x)",

      // Nutrition
      dietaryPreference: "High Protein",
      allergies: "None",
      foodsAvoided: "None",
      dailyCalorieTarget: 2900,
      proteinTargetG: 195,
      carbsTargetG: 340,
      fatsTargetG: 80,
      waterTargetMl: 3800,
      nutritionNotes: "Lean bulking phase. Consuming creatine 5g daily.",

      adherenceScore: 96,
      adherenceStatus: "Excellent",
      workoutAdherence: 98,
      nutritionAdherence: 92,
      sessionAttendance: 100,
      checkinAdherence: 95,

      sessionsPurchased: 12,
      sessionsCompleted: 6,
      sessionsRemaining: 6,
      sessionsCancelled: 0,
      sessionsMissed: 0,

      planName: "Strength Athlete Mentorship",
      monthlyPrice: 450,
      billingCycle: "Monthly",
      paymentStatus: "paid",
      nextPaymentDate: "2026-10-20",
      amountPaidToDate: 3150,
      renewalsCount: 7,
      lifetimeRevenue: 3150,
      lastSessionDate: "2026-09-29",
      lastPaymentDate: "2026-09-20",
      lastActivityDate: "2026-10-01",

      customFields: {
        "Competition Goal": "Local Powerlifting Meet in Spring",
        "Squat Stance": "Wide, flat shoes"
      },
      consentForMarketingPhotos: true
    },
    {
      id: "client-3",
      userId: "user-client-3",
      name: "David Miller",
      email: "david.miller@gmail.com",
      phone: "+1 (555) 567-8901",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      dateOfBirth: "1985-03-10",
      gender: "Male",
      occupation: "Managing Director",
      emergencyContact: "Laura Miller (Wife) - +1 (555) 777-3311",
      startDate: "2026-05-12",
      status: "active",
      trainingType: "1-on-1 In-Person",
      trainingFrequency: "2x per week",
      currentGoal: "General Fitness & Stress Relief",
      goalsList: ["General fitness", "Conditioning"],
      acquisitionSource: "Website",
      heightCm: 178,
      weightKg: 91.5,
      startingWeightKg: 93.0,
      targetWeightKg: 82.0,
      trainingExperience: "Beginner",
      fitnessLevel: "Beginner",
      injuries: "Occasional lower back tightness (L4/L5 disc strain 2024)",
      restrictions: "Keep lumbar spine neutral, no rounded back lifting",
      equipmentAvailability: "Condo Gym (Dumbbells to 50lbs, Cable machine, Treadmill)",
      lifestyleLevel: "Low / Sedentary (High stress 60hr work weeks)",

      // Nutrition
      dietaryPreference: "Standard Western",
      allergies: "None",
      foodsAvoided: "None",
      dailyCalorieTarget: 2100,
      proteinTargetG: 140,
      carbsTargetG: 210,
      fatsTargetG: 65,
      waterTargetMl: 2500,
      nutritionNotes: "Client struggles with late night snacking and client business dinners.",

      // Adherence metrics - NEEDS ATTENTION!
      adherenceScore: 48,
      adherenceStatus: "Needs Attention",
      workoutAdherence: 42,
      nutritionAdherence: 35,
      sessionAttendance: 60,
      checkinAdherence: 40,

      sessionsPurchased: 8,
      sessionsCompleted: 3,
      sessionsRemaining: 3,
      sessionsCancelled: 1,
      sessionsMissed: 1,

      planName: "Executive In-Person Package",
      monthlyPrice: 350,
      billingCycle: "Monthly",
      paymentStatus: "overdue", // OVERDUE
      nextPaymentDate: "2026-09-26",
      amountPaidToDate: 1400,
      renewalsCount: 4,
      lifetimeRevenue: 1400,
      lastSessionDate: "2026-09-22",
      lastPaymentDate: "2026-08-26",
      lastActivityDate: "2026-09-26", // 5 days inactive

      needsAttentionReasons: [
        "Payment is 5 days overdue ($350)",
        "No workout or food logged for 5 days",
        "Missed last scheduled session (No-show on Sept 26)",
        "Adherence score dropped below 50%"
      ],

      customFields: {
        "Executive Travel Frequency": "2 weeks per month"
      },
      consentForMarketingPhotos: false
    },
    {
      id: "client-4",
      userId: "user-client-4",
      name: "Elena Rostova",
      email: "elena.rostova@gmail.com",
      phone: "+1 (555) 678-9012",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      dateOfBirth: "1998-05-30",
      gender: "Female",
      occupation: "Biomedical Researcher",
      emergencyContact: "Dmitri Rostov (Father) - +1 (555) 232-1100",
      startDate: "2026-09-24",
      status: "onboarding", // Onboarding
      trainingType: "Online Coaching & Strength for Runners",
      trainingFrequency: "3x per week",
      currentGoal: "Half Marathon Strength & Core",
      goalsList: ["Conditioning", "Mobility", "Performance"],
      acquisitionSource: "WhatsApp",
      heightCm: 172,
      weightKg: 59.8,
      startingWeightKg: 59.8,
      targetWeightKg: 58.5,
      trainingExperience: "Intermediate Runner, Beginner Lifter",
      fitnessLevel: "Intermediate",
      injuries: "Runner's knee (patellofemoral) during high mileage",
      restrictions: "Strengthen VMO and glute medius, avoid excessive deep lunges",
      equipmentAvailability: "Home gym (Kettlebells, bands, adjustable dumbbells)",
      lifestyleLevel: "Active (Runs 30km/week)",

      dietaryPreference: "Pescatarian",
      allergies: "Lactose intolerance",
      foodsAvoided: "Dairy milk and whey concentrate",
      dailyCalorieTarget: 2200,
      proteinTargetG: 125,
      carbsTargetG: 280,
      fatsTargetG: 55,
      waterTargetMl: 3200,
      nutritionNotes: "Needs plant/pea protein or isolate. High carb timing around long run days.",

      adherenceScore: 88,
      adherenceStatus: "Good",
      workoutAdherence: 85,
      nutritionAdherence: 90,
      sessionAttendance: 100,
      checkinAdherence: 100,

      sessionsPurchased: 4,
      sessionsCompleted: 1,
      sessionsRemaining: 3,
      sessionsCancelled: 0,
      sessionsMissed: 0,

      planName: "Runner's Strength Foundations",
      monthlyPrice: 280,
      billingCycle: "Monthly",
      paymentStatus: "paid",
      nextPaymentDate: "2026-10-24",
      amountPaidToDate: 280,
      renewalsCount: 0,
      lifetimeRevenue: 280,
      lastSessionDate: "2026-09-27",
      lastPaymentDate: "2026-09-24",
      lastActivityDate: "2026-09-30",

      onboardingStep: 5, // 1-created, 2-login sent, 3-profile filled, 4-questionnaire filled, 5-trainer review, 6-program assigned, 7-training started
      customFields: {
        "Target Race": "City Half Marathon (Nov 15)",
        "Current 10k PR": "49:20"
      },
      consentForMarketingPhotos: true
    },
    {
      id: "client-5",
      userId: "user-client-5",
      name: "Jordan Taylor",
      email: "jordan.taylor@gmail.com",
      phone: "+1 (555) 789-0123",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
      dateOfBirth: "1988-12-04",
      gender: "Non-binary",
      occupation: "Creative Director",
      emergencyContact: "Sam Taylor (Sibling) - +1 (555) 888-9900",
      startDate: "2026-02-18",
      status: "paused", // Paused
      trainingType: "Corrective Exercise & Strength",
      trainingFrequency: "2x per week",
      currentGoal: "Shoulder Rehab & Core Stability",
      goalsList: ["Mobility", "General fitness"],
      acquisitionSource: "Existing client",
      heightCm: 175,
      weightKg: 74.0,
      startingWeightKg: 78.0,
      targetWeightKg: 72.0,
      trainingExperience: "Intermediate",
      fitnessLevel: "Intermediate",
      injuries: "Rotator cuff tendonitis and mild impingement",
      restrictions: "Strictly no overhead barbell pressing or behind-the-neck movements",
      equipmentAvailability: "Full gym",
      lifestyleLevel: "Moderate",

      dietaryPreference: "Vegetarian",
      allergies: "Tree nuts",
      foodsAvoided: "Walnuts, almonds, cashews",
      dailyCalorieTarget: 2000,
      proteinTargetG: 130,
      carbsTargetG: 230,
      fatsTargetG: 60,
      waterTargetMl: 2600,
      nutritionNotes: "Focusing on tofu, tempeh, eggs, and Greek yogurt for protein.",

      adherenceScore: 78,
      adherenceStatus: "Good",
      workoutAdherence: 80,
      nutritionAdherence: 75,
      sessionAttendance: 85,
      checkinAdherence: 80,

      sessionsPurchased: 8,
      sessionsCompleted: 6,
      sessionsRemaining: 2,
      sessionsCancelled: 1,
      sessionsMissed: 0,

      planName: "Rehab & Strength Track",
      monthlyPrice: 320,
      billingCycle: "Monthly",
      paymentStatus: "due",
      nextPaymentDate: "2026-10-05",
      amountPaidToDate: 2560,
      renewalsCount: 7,
      lifetimeRevenue: 2560,
      lastSessionDate: "2026-09-18",
      lastPaymentDate: "2026-09-05",
      lastActivityDate: "2026-09-20",

      customFields: {
        "Physical Therapist Contact": "Dr. Mark Sloan, PT"
      },
      consentForMarketingPhotos: false
    },
    {
      id: "client-6",
      userId: "user-client-6",
      name: "Rachel Adams",
      email: "rachel.adams@gmail.com",
      phone: "+1 (555) 890-1234",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      dateOfBirth: "1996-01-19",
      gender: "Female",
      occupation: "Financial Analyst",
      emergencyContact: "Thomas Adams (Spouse) - +1 (555) 321-7654",
      startDate: "2026-06-05",
      status: "active",
      trainingType: "Hypertrophy & Body Recomposition",
      trainingFrequency: "5x per week",
      currentGoal: "Muscle Gain & Glute Specialization",
      goalsList: ["Muscle gain", "Strength", "Fat loss"],
      acquisitionSource: "Instagram",
      heightCm: 168,
      weightKg: 62.5,
      startingWeightKg: 66.0,
      targetWeightKg: 63.0,
      trainingExperience: "Intermediate (3 years)",
      fitnessLevel: "Intermediate-Advanced",
      injuries: "None",
      restrictions: "None",
      equipmentAvailability: "Full Gym with specialized machines (Hack Squat, Hip Thrust machine)",
      lifestyleLevel: "Active",

      dietaryPreference: "Macro Tracking",
      allergies: "None",
      foodsAvoided: "Excessive alcohol",
      dailyCalorieTarget: 2150,
      proteinTargetG: 145,
      carbsTargetG: 240,
      fatsTargetG: 60,
      waterTargetMl: 3000,
      nutritionNotes: "Consistent meal prepper. Uses MyFitnessPal integration.",

      adherenceScore: 94,
      adherenceStatus: "Excellent",
      workoutAdherence: 95,
      nutritionAdherence: 93,
      sessionAttendance: 100,
      checkinAdherence: 100,

      sessionsPurchased: 16,
      sessionsCompleted: 12,
      sessionsRemaining: 4,
      sessionsCancelled: 0,
      sessionsMissed: 0,

      planName: "VIP 1-on-1 + Programming",
      monthlyPrice: 520,
      billingCycle: "Monthly",
      paymentStatus: "paid",
      nextPaymentDate: "2026-10-18",
      amountPaidToDate: 2080,
      renewalsCount: 3,
      lifetimeRevenue: 2080,
      lastSessionDate: "2026-09-30",
      lastPaymentDate: "2026-09-18",
      lastActivityDate: "2026-10-01",

      customFields: {
        "Hip Thrust Current": "120 kg x 8 reps"
      },
      consentForMarketingPhotos: true
    }
  ],

  programs: [
    {
      id: "prog-sarah-1",
      clientId: "client-1",
      trainerId: "user-trainer-1",
      name: "Lean & Sculpt Phase 2",
      goal: "Fat Loss & Metabolic Conditioning",
      durationWeeks: 8,
      daysPerWeek: 4,
      startDate: "2026-09-01",
      endDate: "2026-10-26",
      status: "active",
      notes: "Focus on controlled eccentrics (3-1-0-1) and keeping rest times strictly to 60-75s.",
      days: [
        {
          id: "day-s1",
          dayNumber: 1,
          name: "Lower Body (Quad & Glute Focus)",
          focus: "Squat mechanics & single leg stability",
          exercises: [
            {
              id: "ex-s1-1",
              name: "Barbell Back Squat",
              videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8",
              sets: 4,
              reps: "8-10",
              targetWeightKg: 52.5,
              rpe: 8,
              restSeconds: 90,
              tempo: "3-0-1-0",
              notes: "Maintain brace through the hole. Drive knees out over toes.",
              alternative: "Goblet Squat with heavy dumbbell"
            },
            {
              id: "ex-s1-2",
              name: "Romanian Deadlift (Dumbbell)",
              videoUrl: "https://www.youtube.com/watch?v=JCXUYuzwNrM",
              sets: 3,
              reps: "10-12",
              targetWeightKg: 20,
              rpe: 8,
              restSeconds: 75,
              tempo: "3-1-1-0",
              notes: "Hinge at the hips until hamstring stretch, keep lats engaged.",
              alternative: "Barbell RDL"
            },
            {
              id: "ex-s1-3",
              name: "Bulgarian Split Squat",
              videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE",
              sets: 3,
              reps: "10 each leg",
              targetWeightKg: 14,
              rpe: 8.5,
              restSeconds: 60,
              tempo: "2-1-1-0",
              notes: "Slight forward torso lean for glute bias.",
              alternative: "Reverse Lunges"
            },
            {
              id: "ex-s1-4",
              name: "Seated Leg Curl Machine",
              videoUrl: "https://www.youtube.com/watch?v=ELOCsoDSmrg",
              sets: 3,
              reps: "12-15",
              targetWeightKg: 35,
              rpe: 9,
              restSeconds: 60,
              tempo: "2-0-1-1",
              notes: "Squeeze at bottom peak contraction.",
              alternative: "Swiss Ball Hamstring Curls"
            },
            {
              id: "ex-s1-5",
              name: "Hanging Knee Raises",
              videoUrl: "https://www.youtube.com/watch?v=RD_A-Z15Er4",
              sets: 3,
              reps: "12-15",
              targetWeightKg: 0,
              rpe: 8,
              restSeconds: 45,
              tempo: "2-0-1-0",
              notes: "Posterior pelvic tilt, avoid swinging.",
              alternative: "Captain's Chair Knee Raises"
            }
          ]
        },
        {
          id: "day-s2",
          dayNumber: 2,
          name: "Upper Body (Push & Pull)",
          focus: "Shoulder stability & vertical pulling",
          exercises: [
            {
              id: "ex-s2-1",
              name: "Lat Pulldown (Neutral Grip)",
              videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
              sets: 4,
              reps: "10",
              targetWeightKg: 42.5,
              rpe: 8,
              restSeconds: 75,
              tempo: "2-1-1-1",
              notes: "Pull elbow down towards hip pockets.",
              alternative: "Assisted Pull-ups"
            },
            {
              id: "ex-s2-2",
              name: "Dumbbell Incline Bench Press",
              videoUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
              sets: 3,
              reps: "10-12",
              targetWeightKg: 16,
              rpe: 8,
              restSeconds: 75,
              tempo: "3-0-1-0",
              notes: "30-degree incline, keep wrists stacked over elbows.",
              alternative: "Push-ups on handles"
            },
            {
              id: "ex-s2-3",
              name: "Chest Supported Dumbbell Row",
              videoUrl: "https://www.youtube.com/watch?v=H75im9fAUMc",
              sets: 3,
              reps: "12",
              targetWeightKg: 14,
              rpe: 8,
              restSeconds: 60,
              tempo: "2-0-1-1",
              notes: "Great for mid-back without spinal load.",
              alternative: "Cable Seated Row"
            },
            {
              id: "ex-s2-4",
              name: "Dumbbell Lateral Raise",
              videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo",
              sets: 4,
              reps: "15",
              targetWeightKg: 6,
              rpe: 9,
              restSeconds: 45,
              tempo: "2-0-1-0",
              notes: "Lead with elbows in the scapular plane.",
              alternative: "Cable Lateral Raise"
            }
          ]
        },
        {
          id: "day-s3",
          dayNumber: 3,
          name: "Posterior Chain & Glute Hypertrophy",
          focus: "Hip thrust and hinge strength",
          exercises: [
            {
              id: "ex-s3-1",
              name: "Barbell Hip Thrust",
              videoUrl: "https://www.youtube.com/watch?v=xDmFkJxPzeM",
              sets: 4,
              reps: "10-12",
              targetWeightKg: 85,
              rpe: 8.5,
              restSeconds: 90,
              tempo: "2-1-1-1",
              notes: "Tuck chin, full hip extension at the top.",
              alternative: "Machine Hip Thrust"
            },
            {
              id: "ex-s3-2",
              name: "Walking Lunges (Dumbbells)",
              videoUrl: "https://www.youtube.com/watch?v=L8fvypPrzzs",
              sets: 3,
              reps: "12 steps/leg",
              targetWeightKg: 12,
              rpe: 8.5,
              restSeconds: 60,
              tempo: "Controlled",
              notes: "Keep chest tall, push through front heel.",
              alternative: "Step-ups onto 20-inch box"
            },
            {
              id: "ex-s3-3",
              name: "Cable Glute Kickbacks",
              videoUrl: "https://www.youtube.com/watch?v=tF3F3WzFz6w",
              sets: 3,
              reps: "15 each",
              targetWeightKg: 10,
              rpe: 9,
              restSeconds: 45,
              tempo: "2-0-1-1",
              notes: "Focus on upper glute contraction.",
              alternative: "Band Glute Kickbacks"
            }
          ]
        },
        {
          id: "day-s4",
          dayNumber: 4,
          name: "Full Body Conditioning & Core",
          focus: "Metabolic conditioning & dynamic core",
          exercises: [
            {
              id: "ex-s4-1",
              name: "Kettlebell Swings",
              videoUrl: "https://www.youtube.com/watch?v=sSESeQAir2M",
              sets: 4,
              reps: "20",
              targetWeightKg: 20,
              rpe: 8.5,
              restSeconds: 60,
              tempo: "Explosive",
              notes: "Crisp hip snap, core braced.",
              alternative: "Dumbbell Snatch"
            },
            {
              id: "ex-s4-2",
              name: "Renegade Rows + Push-up",
              videoUrl: "https://www.youtube.com/watch?v=D_Zq3yE6l_8",
              sets: 3,
              reps: "8 pairs",
              targetWeightKg: 10,
              rpe: 8.5,
              restSeconds: 60,
              tempo: "Steady",
              notes: "Keep hips level, no swaying.",
              alternative: "Plank Shoulder Taps"
            }
          ]
        }
      ]
    },
    {
      id: "prog-marcus-1",
      clientId: "client-2",
      trainerId: "user-trainer-1",
      name: "Powerbuilding 4-Day Strength Block",
      goal: "Strength & Muscle Gain",
      durationWeeks: 10,
      daysPerWeek: 4,
      startDate: "2026-08-15",
      endDate: "2026-10-24",
      status: "active",
      notes: "Heavy compounds with progressive overload. Deload planned for week 6.",
      days: [
        {
          id: "day-m1",
          dayNumber: 1,
          name: "Heavy Bench & Upper Body",
          focus: "Horizontal push & vertical pull",
          exercises: [
            {
              id: "ex-m1-1",
              name: "Barbell Bench Press",
              videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
              sets: 5,
              reps: "5",
              targetWeightKg: 102.5,
              rpe: 8.5,
              restSeconds: 150,
              tempo: "2-1-X-0",
              notes: "Drive through feet, slight arch, touch sternum.",
              alternative: "Dumbbell Flat Bench Press"
            },
            {
              id: "ex-m1-2",
              name: "Weighted Pull-ups",
              videoUrl: "https://www.youtube.com/watch?v=3YvfRx31cLg",
              sets: 4,
              reps: "6",
              targetWeightKg: 15,
              rpe: 8.5,
              restSeconds: 120,
              tempo: "2-1-1-0",
              notes: "Full dead hang to chin over bar.",
              alternative: "Lat Pulldown Heavy"
            },
            {
              id: "ex-m1-3",
              name: "Incline Dumbbell Press",
              videoUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
              sets: 3,
              reps: "8-10",
              targetWeightKg: 34,
              rpe: 8.5,
              restSeconds: 90,
              tempo: "3-0-1-0",
              notes: "Upper chest focus.",
              alternative: "Incline Barbell Press"
            }
          ]
        },
        {
          id: "day-m2",
          dayNumber: 2,
          name: "Heavy Squat & Lower Body",
          focus: "Squat strength & hamstring hypertrophy",
          exercises: [
            {
              id: "ex-m2-1",
              name: "Competition Barbell Squat",
              videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8",
              sets: 5,
              reps: "5",
              targetWeightKg: 140,
              rpe: 8.5,
              restSeconds: 180,
              tempo: "2-1-X-0",
              notes: "Below parallel depth. Belt on sets 3-5.",
              alternative: "Safety Bar Squat"
            },
            {
              id: "ex-m2-2",
              name: "Barbell Romanian Deadlift",
              videoUrl: "https://www.youtube.com/watch?v=JCXUYuzwNrM",
              sets: 4,
              reps: "8",
              targetWeightKg: 110,
              rpe: 8,
              restSeconds: 120,
              tempo: "3-1-1-0",
              notes: "Soft knees, push hips back to wall.",
              alternative: "Deficit RDL"
            }
          ]
        }
      ]
    },
    {
      id: "prog-david-1",
      clientId: "client-3",
      trainerId: "user-trainer-1",
      name: "Executive Health & Functional Strength",
      goal: "General Fitness & Back Health",
      durationWeeks: 6,
      daysPerWeek: 2,
      startDate: "2026-09-01",
      endDate: "2026-10-15",
      status: "active",
      notes: "Gentle spinal loading, focus on posterior chain and breathing.",
      days: [
        {
          id: "day-d1",
          dayNumber: 1,
          name: "Functional Full Body A",
          focus: "Posture and movement quality",
          exercises: [
            {
              id: "ex-d1-1",
              name: "Goblet Squat to Box",
              videoUrl: "https://www.youtube.com/watch?v=MvmhYOCy1k4",
              sets: 3,
              reps: "10",
              targetWeightKg: 16,
              rpe: 7,
              restSeconds: 75,
              tempo: "3-1-1-0",
              notes: "Sit gently to 18-inch box without relaxing spine.",
              alternative: "Bodyweight Squat to Bench"
            },
            {
              id: "ex-d1-2",
              name: "Standing Cable Row",
              videoUrl: "https://www.youtube.com/watch?v=xQNrFHEMhI4",
              sets: 3,
              reps: "12",
              targetWeightKg: 25,
              rpe: 7,
              restSeconds: 60,
              tempo: "2-0-1-1",
              notes: "Squeeze scapulae, keep neck relaxed.",
              alternative: "Resistance Band Rows"
            }
          ]
        }
      ]
    }
  ],

  workoutLogs: [
    {
      id: "log-1",
      clientId: "client-1",
      workoutId: "day-s1",
      workoutName: "Lower Body (Quad & Glute Focus)",
      date: "2026-09-29",
      completed: true,
      durationMinutes: 52,
      totalVolumeKg: 4620,
      rpeOverall: 8,
      notes: "Felt strong today! Hit 52.5kg on squats with great depth.",
      exercisesCompleted: [
        {
          exerciseName: "Barbell Back Squat",
          sets: [
            { setNum: 1, reps: 10, weightKg: 50, rpe: 7.5, completed: true },
            { setNum: 2, reps: 9, weightKg: 52.5, rpe: 8, completed: true },
            { setNum: 3, reps: 8, weightKg: 52.5, rpe: 8.5, completed: true },
            { setNum: 4, reps: 8, weightKg: 52.5, rpe: 8.5, completed: true }
          ]
        },
        {
          exerciseName: "Romanian Deadlift (Dumbbell)",
          sets: [
            { setNum: 1, reps: 12, weightKg: 20, rpe: 8, completed: true },
            { setNum: 2, reps: 12, weightKg: 20, rpe: 8, completed: true },
            { setNum: 3, reps: 10, weightKg: 22, rpe: 8.5, completed: true }
          ]
        },
        {
          exerciseName: "Bulgarian Split Squat",
          sets: [
            { setNum: 1, reps: 10, weightKg: 14, rpe: 8, completed: true },
            { setNum: 2, reps: 10, weightKg: 14, rpe: 8.5, completed: true },
            { setNum: 3, reps: 10, weightKg: 14, rpe: 9, completed: true }
          ]
        }
      ]
    },
    {
      id: "log-2",
      clientId: "client-2",
      workoutId: "day-m1",
      workoutName: "Heavy Bench & Upper Body",
      date: "2026-09-30",
      completed: true,
      durationMinutes: 65,
      totalVolumeKg: 6850,
      rpeOverall: 8.5,
      notes: "Bench felt explosive. Paused rep on last set.",
      exercisesCompleted: [
        {
          exerciseName: "Barbell Bench Press",
          sets: [
            { setNum: 1, reps: 5, weightKg: 100, rpe: 8, completed: true },
            { setNum: 2, reps: 5, weightKg: 102.5, rpe: 8.5, completed: true },
            { setNum: 3, reps: 5, weightKg: 102.5, rpe: 8.5, completed: true },
            { setNum: 4, reps: 5, weightKg: 105, rpe: 9, completed: true },
            { setNum: 5, reps: 4, weightKg: 105, rpe: 9.5, completed: true }
          ]
        }
      ]
    }
  ],

  nutritionLogs: [
    {
      id: "nutr-1",
      clientId: "client-1",
      date: "2026-10-01",
      totalCalories: 1720,
      targetCalories: 1750,
      proteinG: 138,
      targetProteinG: 135,
      carbsG: 165,
      targetCarbsG: 170,
      fatsG: 49,
      targetFatsG: 50,
      waterMl: 2600,
      targetWaterMl: 2800,
      notes: "Felt very energetic all afternoon. Water intake on track.",
      meals: {
        breakfast: [
          { name: "Egg whites scrambled with spinach & feta", calories: 280, protein: 32, carbs: 6, fats: 14 },
          { name: "Sourdough toast (1 slice) + 1/4 avocado", calories: 190, protein: 5, carbs: 24, fats: 8 }
        ],
        lunch: [
          { name: "Grilled chicken breast quinoa bowl with roasted veggies", calories: 510, protein: 46, carbs: 54, fats: 12 }
        ],
        dinner: [
          { name: "Baked salmon fillet with steamed broccoli and sweet potato", calories: 540, protein: 44, carbs: 46, fats: 15 }
        ],
        snacks: [
          { name: "Non-fat Greek Yogurt with blueberries & scoop whey", calories: 200, protein: 26, carbs: 20, fats: 0 }
        ]
      }
    },
    {
      id: "nutr-2",
      clientId: "client-1",
      date: "2026-09-30",
      totalCalories: 1765,
      targetCalories: 1750,
      proteinG: 140,
      targetProteinG: 135,
      carbsG: 168,
      targetCarbsG: 170,
      fatsG: 51,
      targetFatsG: 50,
      waterMl: 2900,
      targetWaterMl: 2800,
      notes: "Hit water goal and macros perfectly.",
      meals: {
        breakfast: [{ name: "Protein Oats with chia seeds and banana", calories: 420, protein: 35, carbs: 55, fats: 7 }],
        lunch: [{ name: "Turkey breast wrap with side salad", calories: 480, protein: 42, carbs: 45, fats: 14 }],
        dinner: [{ name: "Lean beef stir-fry with jasmine rice", calories: 610, protein: 45, carbs: 60, fats: 18 }],
        snacks: [{ name: "Rice cakes with almond butter", calories: 255, protein: 6, carbs: 25, fats: 12 }]
      }
    }
  ],

  sessions: [
    {
      id: "sess-1",
      trainerId: "user-trainer-1",
      clientId: "client-1",
      clientName: "Sarah Chen",
      date: "2026-10-02",
      time: "08:00 AM",
      durationMinutes: 60,
      location: "Apex Fitness Studio (Bay 2)",
      sessionType: "1-on-1 In-Person",
      status: "scheduled", // scheduled, completed, cancelled, no-show, rescheduled
      notes: "Assess depth on back squats and review hip hinge form."
    },
    {
      id: "sess-2",
      trainerId: "user-trainer-1",
      clientId: "client-2",
      clientName: "Marcus Vance",
      date: "2026-10-02",
      time: "10:30 AM",
      durationMinutes: 60,
      location: "Metro Barbell Gym",
      sessionType: "Strength Technique",
      status: "scheduled",
      notes: "Heavy deadlift pull mechanics & bar path video check."
    },
    {
      id: "sess-3",
      trainerId: "user-trainer-1",
      clientId: "client-4",
      clientName: "Elena Rostova",
      date: "2026-10-03",
      time: "09:00 AM",
      durationMinutes: 45,
      location: "Zoom Video Call",
      sessionType: "Virtual Onboarding & Movement Assessment",
      status: "scheduled",
      notes: "Review questionnaire and guide initial mobility routine."
    },
    {
      id: "sess-4",
      trainerId: "user-trainer-1",
      clientId: "client-3",
      clientName: "David Miller",
      date: "2026-09-26",
      time: "07:30 AM",
      durationMinutes: 60,
      location: "Executive Condo Gym",
      sessionType: "1-on-1 In-Person",
      status: "no-show", // No show
      notes: "Client did not attend or notify coach. Followed up via WhatsApp."
    },
    {
      id: "sess-5",
      trainerId: "user-trainer-1",
      clientId: "client-1",
      clientName: "Sarah Chen",
      date: "2026-09-30",
      time: "08:00 AM",
      durationMinutes: 60,
      location: "Apex Fitness Studio",
      sessionType: "1-on-1 In-Person",
      status: "completed",
      notes: "Awesome session. Sarah crushed her Romanian deadlifts."
    }
  ],

  payments: [
    {
      id: "pay-1",
      clientId: "client-1",
      clientName: "Sarah Chen",
      planName: "Performance Hybrid Coaching",
      amount: 380,
      billingCycle: "Monthly",
      dueDate: "2026-09-15",
      paidDate: "2026-09-15",
      status: "paid",
      paymentMethod: "Credit Card (Stripe)",
      referenceId: "TXN_SCHEN_99214",
      notes: "Auto-renew processed successfully."
    },
    {
      id: "pay-2",
      clientId: "client-2",
      clientName: "Marcus Vance",
      planName: "Strength Athlete Mentorship",
      amount: 450,
      billingCycle: "Monthly",
      dueDate: "2026-09-20",
      paidDate: "2026-09-20",
      status: "paid",
      paymentMethod: "Credit Card",
      referenceId: "TXN_MVANCE_88410",
      notes: "Monthly subscription."
    },
    {
      id: "pay-3",
      clientId: "client-3",
      clientName: "David Miller",
      planName: "Executive In-Person Package",
      amount: 350,
      billingCycle: "Monthly",
      dueDate: "2026-09-26",
      paidDate: null,
      status: "overdue", // OVERDUE
      paymentMethod: "Bank Transfer",
      referenceId: "INV_DMILLER_202609",
      notes: "Payment reminder sent on Sept 28. Client promised to settle by week end."
    },
    {
      id: "pay-4",
      clientId: "client-4",
      clientName: "Elena Rostova",
      planName: "Runner's Strength Foundations",
      amount: 280,
      billingCycle: "Monthly",
      dueDate: "2026-09-24",
      paidDate: "2026-09-24",
      status: "paid",
      paymentMethod: "Apple Pay",
      referenceId: "TXN_EROSTOVA_11029",
      notes: "Initial month payment & onboarding deposit."
    },
    {
      id: "pay-5",
      clientId: "client-5",
      clientName: "Jordan Taylor",
      planName: "Rehab & Strength Track",
      amount: 320,
      billingCycle: "Monthly",
      dueDate: "2026-10-05",
      paidDate: null,
      status: "due",
      paymentMethod: "Credit Card",
      referenceId: "INV_JTAYLOR_202610",
      notes: "Due in 4 days."
    },
    {
      id: "pay-6",
      clientId: "client-6",
      clientName: "Rachel Adams",
      planName: "VIP 1-on-1 + Programming",
      amount: 520,
      billingCycle: "Monthly",
      dueDate: "2026-09-18",
      paidDate: "2026-09-18",
      status: "paid",
      paymentMethod: "Credit Card",
      referenceId: "TXN_RADAMS_47812",
      notes: "Auto-renew complete."
    }
  ],

  measurements: [
    {
      id: "meas-1",
      clientId: "client-1",
      date: "2026-04-15",
      weightKg: 71.5,
      bodyFatPercent: 28.5,
      chestCm: 94,
      waistCm: 81,
      hipsCm: 104,
      armsCm: 29.5,
      thighsCm: 61,
      customFields: { "Resting Heart Rate": 74 }
    },
    {
      id: "meas-2",
      clientId: "client-1",
      date: "2026-06-15",
      weightKg: 68.2,
      bodyFatPercent: 26.0,
      chestCm: 92,
      waistCm: 76,
      hipsCm: 100,
      armsCm: 29.0,
      thighsCm: 59,
      customFields: { "Resting Heart Rate": 68 }
    },
    {
      id: "meas-3",
      clientId: "client-1",
      date: "2026-08-15",
      weightKg: 65.5,
      bodyFatPercent: 23.8,
      chestCm: 90,
      waistCm: 72,
      hipsCm: 97,
      armsCm: 28.5,
      thighsCm: 57,
      customFields: { "Resting Heart Rate": 64 }
    },
    {
      id: "meas-4",
      clientId: "client-1",
      date: "2026-09-28",
      weightKg: 64.2,
      bodyFatPercent: 22.4,
      chestCm: 89,
      waistCm: 70,
      hipsCm: 95.5,
      armsCm: 28.5,
      thighsCm: 56.5,
      customFields: { "Resting Heart Rate": 61 }
    },
    {
      id: "meas-5",
      clientId: "client-2",
      date: "2026-03-01",
      weightKg: 80.2,
      bodyFatPercent: 15.2,
      chestCm: 106,
      waistCm: 84,
      hipsCm: 101,
      armsCm: 37,
      thighsCm: 60,
      customFields: { "Resting Heart Rate": 60 }
    },
    {
      id: "meas-6",
      clientId: "client-2",
      date: "2026-09-25",
      weightKg: 85.0,
      bodyFatPercent: 14.8,
      chestCm: 112,
      waistCm: 85,
      hipsCm: 103,
      armsCm: 40.5,
      thighsCm: 64,
      customFields: { "Resting Heart Rate": 56 }
    }
  ],

  performanceMetrics: [
    {
      id: "perf-1",
      clientId: "client-1",
      exerciseName: "Barbell Back Squat",
      date: "2026-04-20",
      value: 35,
      unit: "kg",
      reps: 8,
      estimated1RM: 43
    },
    {
      id: "perf-2",
      clientId: "client-1",
      exerciseName: "Barbell Back Squat",
      date: "2026-07-10",
      value: 45,
      unit: "kg",
      reps: 8,
      estimated1RM: 55
    },
    {
      id: "perf-3",
      clientId: "client-1",
      exerciseName: "Barbell Back Squat",
      date: "2026-09-29",
      value: 52.5,
      unit: "kg",
      reps: 8,
      estimated1RM: 64.5
    },
    {
      id: "perf-4",
      clientId: "client-1",
      exerciseName: "Barbell Hip Thrust",
      date: "2026-05-01",
      value: 50,
      unit: "kg",
      reps: 10,
      estimated1RM: 66
    },
    {
      id: "perf-5",
      clientId: "client-1",
      exerciseName: "Barbell Hip Thrust",
      date: "2026-09-25",
      value: 85,
      unit: "kg",
      reps: 10,
      estimated1RM: 113
    },
    {
      id: "perf-6",
      clientId: "client-2",
      exerciseName: "Barbell Bench Press",
      date: "2026-03-10",
      value: 90,
      unit: "kg",
      reps: 5,
      estimated1RM: 101
    },
    {
      id: "perf-7",
      clientId: "client-2",
      exerciseName: "Barbell Bench Press",
      date: "2026-09-30",
      value: 105,
      unit: "kg",
      reps: 5,
      estimated1RM: 118
    },
    {
      id: "perf-8",
      clientId: "client-2",
      exerciseName: "Competition Barbell Squat",
      date: "2026-03-15",
      value: 120,
      unit: "kg",
      reps: 5,
      estimated1RM: 135
    },
    {
      id: "perf-9",
      clientId: "client-2",
      exerciseName: "Competition Barbell Squat",
      date: "2026-09-28",
      value: 140,
      unit: "kg",
      reps: 5,
      estimated1RM: 157.5
    }
  ],

  progressPhotos: [
    {
      id: "photo-1",
      clientId: "client-1",
      date: "2026-04-15",
      category: "front",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
      notes: "Starting condition (Day 1). Weight: 71.5 kg.",
      marketingConsent: true
    },
    {
      id: "photo-2",
      clientId: "client-1",
      date: "2026-07-15",
      category: "front",
      imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
      notes: "3-Month check: Visible reduction in waistline. Weight: 67.0 kg.",
      marketingConsent: true
    },
    {
      id: "photo-3",
      clientId: "client-1",
      date: "2026-09-28",
      category: "front",
      imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
      notes: "Current condition. Weight: 64.2 kg. Noticeable muscle tone and core definition!",
      marketingConsent: true
    },
    {
      id: "photo-4",
      clientId: "client-1",
      date: "2026-04-15",
      category: "side",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
      notes: "Side profile baseline.",
      marketingConsent: true
    },
    {
      id: "photo-5",
      clientId: "client-1",
      date: "2026-09-28",
      category: "side",
      imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
      notes: "Side profile current. Glute elevation and posture improvement.",
      marketingConsent: true
    }
  ],

  notes: [
    {
      id: "note-1",
      clientId: "client-1",
      trainerId: "user-trainer-1",
      title: "Movement Screen & Hamstring Mobility",
      content: "Sarah presented slight hamstring tightess on right side due to prolonged desk sitting. Introduced active 90/90 hip mobilization and couch stretch prior to compound lifts. Doing great!",
      isPrivateToTrainer: false, // shared with client
      createdAt: "2026-04-18T10:00:00Z",
      updatedAt: "2026-04-18T10:00:00Z"
    },
    {
      id: "note-2",
      clientId: "client-1",
      trainerId: "user-trainer-1",
      title: "Squat Depth & Footwear Recommendation",
      content: "Recommend getting Olympic weightlifting shoes or placing 2.5lb plates under heels if ankle dorsiflexion limits depth on heavy days.",
      isPrivateToTrainer: false,
      createdAt: "2026-09-20T11:30:00Z",
      updatedAt: "2026-09-20T11:30:00Z"
    },
    {
      id: "note-3",
      clientId: "client-1",
      trainerId: "user-trainer-1",
      title: "CONFIDENTIAL: Client Retention & Goal Evolution",
      content: "Sarah mentioned in private conversation that her motivation is at an all-time high. Wants to sign up for another 6-month block when current 12-session package expires. Plan to introduce barbell snatches or power cleans next cycle.",
      isPrivateToTrainer: true, // TRAINER PRIVATE
      createdAt: "2026-09-29T14:15:00Z",
      updatedAt: "2026-09-29T14:15:00Z"
    },
    {
      id: "note-4",
      clientId: "client-3",
      trainerId: "user-trainer-1",
      title: "URGENT: Intervention Needed for Inactivity",
      content: "David has missed 2 consecutive sessions and has not responded to messages since Friday. Payment is 5 days overdue. If no response by tomorrow, call direct phone number and propose shifting to 30-min express sessions to fit his workload.",
      isPrivateToTrainer: true, // TRAINER PRIVATE
      createdAt: "2026-09-30T09:00:00Z",
      updatedAt: "2026-09-30T09:00:00Z"
    }
  ],

  messages: [
    {
      id: "msg-1",
      senderId: "user-trainer-1",
      senderRole: "trainer",
      recipientId: "client-1",
      clientId: "client-1",
      text: "Hey Sarah! Outstanding work on your back squats yesterday! 52.5kg moved so smoothly. How are your legs feeling today?",
      category: "workout",
      isRead: true,
      timestamp: "2026-09-30T10:00:00Z"
    },
    {
      id: "msg-2",
      senderId: "user-client-1",
      senderRole: "client",
      recipientId: "user-trainer-1",
      clientId: "client-1",
      text: "Thanks Coach Alex! Quads are definitely feeling it today, but good soreness! Did my 10 minute mobility flow this morning and water is already at 2 liters.",
      category: "workout",
      isRead: true,
      timestamp: "2026-09-30T11:15:00Z"
    },
    {
      id: "msg-3",
      senderId: "user-trainer-1",
      senderRole: "trainer",
      recipientId: "client-1",
      clientId: "client-1",
      text: "Love that dedication! Don't forget to submit your weekly check-in form tomorrow so we can calibrate macros for the weekend.",
      category: "nutrition",
      isRead: true,
      timestamp: "2026-09-30T14:20:00Z"
    },
    {
      id: "msg-4",
      senderId: "user-client-1",
      senderRole: "client",
      recipientId: "user-trainer-1",
      clientId: "client-1",
      text: "Will do! See you Friday 8:00 AM at Apex Studio!",
      category: "general",
      isRead: true,
      timestamp: "2026-09-30T15:00:00Z"
    },
    {
      id: "msg-5",
      senderId: "user-trainer-1",
      senderRole: "trainer",
      recipientId: "client-3",
      clientId: "client-3",
      text: "Hi David, we missed you at our session on Friday morning. Hope everything is alright! Let me know when you can reschedule or if work has been crazy.",
      category: "general",
      isRead: false,
      timestamp: "2026-09-26T08:30:00Z"
    }
  ],

  checkins: [
    {
      id: "chk-1",
      clientId: "client-1",
      clientName: "Sarah Chen",
      date: "2026-09-28",
      status: "reviewed", // pending, reviewed
      responses: {
        energyRating: 8,
        sleepHours: 7.5,
        sleepQuality: 8,
        workoutConsistency: 9,
        nutritionConsistency: 9,
        waterCompliance: 9,
        painOrDiscomfort: "Mild right calf tightness, resolving with foam roller.",
        winsThisWeek: "Hit all 4 workouts on time and prepared my lunches for the entire week!",
        biggestObstacle: "Work happy hour on Thursday, but stuck to club soda and grilled shrimp skewers.",
        nextWeekGoal: "Increase back squat target to 55kg."
      },
      trainerFeedback: "Incredible discipline navigating the happy hour! Let's definitely test 55kg on Tuesday after a thorough warmup. Keep this momentum rolling!",
      reviewedAt: "2026-09-28T18:00:00Z"
    },
    {
      id: "chk-2",
      clientId: "client-2",
      clientName: "Marcus Vance",
      date: "2026-09-29",
      status: "reviewed",
      responses: {
        energyRating: 9,
        sleepHours: 8.0,
        sleepQuality: 9,
        workoutConsistency: 10,
        nutritionConsistency: 9,
        waterCompliance: 10,
        painOrDiscomfort: "None, shoulder feels 100%.",
        winsThisWeek: "Paused bench press at 105kg felt lighter than expected.",
        biggestObstacle: "Consuming enough carbs on non-training days.",
        nextWeekGoal: "Deadlift 180kg x 3 reps."
      },
      trainerFeedback: "Technique videos look pristine Marcus. Let's aim for 180kg on Friday!",
      reviewedAt: "2026-09-29T20:30:00Z"
    }
  ],

  notifications: [
    {
      id: "notif-1",
      userId: "user-trainer-1",
      role: "trainer",
      title: "Payment Overdue Alert",
      message: "David Miller's monthly package payment of $350 is 5 days overdue.",
      type: "payment",
      isRead: false,
      timestamp: "2026-10-01T08:00:00Z",
      link: "/clients/client-3?tab=payments"
    },
    {
      id: "notif-2",
      userId: "user-trainer-1",
      role: "trainer",
      title: "Client Inactivity Warning",
      message: "David Miller has had no logged activity (workouts or nutrition) for 5 days.",
      type: "inactivity",
      isRead: false,
      timestamp: "2026-10-01T08:00:00Z",
      link: "/clients/client-3"
    },
    {
      id: "notif-3",
      userId: "user-trainer-1",
      role: "trainer",
      title: "New Check-in Submitted",
      message: "Sarah Chen submitted her weekly progress check-in.",
      type: "checkin",
      isRead: true,
      timestamp: "2026-09-28T16:00:00Z",
      link: "/clients/client-1?tab=checkins"
    },
    {
      id: "notif-4",
      userId: "user-client-1",
      role: "client",
      title: "Upcoming Session Tomorrow",
      message: "You have a 1-on-1 session with Coach Alex tomorrow at 8:00 AM at Apex Studio.",
      type: "session",
      isRead: false,
      timestamp: "2026-10-01T14:00:00Z",
      link: "/schedule"
    }
  ],

  templates: [
    {
      id: "tpl-1",
      type: "program",
      name: "12-Week Hypertrophy & Body Recomposition",
      goal: "Muscle Gain & Fat Loss",
      daysPerWeek: 4,
      durationWeeks: 12,
      description: "Proven upper/lower split prioritizing compound lifts and targeted isolation volume."
    },
    {
      id: "tpl-2",
      type: "program",
      name: "Fat Loss & Metabolic Conditioning",
      goal: "Fat Loss & Conditioning",
      daysPerWeek: 4,
      durationWeeks: 8,
      description: "High density circuits combined with foundational strength preservation."
    },
    {
      id: "tpl-3",
      type: "program",
      name: "Strength Foundations 5x5",
      goal: "Strength",
      daysPerWeek: 3,
      durationWeeks: 8,
      description: "Linear progression for squat, bench press, deadlift, overhead press, and barbell rows."
    },
    {
      id: "tpl-4",
      type: "checkin",
      name: "Weekly Comprehensive Client Check-in",
      questions: [
        "How was your energy this week? (1-10)",
        "How was your sleep quality and average hours?",
        "How consistent were you with your assigned workouts?",
        "How consistent was your nutrition & water targets?",
        "Any joint pain or muscular discomfort?",
        "What was your biggest win this week?",
        "What was the most difficult challenge?",
        "What is your #1 focus for next week?"
      ]
    }
  ],

  timelineEvents: [
    {
      id: "tl-1",
      clientId: "client-1",
      eventType: "program_assigned",
      title: "Program Assigned",
      description: "Coach Alex assigned 'Lean & Sculpt Phase 2' (8-week program).",
      timestamp: "2026-09-01T09:00:00Z"
    },
    {
      id: "tl-2",
      clientId: "client-1",
      eventType: "measurement_updated",
      title: "Measurements Updated",
      description: "Weight recorded at 65.5 kg (-6.0 kg since start). Waist at 72 cm.",
      timestamp: "2026-08-15T10:00:00Z"
    },
    {
      id: "tl-3",
      clientId: "client-1",
      eventType: "payment_received",
      title: "Payment Received",
      description: "Received $380 for monthly subscription renewal (Ref: TXN_SCHEN_99214).",
      timestamp: "2026-09-15T08:00:00Z"
    },
    {
      id: "tl-4",
      clientId: "client-1",
      eventType: "workout_completed",
      title: "Workout Completed",
      description: "Completed Lower Body (Quad & Glute Focus) in 52 mins. Hit 52.5kg squat PR!",
      timestamp: "2026-09-29T10:30:00Z"
    },
    {
      id: "tl-5",
      clientId: "client-1",
      eventType: "session_completed",
      title: "Session Completed",
      description: "1-on-1 session at Apex Studio completed. 10 of 12 sessions used.",
      timestamp: "2026-09-30T09:00:00Z"
    }
  ]
};
