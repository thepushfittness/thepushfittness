import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { EditSessionModal } from './EditSessionModal';
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
  Filter,
  Pencil,
  Trash2,
  Search,
  AlertTriangle
} from 'lucide-react';

const COMMON_TIMES = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
];

export function SessionCalendar({ onSelectClient }) {
  const { showToast } = useNotifications();
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'upcoming', 'past'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [editingSession, setEditingSession] = useState(null);
  const [deletingSession, setDeletingSession] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      // Reload clients to refresh remaining sessions counts
      api.getClients().then(setClients);
    } catch (err) {
      showToast('Failed to book session', 'error');
    }
  };

  const handleUpdateStatus = async (sessionId, newStatus) => {
    try {
      const updated = await api.updateSession(sessionId, { status: newStatus });
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));
      showToast(`Session marked as ${newStatus}. Client credit updated.`);
      api.getClients().then(setClients);
    } catch (err) {
      showToast('Failed to update session status', 'error');
    }
  };

  const handleSaveEditedSession = (updated) => {
    setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditingSession(null);
    api.getClients().then(setClients);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSession) return;
    try {
      setIsDeleting(true);
      await api.deleteSession(deletingSession.id);
      setSessions(prev => prev.filter(s => s.id !== deletingSession.id));
      showToast('Session deleted. Package credits recalculated.');
      setDeletingSession(null);
      api.getClients().then(setClients);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete session', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Sessions
  const todayStr = new Date().toISOString().split('T')[0];
  const filteredSessions = sessions.filter(sess => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sess.clientName?.toLowerCase().includes(q);
      const matchType = sess.sessionType?.toLowerCase().includes(q);
      const matchLoc = sess.location?.toLowerCase().includes(q);
      const matchNotes = sess.notes?.toLowerCase().includes(q);
      if (!matchName && !matchType && !matchLoc && !matchNotes) return false;
    }

    // Date filter
    if (dateFilter === 'today') {
      return sess.date === todayStr;
    } else if (dateFilter === 'upcoming') {
      return sess.date >= todayStr;
    } else if (dateFilter === 'past') {
      return sess.date < todayStr;
    }

    return true;
  });

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
            Manage upcoming appointments, change dates or timings, and track package attendance.
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

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client name, session type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Date Filters */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] mr-1">Date:</span>
            {[
              { id: 'all', label: 'All Dates' },
              { id: 'today', label: 'Today' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'past', label: 'Past' }
            ].map(df => (
              <button
                key={df.id}
                onClick={() => setDateFilter(df.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${
                  dateFilter === df.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {df.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-xs flex-wrap gap-y-1.5">
            <span className="text-slate-400 font-semibold text-[11px] mr-1">Status:</span>
            {['all', 'scheduled', 'completed', 'no-show', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition ${
                  statusFilter === st
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredSessions.length}</strong> of {sessions.length} sessions
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading coaching sessions...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
          <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No sessions match your search or filter</p>
          <p className="text-xs text-slate-500 mt-1">Book an appointment or clear your filters above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((sess) => {
            const client = clients.find(c => c.id === sess.clientId);
            return (
              <div 
                key={sess.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Bar: Status + Quick Action Icons */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      sess.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : sess.status === 'scheduled'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {sess.status}
                    </span>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setEditingSession(sess)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                        title="Edit date, timings or session details"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingSession(sess)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Client Name & Time */}
                  <div className="flex items-start justify-between mt-3">
                    <div>
                      <h3 
                        onClick={() => onSelectClient && onSelectClient(sess.clientId, 'sessions')}
                        className="font-bold text-base text-white hover:text-cyan-400 cursor-pointer transition flex items-center space-x-1.5"
                      >
                        <span>{sess.clientName}</span>
                      </h3>
                      <p className="text-xs text-emerald-400 font-medium mt-0.5">{sess.sessionType}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-white flex items-center space-x-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{sess.time}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">{sess.date}</div>
                    </div>
                  </div>

                  {/* Location & Package Details */}
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

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs gap-2">
                  {sess.status === 'scheduled' ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(sess.id, 'completed')}
                        className="flex-1 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-lg border border-emerald-500/30 text-center transition"
                      >
                        ✓ Completed
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(sess.id, 'no-show')}
                        className="py-1.5 px-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-lg border border-red-500/20 transition text-[11px]"
                      >
                        No-Show
                      </button>
                      <button
                        onClick={() => setEditingSession(sess)}
                        className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg border border-slate-700 transition flex items-center space-x-1 text-[11px]"
                      >
                        <Pencil className="w-3 h-3 text-cyan-400" />
                        <span>Edit</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex justify-between items-center w-full">
                      <button
                        onClick={() => setEditingSession(sess)}
                        className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit Details</span>
                      </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-emerald-400" />
                <span>Book Coaching Appointment</span>
              </h3>
              <button 
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-3.5">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Select Client</label>
                <select
                  value={bookClientId}
                  onChange={(e) => setBookClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
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

              {/* Quick Time Presets */}
              <div className="flex flex-wrap gap-1">
                {COMMON_TIMES.slice(0, 8).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBookTime(t)}
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      bookTime === t ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
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
                    <option value="Nutrition & Habit Review">Nutrition & Habit Review</option>
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

      {/* Edit Session Modal */}
      <EditSessionModal
        isOpen={!!editingSession}
        session={editingSession}
        clients={clients}
        onClose={() => setEditingSession(null)}
        onSave={handleSaveEditedSession}
        onDelete={(id) => {
          setSessions(prev => prev.filter(s => s.id !== id));
          setEditingSession(null);
          api.getClients().then(setClients);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deletingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Session?</h3>
                <p className="text-slate-400 text-xs">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Client:</span>
                <span className="font-bold text-white">{deletingSession.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-cyan-400">{deletingSession.date} at {deletingSession.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="text-slate-300">{deletingSession.sessionType}</span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-[11px]">
              Deleting this session will remove it from the coaching calendar and automatically recalculate <strong>{deletingSession.clientName}'s</strong> package session credits.
            </p>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingSession(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-red-600/30 transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
