import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';

export function SessionCalendar({ onSelectClient }) {
  const { showToast } = useNotifications();
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('upcoming'); // 'upcoming', 'all'
  const [statusFilter, setStatusFilter] = useState('all');

  // Booking modal
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookClientId, setBookClientId] = useState('');
  const [bookDate, setBookDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookTime, setBookTime] = useState('09:00 AM');
  const [bookDuration, setBookDuration] = useState(60);
  const [bookLocation, setBookLocation] = useState('Apex Fitness Studio');
  const [bookType, setBookType] = useState('1-on-1 In-Person');
  const [bookNotes, setBookNotes] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [sess, cls] = await Promise.all([
        api.getSessions({ status: statusFilter }),
        api.getClients()
      ]);
      setSessions(sess || []);
      setClients(cls || []);
      if (cls && cls.length > 0 && !bookClientId) {
        setBookClientId(cls[0].id);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!bookClientId) return;

    try {
      const created = await api.createSession({
        clientId: bookClientId,
        date: bookDate,
        time: bookTime,
        durationMinutes: Number(bookDuration),
        location: bookLocation,
        sessionType: bookType,
        notes: bookNotes,
        status: 'scheduled'
      });
      setSessions(prev => [created, ...prev]);
      setShowBookModal(false);
      showToast(`Booked session on ${bookDate} at ${bookTime}!`);
    } catch (err) {
      showToast('Failed to book session', 'error');
    }
  };

  const handleUpdateStatus = async (sessionId, newStatus) => {
    try {
      const updated = await api.updateSession(sessionId, { status: newStatus });
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
      showToast(`Session marked as ${newStatus}. Client credit updated.`);
    } catch (err) {
      showToast('Failed to update session status', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-cyan-400" />
            <span>Coaching Calendar & Session Tracker</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage upcoming appointments, track attendance, and automatically update remaining package credits.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Book Coaching Session</span>
        </button>
      </div>

      {/* Filter and Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-semibold">Filter Status:</span>
          {['all', 'scheduled', 'completed', 'no-show', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition ${
                statusFilter === st
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Total: <strong className="text-white">{sessions.length} sessions</strong>
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading coaching sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
          <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No sessions match this status</p>
          <p className="text-xs text-slate-500 mt-1">Book an appointment or change your status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((sess) => {
            const client = clients.find(c => c.id === sess.clientId);
            return (
              <div 
                key={sess.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        sess.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : sess.status === 'scheduled'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}>
                        {sess.status}
                      </span>
                      <h3 className="font-bold text-base text-white mt-2">
                        {sess.clientName}
                      </h3>
                      <p className="text-xs text-emerald-400 font-medium">{sess.sessionType}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-white flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sess.time}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{sess.date}</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center text-slate-400 space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{sess.location}</span>
                    </div>

                    {client && (
                      <div className="p-2.5 bg-slate-950 rounded-xl text-[11px] flex justify-between items-center text-slate-400">
                        <span>Package Status:</span>
                        <span className="text-emerald-400 font-bold">
                          {client.sessionsRemaining} left (Used {client.sessionsCompleted} of {client.sessionsPurchased})
                        </span>
                      </div>
                    )}

                    {sess.notes && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded-lg">
                        "{sess.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  {sess.status === 'scheduled' && (
                    <div className="flex items-center space-x-2 w-full">
                      <button
                        onClick={() => handleUpdateStatus(sess.id, 'completed')}
                        className="flex-1 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-lg border border-emerald-500/30 text-center transition"
                      >
                        ✓ Mark Completed
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(sess.id, 'no-show')}
                        className="py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-lg border border-red-500/20 transition"
                      >
                        No-Show
                      </button>
                    </div>
                  )}

                  {sess.status !== 'scheduled' && (
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[11px] text-slate-500">Logged on system</span>
                      <button
                        onClick={() => handleUpdateStatus(sess.id, 'scheduled')}
                        className="text-[11px] text-slate-400 hover:text-white underline"
                      >
                        Reopen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book Session Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Book Coaching Appointment</h3>

            <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Select Client</label>
                <select
                  value={bookClientId}
                  onChange={(e) => setBookClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.sessionsRemaining} sessions left)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Date</label>
                  <input
                    type="date"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="08:00 AM"
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Session Type</label>
                  <select
                    value={bookType}
                    onChange={(e) => setBookType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="1-on-1 In-Person">1-on-1 In-Person</option>
                    <option value="Strength Technique Check">Strength Technique Check</option>
                    <option value="Conditioning & Mobility">Conditioning & Mobility</option>
                    <option value="Virtual Assessment">Virtual Assessment</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={bookDuration}
                    onChange={(e) => setBookDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Location</label>
                <input
                  type="text"
                  value={bookLocation}
                  onChange={(e) => setBookLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Coach Notes</label>
                <textarea
                  rows={2}
                  placeholder="Focus points, movements to test..."
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-450 transition"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
