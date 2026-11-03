import React from 'react';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  X, 
  Flame, 
  Trophy, 
  Edit3, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export function CompletedWorkoutViewModal({
  isOpen,
  session,
  clientName,
  isTrainer = false,
  onClose,
  onEdit
}) {
  if (!isOpen || !session || !session.workoutDone) return null;

  const wd = session.workoutDone;
  const exercises = wd.exercises || [];
  const finisher = wd.finisher;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 max-w-3xl w-full shadow-2xl my-4 sm:my-8 space-y-6 text-xs text-slate-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Completed Session Workout
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-xs">{session.date} at {session.time}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                {wd.dayName || wd.workoutName || 'Coaching Session Routine'}
              </h3>
              <p className="text-slate-400 text-xs">
                Client: <strong className="text-white">{clientName || session.clientName}</strong>
                {wd.programName && ` • Program: ${wd.programName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isTrainer && onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(session);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center space-x-1 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit Log</span>
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

        {/* Stats highlight cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Exercises</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">{exercises.length}</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Volume</span>
            <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
              {(wd.totalVolumeKg || 0).toLocaleString()} kg
            </span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Session Intensity</span>
            <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block">
              RPE {wd.rpe || 8} / 10
            </span>
          </div>
        </div>

        {/* Exercises Breakdown */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
            Exercises & Logged Weights:
          </h4>

          <div className="space-y-2.5">
            {exercises.map((ex, exIdx) => (
              <div key={ex.id || exIdx} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] inline-flex items-center justify-center">
                      {exIdx + 1}
                    </span>
                    <span className="font-bold text-white text-xs">{ex.name}</span>
                    {ex.alternative && (
                      <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                        Alt: {ex.alternative}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono">
                    {ex.sets?.length || 0} Sets
                  </span>
                </div>

                {/* Sets chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {ex.sets?.map((s, sIdx) => (
                    <div 
                      key={sIdx}
                      className={`px-2.5 py-1 rounded-xl text-xs flex items-center space-x-1.5 border ${
                        s.completed !== false 
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="font-bold text-[10px] text-slate-400">Set {s.setNum}:</span>
                      <span className="font-bold font-mono text-white">{s.weightKg} kg</span>
                      <span className="text-slate-400">×</span>
                      <span className="font-bold text-white">{s.reps} reps</span>
                      {s.completed !== false && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    </div>
                  ))}
                </div>

                {/* Exercise notes / movement changes */}
                {ex.notes && (
                  <div className="p-2 bg-slate-900/60 rounded-xl text-[11px] text-amber-300/90 border border-slate-800/60 flex items-start space-x-1.5">
                    <span className="font-bold">📝 Note:</span>
                    <span>{ex.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conditioning Finisher */}
        {finisher && (
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Finisher: {finisher.title || 'Conditioning'}</span>
            </div>
            {finisher.description && (
              <p className="text-slate-300 text-xs whitespace-pre-line">{finisher.description}</p>
            )}
            {finisher.notes && (
              <p className="text-amber-300 text-[11px] font-medium pt-1">Result: {finisher.notes}</p>
            )}
          </div>
        )}

        {/* Coach Summary & Feedback */}
        {(wd.sessionNotes || session.notes) && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider block">
              Coach Pushkar's Session Summary & Feedback
            </span>
            <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-line">
              {wd.sessionNotes || session.notes}
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
