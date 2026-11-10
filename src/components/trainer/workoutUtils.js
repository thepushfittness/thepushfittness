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

// Full notes parser for live coaching session logging
export function parseNotepadWorkout(rawText) {
  if (!rawText || !rawText.trim()) {
    return {
      workoutName: '',
      exercises: [],
      finisher: null,
      sessionNotes: '',
      rpe: 8
    };
  }

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  let workoutName = '';
  let sessionNotes = '';
  let rpe = 8;
  let finisher = null;
  const exercises = [];

  let currentExercise = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Check for RPE line
    const rpeMatch = line.match(/^(?:rpe|intensity)[:\s]+([0-9]+(?:\.[0-9]+)?)/i);
    if (rpeMatch) {
      rpe = Math.round(parseFloat(rpeMatch[1])) || 8;
      continue;
    }

    // 2. Check for Session Notes line
    const notesMatch = line.match(/^(?:session\s*notes|coach\s*notes|session\s*summary|notes|summary|feedback)[:\s]+(.*)/i);
    if (notesMatch) {
      const extractedNote = notesMatch[1].trim();
      sessionNotes = (sessionNotes ? sessionNotes + ' ' : '') + extractedNote;
      continue;
    }

    // 3. Check for Finisher / Conditioning line
    const condMatch = line.match(/^(?:conditioning|finisher|metcon|circuit|amrap|emom|wod)[:\s]+(.*)/i);
    if (condMatch) {
      const rest = condMatch[1].trim();
      const durationMatch = rest.match(/(\d+\s*(?:min|mins|minutes|rounds|sec|secs))/i);
      finisher = {
        format: rest.split(/[:;,]/)[0]?.trim() || 'Conditioning Finisher',
        title: rest.split(/[:;,]/)[0]?.trim() || "Today's Finisher",
        duration: durationMatch ? durationMatch[1] : '10-12 mins',
        description: rest,
        notes: '',
        isDailyVariable: true
      };
      continue;
    }

    // 4. Check for Header / Title line on first line or lines starting with Day / Routine / Workout
    const isExplicitHeader = line.match(/^(?:day\s*\d+|routine|workout\s*name)[:\s]+(.*)/i);
    const isFirstLineHeader = (i === 0 && !line.match(/\d+\s*(?:kg|lbs|reps|[xX*])/i) && line.match(/^(?:day\s*\d+|push|pull|legs|upper|lower|full\s*body|chest|back|shoulders|arms|workout|routine|session)/i));

    if (isExplicitHeader || isFirstLineHeader) {
      const cleanHeader = isExplicitHeader ? isExplicitHeader[1].trim() : line;
      workoutName = cleanHeader.replace(/^[#\-=*]+\s*/, '').replace(/[:,-]+$/, '').trim();
      continue;
    }

    // 5. Check for multi-line set syntax under current exercise, e.g.:
    // "Set 1: 60kg x 10", "60kg x 10", "10 reps @ 60kg", "10 x 60kg", "Set 1: 45s @ bw", "35 lbs x 12"
    const singleSetMatch = line.match(/^(?:set\s*\d+[:\s]+)?([0-9.]+)\s*(?:kg|kilos|lbs)?\s*([xX*@])\s*([0-9]+)\s*(s|sec|secs|seconds|reps?)?/i)
      || line.match(/^(?:set\s*\d+[:\s]+)?([0-9]+)\s*(s|sec|secs|seconds|reps?)?\s*[@xX*]\s*([0-9.]+)\s*(?:kg|kilos|lbs)?/i);

    if (currentExercise && singleSetMatch) {
      let weight = parseFloat(singleSetMatch[1]);
      let reps = parseInt(singleSetMatch[3] || singleSetMatch[2], 10);
      let seconds = '';
      const isLbs = line.match(/\b(?:lbs|lb|pounds)\b/i);
      const isSeconds = line.match(/\b(?:s|sec|secs|seconds)\b/i);
      if (line.match(/reps?\s*[@]/i)) {
        reps = parseInt(singleSetMatch[1], 10);
        weight = parseFloat(singleSetMatch[2]);
      } else if (singleSetMatch[2] === '@') {
        weight = parseFloat(singleSetMatch[3]);
        reps = parseInt(singleSetMatch[1], 10);
      }

      if (isSeconds) {
        seconds = reps;
        reps = '';
      }

      currentExercise.sets.push({
        setNum: currentExercise.sets.length + 1,
        weight: isNaN(weight) ? (currentExercise.sets[0]?.weightKg || 50) : weight,
        weightKg: isNaN(weight) ? (currentExercise.sets[0]?.weightKg || 50) : weight,
        weightUnit: isLbs ? 'lbs' : (currentExercise.sets[0]?.weightUnit || 'kg'),
        reps: reps,
        seconds: seconds,
        completed: true
      });
      continue;
    }

    // 6. Process general exercise line
    let cleanLine = line.replace(/^(\d+[\.\)]|\-|\*)\s*/, '');
    let exerciseNote = '';

    // Extract inline notes after ' - ' or ' // '
    if (cleanLine.includes(' - ')) {
      const parts = cleanLine.split(' - ');
      cleanLine = parts[0].trim();
      exerciseNote = parts.slice(1).join(' - ').trim();
    } else if (cleanLine.includes(' // ')) {
      const parts = cleanLine.split(' // ');
      cleanLine = parts[0].trim();
      exerciseNote = parts.slice(1).join(' // ').trim();
    }

    // 7. Check if line contains variable sets on same line:
    // "Bench Press: 60kg x 10, 65kg x 8, 70kg x 6" or "DB Press: 30lbs x 10, 35lbs x 8"
    const multiSetWeightPattern = /([0-9.]+)\s*(kg|lbs)?\s*[xX*]\s*([0-9]+)/gi;
    const allMatches = [...cleanLine.matchAll(multiSetWeightPattern)];
    if (allMatches.length >= 2) {
      const firstIndex = allMatches[0].index;
      let exName = cleanLine.substring(0, firstIndex).replace(/[:,-]+$/, '').trim() || 'Exercise';
      const sets = allMatches.map((m, idx) => {
        const isLbs = (m[2] && m[2].toLowerCase() === 'lbs') || cleanLine.toLowerCase().includes('lbs');
        const numWeight = parseFloat(m[1]) || 50;
        return {
          setNum: idx + 1,
          weight: numWeight,
          weightKg: numWeight,
          weightUnit: isLbs ? 'lbs' : 'kg',
          reps: parseInt(m[3], 10) || 10,
          seconds: '',
          completed: true
        };
      });

      currentExercise = {
        id: `ex-${Date.now()}-${exercises.length + 1}-${Math.random().toString(36).substr(2, 4)}`,
        name: exName,
        prescribedText: `${sets.length} sets logged (${sets.map(s => `${s.weightKg}${s.weightUnit}×${s.reps}`).join(', ')})`,
        notes: exerciseNote,
        alternative: '',
        sets
      };
      exercises.push(currentExercise);
      continue;
    }

    // 8. Check for comma-separated or slash-separated reps/seconds format:
    // e.g., "Incline DB Press 35lbs: 12, 10, 10" or "Lat Pulldown 55kg: 12, 12, 10" or "Plank bw: 45s, 60s, 60s"
    const commaRepsMatch = cleanLine.match(/(.*?)\s+([0-9.]+\s*(?:kg|kilos|lbs|bw)?)\s*[:\s]+([0-9a-zA-Z]+(?:\s*[,/]\s*[0-9a-zA-Z]+)+)/i);
    if (commaRepsMatch) {
      const exName = commaRepsMatch[1].replace(/[:,-]+$/, '').trim() || 'Exercise';
      const isLbs = commaRepsMatch[2].toLowerCase().includes('lbs') || cleanLine.toLowerCase().includes('lbs');
      const rawWeight = commaRepsMatch[2].toLowerCase().replace(/[^0-9.]/g, '');
      const weightNum = parseFloat(rawWeight) || (commaRepsMatch[2].includes('bw') ? 0 : (isLbs ? 100 : 50));
      const itemsArray = commaRepsMatch[3].split(/[,/]/).map(r => r.trim()).filter(Boolean);

      const sets = itemsArray.map((item, idx) => {
        const isSec = item.toLowerCase().includes('s');
        const numVal = parseInt(item.replace(/[^0-9]/g, ''), 10) || 10;
        return {
          setNum: idx + 1,
          weight: weightNum,
          weightKg: weightNum,
          weightUnit: isLbs ? 'lbs' : 'kg',
          reps: isSec ? '' : numVal,
          seconds: isSec ? numVal : '',
          completed: true
        };
      });

      currentExercise = {
        id: `ex-${Date.now()}-${exercises.length + 1}-${Math.random().toString(36).substr(2, 4)}`,
        name: exName,
        prescribedText: `${sets.length} sets logged @ ${weightNum} ${isLbs ? 'lbs' : 'kg'}`,
        notes: exerciseNote,
        alternative: '',
        sets
      };
      exercises.push(currentExercise);
      continue;
    }

    // 9. Check for standard "3x10 @ 60kg" or "60kg 3x10" or "Bench Press 4x8-10 60kg" or "3x10 @ 35lbs"
    let targetWeight = 50;
    let targetUnit = 'kg';
    const parenWeight = cleanLine.match(/\(([0-9.]+)\s*(kg|lbs)?\)/i);
    if (parenWeight) {
      targetWeight = parseFloat(parenWeight[1]) || 50;
      if (parenWeight[2]?.toLowerCase() === 'lbs') targetUnit = 'lbs';
      cleanLine = cleanLine.replace(/\([^)]+\)/, '').trim();
    } else {
      const atMatch = cleanLine.match(/[@\s]+([0-9.]+)\s*(kg|kilos|lbs)\b/i);
      if (atMatch) {
        targetWeight = parseFloat(atMatch[1]) || 50;
        if (atMatch[2]?.toLowerCase() === 'lbs') targetUnit = 'lbs';
        cleanLine = cleanLine.replace(/[@\s]+[0-9.]+\s*(?:kg|kilos|lbs)\b/i, '').trim();
      } else if (cleanLine.toLowerCase().includes(' bw') || cleanLine.toLowerCase().includes('bodyweight')) {
        targetWeight = 0;
        cleanLine = cleanLine.replace(/\b(bodyweight|bw)\b/i, '').trim();
      }
    }

    if (cleanLine.toLowerCase().includes('lbs')) targetUnit = 'lbs';

    // Check for NxM sets x reps/seconds: "3x10", "4 x 8-10", "3*12", "3x45s"
    const setsRepsMatch = cleanLine.match(/[:\s]+(\d+)\s*[xX*]\s*([0-9]+)(?:-[0-9]+)?\s*(s|sec|secs|seconds|reps)?/i);
    if (setsRepsMatch) {
      const numSets = Math.min(Math.max(parseInt(setsRepsMatch[1], 10) || 3, 1), 10);
      const val = parseInt(setsRepsMatch[2], 10) || 10;
      const isSec = !!setsRepsMatch[3]?.toLowerCase().startsWith('s');
      const exName = cleanLine.substring(0, setsRepsMatch.index).replace(/[:,-]+$/, '').trim() || 'Exercise';

      const sets = Array.from({ length: numSets }).map((_, idx) => ({
        setNum: idx + 1,
        weight: targetWeight,
        weightKg: targetWeight,
        weightUnit: targetUnit,
        reps: isSec ? '' : val,
        seconds: isSec ? val : '',
        completed: true
      }));

      currentExercise = {
        id: `ex-${Date.now()}-${exercises.length + 1}-${Math.random().toString(36).substr(2, 4)}`,
        name: exName,
        prescribedText: `${numSets} sets × ${isSec ? `${val}s` : `${val} reps`} @ ${targetWeight} ${targetUnit}`,
        notes: exerciseNote,
        alternative: '',
        sets
      };
      exercises.push(currentExercise);
      continue;
    }

    // 10. Check if this is a header for multi-line sets (e.g. "Squat" or "Squats 80kg" or "DB Press 35lbs")
    const trailingWeightMatch = cleanLine.match(/\s+([0-9.]+)\s*(kg|lbs)?$/i);
    let finalWeight = targetWeight;
    let exName = cleanLine;
    if (trailingWeightMatch) {
      finalWeight = parseFloat(trailingWeightMatch[1]) || targetWeight;
      if (trailingWeightMatch[2]?.toLowerCase() === 'lbs') targetUnit = 'lbs';
      exName = cleanLine.substring(0, trailingWeightMatch.index).trim();
    }

    exName = exName.replace(/[:,-]+$/, '').trim();
    if (exName && exName.length >= 2) {
      const nextLine = lines[i + 1];
      const nextIsSet = nextLine && (
        nextLine.match(/^(?:set\s*\d+[:\s]+)?[0-9.]+\s*(?:kg|kilos|lbs)?\s*[xX*@]\s*[0-9]+/i) ||
        nextLine.match(/^[0-9]+\s*reps?\s*[@xX*]\s*[0-9.]+/i)
      );

      const sets = nextIsSet ? [] : [
        { setNum: 1, weight: finalWeight, weightKg: finalWeight, weightUnit: targetUnit, reps: 10, seconds: '', completed: true },
        { setNum: 2, weight: finalWeight, weightKg: finalWeight, weightUnit: targetUnit, reps: 10, seconds: '', completed: true },
        { setNum: 3, weight: finalWeight, weightKg: finalWeight, weightUnit: targetUnit, reps: 10, seconds: '', completed: true }
      ];

      currentExercise = {
        id: `ex-${Date.now()}-${exercises.length + 1}-${Math.random().toString(36).substr(2, 4)}`,
        name: exName,
        prescribedText: nextIsSet ? '' : `3 sets @ ${finalWeight} ${targetUnit}`,
        notes: exerciseNote,
        alternative: '',
        sets
      };
      exercises.push(currentExercise);
    }
  }

  // Fallback: If no exercises were parsed, return a blank starter
  if (exercises.length === 0) {
    exercises.push({
      id: `ex-${Date.now()}-1`,
      name: 'Exercise 1',
      prescribedText: '3 sets × 10 reps',
      notes: '',
      alternative: '',
      sets: [
        { setNum: 1, weight: 50, weightKg: 50, weightUnit: 'kg', reps: 10, seconds: '', completed: true },
        { setNum: 2, weight: 50, weightKg: 50, weightUnit: 'kg', reps: 10, seconds: '', completed: true },
        { setNum: 3, weight: 50, weightKg: 50, weightUnit: 'kg', reps: 10, seconds: '', completed: true }
      ]
    });
  }

  return {
    workoutName: workoutName || 'Studio Workout Log',
    exercises,
    finisher,
    sessionNotes,
    rpe
  };
}

// Convert workout structure back to editable notepad text
export function convertWorkoutToNotepadText(dayOrWorkout) {
  if (!dayOrWorkout) return '';
  const lines = [];
  if (dayOrWorkout.name || dayOrWorkout.workoutName || dayOrWorkout.dayName) {
    lines.push(dayOrWorkout.name || dayOrWorkout.workoutName || dayOrWorkout.dayName);
  }
  const exercises = dayOrWorkout.exercises || [];
  exercises.forEach(ex => {
    if (ex.sets && Array.isArray(ex.sets) && typeof ex.sets[0] === 'object') {
      const weights = ex.sets.map(s => Number(s.weight !== undefined ? s.weight : s.weightKg) || 0);
      const allSameWeight = weights.every(w => w === weights[0]);
      const formatSetMetric = (s) => {
        const hasReps = s.reps !== undefined && s.reps !== null && s.reps !== '' && Number(s.reps) > 0;
        const hasSecs = s.seconds !== undefined && s.seconds !== null && s.seconds !== '' && Number(s.seconds) > 0;
        if (hasReps && hasSecs) return `${s.reps}r ${s.seconds}s`;
        if (hasSecs) return `${s.seconds}s`;
        return `${hasReps ? s.reps : 10}`;
      };
      const unit = ex.sets[0]?.weightUnit || 'kg';
      if (allSameWeight && weights[0] !== undefined) {
        const repsList = ex.sets.map(formatSetMetric).join(', ');
        lines.push(`${ex.name} ${weights[0]}${unit} ${repsList}${ex.notes ? ` - ${ex.notes}` : ''}`);
      } else {
        const setStrings = ex.sets.map(s => `${s.weight !== undefined ? s.weight : s.weightKg}${s.weightUnit || 'kg'} x ${formatSetMetric(s)}`).join(', ');
        lines.push(`${ex.name}: ${setStrings}${ex.notes ? ` - ${ex.notes}` : ''}`);
      }
    } else {
      const targetWeight = ex.targetWeightKg ? `${ex.targetWeightKg}kg` : '50kg';
      lines.push(`${ex.name} ${ex.sets || 3}x${ex.reps || 10} @ ${targetWeight}${ex.notes ? ` - ${ex.notes}` : ''}`);
    }
  });

  if (dayOrWorkout.conditioning || dayOrWorkout.finisher) {
    const fin = dayOrWorkout.conditioning || dayOrWorkout.finisher;
    lines.push(`Finisher: ${fin.title || fin.format || 'Conditioning'}: ${fin.description || ''}`);
  }

  if (dayOrWorkout.sessionNotes || dayOrWorkout.notes) {
    lines.push(`Notes: ${dayOrWorkout.sessionNotes || dayOrWorkout.notes}`);
  }

  if (dayOrWorkout.rpe) {
    lines.push(`RPE: ${dayOrWorkout.rpe}`);
  }

  return lines.join('\n');
}
