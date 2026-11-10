// thepushfittness - Starter Client Roster for Coach Pushkar Mayekar
// Preserves verified active client Anindita Chatterjee

export function getSampleRosterData() {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  return {
    lastUpdatedAt: Date.now(),
    users: [
      {
        id: "user-trainer-1",
        email: "admin@thepushfittness.com",
        name: "Coach Pushkar Mayekar",
        role: "trainer",
        password: "admin123",
        phone: "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        createdAt: "2026-10-02T11:07:59.360Z"
      },
      {
        id: "user-client-1",
        email: "anindita.chatterjee@gmail.com",
        name: "Anindita Chatterjee",
        role: "client",
        clientId: "client-1",
        password: "client123",
        phone: "+91 98201 54321",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
        createdAt: "2026-10-15T09:00:00.000Z"
      }
    ],

    clients: [
      {
        id: "client-1",
        userId: "user-client-1",
        name: "Anindita Chatterjee",
        email: "anindita.chatterjee@gmail.com",
        password: "client123",
        phone: "+91 98201 54321",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
        dateOfBirth: "1995-04-12",
        gender: "Female",
        occupation: "Product Manager",
        emergencyContact: "Rohit Chatterjee (Spouse) - +91 98201 99999",
        startDate: "2026-10-15",
        status: "active",
        trainingMode: "offline",
        trainingType: "Offline Studio Coaching",
        trainingDays: ["Monday", "Wednesday", "Friday"],
        sessionTime: "10:00 AM",
        trainingFrequency: "3x per week",
        currentGoal: "Fat Loss & Core Strength",
        goalsList: ["Fat loss", "Core stability", "Tone arms & back"],
        acquisitionSource: "Instagram",
        heightCm: 162,
        weightKg: 58.5,
        startingWeightKg: 62.0,
        targetWeightKg: 55.0,
        profileCompleted: true,
        trainingExperience: "Beginner",
        fitnessLevel: "Beginner",
        injuries: "None",
        restrictions: "None",
        equipmentAvailability: "The Push Fitness Studio",
        lifestyleLevel: "Moderate (Desk job)",
        dietaryPreference: "Non-Vegetarian",
        allergies: "None",
        foodsAvoided: "Fried snacks",
        dailyCalorieTarget: 1750,
        proteinTargetG: 120,
        carbsTargetG: 175,
        fatsTargetG: 50,
        waterTargetMl: 2800,
        nutritionNotes: "Focus on hitting 120g protein daily with paneer, eggs, and whey.",
        adherenceScore: 94,
        adherenceStatus: "Excellent",
        workoutAdherence: 95,
        nutritionAdherence: 92,
        sessionAttendance: 100,
        checkinAdherence: 95,
        sessionsPurchased: 12,
        sessionsCompleted: 4,
        sessionsRemaining: 8,
        sessionsCancelled: 0,
        sessionsMissed: 0,
        planName: "Personal Coaching Package (12 Sessions)",
        monthlyPrice: 18000,
        billingCycle: "Monthly",
        paymentStatus: "paid",
        nextPaymentDate: "2026-11-15",
        amountPaidToDate: 18000,
        renewalsCount: 1,
        lifetimeRevenue: 18000,
        lastSessionDate: "2026-11-03",
        lastPaymentDate: "2026-10-15",
        lastActivityDate: "2026-11-06",
        onboardingStep: 4,
        customFields: {},
        consentForMarketingPhotos: true
      }
    ],

    programs: [
      {
        id: "prog-1",
        clientId: "client-1",
        clientName: "Anindita Chatterjee",
        name: "Full Body Recomposition & Core Strength",
        goal: "Fat Loss & Core Strength",
        status: "active",
        assignedDate: "2026-10-15",
        durationWeeks: 8,
        daysPerWeek: 3,
        notes: "Prioritize strict tempo and full range of motion. Rest 60-90s between sets.",
        days: [
          {
            dayNumber: 1,
            name: "Day 1: Lower Body & Core Focus",
            focus: "Squat mechanics, posterior chain & core",
            exercises: [
              {
                id: "d1-ex1",
                name: "Goblet Squat (Dumbbell/Kettlebell)",
                sets: 3,
                reps: "12",
                targetWeights: [16, 18, 20],
                restSeconds: 90,
                tempo: "3-0-1-0",
                notes: "Elbows inside knees, chest proud, full depth"
              },
              {
                id: "d1-ex2",
                name: "Romanian Deadlift (Dumbbells)",
                sets: 3,
                reps: "10-12",
                targetWeights: [14, 16, 16],
                restSeconds: 90,
                tempo: "3-1-1-0",
                notes: "Hinge at the hips, soft knee bend, feel hamstring stretch"
              },
              {
                id: "d1-ex3",
                name: "Bulgarian Split Squats",
                sets: 3,
                reps: "10/leg",
                targetWeights: [8, 10, 10],
                restSeconds: 60,
                tempo: "2-0-1-0",
                notes: "Control descent, front foot flat on floor"
              },
              {
                id: "d1-ex4",
                name: "Plank with Shoulder Taps",
                sets: 3,
                reps: "16 taps",
                targetWeights: [0, 0, 0],
                restSeconds: 45,
                tempo: "Controlled",
                notes: "No hip sway, squeeze glutes and brace abs"
              }
            ],
            conditioning: {
              format: "10-Min Steady State Cardio",
              title: "Treadmill Incline Walk",
              duration: "10 mins",
              description: "Incline 8.0, Speed 5.2 km/h. Keep hands off rails.",
              notes: "Heart rate in Zone 2"
            }
          },
          {
            dayNumber: 2,
            name: "Day 2: Upper Body Pull & Push Hypertrophy",
            focus: "Back posture, shoulders & arms tone",
            exercises: [
              {
                id: "d2-ex1",
                name: "Neutral Grip Lat Pulldown",
                sets: 3,
                reps: "12",
                targetWeights: [35, 40, 40],
                restSeconds: 75,
                tempo: "2-1-1-1",
                notes: "1-second squeeze at chest, controlled 2-second negative"
              },
              {
                id: "d2-ex2",
                name: "Incline Dumbbell Bench Press",
                sets: 3,
                reps: "10-12",
                targetWeights: [10, 12, 12],
                restSeconds: 75,
                tempo: "2-0-1-0",
                notes: "30-degree bench angle, tuck elbows at 45 degrees"
              },
              {
                id: "d2-ex3",
                name: "Chest-Supported Dumbbell Rows",
                sets: 3,
                reps: "12",
                targetWeights: [10, 12, 12],
                restSeconds: 60,
                tempo: "2-1-1-0",
                notes: "Squeeze shoulder blades together at top"
              },
              {
                id: "d2-ex4",
                name: "Dumbbell Lateral Raises",
                sets: 3,
                reps: "15",
                targetWeights: [4, 5, 5],
                restSeconds: 45,
                tempo: "2-0-1-0",
                notes: "Slight forward lean, raise with elbows"
              }
            ],
            conditioning: {
              format: "Finisher Circuit",
              title: "Rowing Machine Sprint Intervals",
              duration: "8 mins",
              description: "30s sprint @ >28 SPM / 30s slow recovery paddle x 8 rounds",
              notes: "Push for max distance each sprint"
            }
          },
          {
            dayNumber: 3,
            name: "Day 3: Full Body Conditioning & Density",
            focus: "High calorie expenditure, functional stability & core",
            exercises: [
              {
                id: "d3-ex1",
                name: "Kettlebell Deadlift to High Pull",
                sets: 3,
                reps: "12",
                targetWeights: [16, 20, 20],
                restSeconds: 60,
                tempo: "Explosive",
                notes: "Drive through heels, snap hips"
              },
              {
                id: "d3-ex2",
                name: "Dumbbell Step-Ups",
                sets: 3,
                reps: "10/leg",
                targetWeights: [8, 10, 10],
                restSeconds: 60,
                tempo: "Controlled",
                notes: "Drive through lead heel, minimal push from back foot"
              },
              {
                id: "d3-ex3",
                name: "Cable Face Pulls",
                sets: 3,
                reps: "15",
                targetWeights: [15, 17.5, 17.5],
                restSeconds: 45,
                tempo: "2-1-1-1",
                notes: "Pull to eye level, external rotation at end range"
              },
              {
                id: "d3-ex4",
                name: "Hanging Knee Raises / Captain's Chair",
                sets: 3,
                reps: "12",
                targetWeights: [0, 0, 0],
                restSeconds: 45,
                tempo: "Controlled",
                notes: "Roll pelvis upward, avoid swinging"
              }
            ],
            conditioning: {
              format: "10-Min AMRAP",
              title: "Engine Burnout AMRAP",
              duration: "10 mins",
              description: "10 Calorie Bike + 12 Kettlebell Swings (16kg) + 8 Slam Balls (7kg)",
              notes: "Keep steady aerobic pace throughout"
            }
          }
        ]
      }
    ],

    sessions: [
      {
        id: "sess-1",
        clientId: "client-1",
        clientName: "Anindita Chatterjee",
        date: "2026-11-03",
        time: "10:00 AM",
        duration: 60,
        location: "The Push Fitness Studio",
        type: "1-on-1 In-Person",
        status: "completed",
        notes: "Excellent execution on Goblet Squats (20kg PR) and Incline Walk.",
        workoutDone: {
          programId: "prog-1",
          programName: "Full Body Recomposition & Core Strength",
          dayNumber: 1,
          dayName: "Day 1: Lower Body & Core Focus",
          focus: "Squat mechanics, posterior chain & core",
          completedAt: "2026-11-03T11:05:00.000Z",
          rpe: 8,
          totalVolumeKg: 4250,
          sessionNotes: "Anindita hit a new personal best on Goblet Squats with 20kg dumbbell! Great mobility, knees tracked perfectly over toes.",
          exercises: [
            {
              id: "d1-ex1",
              name: "Goblet Squat (Dumbbell/Kettlebell)",
              prescribedText: "3 sets × 12 reps @ 20 kg",
              notes: "Elbows inside knees, clean depth on all 3 sets",
              sets: [
                { setNum: 1, weightKg: 16, reps: 12, completed: true },
                { setNum: 2, weightKg: 18, reps: 12, completed: true },
                { setNum: 3, weightKg: 20, reps: 12, completed: true }
              ]
            },
            {
              id: "d1-ex2",
              name: "Romanian Deadlift (Dumbbells)",
              prescribedText: "3 sets × 10-12 reps @ 16 kg",
              notes: "Hips hinged back properly, soft knees",
              sets: [
                { setNum: 1, weightKg: 14, reps: 12, completed: true },
                { setNum: 2, weightKg: 16, reps: 12, completed: true },
                { setNum: 3, weightKg: 16, reps: 10, completed: true }
              ]
            },
            {
              id: "d1-ex3",
              name: "Bulgarian Split Squats",
              prescribedText: "3 sets × 10/leg @ 10 kg",
              notes: "Good balance maintained",
              sets: [
                { setNum: 1, weightKg: 8, reps: 10, completed: true },
                { setNum: 2, weightKg: 10, reps: 10, completed: true },
                { setNum: 3, weightKg: 10, reps: 10, completed: true }
              ]
            },
            {
              id: "d1-ex4",
              name: "Plank with Shoulder Taps",
              prescribedText: "3 sets × 16 taps",
              notes: "Hips locked and stable",
              sets: [
                { setNum: 1, weightKg: 0, reps: 16, completed: true },
                { setNum: 2, weightKg: 0, reps: 16, completed: true },
                { setNum: 3, weightKg: 0, reps: 16, completed: true }
              ]
            }
          ],
          finisher: {
            title: "Treadmill Incline Walk",
            duration: "10 mins",
            description: "Incline 8.0, Speed 5.2 km/h",
            notes: "Heart rate sustained 135 bpm, completed full 10 minutes without touching rails."
          }
        }
      },
      {
        id: "sess-2",
        clientId: "client-1",
        clientName: "Anindita Chatterjee",
        date: todayStr,
        time: "10:00 AM",
        duration: 60,
        location: "The Push Fitness Studio",
        type: "1-on-1 In-Person",
        status: "scheduled",
        notes: "Today: Upper body pull & push session + rowing intervals."
      },
      {
        id: "sess-3",
        clientId: "client-1",
        clientName: "Anindita Chatterjee",
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "10:00 AM",
        duration: 60,
        location: "The Push Fitness Studio",
        type: "1-on-1 In-Person",
        status: "scheduled",
        notes: "Full body conditioning & core density."
      }
    ],

    payments: [
      {
        id: "pay-1",
        clientId: "client-1",
        clientName: "Anindita Chatterjee",
        amount: 18000,
        date: "2026-10-15",
        status: "paid",
        sessionsAdded: 12,
        packageName: "12 Sessions Personal Training Package (₹18,000)",
        method: "UPI (Google Pay)",
        notes: "Initial upfront monthly package payment received via UPI."
      }
    ],

    workoutLogs: [
      {
        id: "wl-1",
        clientId: "client-1",
        clientName: "Anindita Chatterjee",
        programId: "prog-1",
        date: "2026-11-03",
        workoutName: "Day 1: Lower Body & Core Focus",
        durationMinutes: 55,
        totalVolumeKg: 4250,
        rpe: 8,
        notes: "Session logged by Coach Pushkar Mayekar. 20kg Goblet Squat PR recorded."
      }
    ],

    nutritionLogs: [
      {
        id: "nl-1",
        clientId: "client-1",
        date: "2026-11-03",
        calories: 1720,
        proteinG: 122,
        carbsG: 168,
        fatsG: 48,
        waterMl: 3000,
        notes: "Hit all macronutrient targets. Kept dinner light with grilled chicken salad."
      }
    ],

    measurements: [
      {
        id: "meas-1",
        clientId: "client-1",
        date: "2026-10-15",
        weightKg: 62.0,
        bodyFatPercentage: 27.5,
        chestCm: 90,
        waistCm: 76,
        hipsCm: 99,
        thighsCm: 56,
        notes: "Baseline measurement on joining."
      },
      {
        id: "meas-2",
        clientId: "client-1",
        date: "2026-11-03",
        weightKg: 58.5,
        bodyFatPercentage: 25.1,
        chestCm: 88,
        waistCm: 72,
        hipsCm: 96,
        thighsCm: 54,
        notes: "3.5 kg fat loss progress check-in! Waist down 4 cm."
      }
    ],

    performanceMetrics: [
      {
        id: "pm-1",
        clientId: "client-1",
        date: "2026-11-03",
        exerciseName: "Goblet Squat (Dumbbell)",
        metricType: "1RM Estimate",
        value: 20,
        unit: "kg",
        notes: "12 solid reps with 20kg dumbbell."
      }
    ],

    progressPhotos: [],
    notes: [
      {
        id: "note-1",
        clientId: "client-1",
        authorId: "user-trainer-1",
        authorName: "Coach Pushkar Mayekar",
        content: "Anindita responds very well to progressive overload on squats and dumbbell presses. Maintain strict 60-90s rest periods.",
        isPinned: true,
        createdAt: "2026-10-16T10:00:00.000Z"
      }
    ],

    messages: [],
    checkins: [
      {
        id: "chk-1",
        clientId: "client-1",
        clientName: "Anindita Chatterjee",
        date: "2026-11-03",
        weightKg: 58.5,
        energyLevel: 9,
        sleepHours: 7.5,
        workoutAdherencePct: 100,
        nutritionAdherencePct: 95,
        feedback: "Feeling much stronger and lighter! Excited for the next phase of training.",
        reviewedByTrainer: true,
        trainerReply: "Amazing work Anindita! Your squat form and conditioning are progressing rapidly."
      }
    ],

    notifications: [
      {
        id: "notif-1",
        userId: "user-trainer-1",
        role: "trainer",
        title: "Session Completed",
        message: "Anindita Chatterjee completed Day 1: Lower Body & Core Focus (4,250 kg volume).",
        type: "session",
        isRead: false,
        timestamp: "2026-11-03T11:05:00.000Z",
        link: "/clients/client-1?tab=sessions"
      }
    ],

    templates: []
  };
}
