import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { parseNotepadWorkout, convertWorkoutToNotepadText } from './workoutUtils';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Flame, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  Save,
  Check,
  Zap,
  Repeat,
  Info,
  FileText,
  ClipboardList,
  Copy,
  RotateCcw
} from 'lucide-react';

export function SessionWorkoutLoggerModal({
  isOpen,
  session,
  client,
  programs = [],
  readOnly = false,
  initialMode = 'notepad',
  onClose,
  onSuccess
}) {
  const { showToast } = useNotifications();
  const modalScrollRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clientPrograms, setClientPrograms] = useState(programs || []);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedDayNumber, setSelectedDayNumber] = useState(null);

  // Active Logger Mode: 'notepad' (freeform notes paste) vs 'template' (assigned day routine & interactive set table)
  const [activeMode, setActiveMode] = useState(initialMode || 'notepad');
  const [notepadText, setNotepadText] = useState('');

  // Live logged exercises state
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [finisher, setFinisher] = useState(null);
  const [finisherNotes, setFinisherNotes] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionRpe, setSessionRpe] = useState(8);
  const [isEditingExisting, setIsEditingExisting] = useState(!readOnly);

  // Swap exercise state
  const [swappingExIdx, setSwappingExIdx] = useState(null);
  const [swapName, setSwapName] = useState('');
  const [globalUnit, setGlobalUnit] = useState('kg'); // 'kg' | 'lbs'

  // Load programs if not passed
  useEffect(() => {
    if (isOpen && session) {
      const clientId = session.clientId || client?.id;
      if (clientId && (!programs || programs.length === 0)) {
        api.getPrograms(clientId)
          .then(data => {
            setClientPrograms(data || []);
            initFromSessionOrProgram(data || []);
          })
          .catch(err => {
            console.error(err);
            initFromSessionOrProgram([]);
          });
      } else {
        setClientPrograms(programs || []);
        initFromSessionOrProgram(programs || []);
      }

      // Scroll modal to top
      setTimeout(() => {
        if (modalScrollRef.current) {
          modalScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
      }, 50);
    }
  }, [isOpen, session]);

  const initFromSessionOrProgram = (availPrograms) => {
    if (!session) return;

    // 1. If session already has a workoutDone saved
    if (session.workoutDone) {
      const wd = session.workoutDone;
      setWorkoutName(wd.dayName || wd.workoutName || 'Completed Workout');
      setSelectedProgramId(wd.programId || (availPrograms[0]?.id || ''));
      setSelectedDayNumber(wd.dayNumber || 1);
      setSessionNotes(wd.sessionNotes || session.notes || '');
      setSessionRpe(wd.rpe || 8);
      setFinisher(wd.finisher || null);
      setFinisherNotes(wd.finisherNotes || (wd.finisher?.notes || ''));

      const hasLbs = wd.weightUnit === 'lbs' || (wd.exercises || []).some(ex => (ex.sets || []).some(s => s.weightUnit === 'lbs'));
      setGlobalUnit(hasLbs ? 'lbs' : (wd.weightUnit || 'kg'));

      const loadedExs = (wd.exercises || []).map((ex, exIdx) => ({
        id: ex.id || `ex-${exIdx}-${Date.now()}`,
        name: ex.name || 'Exercise',
        prescribedText: ex.prescribedText || '',
        notes: ex.notes || '',
        alternative: ex.alternative || '',
        sets: (ex.sets || []).map((s, sIdx) => ({
          setNum: s.setNum || sIdx + 1,
          weightKg: s.weight !== undefined && s.weight !== null ? s.weight : (s.weightKg !== undefined ? s.weightKg : (s.targetWeightKg || 50)),
          weightUnit: s.weightUnit || (hasLbs ? 'lbs' : (wd.weightUnit || 'kg')),
          reps: s.reps !== undefined ? s.reps : (s.targetReps || ''),
          seconds: s.seconds !== undefined ? s.seconds : (s.durationSeconds || ''),
          completed: s.completed !== undefined ? s.completed : true
        }))
      }));

      setExercises(loadedExs);
      setIsEditingExisting(!readOnly);
      setActiveMode('template');
      setNotepadText(convertWorkoutToNotepadText(wd));
      return;
    }

    // 2. Otherwise initialize from client's active program
    const activeProg = availPrograms.find(p => p.status === 'active') || availPrograms[0];
    if (activeProg) {
      setSelectedProgramId(activeProg.id);
      // Auto-select Day 1 by default without toast
      if (activeProg.days && activeProg.days.length > 0) {
        selectProgramDay(activeProg, activeProg.days[0], false);
      }
    } else {
      // Blank starter
      setWorkoutName('Studio Coaching Session Workout');
      setExercises([createBlankExercise(1)]);
    }

    setSessionNotes(session.notes || '');
    setIsEditingExisting(!readOnly);
    setActiveMode(initialMode || 'notepad');
  };

  const createBlankExercise = (num = 1) => ({
    id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: `Exercise ${num}`,
    prescribedText: '3 sets × 10 reps',
    notes: '',
    alternative: '',
    sets: [
      { setNum: 1, weightKg: globalUnit === 'lbs' ? 100 : 50, weightUnit: globalUnit || 'kg', reps: 10, seconds: '', completed: true },
      { setNum: 2, weightKg: globalUnit === 'lbs' ? 100 : 50, weightUnit: globalUnit || 'kg', reps: 10, seconds: '', completed: true },
      { setNum: 3, weightKg: globalUnit === 'lbs' ? 100 : 50, weightUnit: globalUnit || 'kg', reps: 10, seconds: '', completed: true }
    ]
  });

  const selectProgramDay = (prog, day, showNotification = true) => {
    setSelectedDayNumber(day.dayNumber);
    setWorkoutName(`${day.name || `Day ${day.dayNumber}`} (${day.focus || prog.name})`);
    setFinisher(day.conditioning || null);
    setFinisherNotes(day.conditioning?.description || '');

    const loadedExs = (day.exercises || []).map((ex, exIdx) => {
      const numSets = Number(ex.sets) || 3;
      const repStr = String(ex.reps || '');
      const timeMatch = repStr.toLowerCase().match(/(\d+)\s*(?:s|sec|secs|seconds)\b/);
      const parsedSeconds = timeMatch ? parseInt(timeMatch[1], 10) : (ex.seconds || '');
      const parsedReps = timeMatch ? '' : (parseInt(repStr.replace(/[^0-9]/g, '')) || 10);
      const targetWeight = Number(ex.targetWeightKg) || (Array.isArray(ex.targetWeights) ? Number(ex.targetWeights[0]) : 50) || 50;
      
      const sets = Array.from({ length: numSets }).map((_, sIdx) => {
        let setWeight = targetWeight;
        if (Array.isArray(ex.targetWeights) && ex.targetWeights[sIdx] !== undefined) {
          setWeight = Number(ex.targetWeights[sIdx]) || targetWeight;
        }
        return {
          setNum: sIdx + 1,
          weightKg: setWeight,
          weightUnit: globalUnit || 'kg',
          reps: parsedReps,
          seconds: parsedSeconds,
          completed: true
        };
      });

      return {
        id: ex.id || `ex-${exIdx}-${Date.now()}`,
        name: ex.name,
        prescribedText: `${numSets} sets × ${ex.reps || '10'} reps @ ${targetWeight} kg • Rest ${ex.restSeconds || 90}s`,
        notes: ex.notes || '',
        alternative: ex.alternative || '',
        sets
      };
    });

    setExercises(loadedExs.length > 0 ? loadedExs : [createBlankExercise(1)]);
    if (showNotification) {
      showToast(`Loaded ${day.name || `Day ${day.dayNumber}`} (${loadedExs.length} exercises)`);
    }
  };

  const handleDayButtonClick = (day) => {
    const activeProg = clientPrograms.find(p => p.id === selectedProgramId) || clientPrograms[0];
    if (activeProg) {
      selectProgramDay(activeProg, day, true);
    }
  };

  // Set-level updates
  const handleSetChange = (exIdx, sIdx, field, value) => {
    const updated = [...exercises];
    updated[exIdx].sets[sIdx][field] = value;
    setExercises(updated);
  };

  const toggleSetComplete = (exIdx, sIdx) => {
    const updated = [...exercises];
    updated[exIdx].sets[sIdx].completed = !updated[exIdx].sets[sIdx].completed;
    setExercises(updated);
  };

  const addSet = (exIdx) => {
    const updated = [...exercises];
    const curSets = updated[exIdx].sets;
    const lastSet = curSets[curSets.length - 1];
    curSets.push({
      setNum: curSets.length + 1,
      weightKg: lastSet ? lastSet.weightKg : (globalUnit === 'lbs' ? 100 : 50),
      weightUnit: lastSet ? (lastSet.weightUnit || globalUnit) : globalUnit,
      reps: lastSet ? lastSet.reps : 10,
      seconds: lastSet ? (lastSet.seconds || '') : '',
      completed: true
    });
    setExercises(updated);
  };

  // Unit toggle handlers: pounds (lbs) along with kgs
  const handleGlobalUnitChange = (newUnit) => {
    setGlobalUnit(newUnit);
    const updated = exercises.map(ex => ({
      ...ex,
      sets: (ex.sets || []).map(s => ({
        ...s,
        weightUnit: newUnit
      }))
    }));
    setExercises(updated);
    showToast(`Tracking weights in ${newUnit.toUpperCase()}`);
  };

  const toggleSetUnit = (exIdx, sIdx) => {
    const updated = [...exercises];
    const currentUnit = updated[exIdx].sets[sIdx].weightUnit || globalUnit || 'kg';
    const nextUnit = currentUnit === 'kg' ? 'lbs' : 'kg';
    updated[exIdx].sets[sIdx].weightUnit = nextUnit;
    setExercises(updated);
  };

  const toggleExerciseUnit = (exIdx) => {
    const updated = [...exercises];
    const currentUnit = updated[exIdx].sets[0]?.weightUnit || globalUnit || 'kg';
    const nextUnit = currentUnit === 'kg' ? 'lbs' : 'kg';
    updated[exIdx].sets.forEach(s => {
      s.weightUnit = nextUnit;
    });
    setExercises(updated);
    showToast(`Switched ${updated[exIdx].name} sets to ${nextUnit.toUpperCase()}`);
  };

  const removeSet = (exIdx, sIdx) => {
    const updated = [...exercises];
    if (updated[exIdx].sets.length <= 1) {
      showToast('Exercise must have at least 1 set', 'error');
      return;
    }
    updated[exIdx].sets.splice(sIdx, 1);
    updated[exIdx].sets.forEach((s, idx) => { s.setNum = idx + 1; });
    setExercises(updated);
  };

  // Exercise additions and deletions
  const addExercise = () => {
    setExercises([...exercises, createBlankExercise(exercises.length + 1)]);
  };

  const removeExercise = (exIdx) => {
    if (exercises.length <= 1) {
      showToast('Session must have at least 1 exercise', 'error');
      return;
    }
    const updated = exercises.filter((_, idx) => idx !== exIdx);
    setExercises(updated);
  };

  // Movement substitution / swap
  const handleConfirmSwap = (exIdx) => {
    if (!swapName.trim()) return;
    const updated = [...exercises];
    const prevName = updated[exIdx].name;
    updated[exIdx].name = swapName.trim();
    const swapNote = `Swapped from "${prevName}" to "${swapName.trim()}"`;
    updated[exIdx].notes = updated[exIdx].notes ? `${updated[exIdx].notes} | ${swapNote}` : swapNote;
    setExercises(updated);
    setSwappingExIdx(null);
    setSwapName('');
    showToast(`Movement swapped to "${swapName.trim()}"`);
  };

  // Dynamic Volume Calculator (normalizes lbs to kg so volume is consistent)
  const totalVolumeKg = exercises.reduce((sum, ex) => {
    return sum + (ex.sets || []).reduce((sSum, s) => {
      if (!s.completed) return sSum;
      const reps = Number(s.reps) || 0;
      const rawWeight = Number(s.weightKg) || 0;
      const unit = s.weightUnit || globalUnit || 'kg';
      const weightInKg = unit === 'lbs' ? (rawWeight / 2.20462) : rawWeight;
      return sSum + (weightInKg * reps);
    }, 0);
  }, 0);

  const totalVolumeLbs = Math.round(totalVolumeKg * 2.20462);

  const completedSetsCount = exercises.reduce((sum, ex) => {
    return sum + (ex.sets || []).filter(s => s.completed).length;
  }, 0);

  const totalSetsCount = exercises.reduce((sum, ex) => sum + (ex.sets || []).length, 0);

  // Save & Complete or Draft Handler
  const handleSaveSessionWorkout = async (shouldComplete = true, overrideData = null) => {
    if (!session) return;
    const currentExercises = overrideData?.exercises || exercises;
    if (!currentExercises || currentExercises.length === 0) {
      showToast('Please add at least one exercise', 'error');
      return;
    }

    try {
      setSaving(true);
      const activeProg = clientPrograms.find(p => p.id === selectedProgramId);

      const calculatedVolumeKg = currentExercises.reduce((sum, ex) => {
        return sum + (ex.sets || []).reduce((sSum, s) => {
          if (!s.completed) return sSum;
          const reps = Number(s.reps) || 0;
          const rawWeight = Number(s.weightKg) || 0;
          const unit = s.weightUnit || globalUnit || 'kg';
          const weightInKg = unit === 'lbs' ? (rawWeight / 2.20462) : rawWeight;
          return sSum + (weightInKg * reps);
        }, 0);
      }, 0);

      const saveFinisher = overrideData ? overrideData.finisher : finisher;
      const saveFinisherNotes = overrideData ? (overrideData.finisher?.notes || overrideData.finisher?.description || '') : finisherNotes;
      const saveSessionNotes = (overrideData?.sessionNotes !== undefined ? overrideData.sessionNotes : sessionNotes).trim();
      const saveRpe = Number(overrideData?.rpe || sessionRpe) || 8;
      const saveWorkoutName = overrideData?.workoutName || workoutName || 'Studio Coaching Session Workout';

      const workoutDonePayload = {
        programId: selectedProgramId || null,
        programName: activeProg ? activeProg.name : 'Custom Program',
        dayNumber: selectedDayNumber || 1,
        dayName: saveWorkoutName,
        weightUnit: globalUnit,
        focus: activeProg?.days?.find(d => d.dayNumber === selectedDayNumber)?.focus || '',
        exercises: currentExercises.map((ex, idx) => ({
          id: ex.id || `ex-${idx}`,
          name: ex.name,
          prescribedText: ex.prescribedText || '',
          alternative: ex.alternative || '',
          notes: (ex.notes || '').trim(),
          sets: ex.sets.map(s => {
            const rawWeight = Number(s.weightKg) || 0;
            const unit = s.weightUnit || globalUnit || 'kg';
            const normKg = unit === 'lbs' ? Number((rawWeight / 2.20462).toFixed(1)) : rawWeight;
            return {
              setNum: s.setNum,
              weight: rawWeight,
              weightKg: normKg,
              weightUnit: unit,
              reps: s.reps !== '' && s.reps !== null && !isNaN(Number(s.reps)) ? Number(s.reps) : 0,
              seconds: s.seconds !== '' && s.seconds !== null && !isNaN(Number(s.seconds)) ? Number(s.seconds) : 0,
              completed: !!s.completed
            };
          })
        })),
        finisher: saveFinisher ? {
          title: saveFinisher.title || saveFinisher.format || 'Conditioning Finisher',
          description: saveFinisher.description || '',
          notes: saveFinisherNotes.trim()
        } : null,
        sessionNotes: saveSessionNotes,
        rpe: saveRpe,
        totalVolumeKg: Math.round(calculatedVolumeKg),
        totalVolumeLbs: Math.round(calculatedVolumeKg * 2.20462),
        completedAt: new Date().toISOString()
      };

      const sessionUpdates = {
        workoutDone: workoutDonePayload,
        notes: saveSessionNotes || session.notes
      };

      if (shouldComplete) {
        sessionUpdates.status = 'completed';
      }

      const updatedSession = await api.updateSession(session.id, sessionUpdates);

      if (shouldComplete) {
        showToast(`✓ Session completed & workout logged! ${calculatedVolume.toLocaleString()} kg total volume recorded.`);
      } else {
        showToast('Workout progress draft saved!');
      }

      if (onSuccess) onSuccess(updatedSession);
      onClose();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save workout session', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Convert notepad text into live exercises and review/complete
  const handleConvertNotepadToWorkout = (shouldCompleteImmediately = false) => {
    if (!notepadText || !notepadText.trim()) {
      showToast('Please type or paste your workout notes first', 'error');
      return;
    }

    const parsed = parseNotepadWorkout(notepadText);
    if (!parsed.exercises || parsed.exercises.length === 0) {
      showToast('Could not find any exercises in the notes. Check format tips below.', 'error');
      return;
    }

    setWorkoutName(parsed.workoutName || workoutName || 'Studio Workout Log');
    setExercises(parsed.exercises);
    if (parsed.finisher) {
      setFinisher(parsed.finisher);
      setFinisherNotes(parsed.finisher.notes || parsed.finisher.description || '');
    }
    if (parsed.sessionNotes) {
      setSessionNotes(parsed.sessionNotes);
    }
    if (parsed.rpe) {
      setSessionRpe(parsed.rpe);
    }

    if (shouldCompleteImmediately) {
      handleSaveSessionWorkout(true, parsed);
    } else {
      setActiveMode('template');
      showToast(`✓ Converted ${parsed.exercises.length} movements into workout log! Review sets below.`);
    }
  };

  if (!isOpen || !session) return null;

  const activeProg = clientPrograms.find(p => p.id === selectedProgramId) || clientPrograms[0];
  const programDays = activeProg?.days || [];
  const clientName = client?.name || session.clientName || 'Client';

  return (
    <div 
      ref={modalScrollRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start animate-fade-in"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 max-w-4xl w-full shadow-2xl my-4 sm:my-8 space-y-6 text-xs text-slate-200">
        
        {/* MODAL HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Live Coaching Session & Workout Logger
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  session.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                }`}>
                  {session.status === 'completed' ? '✓ Completed' : '● In Session'}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5 flex items-center space-x-2 flex-wrap">
                <span>Client: <strong className="text-white">{clientName}</strong></span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>{session.date}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{session.time}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{session.location || 'Studio'}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {readOnly && (
              <button
                type="button"
                onClick={() => setIsEditingExisting(!isEditingExisting)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition flex items-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isEditingExisting ? 'View Only' : 'Edit Logged Weights'}</span>
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

        {/* MODE SELECTION TABS: NOTEPAD vs TEMPLATE */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMode('notepad')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
              activeMode === 'notepad'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📝 Quick Notes Style Pad (Copy-Paste)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('template')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
              activeMode === 'template'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>📋 Assigned Day Routine Template & Sets</span>
          </button>
        </div>

        {/* NOTEPAD MODE CONTENT */}
        {activeMode === 'notepad' && (
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 animate-fade-in shadow-xl">
            {/* Notepad Header / Quick Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-850 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Notes Style Workout Log
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Smart Converter
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">
                  Copy-paste freeform notes directly from your phone (Apple Notes, Keep, WhatsApp), then convert to a workout log.
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                {activeProg && activeProg.days?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const dayToUse = activeProg.days.find(d => d.dayNumber === selectedDayNumber) || activeProg.days[0];
                      const text = convertWorkoutToNotepadText(dayToUse);
                      setNotepadText(text);
                      showToast(`Loaded ${dayToUse.name || 'Day Plan'} into notepad`);
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                    title="Load client's assigned day plan routine into text to tweak"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Load Assigned Day Plan</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setNotepadText(
`Incline DB Press 22kg 12, 10, 10
Lat Pulldown 55kg 12, 12, 10 - strict squeeze
Goblet Squat 24kg 15, 12, 12
Finisher: 10 mins Row 500m intervals
Notes: Client pushed hard on incline bench, great shoulder control.
RPE: 8`
                    );
                    showToast('Sample workout notes loaded!');
                  }}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Paste Sample</span>
                </button>

                {notepadText && (
                  <button
                    type="button"
                    onClick={() => setNotepadText('')}
                    className="px-2.5 py-1 text-slate-400 hover:text-red-400 rounded-xl text-xs transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                rows={11}
                value={notepadText}
                onChange={(e) => setNotepadText(e.target.value)}
                placeholder={`Paste your workout notes here, e.g.:

Incline DB Press 22kg 12, 10, 10
Lat Pulldown 55kg 12, 12, 10 - strict squeeze
Goblet Squat 24kg 15, 12, 12
Finisher: 10 mins Row 500m intervals
Notes: Client pushed hard on incline bench, great shoulder control.
RPE: 8`}
                className="w-full bg-slate-900/95 border-2 border-slate-750 focus:border-emerald-500 text-slate-100 placeholder:text-slate-500 font-mono text-xs sm:text-[13px] rounded-2xl p-4 leading-relaxed outline-none transition shadow-inner"
              />
            </div>

            {/* Primary Convert Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Click <strong>Convert</strong> to parse into sets table & review volume.</span>
              </div>

              <div className="flex items-center space-x-2.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleConvertNotepadToWorkout(false)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>✨ Convert to Workout Log & Review Sets</span>
                </button>

                {session.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => handleConvertNotepadToWorkout(true)}
                    disabled={saving}
                    className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
                    title="Convert notes and mark session completed in 1 tap"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <Zap className="w-4 h-4 text-slate-950" />
                    )}
                    <span>⚡ Convert & Complete Now</span>
                  </button>
                )}
              </div>
            </div>

            {/* Format Help Guide */}
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block text-xs">💡 Supported Note Formats:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-slate-400 pt-0.5">
                <div>• <strong className="text-white">Comma sets:</strong> <code>Incline DB 22kg 12, 10, 10</code></div>
                <div>• <strong className="text-white">Variable weight:</strong> <code>Bench 60kg x 10, 65kg x 8</code></div>
                <div>• <strong className="text-white">Standard sets:</strong> <code>Squats 80kg 3x10</code> or <code>3x8 BW</code></div>
                <div>• <strong className="text-white">Notes & Cues:</strong> <code>Lat Pulldown 55kg 3x10 - strict squeeze</code></div>
                <div>• <strong className="text-white">Finisher:</strong> <code>Finisher: 10 mins Row 500m intervals</code></div>
                <div>• <strong className="text-white">Feedback:</strong> <code>Notes: Client hit PR on bench! RPE: 8</code></div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: SELECT WORKOUT TEMPLATE DAY (TEMPLATE MODE) */}
        {activeMode === 'template' && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Step 1: Choose Routine for Today's Session
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {activeProg ? activeProg.name : 'No Workout Plan Assigned'}
                </h4>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const currentData = {
                      workoutName,
                      exercises,
                      finisher,
                      sessionNotes,
                      rpe: sessionRpe
                    };
                    setNotepadText(convertWorkoutToNotepadText(currentData));
                    setActiveMode('notepad');
                  }}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1 transition"
                  title="Edit current exercises in text notepad"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Edit in Notepad</span>
                </button>

                {clientPrograms.length > 1 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-xs">Program:</span>
                    <select
                      value={selectedProgramId}
                      onChange={(e) => {
                        setSelectedProgramId(e.target.value);
                        const chosen = clientPrograms.find(p => p.id === e.target.value);
                        if (chosen && chosen.days && chosen.days.length > 0) {
                          selectProgramDay(chosen, chosen.days[0]);
                        }
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-white text-xs"
                    >
                      {clientPrograms.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Day selection buttons */}
            {programDays.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400">Select which day was performed:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {programDays.map((day) => {
                    const isSelected = selectedDayNumber === day.dayNumber;
                    return (
                      <button
                        key={day.id || day.dayNumber}
                        type="button"
                        onClick={() => handleDayButtonClick(day)}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">Day {day.dayNumber}</span>
                            <span className="text-[10px] text-emerald-400 font-mono">{day.exercises?.length || 0} ex</span>
                          </div>
                          <p className="text-[11px] font-medium text-emerald-300/90 truncate mt-0.5">{day.name}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{day.focus}</p>
                        </div>
                        {isSelected && (
                          <div className="flex items-center space-x-1 text-emerald-400 text-[10px] font-bold mt-2 pt-1 border-t border-emerald-500/20">
                            <Check className="w-3 h-3" />
                            <span>Active Log</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-3 text-slate-400 text-xs">
                <p>No periodized days found in client's program. You can log exercises freely below.</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: LIVE EXERCISE LOGGING TABLE */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Step 2: Log Weights, Reps & Adjustments
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="bg-transparent border-b border-slate-700 focus:border-emerald-500 text-white font-bold text-sm outline-none px-1 py-0.5 w-72 sm:w-96"
                  placeholder="Workout routine name..."
                />
              </div>
            </div>

            {/* Live Volume & Sets summary */}
            <div className="flex items-center space-x-3 text-xs flex-wrap gap-y-2">
              {/* Unit Toggle: KG vs LBS */}
              <div className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl flex items-center space-x-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold pr-0.5">Unit:</span>
                <button
                  type="button"
                  onClick={() => handleGlobalUnitChange('kg')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                    globalUnit === 'kg'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Track weights in Kilograms (kg)"
                >
                  KG
                </button>
                <button
                  type="button"
                  onClick={() => handleGlobalUnitChange('lbs')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                    globalUnit === 'lbs'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Track weights in Pounds (lbs)"
                >
                  LBS
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Sets Done</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">
                  {completedSetsCount} / {totalSetsCount}
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Volume</span>
                <span className="text-white font-bold font-mono text-sm">
                  {totalVolumeKg.toLocaleString()} kg
                  <span className="text-slate-400 text-[11px] font-normal ml-1">
                    ({totalVolumeLbs.toLocaleString()} lbs)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Exercise cards list */}
          <div className="space-y-4">
            {exercises.map((ex, exIdx) => (
              <div 
                key={ex.id || exIdx}
                className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-3 shadow-md"
              >
                {/* Exercise Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] inline-flex items-center justify-center">
                        {exIdx + 1}
                      </span>
                      <h4 className="font-bold text-white text-sm">{ex.name}</h4>
                      {ex.alternative && (
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                          Alt: {ex.alternative}
                        </span>
                      )}
                    </div>
                    {ex.prescribedText && (
                      <p className="text-[11px] text-slate-400 italic pl-7">
                        {ex.prescribedText}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 self-end sm:self-auto flex-wrap">
                    {/* All sets unit quick toggle for this exercise */}
                    <button
                      type="button"
                      onClick={() => toggleExerciseUnit(exIdx)}
                      title={`Click to switch all sets in ${ex.name} to ${(ex.sets?.[0]?.weightUnit || globalUnit || 'kg') === 'kg' ? 'LBS' : 'KG'}`}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1 transition"
                    >
                      <span className="text-slate-500 font-normal text-[10px]">All:</span>
                      <span className={`font-bold ${(ex.sets?.[0]?.weightUnit || globalUnit || 'kg') === 'lbs' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {(ex.sets?.[0]?.weightUnit || globalUnit || 'kg').toUpperCase()}
                      </span>
                    </button>

                    {/* Swap movement button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSwappingExIdx(swappingExIdx === exIdx ? null : exIdx);
                        setSwapName(ex.alternative || '');
                      }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1 transition"
                      title="Swap this exercise if client couldn't perform or machine was occupied"
                    >
                      <Repeat className="w-3 h-3" />
                      <span>Swap Movement</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeExercise(exIdx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900 transition"
                      title="Remove exercise"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Swap Movement Inline Form */}
                {swappingExIdx === exIdx && (
                  <div className="p-3 bg-cyan-950/30 border border-cyan-500/40 rounded-xl space-y-2 animate-fade-in">
                    <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>Swap "{ex.name}" with another exercise:</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={swapName}
                        onChange={(e) => setSwapName(e.target.value)}
                        placeholder="e.g. Dumbbell Bench Press / Goblet Squat / Leg Press"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleConfirmSwap(exIdx)}
                        className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
                      >
                        Confirm Swap
                      </button>
                      <button
                        type="button"
                        onClick={() => setSwappingExIdx(null)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Sets Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3 w-16 text-center">Set</th>
                        <th className="py-2 px-3 w-32 text-center">Weight</th>
                        <th className="py-2 px-3 text-center">Reps / Seconds</th>
                        <th className="py-2 px-3 w-24 text-center">Done?</th>
                        <th className="py-2 px-3 text-right w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {ex.sets.map((set, sIdx) => (
                        <tr 
                          key={sIdx} 
                          className={`transition ${set.completed ? 'bg-emerald-950/20' : 'hover:bg-slate-900/40'}`}
                        >
                          <td className="py-2 px-3 text-center font-bold text-slate-300">
                            Set {set.setNum}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="inline-flex items-center space-x-1 justify-center">
                              <input
                                type="number"
                                step="any"
                                value={set.weightKg}
                                onChange={(e) => handleSetChange(exIdx, sIdx, 'weightKg', e.target.value)}
                                className="w-16 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-2 py-1 text-center font-mono font-bold text-emerald-400 text-xs outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => toggleSetUnit(exIdx, sIdx)}
                                title="Click to toggle between kg and lbs for this set"
                                className={`px-1.5 py-0.5 rounded font-extrabold text-[10px] uppercase transition cursor-pointer shadow-sm ${
                                  (set.weightUnit || globalUnit || 'kg') === 'lbs'
                                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                }`}
                              >
                                {set.weightUnit || globalUnit || 'kg'}
                              </button>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="inline-flex items-center space-x-1.5 justify-center">
                              <div className="flex items-center space-x-1" title="Repetitions">
                                <input
                                  type="number"
                                  value={set.reps !== undefined && set.reps !== null ? set.reps : ''}
                                  onChange={(e) => handleSetChange(exIdx, sIdx, 'reps', e.target.value)}
                                  placeholder="0"
                                  className="w-14 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-1.5 py-1 text-center font-bold text-white text-xs outline-none"
                                />
                                <span className="text-slate-400 text-[10px]">reps</span>
                              </div>
                              <span className="text-slate-600 font-bold text-xs">•</span>
                              <div className="flex items-center space-x-1" title="Hold time / duration in seconds">
                                <input
                                  type="number"
                                  value={set.seconds !== undefined && set.seconds !== null ? set.seconds : ''}
                                  onChange={(e) => handleSetChange(exIdx, sIdx, 'seconds', e.target.value)}
                                  placeholder="0"
                                  className="w-14 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg px-1.5 py-1 text-center font-bold text-cyan-300 text-xs outline-none"
                                />
                                <span className="text-cyan-400 text-[10px]">sec</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => toggleSetComplete(exIdx, sIdx)}
                              className={`px-3 py-1 rounded-lg font-bold text-xs inline-flex items-center space-x-1 transition shadow-sm ${
                                set.completed
                                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{set.completed ? 'Done' : 'Skip'}</span>
                            </button>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeSet(exIdx, sIdx)}
                              className="text-slate-500 hover:text-red-400 p-1 rounded transition"
                              title="Delete set"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Set & Movement Form Cues Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => addSet(exIdx)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Set to {ex.name}</span>
                  </button>

                  <div className="flex-1 sm:max-w-md">
                    <input
                      type="text"
                      value={ex.notes}
                      onChange={(e) => {
                        const updated = [...exercises];
                        updated[exIdx].notes = e.target.value;
                        setExercises(updated);
                      }}
                      placeholder="Movement cues / changes (e.g. slight elbow flare, paused 1s at bottom)..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-xl px-3 py-1 text-[11px] text-slate-300 placeholder:text-slate-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add another movement button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={addExercise}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-bold rounded-2xl text-xs flex items-center space-x-2 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Another Exercise Movement to Today's Session</span>
            </button>
          </div>
        </div>

        {/* STEP 3: FINISHER / CONDITIONING ROUTINE */}
        {finisher && (
          <div className="bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold text-xs flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Conditioning Finisher: {finisher.title || finisher.format}</span>
              </span>
              <span className="text-[10px] text-slate-400">{finisher.duration || 'Finisher'}</span>
            </div>
            <p className="text-slate-300 text-xs whitespace-pre-line leading-relaxed">
              {finisher.description}
            </p>
            <div className="pt-1">
              <input
                type="text"
                value={finisherNotes}
                onChange={(e) => setFinisherNotes(e.target.value)}
                placeholder="Log finisher performance (e.g. Completed all 5 rounds in 9:45, client hit 80 RPM)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 placeholder:text-slate-500 outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* STEP 4: COACH NOTES & SESSION RATING */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 font-semibold block text-xs">
              Coach Pushkar's Session Summary & Client Feedback
            </label>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">RPE / Intensity:</span>
              {[6, 7, 8, 9, 10].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSessionRpe(val)}
                  className={`w-6 h-6 rounded-lg font-bold text-[11px] transition ${
                    sessionRpe === val
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Document client progress, PRs hit today, posture/tempo notes, and recovery reminders..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus:border-emerald-500"
          />
        </div>

        {/* STEP 5: BOTTOM ACTION BAR */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>
              Saving will log this workout to <strong className="text-white">{clientName}'s</strong> timeline, update adherence, and deduct 1 session credit.
            </span>
          </div>

          <div className="flex items-center space-x-2.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl transition text-xs"
            >
              Cancel
            </button>

            {session.status !== 'completed' && (
              <button
                type="button"
                onClick={() => handleSaveSessionWorkout(false)}
                disabled={saving}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-bold rounded-xl transition text-xs flex items-center space-x-1.5 shadow-sm"
                title="Save logged weights and notes without marking completed yet"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSaveSessionWorkout(true)}
              disabled={saving}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 text-xs flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>
                {saving
                  ? 'Saving Workout...'
                  : session.status === 'completed'
                  ? '✓ Update Completed Session Log'
                  : '✓ Save Workout & Complete Session'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
