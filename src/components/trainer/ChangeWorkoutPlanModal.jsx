import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { MODULAR_DAY_PRESETS, parseNotepadText } from './workoutUtils';
import { 
  Dumbbell, 
  Sparkles, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Flame, 
  Zap, 
  FileText, 
  AlertTriangle, 
  Copy, 
  ArrowRight,
  Clock
} from 'lucide-react';

const PREBUILT_SPLITS = [
  {
    id: 'split-3day-ppl',
    name: '3-Day Classic Push / Pull / Legs (PPL)',
    goal: 'Strength & Muscle Gain',
    durationWeeks: 8,
    daysPerWeek: 3,
    description: 'Gold-standard 3-day split separating pushing muscles, pulling muscles, and lower body for optimal recovery and progressive overload.',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 — Push (Chest, Delts & Triceps)',
        focus: 'Horizontal & vertical pushing hypertrophy',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '8-10', targetWeightKg: 60, restSeconds: 90, notes: 'Retract scapulae, touch lower sternum' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', targetWeightKg: 22, restSeconds: 60, notes: '30-degree bench incline' },
          { name: 'Seated Overhead Dumbbell Press', sets: 3, reps: '10', targetWeightKg: 18, restSeconds: 60, notes: 'Elbows slightly tucked' },
          { name: 'Standing Lateral DB Raises', sets: 3, reps: '15', targetWeightKg: 8, restSeconds: 45, notes: 'Slow eccentric, no swinging' },
          { name: 'Tricep Rope Pushdowns', sets: 3, reps: '12-15', targetWeightKg: 20, restSeconds: 45, notes: 'Flared ropes at bottom lockout' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 — Pull (Back, Rear Delts & Biceps)',
        focus: 'Vertical pulling, heavy rows and arm thickness',
        exercises: [
          { name: 'Bent-Over Barbell Row', sets: 4, reps: '8-10', targetWeightKg: 50, restSeconds: 90, notes: 'Pull to lower ribcage, 1s pause' },
          { name: 'Lat Pulldown (Neutral Grip)', sets: 3, reps: '10-12', targetWeightKg: 55, restSeconds: 60, notes: 'Full lat stretch at top' },
          { name: 'Seated Cable Row', sets: 3, reps: '10-12', targetWeightKg: 50, restSeconds: 60, notes: 'Squeeze shoulder blades' },
          { name: 'Face Pulls / Rear Delt Fly', sets: 3, reps: '15', targetWeightKg: 15, restSeconds: 45, notes: 'External rotation at end' },
          { name: 'Incline Dumbbell Bicep Curls', sets: 3, reps: '12', targetWeightKg: 12, restSeconds: 45, notes: 'Supinate at top' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 — Legs & Core (Posterior Chain & Quads)',
        focus: 'Squat mechanics, posterior chain and core stability',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '6-8', targetWeightKg: 80, restSeconds: 120, notes: 'Below parallel, drive through mid-foot' },
          { name: 'Romanian Deadlift (Barbell or DB)', sets: 3, reps: '10-12', targetWeightKg: 50, restSeconds: 90, notes: 'Hinge hips backward, keep spine flat' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10/leg', targetWeightKg: 14, restSeconds: 60, notes: 'Controlled tempo 3-0-1' },
          { name: 'Lying Leg Curls', sets: 3, reps: '12-15', targetWeightKg: 35, restSeconds: 60, notes: 'Squeeze hamstrings at top' },
          { name: 'Hanging Leg / Knee Raises', sets: 3, reps: '15', targetWeightKg: 'BW', restSeconds: 45, notes: 'No swinging, curl pelvis' }
        ]
      }
    ]
  },
  {
    id: 'split-3day-fullbody',
    name: '3-Day Full Body Functional & Strength',
    goal: 'Fat Loss & Conditioning',
    durationWeeks: 8,
    daysPerWeek: 3,
    description: 'High-efficiency 3-day full body regimen pairing compound strength with metabolic conditioning finishers.',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 — Full Body Strength & Squat',
        focus: 'Squat pattern, horizontal push & vertical pull',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '8', targetWeightKg: 70, restSeconds: 90, notes: 'Chest up, knees out' },
          { name: 'Flat Dumbbell Bench Press', sets: 3, reps: '10', targetWeightKg: 24, restSeconds: 60, notes: 'Solid arch, drive feet' },
          { name: 'Lat Pulldown or Pull-ups', sets: 3, reps: '10-12', targetWeightKg: 50, restSeconds: 60, notes: 'Controlled negative' },
          { name: 'Walking Dumbbell Lunges', sets: 3, reps: '12/leg', targetWeightKg: 14, restSeconds: 60, notes: 'Upright posture' },
          { name: 'Plank Hold', sets: 3, reps: '45-60s', targetWeightKg: 'BW', restSeconds: 45, notes: 'Brace core and glutes' }
        ],
        conditioning: {
          title: '10-Min Kettlebell Swings EMOM',
          format: 'EMOM',
          duration: '10 Mins',
          description: 'Minute 1: 15 KB Swings (20kg)\nMinute 2: 12 Burpees\nAlternate for 10 total minutes.'
        }
      },
      {
        dayNumber: 2,
        name: 'Day 2 — Full Body Hinge & Overhead',
        focus: 'Deadlift mechanics, vertical push & horizontal pull',
        exercises: [
          { name: 'Conventional Barbell Deadlift', sets: 4, reps: '6', targetWeightKg: 90, restSeconds: 120, notes: 'Brace lats, pull slack from bar' },
          { name: 'Overhead Barbell / DB Press', sets: 3, reps: '8-10', targetWeightKg: 30, restSeconds: 75, notes: 'Full lockout at top' },
          { name: 'Chest-Supported T-Bar Row', sets: 3, reps: '10-12', targetWeightKg: 40, restSeconds: 60, notes: 'Pause 1s at top' },
          { name: 'Goblet Squats', sets: 3, reps: '12', targetWeightKg: 24, restSeconds: 60, notes: 'Elbows inside knees' },
          { name: 'Dumbbell Hammer Curls', sets: 3, reps: '12', targetWeightKg: 12, restSeconds: 45, notes: 'Controlled tempo' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 — Full Body Density & Core',
        focus: 'Hypertrophy isolation, lunges and engine builder',
        exercises: [
          { name: 'Romanian Deadlift (DB or Barbell)', sets: 4, reps: '10', targetWeightKg: 45, restSeconds: 75, notes: 'Hinge back, feel hamstring stretch' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', targetWeightKg: 20, restSeconds: 60, notes: 'Slow eccentric' },
          { name: 'Seated Cable Row', sets: 3, reps: '12', targetWeightKg: 50, restSeconds: 60, notes: 'Squeeze mid-back' },
          { name: 'Lateral Cable / DB Raises', sets: 3, reps: '15', targetWeightKg: 8, restSeconds: 45, notes: 'Lead with elbows' },
          { name: 'Ab Wheel Rollouts or Leg Raises', sets: 3, reps: '12-15', targetWeightKg: 'BW', restSeconds: 45, notes: 'Posterior pelvic tilt' }
        ],
        conditioning: {
          title: '12-Min Row & Wall-Ball AMRAP',
          format: 'AMRAP',
          duration: '12 Mins',
          description: '200m Concept2 Row\n15 Wall Ball Shots (6-9kg)\n10 Box Jumps'
        }
      }
    ]
  },
  {
    id: 'split-4day-upperlower',
    name: '4-Day Upper / Lower Periodized Split',
    goal: 'Strength & Muscle Gain',
    durationWeeks: 10,
    daysPerWeek: 4,
    description: 'High-frequency upper/lower split maximizing muscle protein synthesis by hitting each muscle group twice weekly.',
    days: [
      {
        dayNumber: 1,
        name: 'Day 1 — Upper Body Power',
        focus: 'Heavy pressing and heavy rowing',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '6-8', targetWeightKg: 70, restSeconds: 90, notes: 'Pause at chest' },
          { name: 'Bent-Over Barbell Row', sets: 4, reps: '6-8', targetWeightKg: 60, restSeconds: 90, notes: 'Explosive pull, 2s lower' },
          { name: 'Standing Overhead Press', sets: 3, reps: '8', targetWeightKg: 35, restSeconds: 75, notes: 'Tight glutes and core' },
          { name: 'Weighted / Banded Pull-ups', sets: 3, reps: '8', targetWeightKg: 'BW', restSeconds: 75, notes: 'Full hang stretch' },
          { name: 'Skull Crushers (EZ Bar)', sets: 3, reps: '10', targetWeightKg: 25, restSeconds: 60, notes: 'Elbows pointing up' }
        ]
      },
      {
        dayNumber: 2,
        name: 'Day 2 — Lower Body Power',
        focus: 'Squats, knee flexion and calf density',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '6', targetWeightKg: 85, restSeconds: 120, notes: 'Hit depth with control' },
          { name: 'Romanian Deadlift', sets: 3, reps: '8-10', targetWeightKg: 60, restSeconds: 90, notes: 'Feel deep hamstring stretch' },
          { name: 'Leg Press (Quad Focus)', sets: 3, reps: '12', targetWeightKg: 140, restSeconds: 75, notes: 'Feet low on platform' },
          { name: 'Lying Leg Curls', sets: 3, reps: '12', targetWeightKg: 40, restSeconds: 60, notes: 'Peak contraction 1s' },
          { name: 'Standing Calf Raises', sets: 4, reps: '15', targetWeightKg: 50, restSeconds: 45, notes: 'Pause 2s at stretch' }
        ]
      },
      {
        dayNumber: 3,
        name: 'Day 3 — Upper Body Hypertrophy',
        focus: 'Incline pressing, cable flyes and high-volume arms',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', targetWeightKg: 24, restSeconds: 60, notes: 'Deep stretch' },
          { name: 'Lat Pulldown (Wide Grip)', sets: 4, reps: '10-12', targetWeightKg: 55, restSeconds: 60, notes: 'Pull to collarbone' },
          { name: 'Seated Cable Row', sets: 3, reps: '12', targetWeightKg: 50, restSeconds: 60, notes: 'Underhand grip' },
          { name: 'Lateral Cable Raises', sets: 4, reps: '15', targetWeightKg: 9, restSeconds: 45, notes: 'Constant cable tension' },
          { name: 'Incline DB Bicep Curls Superset Tricep Pushdowns', sets: 3, reps: '12', targetWeightKg: 12, restSeconds: 45, notes: 'Arm pump superset' }
        ]
      },
      {
        dayNumber: 4,
        name: 'Day 4 — Lower Body Hypertrophy & Posterior',
        focus: 'Deadlift variation, lunges and glute hypertrophy',
        exercises: [
          { name: 'Conventional Deadlift or Trap Bar', sets: 4, reps: '6-8', targetWeightKg: 95, restSeconds: 120, notes: 'Solid spine alignment' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10/leg', targetWeightKg: 16, restSeconds: 60, notes: 'Deep drop' },
          { name: 'Leg Extensions', sets: 3, reps: '15', targetWeightKg: 45, restSeconds: 45, notes: '2s isometric hold at top' },
          { name: 'Seated Hamstring Curls', sets: 3, reps: '12', targetWeightKg: 40, restSeconds: 45, notes: 'Controlled tempo' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '15', targetWeightKg: 'BW', restSeconds: 45, notes: 'Tuck pelvis' }
        ]
      }
    ]
  }
];

export function ChangeWorkoutPlanModal({
  isOpen,
  program,
  client,
  initialMode = 'switch', // 'switch' | 'edit'
  onClose,
  onSuccess,
  onDelete
}) {
  const { showToast } = useNotifications();
  const modalScrollRef = useRef(null);

  const [activeTab, setActiveTab] = useState(initialMode); // 'switch' | 'edit'
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [dbTemplates, setDbTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  // Edit / Customizer fields
  const [programName, setProgramName] = useState('');
  const [programGoal, setProgramGoal] = useState('Strength & Muscle Gain');
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [programNotes, setProgramNotes] = useState('');
  const [programStatus, setProgramStatus] = useState('active');
  const [days, setDays] = useState([]);

  // Builder mode for editing
  const [builderMode, setBuilderMode] = useState('visual'); // 'visual' | 'notepad'
  const [notepadText, setNotepadText] = useState('');
  const [activeNotepadDayIdx, setActiveNotepadDayIdx] = useState(0);
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [expandedDayIdx, setExpandedDayIdx] = useState(0);

  // Delete confirmation inside modal
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load templates on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      setConfirmDelete(false);
      loadTemplates();
      populateFromProgram();

      // Reset scroll position to top
      setTimeout(() => {
        if (modalScrollRef.current) {
          modalScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
      }, 50);
    }
  }, [isOpen, program, initialMode]);

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const res = await api.getTemplates('program');
      setDbTemplates(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const populateFromProgram = () => {
    if (program) {
      setProgramName(program.name || '');
      setProgramGoal(program.goal || 'Strength & Muscle Gain');
      setDurationWeeks(program.durationWeeks || 8);
      setDaysPerWeek(program.daysPerWeek || (program.days?.length || 3));
      setProgramNotes(program.notes || '');
      setProgramStatus(program.status || 'active');

      const loadedDays = (program.days || []).map((d, dIdx) => ({
        id: d.id || `d-${Date.now()}-${dIdx}`,
        dayNumber: d.dayNumber || dIdx + 1,
        name: d.name || `Day ${dIdx + 1}`,
        focus: d.focus || '',
        conditioning: d.conditioning || null,
        exercises: (d.exercises || []).map((ex, exIdx) => {
          const numSets = Number(ex.sets) || 3;
          const targetWeights = (ex.targetWeights && ex.targetWeights.length === numSets)
            ? ex.targetWeights
            : Array(numSets).fill(ex.targetWeightKg || 0);
          const isDifferentWeights = ex.isDifferentWeights !== undefined
            ? ex.isDifferentWeights
            : (targetWeights.length > 1 && new Set(targetWeights).size > 1);
          return {
            id: ex.id || `ex-${Date.now()}-${dIdx}-${exIdx}`,
            name: ex.name || '',
            sets: numSets,
            reps: String(ex.reps || '10'),
            targetWeightKg: ex.targetWeightKg !== undefined ? ex.targetWeightKg : (targetWeights[0] || 0),
            targetWeights,
            isDifferentWeights,
            restSeconds: ex.restSeconds || ex.restSec || 90,
            tempo: ex.tempo || '2-0-1-0',
            notes: ex.notes || '',
            videoUrl: ex.videoUrl || '',
            alternative: ex.alternative || ''
          };
        })
      }));
      setDays(loadedDays.length > 0 ? loadedDays : [createFreshDay(1)]);
    } else {
      // Default new program
      setProgramName(`${client?.name ? `${client.name}'s ` : ''}Custom Workout Program`);
      setProgramGoal('Strength & Muscle Gain');
      setDurationWeeks(8);
      setDaysPerWeek(3);
      setProgramNotes('Follow rest periods carefully. Stay hydrated and prioritize form.');
      setProgramStatus('active');
      setDays([createFreshDay(1)]);
    }
  };

  const createFreshDay = (num = 1) => ({
    id: `d-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    dayNumber: num,
    name: `Day ${num} — Routine`,
    focus: 'Compound movements and hypertrophy',
    exercises: [
      {
        id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: 'Barbell Back Squat',
        sets: 3,
        reps: '10',
        targetWeightKg: 50,
        targetWeights: [50, 50, 50],
        isDifferentWeights: false,
        restSeconds: 90,
        tempo: '2-0-1-0',
        notes: 'Maintain neutral spine, push knees outward',
        videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
        alternative: 'Goblet Squat'
      }
    ]
  });

  const addDay = () => {
    const nextNum = days.length + 1;
    const newDay = createFreshDay(nextNum);
    newDay.name = `Day ${nextNum} — Routine`;
    setDays([...days, newDay]);
    setExpandedDayIdx(days.length);
    setDaysPerWeek(days.length + 1);
    showToast(`Added Day ${nextNum}`);
  };

  const removeDay = (dIdx) => {
    if (days.length <= 1) {
      setDays([createFreshDay(1)]);
      showToast('Reset Day 1 to a fresh blank routine');
      return;
    }
    const updated = days
      .filter((_, idx) => idx !== dIdx)
      .map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
    setDays(updated);
    setDaysPerWeek(updated.length);
    setExpandedDayIdx(Math.max(0, dIdx - 1));
    showToast(`Removed day ${dIdx + 1}`);
  };

  const addExercise = (dayIdx) => {
    const updated = [...days];
    updated[dayIdx].exercises.push({
      id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: 'Romanian Deadlift',
      sets: 3,
      reps: '10-12',
      targetWeightKg: 40,
      targetWeights: [40, 40, 40],
      isDifferentWeights: false,
      restSeconds: 75,
      tempo: '3-0-1-0',
      notes: 'Hinge hips backward, keep spine flat',
      videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
      alternative: 'Dumbbell RDL'
    });
    setDays(updated);
  };

  const removeExercise = (dayIdx, exIdx) => {
    const updated = [...days];
    updated[dayIdx].exercises.splice(exIdx, 1);
    setDays(updated);
  };

  const loadPresetDay = (preset, targetDayIdx = null) => {
    const nextNum = targetDayIdx !== null ? targetDayIdx + 1 : days.length + 1;
    const newDay = {
      id: `d-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      dayNumber: nextNum,
      name: `Day ${nextNum} — ${preset.name}`,
      focus: preset.focus,
      conditioning: preset.conditioning || null,
      exercises: (preset.exercises || []).map(ex => {
        const numSets = Number(ex.sets) || 3;
        const targetWeights = Array(numSets).fill(ex.targetWeightKg || '50');
        return {
          id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: ex.name,
          sets: numSets,
          reps: String(ex.reps || '10'),
          targetWeightKg: ex.targetWeightKg || '50',
          targetWeights,
          isDifferentWeights: false,
          restSeconds: ex.restSeconds || 90,
          tempo: ex.tempo || '2-0-1-0',
          notes: ex.notes || '',
          videoUrl: ex.videoUrl || '',
          alternative: ex.alternative || ''
        };
      })
    };

    if (targetDayIdx !== null && targetDayIdx < days.length) {
      const updated = [...days];
      updated[targetDayIdx] = { ...newDay, dayNumber: targetDayIdx + 1 };
      setDays(updated);
    } else {
      setDays([...days, newDay]);
      setDaysPerWeek(days.length + 1);
    }
    showToast(`Loaded preset "${preset.name}"!`);
  };

  const handleConvertNotepad = (targetDayIdx) => {
    if (!notepadText.trim()) {
      showToast('Please enter workout text first', 'error');
      return;
    }
    const { exercises: parsedExs, conditioning: parsedCond } = parseNotepadText(notepadText);
    if (parsedExs.length === 0 && !parsedCond) {
      showToast('Could not parse exercises. Format: "Bench Press: 3x10 (60kg) - notes"', 'error');
      return;
    }

    const updated = [...days];
    if (targetDayIdx === 'new' || targetDayIdx >= updated.length) {
      const nextNum = updated.length + 1;
      updated.push({
        id: `d-${Date.now()}`,
        dayNumber: nextNum,
        name: `Day ${nextNum} — Custom Routine`,
        focus: 'Parsed from quick text',
        exercises: parsedExs,
        conditioning: parsedCond || null
      });
      setDaysPerWeek(updated.length);
    } else {
      updated[targetDayIdx].exercises = [
        ...(updated[targetDayIdx].exercises || []),
        ...parsedExs
      ];
      if (parsedCond) {
        updated[targetDayIdx].conditioning = parsedCond;
      }
    }
    setDays(updated);
    setBuilderMode('visual');
    showToast(`Added ${parsedExs.length} exercises from notepad!`);
  };

  // Combine pre-built splits + DB templates
  const allAvailableTemplates = [
    ...PREBUILT_SPLITS,
    ...dbTemplates.map(tpl => ({
      id: tpl.id,
      name: tpl.name,
      goal: tpl.goal || 'General Fitness',
      durationWeeks: tpl.durationWeeks || 8,
      daysPerWeek: tpl.daysPerWeek || (tpl.days?.length || 3),
      description: tpl.description || '',
      days: (tpl.days || []).map((d, idx) => ({
        dayNumber: d.dayNumber || idx + 1,
        name: d.name || `Day ${idx + 1}`,
        focus: d.focus || tpl.goal,
        exercises: (d.exercises || []).map(ex => ({
          name: ex.name,
          sets: Number(ex.sets) || 3,
          reps: String(ex.reps || '10'),
          targetWeightKg: ex.targetWeightKg || 50,
          restSeconds: ex.restSec || ex.restSeconds || 60,
          notes: ex.notes || ''
        }))
      }))
    }))
  ];

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id);
    setPreviewTemplate(tpl);
  };

  const handleApplyTemplate = async (tplToApply) => {
    if (!tplToApply) return;
    try {
      setIsApplying(true);
      const cleanedDays = (tplToApply.days || []).map((d, dIdx) => ({
        id: `d-${Date.now()}-${dIdx}`,
        dayNumber: d.dayNumber || dIdx + 1,
        name: d.name,
        focus: d.focus || tplToApply.goal,
        conditioning: d.conditioning || null,
        exercises: (d.exercises || []).map((ex, exIdx) => {
          const sets = Number(ex.sets) || 3;
          const targetWeight = (ex.targetWeightKg !== undefined && ex.targetWeightKg !== '') ? ex.targetWeightKg : 50;
          return {
            id: `ex-${Date.now()}-${dIdx}-${exIdx}`,
            name: ex.name,
            sets: sets,
            reps: String(ex.reps || '10'),
            targetWeightKg: targetWeight,
            targetWeights: Array(sets).fill(targetWeight),
            isDifferentWeights: false,
            restSeconds: ex.restSeconds || 90,
            tempo: ex.tempo || '2-0-1-0',
            notes: ex.notes || '',
            videoUrl: ex.videoUrl || '',
            alternative: ex.alternative || ''
          };
        })
      }));

      const payload = {
        clientId: client?.id || program?.clientId,
        name: `${client?.name ? `${client.name}: ` : ''}${tplToApply.name}`,
        goal: tplToApply.goal,
        durationWeeks: Number(tplToApply.durationWeeks) || 8,
        daysPerWeek: Number(tplToApply.daysPerWeek) || cleanedDays.length,
        notes: tplToApply.description || `Assigned program from template "${tplToApply.name}".`,
        status: 'active',
        startDate: program?.startDate || new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + (tplToApply.durationWeeks || 8) * 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
        days: cleanedDays
      };

      if (program && program.id) {
        // In-place replace/update
        await api.updateProgram(program.id, payload);
        showToast(`Workout plan changed to "${tplToApply.name}" for ${client?.name || 'client'}!`);
      } else {
        // Brand new assignment
        await api.createProgram(payload);
        showToast(`Assigned "${tplToApply.name}" to ${client?.name || 'client'}!`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to apply workout plan', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveCustomPlan = async (e) => {
    if (e) e.preventDefault();
    if (!programName.trim()) {
      showToast('Please enter a program name', 'error');
      return;
    }

    try {
      setIsApplying(true);
      const cleanedDays = days.map((d, dIdx) => ({
        id: d.id || `d-${Date.now()}-${dIdx}`,
        dayNumber: dIdx + 1,
        name: d.name || `Day ${dIdx + 1}`,
        focus: d.focus || '',
        conditioning: d.conditioning || null,
        exercises: (d.exercises || []).map((ex, exIdx) => {
          const numSets = Number(ex.sets) || 3;
          const fallbackWeight = (ex.targetWeightKg !== undefined && ex.targetWeightKg !== '') ? ex.targetWeightKg : 0;
          let targetWeights = ex.targetWeights;
          if (!targetWeights || targetWeights.length !== numSets) {
            targetWeights = Array(numSets).fill(fallbackWeight);
          } else {
            targetWeights = targetWeights.map(w => (w !== undefined && w !== '') ? w : fallbackWeight);
          }
          return {
            id: ex.id || `ex-${Date.now()}-${dIdx}-${exIdx}`,
            name: ex.name || 'Exercise',
            sets: numSets,
            reps: String(ex.reps || '10'),
            targetWeights,
            isDifferentWeights: !!ex.isDifferentWeights,
            targetWeightKg: fallbackWeight,
            restSeconds: Number(ex.restSeconds) || 90,
            tempo: ex.tempo || '2-0-1-0',
            notes: (ex.notes || '').trim(),
            videoUrl: ex.videoUrl || '',
            alternative: ex.alternative || ''
          };
        })
      }));

      const payload = {
        clientId: client?.id || program?.clientId,
        name: programName.trim(),
        goal: programGoal,
        durationWeeks: Number(durationWeeks) || 8,
        daysPerWeek: Number(daysPerWeek) || cleanedDays.length,
        notes: programNotes.trim(),
        status: programStatus,
        startDate: program?.startDate || new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + (Number(durationWeeks) || 8) * 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
        days: cleanedDays
      };

      if (program && program.id) {
        await api.updateProgram(program.id, payload);
        showToast(`Workout plan "${programName}" updated successfully!`);
      } else {
        await api.createProgram(payload);
        showToast(`Workout plan "${programName}" created and assigned!`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save workout plan', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const handleDeleteCurrentPlan = async () => {
    if (!program || !program.id) return;
    try {
      setIsDeleting(true);
      await api.deleteProgram(program.id);
      showToast(`Workout plan "${program.name}" deleted successfully.`);
      if (onDelete) onDelete(program.id);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to delete workout plan', 'error');
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalScrollRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start animate-fade-in"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 max-w-4xl w-full shadow-2xl my-4 sm:my-8 space-y-6 text-xs text-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {program ? `Manage Workout Plan: ${program.name}` : `Assign Workout Plan to ${client?.name || 'Client'}`}
                </h3>
                {program && (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {program.status || 'active'}
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Client: <strong className="text-white">{client?.name || 'Selected Client'}</strong> • Change template, tweak exercises, or delete duplicates
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {program && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold transition"
                title="Delete this plan"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Plan</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Banner inside modal */}
        {confirmDelete && program && (
          <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-2xl space-y-3 animate-fade-in">
            <div className="flex items-center space-x-2 text-red-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Are you sure you want to delete this workout plan?</span>
            </div>
            <p className="text-xs text-slate-300">
              This will permanently delete <strong>"{program.name}"</strong> ({program.days?.length || 0} workout days) for <strong>{client?.name}</strong>. If this plan was added twice by mistake, confirming will clean up the duplicate.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteCurrentPlan}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg shadow-red-900/30 flex items-center space-x-1.5"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Workout Plan'}</span>
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmDelete(false)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('switch')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition ${
              activeTab === 'switch'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🔄 Switch / Replace with Pre-Built Template</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition ${
              activeTab === 'edit'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>✏️ Edit Routine Days & Exercises Directly</span>
          </button>
        </div>

        {/* TAB 1: SWITCH WITH PRE-BUILT TEMPLATE */}
        {activeTab === 'switch' && (
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-white">Select a Verified Workout Split:</h4>
              <p className="text-slate-400 text-xs">
                Pick a template below to replace {client?.name ? `${client.name}'s` : "the client's"} current plan. You can preview exercises and apply with 1 click.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {allAvailableTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 shadow-xl'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {tpl.daysPerWeek}x / Week
                        </span>
                        <span className="text-[10px] text-slate-500">{tpl.durationWeeks} Weeks</span>
                      </div>
                      <h5 className="font-bold text-white text-sm mt-2">{tpl.name}</h5>
                      <p className="text-slate-400 text-[11px] line-clamp-2 mt-1">{tpl.description || tpl.goal}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {tpl.days?.length || 0} Workout Days
                      </span>
                      <span className={`text-xs font-bold flex items-center space-x-1 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                        <span>{isSelected ? 'Selected' : 'View'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Template Preview & Quick Apply */}
            {previewTemplate && (
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 space-y-4 animate-fade-in shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Template Preview
                      </span>
                      <h4 className="text-base font-bold text-white">{previewTemplate.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Goal: {previewTemplate.goal} • {previewTemplate.durationWeeks} Weeks • {previewTemplate.daysPerWeek}x weekly frequency
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={isApplying}
                      onClick={() => handleApplyTemplate(previewTemplate)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5"
                    >
                      {isApplying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{isApplying ? 'Applying Plan...' : `Apply This Plan to ${client?.name || 'Client'}`}</span>
                    </button>
                  </div>
                </div>

                {/* Days Breakdown in Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {previewTemplate.days?.map((d, dIdx) => (
                    <div key={dIdx} className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-white text-xs">{d.name}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">{d.exercises?.length || 0} ex</span>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">{d.focus}</p>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {d.exercises?.slice(0, 5).map((ex, exIdx) => (
                          <li key={exIdx} className="flex justify-between items-center py-0.5 border-b border-slate-800/40">
                            <span className="truncate pr-2 font-medium">{ex.name}</span>
                            <span className="text-slate-500 text-[10px] flex-shrink-0">{ex.sets}x{ex.reps}</span>
                          </li>
                        ))}
                        {(d.exercises?.length || 0) > 5 && (
                          <li className="text-[10px] text-slate-500 text-center pt-1">
                            +{d.exercises.length - 5} more exercises
                          </li>
                        )}
                      </ul>
                      {d.conditioning && (
                        <div className="flex items-center space-x-1 text-amber-400 text-[10px] pt-1">
                          <Flame className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Finisher: {d.conditioning.title || d.conditioning.format}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EDIT DAYS & EXERCISES DIRECTLY */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveCustomPlan} className="space-y-5">
            {/* Top metadata grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">Workout Plan Name</label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="e.g. 8-Week Hypertrophy & Body Recomp"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Goal Focus</label>
                <select
                  value={programGoal}
                  onChange={(e) => setProgramGoal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Strength & Muscle Gain">Strength & Muscle Gain</option>
                  <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                  <option value="Mobility & Posture Rehab">Mobility & Posture Rehab</option>
                  <option value="Endurance & Athletic Performance">Endurance & Athletic Performance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Duration (Wks)</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Days / Wk</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="text-slate-300 font-semibold block mb-1">Coach Instructions & Notes</label>
                <textarea
                  rows={2}
                  value={programNotes}
                  onChange={(e) => setProgramNotes(e.target.value)}
                  placeholder="Rest instructions, warm-up guidance, tempo cues..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            {/* Mode & Tools bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setBuilderMode('visual')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
                    builderMode === 'visual'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Visual Cards ({days.length} Days)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderMode('notepad')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition ${
                    builderMode === 'notepad'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Quick Notepad Paste</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {/* Modular presets dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPresetPicker(prev => !prev)}
                    className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Day Routine Preset</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showPresetPicker && (
                    <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                        Add Pre-Built Day Routine:
                      </div>
                      {MODULAR_DAY_PRESETS.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            loadPresetDay(preset);
                            setShowPresetPicker(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-800 transition flex flex-col group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white group-hover:text-emerald-400">{preset.name}</span>
                            <span className="text-[10px] text-emerald-400/80 font-mono">{preset.exercises.length} ex</span>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-0.5 truncate">{preset.focus}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={addDay}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Day</span>
                </button>
              </div>
            </div>

            {/* NOTEPAD FREEFORM PASTE */}
            {builderMode === 'notepad' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-xs">Quick Routine Notepad / Freeform Paste</h5>
                    <p className="text-[11px] text-slate-400">
                      Paste routine: e.g. <code>Barbell Bench Press: 4x8 (60kg) - pause at chest</code>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-xs">Append into:</span>
                    <select
                      value={activeNotepadDayIdx}
                      onChange={(e) => setActiveNotepadDayIdx(e.target.value === 'new' ? 'new' : Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                    >
                      {days.map((d, idx) => (
                        <option key={d.id} value={idx}>Day {d.dayNumber}: {d.name}</option>
                      ))}
                      <option value="new">+ Create as New Day</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={notepadText}
                  onChange={(e) => setNotepadText(e.target.value)}
                  placeholder="Barbell Bench Press: 4x8 (60kg) - pause at bottom&#10;Incline DB Press: 3x10 (22kg) - 30 deg&#10;Tricep Pushdowns: 3x15 (20kg)&#10;Finisher: 10-Min EMOM - 15 KB Swings"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleConvertNotepad(activeNotepadDayIdx)}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs rounded-xl transition shadow-md"
                  >
                    ⚡ Parse & Add Exercises
                  </button>
                </div>
              </div>
            )}

            {/* VISUAL DAYS CARDS */}
            {builderMode === 'visual' && (
              <div className="space-y-4">
                {days.map((day, dIdx) => {
                  const isExpanded = expandedDayIdx === dIdx;
                  return (
                    <div key={day.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                      {/* Day Header */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 mr-3">
                          <input
                            type="text"
                            value={day.name}
                            onChange={(e) => {
                              const updated = [...days];
                              updated[dIdx].name = e.target.value;
                              setDays(updated);
                            }}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-emerald-400 font-bold text-sm"
                            placeholder={`Day ${dIdx + 1} Name`}
                          />
                          <input
                            type="text"
                            value={day.focus}
                            onChange={(e) => {
                              const updated = [...days];
                              updated[dIdx].focus = e.target.value;
                              setDays(updated);
                            }}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300 text-xs"
                            placeholder="Focus: e.g. Quad Hypertrophy & Squat"
                          />
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setExpandedDayIdx(isExpanded ? -1 : dIdx)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            title="Toggle day expand"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeDay(dIdx)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/50 text-slate-400 hover:text-red-400 transition"
                            title="Delete Day"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Day Content when expanded */}
                      {isExpanded && (
                        <div className="space-y-3 pt-1">
                          {/* Exercises Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                                <tr>
                                  <th className="py-2 px-2">Exercise Name</th>
                                  <th className="py-2 px-2 w-20">Sets</th>
                                  <th className="py-2 px-2 w-24">Reps</th>
                                  <th className="py-2 px-2 w-28">Weight (kg)</th>
                                  <th className="py-2 px-2 w-24">Rest (s)</th>
                                  <th className="py-2 px-2">Coach Cues / Notes</th>
                                  <th className="py-2 px-2 w-10 text-center"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60">
                                {day.exercises?.map((ex, exIdx) => (
                                  <tr key={ex.id || exIdx} className="hover:bg-slate-900/40">
                                    <td className="py-2 px-2">
                                      <input
                                        type="text"
                                        value={ex.name}
                                        onChange={(e) => {
                                          const updated = [...days];
                                          updated[dIdx].exercises[exIdx].name = e.target.value;
                                          setDays(updated);
                                        }}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-medium"
                                        placeholder="Exercise name"
                                      />
                                    </td>
                                    <td className="py-2 px-2">
                                      <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={ex.sets}
                                        onChange={(e) => {
                                          const updated = [...days];
                                          const numSets = Number(e.target.value) || 1;
                                          updated[dIdx].exercises[exIdx].sets = numSets;
                                          // Keep weights array synced
                                          const prevWeights = updated[dIdx].exercises[exIdx].targetWeights || [];
                                          const base = updated[dIdx].exercises[exIdx].targetWeightKg || 0;
                                          const synced = Array(numSets).fill(0).map((_, i) => prevWeights[i] !== undefined ? prevWeights[i] : base);
                                          updated[dIdx].exercises[exIdx].targetWeights = synced;
                                          setDays(updated);
                                        }}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center font-mono"
                                      />
                                    </td>
                                    <td className="py-2 px-2">
                                      <input
                                        type="text"
                                        value={ex.reps}
                                        onChange={(e) => {
                                          const updated = [...days];
                                          updated[dIdx].exercises[exIdx].reps = e.target.value;
                                          setDays(updated);
                                        }}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center"
                                        placeholder="8-10"
                                      />
                                    </td>
                                    <td className="py-2 px-2">
                                      <input
                                        type="text"
                                        value={ex.targetWeightKg}
                                        onChange={(e) => {
                                          const updated = [...days];
                                          updated[dIdx].exercises[exIdx].targetWeightKg = e.target.value;
                                          setDays(updated);
                                        }}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-emerald-400 text-center font-mono"
                                        placeholder="60"
                                      />
                                    </td>
                                    <td className="py-2 px-2">
                                      <input
                                        type="number"
                                        step={5}
                                        value={ex.restSeconds}
                                        onChange={(e) => {
                                          const updated = [...days];
                                          updated[dIdx].exercises[exIdx].restSeconds = Number(e.target.value);
                                          setDays(updated);
                                        }}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-300 text-center font-mono"
                                        placeholder="90"
                                      />
                                    </td>
                                    <td className="py-2 px-2">
                                      <input
                                        type="text"
                                        value={ex.notes}
                                        onChange={(e) => {
                                          const updated = [...days];
                                          updated[dIdx].exercises[exIdx].notes = e.target.value;
                                          setDays(updated);
                                        }}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300"
                                        placeholder="Form cues, tempo..."
                                      />
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => removeExercise(dIdx, exIdx)}
                                        className="text-slate-500 hover:text-red-400 p-1 rounded transition"
                                        title="Delete exercise"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Add exercise button */}
                          <div className="pt-2 flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => addExercise(dIdx)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold rounded-xl text-xs flex items-center space-x-1.5 transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Exercise to Day {day.dayNumber}</span>
                            </button>

                            {day.conditioning && (
                              <div className="flex items-center space-x-1.5 text-amber-400 text-xs bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                                <Flame className="w-3.5 h-3.5" />
                                <span>Finisher: {day.conditioning.title || day.conditioning.format}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-xs">
                Total: <strong className="text-white">{days.length} workout days</strong> ({days.reduce((acc, d) => acc + (d.exercises?.length || 0), 0)} exercises)
              </span>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5"
                >
                  {isApplying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{isApplying ? 'Saving Changes...' : 'Save & Update Workout Plan'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
