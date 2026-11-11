// thepushfittness - Production Initial State with Active Roster
export const initialData = {
  "lastUpdatedAt": 1794292758806,
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
        "totalVolumeKg": 4250,
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
        }
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
      "totalVolumeKg": 4250,
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
