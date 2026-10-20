import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { QuickConditioningModal } from './QuickConditioningModal';
import { MODULAR_DAY_PRESETS, parseNotepadText } from './workoutUtils';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Copy, 
  Edit3,
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Clock, 
  Sparkles,
  Layers,
  FileCheck,
  Flame,
  Zap,
  CheckCircle2,
  FileText
} from 'lucide-react';

export function WorkoutManager({ onSelectClient }) {
  const { showToast } = useNotifications();
  const [programs, setPrograms] = useState([]);
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Conditioning Modal state
  const [showConditioningModal, setShowConditioningModal] = useState(false);
  const [conditioningProgram, setConditioningProgram] = useState(null);

  // Create / Edit program modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [programName, setProgramName] = useState('');
  const [programGoal, setProgramGoal] = useState('Strength & Muscle Gain');
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [programNotes, setProgramNotes] = useState('');

  // Flexible Workout Builder states
  const [builderMode, setBuilderMode] = useState('visual'); // 'visual' | 'notepad'
  const [notepadText, setNotepadText] = useState('');
  const [activeNotepadDayIdx, setActiveNotepadDayIdx] = useState('new');
  const [expandedDetails, setExpandedDetails] = useState({}); // { [exId]: boolean }
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Workout days for new program
  const [days, setDays] = useState([
    {
      id: 'd1',
      dayNumber: 1,
      name: 'Day 1 — Lower Body Focus',
      focus: 'Squat mechanics and quad hypertrophy',
      exercises: [
        {
          id: 'ex1',
          name: 'Barbell Back Squat',
          videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
          sets: 4,
          reps: '8-10',
          targetWeightKg: 60,
          rpe: 8,
          restSeconds: 90,
          tempo: '3-0-1-0',
          notes: 'Maintain neutral spine, push knees outward',
          alternative: 'Goblet Squat'
        }
      ]
    }
  ]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [progs, cls, tpls] = await Promise.all([
        api.getPrograms(),
        api.getClients(),
        api.getTemplates('program')
      ]);
      setPrograms(progs || []);
      setClients(cls || []);
      setTemplates(tpls || []);
      if (cls && cls.length > 0) setSelectedClientId(cls[0].id);
    } catch (err) {
      console.error(err);
      showToast('Failed to load programs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const addDay = () => {
    const nextNum = days.length + 1;
    setDays([
      ...days,
      {
        id: `d-${Date.now()}`,
        dayNumber: nextNum,
        name: `Day ${nextNum} — Upper Body`,
        focus: 'Compound push and pull',
        exercises: [
          {
            id: `ex-${Date.now()}`,
            name: 'Barbell Bench Press',
            videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
            sets: 4,
            reps: '8',
            targetWeightKg: 50,
            rpe: 8,
            restSeconds: 90,
            tempo: '2-1-1-0',
            notes: 'Touch chest, squeeze triceps at top',
            alternative: 'Dumbbell Press'
          }
        ]
      }
    ]);
  };

  const addExercise = (dayIdx) => {
    const updated = [...days];
    updated[dayIdx].exercises.push({
      id: `ex-${Date.now()}-${Math.random()}`,
      name: 'Romanian Deadlift',
      videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
      sets: 3,
      reps: '10',
      targetWeightKg: 40,
      targetWeights: [40, 40, 40],
      isDifferentWeights: false,
      rpe: 8,
      restSeconds: 75,
      tempo: '3-1-1-0',
      notes: 'Hinge hips backward, keep spine flat',
      alternative: 'Dumbbell RDL'
    });
    setDays(updated);
  };

  const removeExercise = (dayIdx, exIdx) => {
    const updated = [...days];
    updated[dayIdx].exercises.splice(exIdx, 1);
    setDays(updated);
  };

  const toggleDetails = (exId) => {
    setExpandedDetails(prev => ({ ...prev, [exId]: !prev[exId] }));
  };

  const loadPresetDay = (preset) => {
    const nextNum = days.length + 1;
    const newDay = {
      id: `d-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      dayNumber: nextNum,
      name: `Day ${nextNum} — ${preset.name}`,
      focus: preset.focus,
      conditioning: preset.conditioning || null,
      exercises: (preset.exercises || []).map(ex => {
        const numSets = Number(ex.sets) || 3;
        const targetWeights = Array(numSets).fill(ex.targetWeightKg || '60');
        return {
          id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: ex.name,
          sets: numSets,
          reps: String(ex.reps || '10'),
          targetWeightKg: ex.targetWeightKg || '60',
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

    if (days.length === 1 && days[0].exercises?.length === 1 && days[0].exercises[0].name === 'Barbell Back Squat' && !editingProgramId) {
      setDays([{ ...newDay, dayNumber: 1, name: `Day 1 — ${preset.name}` }]);
    } else {
      setDays([...days, newDay]);
    }
    showToast(`Loaded "${preset.name}" preset (${preset.exercises.length} exercises)!`);
  };

  const handleConvertNotepad = (targetDayIdx) => {
    if (!notepadText.trim()) {
      showToast('Please enter or paste your workout routine first', 'error');
      return;
    }

    const { exercises: parsedExs, conditioning: parsedCond } = parseNotepadText(notepadText);

    if (parsedExs.length === 0 && !parsedCond) {
      showToast('Could not parse exercises. Try format: "Bench Press: 3x10 (60kg) - notes"', 'error');
      return;
    }

    const updated = [...days];
    if (targetDayIdx === 'new' || targetDayIdx >= updated.length) {
      const nextNum = updated.length + 1;
      updated.push({
        id: `d-${Date.now()}`,
        dayNumber: nextNum,
        name: `Day ${nextNum} — Custom Routine`,
        focus: 'Parsed from quick notepad',
        exercises: parsedExs,
        conditioning: parsedCond || null
      });
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
    showToast(`⚡ Generated ${parsedExs.length} exercises${parsedCond ? ' + 1 conditioning finisher' : ''}!`);
  };

  const handleLoadSampleNotepad = () => {
    setNotepadText(
`Barbell Bench Press: 4x8 (60kg) - Retract scapulae, pause at chest
Incline Dumbbell Press: 3x10-12 (22kg) - 30 degree bench
Dumbbell Lateral Raises: 3x15 (8kg) - Slow eccentric, no swinging
Tricep Rope Pushdowns: 3x12 (20kg) - Flared ropes at bottom
Finisher: 10-Min EMOM - Min 1: 15 KB Swings (24kg), Min 2: 12 Burpees`
    );
  };

  const handleOpenEditProgram = (prog) => {
    setEditingProgramId(prog.id);
    setSelectedClientId(prog.clientId || (clients[0]?.id || ''));
    setProgramName(prog.name || '');
    setProgramGoal(prog.goal || 'Strength & Muscle Gain');
    setDurationWeeks(prog.durationWeeks || 8);
    setDaysPerWeek(prog.daysPerWeek || 4);
    setProgramNotes(prog.notes || '');
    const loadedDays = (prog.days || []).map(d => ({
      ...d,
      conditioning: d.conditioning || null,
      exercises: (d.exercises || []).map(ex => {
        const numSets = Number(ex.sets) || 3;
        const targetWeights = (ex.targetWeights && ex.targetWeights.length === numSets)
          ? ex.targetWeights
          : Array(numSets).fill(ex.targetWeightKg || 0);
        const isDifferentWeights = ex.isDifferentWeights !== undefined
          ? ex.isDifferentWeights
          : (targetWeights.length > 1 && new Set(targetWeights).size > 1);
        return {
          ...ex,
          sets: numSets,
          targetWeights,
          isDifferentWeights,
          targetWeightKg: (ex.targetWeightKg !== undefined && ex.targetWeightKg !== '') ? ex.targetWeightKg : (targetWeights[0] || 0),
          notes: ex.notes || ''
        };
      })
    }));
    setDays(JSON.parse(JSON.stringify(loadedDays)));
    setShowCreateModal(true);
  };

  const handleDeleteProgram = async (progId, progName) => {
    try {
      await api.deleteProgram(progId);
      setPrograms(prev => prev.filter(p => p.id !== progId));
      showToast(`Deleted program "${progName}"`);
    } catch (err) {
      showToast('Failed to delete program', 'error');
    }
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    if (!programName.trim()) {
      showToast('Please enter a program name', 'error');
      return;
    }

    try {
      const cleanedDays = days.map(d => ({
        ...d,
        conditioning: d.conditioning || null,
        exercises: (d.exercises || []).map(ex => {
          const numSets = Number(ex.sets) || 3;
          const fallbackWeight = (ex.targetWeightKg !== undefined && ex.targetWeightKg !== '') ? ex.targetWeightKg : 0;
          let targetWeights = ex.targetWeights;
          if (!targetWeights || targetWeights.length !== numSets) {
            targetWeights = Array(numSets).fill(fallbackWeight);
          } else {
            targetWeights = targetWeights.map(w => (w !== undefined && w !== '') ? w : fallbackWeight);
          }
          return {
            ...ex,
            sets: numSets,
            targetWeights,
            isDifferentWeights: !!ex.isDifferentWeights,
            targetWeightKg: fallbackWeight,
            notes: (ex.notes || '').trim()
          };
        })
      }));

      if (editingProgramId) {
        const updated = await api.updateProgram(editingProgramId, {
          clientId: selectedClientId,
          name: programName,
          goal: programGoal,
          durationWeeks: Number(durationWeeks),
          daysPerWeek: Number(daysPerWeek),
          notes: programNotes,
          days: cleanedDays
        });
        setPrograms(prev => prev.map(p => p.id === editingProgramId ? updated : p));
        showToast(`Program "${programName}" updated!`);
      } else {
        const created = await api.createProgram({
          clientId: selectedClientId,
          name: programName,
          goal: programGoal,
          durationWeeks: Number(durationWeeks),
          daysPerWeek: Number(daysPerWeek),
          notes: programNotes,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + durationWeeks * 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
          days: cleanedDays
        });
        setPrograms(prev => [created, ...prev]);
        showToast(`Program "${programName}" created and assigned!`);
      }

      setShowCreateModal(false);
      setEditingProgramId(null);
      setProgramName('');
      setProgramNotes('');
    } catch (err) {
      showToast('Failed to save program', 'error');
    }
  };

  const handleDuplicate = async (prog) => {
    try {
      const copy = {
        ...prog,
        name: `${prog.name} (Copy)`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + prog.durationWeeks * 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
      };
      delete copy.id;
      const created = await api.createProgram(copy);
      setPrograms(prev => [created, ...prev]);
      showToast(`Duplicated "${prog.name}" successfully!`);
    } catch (err) {
      showToast('Failed to duplicate program', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center space-x-2">
            <Dumbbell className="w-6 h-6 text-emerald-400" />
            <span>Workout Programs & Template Library</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Design periodized programs, workout days, and exercises with demo links and alternatives.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {programs.length > 0 && (
            <button
              onClick={() => {
                setConditioningProgram(programs[0]);
                setShowConditioningModal(true);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs transition"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>⚡ Update Today's Conditioning</span>
            </button>
          )}

          <button
            onClick={() => {
              setEditingProgramId(null);
              setProgramName('');
              setProgramNotes('');
              setShowCreateModal(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create & Assign Program</span>
          </button>
        </div>
      </div>

      {/* Program Templates Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Template
                </span>
                <span className="text-xs text-slate-500">{tpl.durationWeeks} Weeks • {tpl.daysPerWeek}x/wk</span>
              </div>
              <h3 className="font-bold text-sm text-white mt-2">{tpl.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{tpl.description}</p>
            </div>
            <button
              onClick={() => {
                setEditingProgramId(null);
                setProgramName(tpl.name);
                setProgramGoal(tpl.goal);
                setDurationWeeks(tpl.durationWeeks);
                setDaysPerWeek(tpl.daysPerWeek);
                if (tpl.days && tpl.days.length > 0) {
                  setDays(tpl.days.map((d, idx) => ({
                    ...d,
                    dayNumber: d.dayNumber || idx + 1,
                    focus: d.focus || tpl.goal,
                    exercises: (d.exercises || []).map(ex => ({
                      ...ex,
                      restSeconds: ex.restSeconds || ex.restSec || 60
                    }))
                  })));
                }
                setShowCreateModal(true);
              }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Use This Template</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>

      {/* Active Assigned Programs */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Active Assigned Client Programs</h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading programs...</div>
        ) : programs.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400">No workout programs created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((prog) => {
              const assignedClient = clients.find(c => c.id === prog.clientId);
              return (
                <div key={prog.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-white">{prog.name}</h3>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {prog.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Assigned to: <strong className="text-emerald-400">{assignedClient ? assignedClient.name : 'Unassigned'}</strong> • {prog.daysPerWeek} Days/Week
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          setConditioningProgram(prog);
                          setShowConditioningModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition flex items-center space-x-1"
                        title="Update Today's Conditioning for this Program"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold hidden sm:inline">Conditioning</span>
                      </button>
                      <button
                        onClick={() => handleOpenEditProgram(prog)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-400 transition"
                        title="Edit Program"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(prog)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Duplicate Program"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProgram(prog.id, prog.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition"
                        title="Delete Program"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {prog.notes && (
                    <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      {prog.notes}
                    </p>
                  )}

                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Workout Days ({prog.days?.length || 0})
                    </span>
                    <div className="space-y-1.5">
                      {prog.days?.map((d) => (
                        <div key={d.id} className="flex justify-between items-center text-xs p-2 bg-slate-950/70 rounded-lg">
                          <div>
                            <span className="font-medium text-slate-200">Day {d.dayNumber}: {d.name}</span>
                            {d.conditioning && (
                              <div className="flex items-center space-x-1 text-amber-400 text-[10px] font-semibold mt-0.5">
                                <Flame className="w-3 h-3" />
                                <span>Finisher: {d.conditioning.title || d.conditioning.format}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-slate-500">{d.exercises?.length || 0} exercises</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
                    <span>Duration: {prog.durationWeeks} weeks</span>
                    {assignedClient && (
                      <button
                        onClick={() => onSelectClient(assignedClient.id, 'workouts')}
                        className="text-emerald-400 font-semibold hover:underline"
                      >
                        View in Client Profile →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT PROGRAM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full shadow-2xl my-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingProgramId ? 'Edit Workout Program' : 'Create New Workout Program'}
                </h3>
                <p className="text-xs text-slate-400">Assemble periodized routines and assign to a client</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingProgramId(null);
                }}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assign to Client</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.currentGoal})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Program Name</label>
                  <input
                    type="text"
                    placeholder="e.g. 8-Week Hypertrophy & Body Recomp"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Goal Focus</label>
                  <select
                    value={programGoal}
                    onChange={(e) => setProgramGoal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
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
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      min={1}
                      max={52}
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Days / Week</label>
                    <input
                      type="number"
                      value={daysPerWeek}
                      onChange={(e) => setDaysPerWeek(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      min={1}
                      max={7}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Coach Instructions & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Rest instructions, warm-up reminders, tempo cues..."
                  value={programNotes}
                  onChange={(e) => setProgramNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              {/* Workout Days & Builder Mode Header */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
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
                      <span>⚡ Visual Cards ({days.length} Days)</span>
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
                      <span>📝 Quick Notepad / Freeform Paste</span>
                    </button>
                  </div>

                  {/* Modular Day Presets & Add Day */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowPresetPicker(prev => !prev)}
                        className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>⚡ Load Day Preset</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {showPresetPicker && (
                        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                            Select Pre-Built Routine Split:
                          </div>
                          {MODULAR_DAY_PRESETS.map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => {
                                loadPresetDay(preset);
                                setShowPresetPicker(false);
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 transition flex flex-col group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-white group-hover:text-emerald-400">{preset.name}</span>
                                <span className="text-[10px] text-emerald-400/80 font-mono">{preset.exercises.length} ex</span>
                              </div>
                              <span className="text-[11px] text-slate-400 mt-0.5">{preset.focus}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={addDay}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl font-semibold text-xs flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Day</span>
                    </button>
                  </div>
                </div>

                {/* NOTEPAD / FREEFORM PASTE MODE */}
                {builderMode === 'notepad' ? (
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span>Quick Routine Notepad / Freeform Paste</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Type or paste exercises freely. Instant conversion without filling out rigid form fields.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-slate-400 font-semibold shrink-0">Add to:</label>
                        <select
                          value={activeNotepadDayIdx}
                          onChange={(e) => setActiveNotepadDayIdx(e.target.value === 'new' ? 'new' : Number(e.target.value))}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="new">+ Create as New Day</option>
                          {days.map((d, i) => (
                            <option key={d.id} value={i}>{d.name || `Day ${i + 1}`}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={8}
                        value={notepadText}
                        onChange={(e) => setNotepadText(e.target.value)}
                        placeholder={`Barbell Bench Press: 4x8 (60kg) - pause at chest\nIncline Dumbbell Press: 3x10 (22kg)\nDumbbell Lateral Raises: 3x15 (8kg) - slow negative\nTricep Rope Pushdowns: 3x12 (20kg)\nFinisher: 10-Min EMOM - 15 KB Swings (24kg) / 12 Burpees`}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleLoadSampleNotepad}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
                        >
                          📋 Load Sample
                        </button>
                        {notepadText && (
                          <button
                            type="button"
                            onClick={() => setNotepadText('')}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 text-xs transition"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleConvertNotepad(activeNotepadDayIdx)}
                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5"
                      >
                        <Zap className="w-4 h-4" />
                        <span>⚡ Convert to Workout Cards</span>
                      </button>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
                      <span className="font-bold text-slate-300">💡 Smart Formatting Tips:</span>
                      <p>• <strong>Exercise:</strong> <code className="text-emerald-400">Exercise Name: SetsxReps (Weight) - Notes</code> (e.g. <code>Lat Pulldown: 3x12 (55kg) - full stretch</code>)</p>
                      <p>• <strong>Conditioning Finisher:</strong> Start the line with <code className="text-amber-400">Finisher:</code> or <code className="text-amber-400">EMOM:</code> or <code className="text-amber-400">AMRAP:</code></p>
                    </div>
                  </div>
                ) : (
                  /* CLEAN VISUAL CARDS BUILDER */
                  <div className="space-y-4">
                    {days.map((d, dIdx) => (
                      <div key={d.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={d.name}
                            onChange={(e) => {
                              const updated = [...days];
                              updated[dIdx].name = e.target.value;
                              setDays(updated);
                            }}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                            placeholder="Day Title (e.g. Day 1 — Push Focus)"
                          />
                          <input
                            type="text"
                            value={d.focus}
                            onChange={(e) => {
                              const updated = [...days];
                              updated[dIdx].focus = e.target.value;
                              setDays(updated);
                            }}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300"
                            placeholder="Focus summary (e.g. Chest & Tricep Hypertrophy)"
                          />
                        </div>

                        {/* Exercises in this Day */}
                        <div className="space-y-2.5">
                          {d.exercises?.map((ex, exIdx) => {
                            const numSets = Number(ex.sets) || 1;
                            const currentWeights = Array.isArray(ex.targetWeights) && ex.targetWeights.length === numSets
                              ? ex.targetWeights
                              : Array(numSets).fill(ex.targetWeightKg ?? '60');
                            const isDiff = !!ex.isDifferentWeights;
                            const isExpanded = !!expandedDetails[ex.id];

                            return (
                              <div key={ex.id} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
                                {/* Row 1: Exercise name, sets x reps, weight target, details toggle, delete */}
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                  <div className="sm:col-span-5">
                                    <div className="flex items-center space-x-1.5 mb-1">
                                      <span className="text-[10px] font-mono text-emerald-400 font-bold">#{exIdx + 1}</span>
                                      <label className="text-[10px] text-slate-400 font-semibold">Exercise Name</label>
                                    </div>
                                    <input
                                      type="text"
                                      value={ex.name}
                                      onChange={(e) => {
                                        const updated = [...days];
                                        updated[dIdx].exercises[exIdx].name = e.target.value;
                                        setDays(updated);
                                      }}
                                      placeholder="e.g. Barbell Back Squat"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-medium text-xs focus:border-emerald-500"
                                    />
                                  </div>

                                  <div className="sm:col-span-3">
                                    <label className="text-[10px] text-slate-400 font-semibold block mb-1">Sets × Reps</label>
                                    <input
                                      type="text"
                                      value={`${ex.sets}x${ex.reps}`}
                                      onChange={(e) => {
                                        const [s, r] = e.target.value.split('x');
                                        const updated = [...days];
                                        const newSetsCount = Number(s) || 3;
                                        if (s) {
                                          updated[dIdx].exercises[exIdx].sets = newSetsCount;
                                          const existing = updated[dIdx].exercises[exIdx].targetWeights || [];
                                          const lastW = existing[existing.length - 1] ?? updated[dIdx].exercises[exIdx].targetWeightKg ?? '60';
                                          const newWeights = Array(newSetsCount).fill(0).map((_, i) => existing[i] !== undefined ? existing[i] : lastW);
                                          updated[dIdx].exercises[exIdx].targetWeights = newWeights;
                                        }
                                        if (r !== undefined) updated[dIdx].exercises[exIdx].reps = r;
                                        setDays(updated);
                                      }}
                                      placeholder="4x8-10"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-emerald-400 font-mono font-bold text-xs"
                                    />
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label className="text-[10px] text-slate-400 font-semibold block mb-1">Target Load</label>
                                    <input
                                      type="text"
                                      value={ex.targetWeightKg ?? ''}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        const updated = [...days];
                                        updated[dIdx].exercises[exIdx].targetWeightKg = val;
                                        if (!ex.isDifferentWeights) {
                                          updated[dIdx].exercises[exIdx].targetWeights = Array(numSets).fill(val);
                                        }
                                        setDays(updated);
                                      }}
                                      placeholder="60kg or RPE 8"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-semibold text-xs"
                                    />
                                  </div>

                                  <div className="sm:col-span-2 flex items-center justify-end pt-3 sm:pt-4 space-x-1.5">
                                    <button
                                      type="button"
                                      onClick={() => toggleDetails(ex.id)}
                                      className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 ${
                                        isExpanded
                                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                          : 'bg-slate-800 text-slate-300 hover:text-white'
                                      }`}
                                      title="Toggle rest time, tempo, video link, and per-set custom weights"
                                    >
                                      <span>Details</span>
                                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => removeExercise(dIdx, exIdx)}
                                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                                      title="Remove exercise"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Row 2: Direct Coach Note / Cue */}
                                <div className="flex items-center space-x-2 pt-0.5">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">📝 Note:</span>
                                  <input
                                    type="text"
                                    value={ex.notes || ''}
                                    onChange={(e) => {
                                      const updated = [...days];
                                      updated[dIdx].exercises[exIdx].notes = e.target.value;
                                      setDays(updated);
                                    }}
                                    placeholder="e.g. Pause 2s at bottom, RPE 8, drop weight if lower back fatigues"
                                    className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>

                                {/* Expanded Advanced Details (Rest, Tempo, Video, Alternative, Per-Set Weights) */}
                                {isExpanded && (
                                  <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-3 mt-2">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                      <div>
                                        <label className="text-[10px] text-slate-400 block mb-0.5">Rest (seconds)</label>
                                        <input
                                          type="number"
                                          value={ex.restSeconds || 90}
                                          onChange={(e) => {
                                            const updated = [...days];
                                            updated[dIdx].exercises[exIdx].restSeconds = Number(e.target.value);
                                            setDays(updated);
                                          }}
                                          placeholder="90"
                                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[10px] text-slate-400 block mb-0.5">Tempo</label>
                                        <input
                                          type="text"
                                          value={ex.tempo || '2-0-1-0'}
                                          onChange={(e) => {
                                            const updated = [...days];
                                            updated[dIdx].exercises[exIdx].tempo = e.target.value;
                                            setDays(updated);
                                          }}
                                          placeholder="2-0-1-0"
                                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[10px] text-slate-400 block mb-0.5">Alternative Exercise</label>
                                        <input
                                          type="text"
                                          value={ex.alternative || ''}
                                          onChange={(e) => {
                                            const updated = [...days];
                                            updated[dIdx].exercises[exIdx].alternative = e.target.value;
                                            setDays(updated);
                                          }}
                                          placeholder="e.g. Dumbbell Press"
                                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-[10px] text-slate-400 block mb-0.5">Demo Video URL</label>
                                        <input
                                          type="text"
                                          value={ex.videoUrl || ''}
                                          onChange={(e) => {
                                            const updated = [...days];
                                            updated[dIdx].exercises[exIdx].videoUrl = e.target.value;
                                            setDays(updated);
                                          }}
                                          placeholder="https://youtube.com/..."
                                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                                        />
                                      </div>
                                    </div>

                                    {/* Per-Set Custom Weights */}
                                    <div className="pt-2 border-t border-slate-800">
                                      <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center space-x-1.5">
                                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                            Pyramid / Custom Weights Per Set:
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...days];
                                            const toggled = !isDiff;
                                            updated[dIdx].exercises[exIdx].isDifferentWeights = toggled;
                                            if (!toggled) {
                                              const baseW = currentWeights[0] || ex.targetWeightKg || '60';
                                              updated[dIdx].exercises[exIdx].targetWeightKg = baseW;
                                              updated[dIdx].exercises[exIdx].targetWeights = Array(numSets).fill(baseW);
                                            }
                                            setDays(updated);
                                          }}
                                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                                            isDiff
                                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                          }`}
                                        >
                                          {isDiff ? '⚡ Enabled (Different weights per set)' : 'Set uniform weight for all'}
                                        </button>
                                      </div>

                                      {isDiff && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                          {currentWeights.map((wVal, sIdx) => (
                                            <div key={sIdx} className="flex items-center bg-slate-900 border border-slate-800 rounded px-2 py-1">
                                              <span className="text-[10px] text-slate-400 font-bold mr-1.5">Set {sIdx + 1}:</span>
                                              <input
                                                type="text"
                                                value={wVal ?? ''}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  const updated = [...days];
                                                  const newW = [...currentWeights];
                                                  newW[sIdx] = val;
                                                  updated[dIdx].exercises[exIdx].targetWeights = newW;
                                                  if (sIdx === 0) updated[dIdx].exercises[exIdx].targetWeightKg = val;
                                                  setDays(updated);
                                                }}
                                                className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-white font-bold text-xs"
                                                placeholder="kg"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => addExercise(dIdx)}
                            className="text-xs text-emerald-400 hover:underline font-semibold flex items-center space-x-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Exercise to this Day</span>
                          </button>
                        </div>

                        {/* Conditioning / Finisher for this day */}
                        <div className="mt-3 pt-3 border-t border-slate-800/80">
                          {d.conditioning ? (
                            <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/40 rounded-xl p-3.5 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Flame className="w-4 h-4 text-amber-400" />
                                  <span className="text-xs font-bold text-amber-300">
                                    Conditioning / Finisher: {d.conditioning.format || 'EMOM / AMRAP'}
                                  </span>
                                  {d.conditioning.isDailyVariable && (
                                    <span className="bg-amber-500/10 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                                      ⚡ Variable / Added on Day of Training
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...days];
                                    updated[dIdx].conditioning = null;
                                    setDays(updated);
                                  }}
                                  className="text-[10px] text-red-400 hover:underline font-semibold"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Title / Routine Name</label>
                                  <input
                                    type="text"
                                    value={d.conditioning.title || ''}
                                    onChange={(e) => {
                                      const updated = [...days];
                                      updated[dIdx].conditioning = { ...updated[dIdx].conditioning, title: e.target.value };
                                      setDays(updated);
                                    }}
                                    placeholder="e.g. 10-Min EMOM Finisher"
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-medium"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Duration / Time Cap</label>
                                  <input
                                    type="text"
                                    value={d.conditioning.duration || ''}
                                    onChange={(e) => {
                                      const updated = [...days];
                                      updated[dIdx].conditioning = { ...updated[dIdx].conditioning, duration: e.target.value };
                                      setDays(updated);
                                    }}
                                    placeholder="e.g. 10 mins / 12 mins cap"
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Movements & Reps</label>
                                <textarea
                                  rows={2}
                                  value={d.conditioning.description || ''}
                                  onChange={(e) => {
                                    const updated = [...days];
                                    updated[dIdx].conditioning = { ...updated[dIdx].conditioning, description: e.target.value };
                                    setDays(updated);
                                  }}
                                  placeholder="e.g. Min 1: 15 Kettlebell swings (24kg), Min 2: 12 Burpees, Min 3: 200m Row"
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                                />
                              </div>

                              <div className="flex items-center space-x-2 pt-1">
                                <input
                                  type="checkbox"
                                  id={`daily-var-${dIdx}`}
                                  checked={d.conditioning.isDailyVariable !== false}
                                  onChange={(e) => {
                                    const updated = [...days];
                                    updated[dIdx].conditioning = { ...updated[dIdx].conditioning, isDailyVariable: e.target.checked };
                                    setDays(updated);
                                  }}
                                  className="rounded text-amber-500 focus:ring-amber-500"
                                />
                                <label htmlFor={`daily-var-${dIdx}`} className="text-[11px] text-amber-300 font-medium cursor-pointer">
                                  Mark as dynamically added/updated on day of training
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-xs bg-slate-900/60 p-2.5 rounded-xl border border-dashed border-slate-800">
                              <span className="text-slate-400">No conditioning finisher added for this day yet.</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...days];
                                  updated[dIdx].conditioning = {
                                    format: '10-Min EMOM',
                                    title: '10-Min EMOM Finisher',
                                    duration: '10 mins',
                                    description: 'Min 1: 15 Kettlebell Swings (24kg)\nMin 2: 12 Burpees\nMin 3: 15 Wall Balls',
                                    notes: 'Maintain 75-80% sustained effort with 20s rest per minute.',
                                    isDailyVariable: true,
                                    lastUpdatedDate: new Date().toISOString().split('T')[0]
                                  };
                                  setDays(updated);
                                }}
                                className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
                              >
                                <Flame className="w-3.5 h-3.5" />
                                <span>+ Add Conditioning / Finisher</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-450 transition"
                >
                  Save & Assign Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK CONDITIONING MODAL */}
      <QuickConditioningModal
        isOpen={showConditioningModal}
        onClose={() => {
          setShowConditioningModal(false);
          setConditioningProgram(null);
        }}
        program={conditioningProgram}
        onSave={() => {
          loadAll();
        }}
      />
    </div>
  );
}
