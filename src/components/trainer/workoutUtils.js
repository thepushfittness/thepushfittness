// Modular Workout Presets and Smart Text Parser for thepushfittness

export const MODULAR_DAY_PRESETS = [
  {
    name: 'Push Day (Chest, Shoulders & Triceps)',
    focus: 'Horizontal & vertical pushing hypertrophy',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', targetWeightKg: '60', restSeconds: 90, notes: 'Retract scapulae, touch lower chest' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', targetWeightKg: '22', restSeconds: 60, notes: '30-degree incline' },
      { name: 'Overhead Barbell / DB Press', sets: 3, reps: '8-10', targetWeightKg: '35', restSeconds: 75, notes: 'Brace core, full lockout' },
      { name: 'Lateral Cable / DB Raises', sets: 3, reps: '15', targetWeightKg: '8', restSeconds: 45, notes: 'Control the negative' },
      { name: 'Tricep Rope Pushdowns', sets: 3, reps: '12-15', targetWeightKg: '20', restSeconds: 45, notes: 'Flared ropes at bottom' }
    ]
  },
  {
    name: 'Pull Day (Back, Rear Delts & Biceps)',
    focus: 'Vertical pulling, heavy rows and arm thickness',
    exercises: [
      { name: 'Bent-Over Barbell Row', sets: 4, reps: '8-10', targetWeightKg: '50', restSeconds: 90, notes: 'Pull to lower ribcage' },
      { name: 'Lat Pulldown (Neutral Grip)', sets: 3, reps: '10-12', targetWeightKg: '55', restSeconds: 60, notes: 'Full stretch at top' },
      { name: 'Seated Cable Row', sets: 3, reps: '10-12', targetWeightKg: '50', restSeconds: 60, notes: 'Squeeze shoulder blades 1s' },
      { name: 'Face Pulls / Rear Delt Fly', sets: 3, reps: '15', targetWeightKg: '15', restSeconds: 45, notes: 'External rotation at end' },
      { name: 'Incline Dumbbell Curls', sets: 3, reps: '12', targetWeightKg: '12', restSeconds: 45, notes: 'Supinate at top' }
    ]
  },
  {
    name: 'Leg Day (Quads, Glutes & Hamstrings)',
    focus: 'Squat mechanics and lower body hypertrophy',
    exercises: [
      { name: 'Barbell Back Squat', sets: 4, reps: '6-8', targetWeightKg: '80', restSeconds: 120, notes: 'Below parallel, drive up explosive' },
      { name: 'Romanian Deadlift (Barbell or DB)', sets: 3, reps: '10-12', targetWeightKg: '50', restSeconds: 90, notes: 'Hinge hips, soft knees' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10/leg', targetWeightKg: '14', restSeconds: 60, notes: 'Control tempo 3-1-1' },
      { name: 'Lying Leg Curls', sets: 3, reps: '12-15', targetWeightKg: '35', restSeconds: 60, notes: 'Squeeze hamstrings at top' },
      { name: 'Standing Calf Raises', sets: 4, reps: '15', targetWeightKg: '40', restSeconds: 45, notes: '2s pause at bottom' }
    ]
  },
  {
    name: 'Upper Body (Compound Power)',
    focus: 'Chest, back, shoulders and arms power-builder',
    exercises: [
      { name: 'Incline Barbell Bench Press', sets: 4, reps: '8', targetWeightKg: '55', restSeconds: 90, notes: 'Solid arch, drive through floor' },
      { name: 'Weighted / Bodyweight Pull-ups', sets: 4, reps: '6-8', targetWeightKg: 'Bodyweight', restSeconds: 90, notes: 'Chin over bar, full hang' },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10', targetWeightKg: '20', restSeconds: 60, notes: 'Elbows slightly tucked' },
      { name: 'Chest-Supported T-Bar Row', sets: 3, reps: '10-12', targetWeightKg: '40', restSeconds: 60, notes: 'No momentum' },
      { name: 'Hammer Curls / Skullcrushers Superset', sets: 3, reps: '12', targetWeightKg: '14', restSeconds: 60, notes: 'Arms pump finisher' }
    ]
  },
  {
    name: 'Lower Body & Core (Posterior Chain Focus)',
    focus: 'Hips, deadlift strength and core stability',
    exercises: [
      { name: 'Conventional Barbell Deadlift', sets: 4, reps: '5', targetWeightKg: '100', restSeconds: 150, notes: 'Brace hard, pull slack out of bar' },
      { name: 'Leg Press / Hack Squat', sets: 3, reps: '12', targetWeightKg: '140', restSeconds: 75, notes: 'Full depth' },
      { name: 'Dumbbell Walking Lunges', sets: 3, reps: '12/leg', targetWeightKg: '16', restSeconds: 60, notes: 'Stay upright' },
      { name: 'Hanging Leg / Knee Raises', sets: 3, reps: '15', targetWeightKg: 'Bodyweight', restSeconds: 45, notes: 'No swinging, curl pelvis' }
    ]
  },
  {
    name: 'Full Body Functional & Conditioning',
    focus: 'Total body density and high heart-rate capacity',
    exercises: [
      { name: 'Goblet Squats', sets: 4, reps: '15', targetWeightKg: '24', restSeconds: 45, notes: 'Chest tall, deep squat' },
      { name: 'Dumbbell Push Press', sets: 4, reps: '12', targetWeightKg: '16', restSeconds: 45, notes: 'Dip and drive' },
      { name: 'Kettlebell Swings', sets: 4, reps: '20', targetWeightKg: '20', restSeconds: 45, notes: 'Snappy hip lockout' },
      { name: 'Farmer Carry Walk', sets: 4, reps: '40m', targetWeightKg: '24', restSeconds: 60, notes: 'Pack shoulders, walk briskly' }
    ],
    conditioning: {
      format: '12-Min AMRAP',
      title: '12-Min AMRAP: Engine Burnout',
      duration: '12 mins',
      description: '10 Burpees\n15 Box Jumps (24")\n200m Sprint / Row',
      notes: 'Sustain 80% pace, sprint last 2 minutes',
      isDailyVariable: true
    }
  }
];

export function parseNotepadText(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const exercises = [];
  let conditioning = null;

  for (const line of lines) {
    const condMatch = line.match(/^(?:conditioning|finisher|metcon|circuit|amrap|emom|wod):\s*(.*)/i);
    if (condMatch || line.toLowerCase().startsWith('conditioning:') || line.toLowerCase().startsWith('finisher:')) {
      const rest = condMatch ? condMatch[1] : line.replace(/^(?:conditioning|finisher):\s*/i, '');
      const durationMatch = rest.match(/(\d+\s*(?:min|mins|minutes|rounds))/i);
      conditioning = {
        format: rest.split(/[:,-]/)[0]?.trim() || 'Daily Conditioning',
        title: rest.split(/[-:]/)[0]?.trim() || "Today's Finisher",
        duration: durationMatch ? durationMatch[1] : '10-12 mins',
        description: rest,
        notes: 'Pace as programmed by Coach Pushkar',
        isDailyVariable: true,
        lastUpdatedDate: new Date().toISOString().split('T')[0]
      };
      continue;
    }

    let cleanLine = line.replace(/^\d+[\.\)]\s*/, '');
    let notes = '';
    let targetWeightKg = '';
    let sets = 3;
    let reps = '10';

    if (cleanLine.includes(' - ')) {
      const parts = cleanLine.split(' - ');
      cleanLine = parts[0];
      notes = parts.slice(1).join(' - ').trim();
    } else if (cleanLine.includes(' // ')) {
      const parts = cleanLine.split(' // ');
      cleanLine = parts[0];
      notes = parts.slice(1).join(' // ').trim();
    }

    const parenWeight = cleanLine.match(/\(([^)]+)\)/);
    if (parenWeight) {
      targetWeightKg = parenWeight[1].trim();
      cleanLine = cleanLine.replace(/\(([^)]+)\)/, '').trim();
    } else {
      const atMatch = cleanLine.match(/@\s*([0-9a-zA-Z\s,/-]+)$/);
      if (atMatch) {
        targetWeightKg = atMatch[1].trim();
        cleanLine = cleanLine.replace(/@\s*([0-9a-zA-Z\s,/-]+)$/, '').trim();
      }
    }

    const setsRepsMatch = cleanLine.match(/[:\s]+(\d+)\s*[xX*]\s*([0-9]+(?:-[0-9]+)?(?:\/[a-zA-Z]+)?)/);
    let exerciseName = cleanLine;
    if (setsRepsMatch) {
      sets = Number(setsRepsMatch[1]) || 3;
      reps = setsRepsMatch[2] || '10';
      exerciseName = cleanLine.substring(0, setsRepsMatch.index).replace(/[:,-]+$/, '').trim();
    } else {
      exerciseName = cleanLine.replace(/[:,-]+$/, '').trim();
    }

    if (!exerciseName) exerciseName = 'Exercise';

    exercises.push({
      id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: exerciseName,
      sets: sets,
      reps: reps,
      targetWeightKg: targetWeightKg || '60',
      restSeconds: 90,
      tempo: '2-0-1-0',
      notes: notes,
      alternative: ''
    });
  }

  return { exercises, conditioning };
}
