import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Flame, 
  X, 
  Zap, 
  Clock, 
  Save, 
  Dumbbell, 
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

const CONDITIONING_PRESETS = [
  {
    title: '10-Min EMOM (Every Minute on the Minute)',
    format: 'EMOM',
    duration: '10 Mins',
    description: 'Minute 1: 15 Kettlebell Swings (16-24kg)\nMinute 2: 12 Burpees to target\nAlternate every minute for 10 total minutes.',
    notes: 'Pace the burpees to finish within 40 seconds to give yourself 20 seconds rest.'
  },
  {
    title: '12-Min Metabolic AMRAP',
    format: 'AMRAP',
    duration: '12 Mins',
    description: 'As Many Rounds as Possible in 12 Mins:\n- 200m Concept2 Row\n- 15 Wall Ball Shots (6-9kg)\n- 10 Box Jumps or Step-Overs (20-24")',
    notes: 'Keep smooth transitions between machines. Aim for consistent 2:30 split times per round.'
  },
  {
    title: '4 Rounds for Time (Engine Builder)',
    format: 'Rounds For Time',
    duration: '15 Mins Cap',
    description: '4 Complete Rounds for Time:\n- 15 Calorie Echo / Assault Bike\n- 20 Kettlebell Goblet Squats\n- 15 Push-ups or Ring Dips\n*Rest 60 seconds between rounds*',
    notes: 'Sprint the first 5 calories on the bike then settle into a 75 RPM cadence.'
  },
  {
    title: 'Tabata High-Intensity Intervals (8 Rounds)',
    format: 'Tabata / Intervals',
    duration: '8 Mins',
    description: '8 Rounds of (20 sec All-Out Work / 10 sec Rest):\n- Rounds 1-4: Heavy Battling Ropes Slam\n- Rounds 5-8: Medicine Ball Slams into floor',
    notes: 'True 100% maximum effort on every 20-second interval.'
  },
  {
    title: 'Sled Push & Farmer Carry Finisher',
    format: 'Circuit',
    duration: '12 Mins',
    description: '5 Heavy Rounds:\n- 20m Turf Sled Push (Heavy)\n- 40m Dual Kettlebell Farmer Carry\n- 15 Hanging Knee or Leg Raises\n*Rest 75s after each round*',
    notes: 'Brace core hard, maintain upright posture on the carries, drive through heels on the sled.'
  },
  {
    title: 'Cardio Aerobic Flush & Core',
    format: 'Cardio Finisher',
    duration: '10 Mins',
    description: '3 Smooth Rounds:\n- 500m SkiErg or Rower\n- 30 sec Hollow Body Plank Hold\n- 20 Mountain Climbers',
    notes: 'Low impact flush to cool down and clear lactate.'
  }
];

export function QuickConditioningModal({ 
  isOpen, 
  client, 
  programs = [], 
  onClose, 
  onSaved 
}) {
  const { showToast } = useNotifications();

  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [format, setFormat] = useState('AMRAP');
  const [title, setTitle] = useState('12-Min Metabolic AMRAP');
  const [duration, setDuration] = useState('12 Mins');
  const [description, setDescription] = useState(
    'As Many Rounds as Possible in 12 Mins:\n- 200m Concept2 Row\n- 15 Wall Ball Shots (9kg)\n- 10 Box Jumps (24")'
  );
  const [coachNotes, setCoachNotes] = useState('Customized for today based on energy and equipment.');
  const [saving, setSaving] = useState(false);

  // Initialize selected program
  useEffect(() => {
    if (programs.length > 0) {
      const active = programs.find(p => p.status === 'active') || programs[0];
      setSelectedProgramId(active.id);
      setSelectedDayIdx(0);
    }
  }, [programs, isOpen]);

  // When day changes, pre-load existing conditioning if present
  useEffect(() => {
    const currentProg = programs.find(p => p.id === selectedProgramId);
    if (currentProg && currentProg.days?.[selectedDayIdx]?.conditioning) {
      const cond = currentProg.days[selectedDayIdx].conditioning;
      setTitle(cond.title || 'Daily Conditioning Finisher');
      setFormat(cond.format || 'AMRAP');
      setDuration(cond.duration || '12 Mins');
      setDescription(cond.description || '');
      setCoachNotes(cond.notes || '');
    }
  }, [selectedProgramId, selectedDayIdx, programs]);

  if (!isOpen) return null;

  const currentProg = programs.find(p => p.id === selectedProgramId);
  const currentDay = currentProg?.days?.[selectedDayIdx];

  const handleApplyPreset = (preset) => {
    setTitle(preset.title);
    setFormat(preset.format);
    setDuration(preset.duration);
    setDescription(preset.description);
    setCoachNotes(preset.notes);
    showToast(`Loaded "${preset.title}" preset!`);
  };

  const handleSaveConditioning = async (e) => {
    e.preventDefault();
    if (!currentProg || !currentDay) {
      showToast('Please select a program and day', 'error');
      return;
    }

    try {
      setSaving(true);
      const updatedDays = JSON.parse(JSON.stringify(currentProg.days || []));
      updatedDays[selectedDayIdx].conditioning = {
        title: title.trim(),
        format,
        duration: duration.trim(),
        description: description.trim(),
        notes: coachNotes.trim(),
        isDailyVariable: true,
        lastUpdatedDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString()
      };

      const updatedProgram = await api.updateProgram(currentProg.id, {
        days: updatedDays
      });

      // Send notification to client
      if (client) {
        showToast(`🔥 Today's Conditioning updated for ${client.name}!`, 'success');
      } else {
        showToast("🔥 Today's Conditioning updated successfully!", 'success');
      }

      if (onSaved) onSaved(updatedProgram);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Failed to update conditioning', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8 text-xs relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-orange-500/20">
              <Flame className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Assign / Update Today's Conditioning</span>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Day-of-Training
                </span>
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {client ? `Custom conditioning finisher for ${client.name}` : 'Customize today\'s dynamic finisher'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Conditioning Presets (Pick & Customize):</span>
            </span>
            <span className="text-[10px] text-slate-500">Auto-fills format & movements</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CONDITIONING_PRESETS.map((p, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between space-y-1 ${
                  title === p.title
                    ? 'bg-orange-950/40 border-orange-500/50 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider">
                    {p.format}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">{p.duration}</span>
                </div>
                <div className="font-bold text-[11px] line-clamp-1">{p.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSaveConditioning} className="space-y-4 pt-2 border-t border-slate-800">
          {/* Program & Day Selector */}
          {programs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Program</label>
                <select
                  value={selectedProgramId}
                  onChange={(e) => {
                    setSelectedProgramId(e.target.value);
                    setSelectedDayIdx(0);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-orange-500"
                >
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.days?.length || 0} Days)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Workout Day to Update</label>
                <select
                  value={selectedDayIdx}
                  onChange={(e) => setSelectedDayIdx(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-orange-500"
                >
                  {currentProg?.days?.map((d, idx) => (
                    <option key={d.id || idx} value={idx}>
                      Day {d.dayNumber || idx + 1}: {d.name} {d.conditioning ? '🔥 (Has Finisher)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Title, Format & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Finisher Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 12-Min Metabolic AMRAP"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Conditioning Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-orange-500"
              >
                <option value="AMRAP">AMRAP (As Many Rounds As Possible)</option>
                <option value="EMOM">EMOM (Every Minute on the Minute)</option>
                <option value="Rounds For Time">Rounds For Time</option>
                <option value="Tabata / Intervals">Tabata / Intervals</option>
                <option value="Circuit">Circuit / Station Rotation</option>
                <option value="Cardio Finisher">Cardio Finisher / Incline Walk</option>
                <option value="Custom">Custom Conditioning</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Duration / Cap</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 10 Mins / 15 Mins Cap"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          {/* Movements and Instructions */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Movements, Reps & Circuit Protocol
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g.&#10;As Many Rounds As Possible in 12 Mins:&#10;- 200m Row&#10;- 15 Kettlebell Swings (16kg)&#10;- 10 Burpees"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-xs placeholder-slate-600 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {/* Coach Notes */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Coach Tips & Pacing Advice for Today
            </label>
            <input
              type="text"
              value={coachNotes}
              onChange={(e) => setCoachNotes(e.target.value)}
              placeholder="e.g. Today's focus: pace the row and sprint the last 2 minutes!"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-[11px] text-amber-400 font-medium flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Instantly pushes to client's app for today's session</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-orange-500/20 transition transform active:scale-95 disabled:opacity-50"
              >
                <Flame className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Save & Push to Client'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
