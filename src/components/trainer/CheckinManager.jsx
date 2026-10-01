import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Clock, 
  Send, 
  User, 
  Flame, 
  Moon, 
  Zap, 
  Smile, 
  AlertCircle 
} from 'lucide-react';

export function CheckinManager({ onSelectClient }) {
  const { showToast } = useNotifications();
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadCheckins = async () => {
    try {
      setLoading(true);
      const data = await api.getCheckins();
      setCheckins(data || []);
      if (data && data.length > 0 && !selectedCheckin) {
        setSelectedCheckin(data[0]);
        setFeedback(data[0].trainerFeedback || '');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load check-ins', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckins();
  }, []);

  const handleSelect = (chk) => {
    setSelectedCheckin(chk);
    setFeedback(chk.trainerFeedback || '');
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedCheckin || !feedback.trim()) return;

    try {
      const updated = await api.reviewCheckin(selectedCheckin.id, feedback);
      setCheckins(prev => prev.map(c => c.id === selectedCheckin.id ? updated : c));
      setSelectedCheckin(updated);
      showToast(`Delivered feedback to ${updated.clientName}!`);
    } catch (err) {
      showToast('Failed to submit feedback', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white flex items-center space-x-2">
          <ClipboardCheck className="w-6 h-6 text-purple-400" />
          <span>Client Weekly Progress Check-ins</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Review subjective wellness scores, sleep quality, training wins, and deliver coach guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Submissions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px]">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold text-white uppercase tracking-wider">Submissions</span>
            <span className="text-slate-400">{checkins.length} Total</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading check-ins...</div>
            ) : checkins.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No check-ins submitted.</div>
            ) : (
              checkins.map((chk) => {
                const isSelected = selectedCheckin?.id === chk.id;
                return (
                  <button
                    key={chk.id}
                    onClick={() => handleSelect(chk)}
                    className={`w-full text-left p-4 hover:bg-slate-800/60 transition flex flex-col space-y-2 ${
                      isSelected ? 'bg-slate-800 border-l-4 border-emerald-400' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{chk.clientName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        chk.status === 'reviewed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {chk.status === 'reviewed' ? 'Reviewed' : 'Needs Review'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span>Date: {chk.date}</span>
                      <span>•</span>
                      <span>Energy: {chk.responses?.energyRating}/10</span>
                      <span>•</span>
                      <span>Sleep: {chk.responses?.sleepHours}h</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Review & Feedback Box */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
          {selectedCheckin ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-white">{selectedCheckin.clientName}</h2>
                    <span className="text-xs text-slate-400">({selectedCheckin.date})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Weekly accountability submission</p>
                </div>

                <button
                  onClick={() => onSelectClient(selectedCheckin.clientId, 'checkins')}
                  className="text-xs text-emerald-400 font-semibold hover:underline"
                >
                  View Client Full History →
                </button>
              </div>

              {/* Numerical Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">Energy Rating</span>
                    <span className="text-base font-bold text-white">{selectedCheckin.responses?.energyRating} / 10</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">Sleep Quality</span>
                    <span className="text-base font-bold text-white">{selectedCheckin.responses?.sleepHours} hrs</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
                  <Flame className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">Workout Consistency</span>
                    <span className="text-base font-bold text-emerald-400">{selectedCheckin.responses?.workoutConsistency} / 10</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
                  <Smile className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">Nutrition Adherence</span>
                    <span className="text-base font-bold text-cyan-400">{selectedCheckin.responses?.nutritionConsistency} / 10</span>
                  </div>
                </div>
              </div>

              {/* Subjective Q&A */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-amber-400 block">Joint Pain or Physical Discomfort:</span>
                  <p className="text-slate-300 mt-0.5">{selectedCheckin.responses?.painOrDiscomfort || 'None reported'}</p>
                </div>
                <div>
                  <span className="font-semibold text-emerald-400 block">Biggest Win This Week:</span>
                  <p className="text-slate-300 mt-0.5">{selectedCheckin.responses?.winsThisWeek || '—'}</p>
                </div>
                <div>
                  <span className="font-semibold text-red-400 block">Most Difficult Challenge:</span>
                  <p className="text-slate-300 mt-0.5">{selectedCheckin.responses?.biggestObstacle || '—'}</p>
                </div>
                <div>
                  <span className="font-semibold text-cyan-400 block">#1 Goal for Next Week:</span>
                  <p className="text-slate-300 mt-0.5">{selectedCheckin.responses?.nextWeekGoal || '—'}</p>
                </div>
              </div>

              {/* Coach Feedback Form */}
              <form onSubmit={handleSubmitFeedback} className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-xs font-bold text-white block">
                  Coach Alex Feedback & Next Steps:
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide motivating feedback, adjustments to workouts or nutrition, and words of encouragement..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Coach Feedback</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select a check-in to review
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
