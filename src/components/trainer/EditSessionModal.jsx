import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  X, 
  Trash2, 
  Save, 
  AlertTriangle,
  CheckCircle2,
  Tag
} from 'lucide-react';

const COMMON_TIMES = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
];

const COMMON_LOCATIONS = [
  'Apex Fitness Studio',
  'Main Gym Floor',
  'Private Training Studio',
  'Virtual / Zoom Video Call',
  'Outdoor Track / Park'
];

export function EditSessionModal({ isOpen, session, clients = [], onClose, onSave, onDelete }) {
  const { showToast } = useNotifications();

  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [sessionType, setSessionType] = useState('1-on-1 In-Person');
  const [location, setLocation] = useState('Apex Fitness Studio');
  const [status, setStatus] = useState('scheduled');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (session) {
      setClientId(session.clientId || (clients[0]?.id || ''));
      setDate(session.date || new Date().toISOString().split('T')[0]);
      setTime(session.time || '09:00 AM');
      setDurationMinutes(session.durationMinutes || 60);
      setSessionType(session.sessionType || '1-on-1 In-Person');
      setLocation(session.location || 'Apex Fitness Studio');
      setStatus(session.status || 'scheduled');
      setNotes(session.notes || '');
      setConfirmDelete(false);
    }
  }, [session, clients, isOpen]);

  if (!isOpen || !session) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      showToast('Please select a client', 'error');
      return;
    }
    if (!date) {
      showToast('Please select a session date', 'error');
      return;
    }
    if (!time.trim()) {
      showToast('Please specify a session time', 'error');
      return;
    }

    try {
      setSaving(true);
      const updated = await api.updateSession(session.id, {
        clientId,
        date,
        time: time.trim(),
        durationMinutes: Number(durationMinutes) || 60,
        sessionType,
        location: location.trim(),
        status,
        notes: notes.trim()
      });

      showToast(`Session updated for ${date} at ${time}!`);
      if (onSave) onSave(updated);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Failed to update session. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setDeleting(true);
      await api.deleteSession(session.id);
      showToast('Session deleted. Package credits recalculated.');
      if (onDelete) onDelete(session.id);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete session', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const currentClient = clients.find(c => c.id === clientId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 my-8 text-xs relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Edit Coaching Session</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : status === 'scheduled'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  {status}
                </span>
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Update date, timings, client assignment, or status.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Selection */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Assigned Client</span>
              </span>
              {currentClient && (
                <span className="text-[11px] text-emerald-400 font-bold">
                  {currentClient.sessionsRemaining} sessions left
                </span>
              )}
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-cyan-500 transition"
              required
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.sessionsRemaining} remaining (Used {c.sessionsCompleted} of {c.sessionsPurchased})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 flex items-center space-x-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Session Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500 transition"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Time & Timing</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500 transition"
                required
              />
            </div>
          </div>

          {/* Quick Time Presets */}
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block mb-1.5">
              Quick Timings Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                    time === t
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Session Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">
                Duration (Minutes)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="15"
                  max="240"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500 transition"
                  required
                />
                <div className="flex space-x-1">
                  {[30, 45, 60, 90].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={`px-2 py-2 rounded-lg text-[10px] font-bold transition ${
                        Number(durationMinutes) === mins
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'bg-slate-950 text-slate-500 hover:text-white border border-slate-800'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Session Type</span>
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="1-on-1 In-Person">1-on-1 In-Person</option>
                <option value="Strength Technique Check">Strength Technique Check</option>
                <option value="Conditioning & Mobility">Conditioning & Mobility</option>
                <option value="Virtual Assessment">Virtual Assessment</option>
                <option value="Nutrition & Habit Review">Nutrition & Habit Review</option>
                <option value="Recovery & Rehab Session">Recovery & Rehab Session</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Location</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500 transition"
              placeholder="e.g. Apex Fitness Studio"
              required
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] transition ${
                    location === loc
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-950/60 text-slate-500 hover:text-slate-300 border border-slate-800'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Session Status */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Status</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'scheduled', label: 'Scheduled', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
                { id: 'completed', label: 'Completed', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
                { id: 'no-show', label: 'No-Show', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
                { id: 'cancelled', label: 'Cancelled', color: 'text-red-400 border-red-500/30 bg-red-500/10' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatus(st.id)}
                  className={`py-2 px-2 rounded-xl text-center font-bold text-xs border transition ${
                    status === st.id
                      ? `${st.color} ring-1 ring-white/20 shadow-md`
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Coach Notes */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Coach Notes / Workout Focus Points
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Target lifts, cue reminders, rehab focuses, or client requests..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            {/* Delete button with safety confirmation */}
            <div>
              {confirmDelete ? (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-red-600/30 transition animate-pulse"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{deleting ? 'Deleting...' : 'Confirm Delete?'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-2 text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center space-x-1.5 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl border border-red-500/20 text-xs font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Session</span>
                </button>
              )}
            </div>

            {/* Cancel and Save */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Session Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
