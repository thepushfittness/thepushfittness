import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Copy, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Clock, 
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';

export function WorkoutManager({ onSelectClient }) {
  const { showToast } = useNotifications();
  const [programs, setPrograms] = useState([]);
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // New program modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [programName, setProgramName] = useState('');
  const [programGoal, setProgramGoal] = useState('Strength & Hypertrophy');
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [programNotes, setProgramNotes] = useState('');

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

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    if (!programName.trim()) {
      showToast('Please enter a program name', 'error');
      return;
    }

    try {
      const created = await api.createProgram({
        clientId: selectedClientId,
        name: programName,
        goal: programGoal,
        durationWeeks: Number(durationWeeks),
        daysPerWeek: Number(daysPerWeek),
        notes: programNotes,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + durationWeeks * 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
        days
      });

      setPrograms(prev => [created, ...prev]);
      setShowCreateModal(false);
      showToast(`Program "${programName}" created and assigned!`);
      setProgramName('');
      setProgramNotes('');
    } catch (err) {
      showToast('Failed to create program', 'error');
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

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create & Assign Program</span>
        </button>
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
                setProgramName(tpl.name);
                setProgramGoal(tpl.goal);
                setDurationWeeks(tpl.durationWeeks);
                setDaysPerWeek(tpl.daysPerWeek);
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

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDuplicate(prog)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Duplicate Program"
                      >
                        <Copy className="w-3.5 h-3.5" />
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
                          <span className="font-medium text-slate-200">Day {d.dayNumber}: {d.name}</span>
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

      {/* CREATE PROGRAM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full shadow-2xl my-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Create New Workout Program</h3>
                <p className="text-xs text-slate-400">Assemble periodized routines and assign to a client</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
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

              {/* Workout Days & Exercises Builder */}
              <div className="space-y-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">Workout Days ({days.length})</h4>
                  <button
                    type="button"
                    onClick={addDay}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold rounded-lg text-xs"
                  >
                    + Add Workout Day
                  </button>
                </div>

                <div className="space-y-4">
                  {days.map((d, dIdx) => (
                    <div key={d.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
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
                          placeholder="Day Title"
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
                          placeholder="Focus summary"
                        />
                      </div>

                      {/* Exercises in this Day */}
                      <div className="space-y-2">
                        {d.exercises?.map((ex, exIdx) => (
                          <div key={ex.id} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 grid grid-cols-2 sm:grid-cols-6 gap-2 items-center">
                            <div className="col-span-2">
                              <label className="text-[10px] text-slate-500 block">Exercise</label>
                              <input
                                type="text"
                                value={ex.name}
                                onChange={(e) => {
                                  const updated = [...days];
                                  updated[dIdx].exercises[exIdx].name = e.target.value;
                                  setDays(updated);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-medium"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block">Sets × Reps</label>
                              <input
                                type="text"
                                value={`${ex.sets}x${ex.reps}`}
                                onChange={(e) => {
                                  const [s, r] = e.target.value.split('x');
                                  const updated = [...days];
                                  if (s) updated[dIdx].exercises[exIdx].sets = Number(s) || 3;
                                  if (r) updated[dIdx].exercises[exIdx].reps = r;
                                  setDays(updated);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-emerald-400"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block">Target Wt (kg)</label>
                              <input
                                type="number"
                                value={ex.targetWeightKg}
                                onChange={(e) => {
                                  const updated = [...days];
                                  updated[dIdx].exercises[exIdx].targetWeightKg = Number(e.target.value);
                                  setDays(updated);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block">Rest (s)</label>
                              <input
                                type="number"
                                value={ex.restSeconds}
                                onChange={(e) => {
                                  const updated = [...days];
                                  updated[dIdx].exercises[exIdx].restSeconds = Number(e.target.value);
                                  setDays(updated);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white"
                              />
                            </div>
                            <div className="flex items-center justify-end pt-3">
                              <button
                                type="button"
                                onClick={() => removeExercise(dIdx, exIdx)}
                                className="p-1 text-slate-500 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addExercise(dIdx)}
                        className="text-xs text-emerald-400 hover:underline font-semibold"
                      >
                        + Add Exercise to this Day
                      </button>
                    </div>
                  ))}
                </div>
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
    </div>
  );
}
