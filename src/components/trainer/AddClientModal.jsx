import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Calendar, 
  Clock, 
  Globe, 
  Dumbbell, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  ShieldCheck, 
  Check,
  UserCheck
} from 'lucide-react';

export const MALE_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&clothing=graphicShirt',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=David&facialHair=beardLight'
];

export const FEMALE_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&clothing=collarAndSweater',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&top=longHair'
];

const PRESET_TIMES = [
  '06:00 AM',
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM'
];

const DAY_LABELS = [
  { id: 1, label: 'Mon', full: 'Monday' },
  { id: 2, label: 'Tue', full: 'Tuesday' },
  { id: 3, label: 'Wed', full: 'Wednesday' },
  { id: 4, label: 'Thu', full: 'Thursday' },
  { id: 5, label: 'Fri', full: 'Friday' },
  { id: 6, label: 'Sat', full: 'Saturday' },
  { id: 0, label: 'Sun', full: 'Sunday' }
];

export function AddClientModal({ isOpen, onClose, onClientAdded }) {
  const { showToast } = useNotifications();

  // Basic Account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('client123');

  // Mode: 'offline' (Studio) or 'online' (Virtual)
  const [trainingMode, setTrainingMode] = useState('offline');

  // Days: 'MWF', 'TTS', or 'custom'
  const [scheduleOption, setScheduleOption] = useState('MWF');
  const [customDays, setCustomDays] = useState([1, 3, 5]); // default Mon, Wed, Fri

  // Timings
  const [sessionTime, setSessionTime] = useState('07:00 AM');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTimeInput, setCustomTimeInput] = useState('');

  // Start Date
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Billing (Prepaid ₹18,000 for 12 sessions)
  const [monthlyPrice, setMonthlyPrice] = useState(18000);
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay / PhonePe)');
  const [paymentReference, setPaymentReference] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculate target days
  const getTargetDays = () => {
    if (scheduleOption === 'MWF') return [1, 3, 5];
    if (scheduleOption === 'TTS') return [2, 4, 6];
    return customDays.length > 0 ? customDays : [1, 3, 5];
  };

  const getTargetDayNames = () => {
    const days = getTargetDays();
    return days.map(d => {
      const match = DAY_LABELS.find(dl => dl.id === d);
      return match ? match.label : '';
    }).join(' • ');
  };

  const toggleCustomDay = (dayId) => {
    setCustomDays(prev => {
      if (prev.includes(dayId)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter(d => d !== dayId);
      } else {
        return [...prev, dayId].sort();
      }
    });
  };

  const effectiveTime = isCustomTime ? (customTimeInput.trim() || '10:00 AM') : sessionTime;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Client full name and email are required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const targetDays = getTargetDays();
      const targetDayNames = targetDays.map(d => DAY_LABELS.find(dl => dl.id === d)?.full || '');

      const payload = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password.trim() || 'client123',
        trainingMode,
        trainingType: trainingMode === 'online' ? 'Online Coaching' : 'Offline Studio Coaching',
        trainingDays: targetDayNames,
        sessionTime: effectiveTime,
        startDate,
        monthlyPrice: Number(monthlyPrice) || 18000,
        sessionsPurchased: 12,
        paymentStatus: 'paid', // Prepaid beforehand
        paymentMethod,
        paymentReference: paymentReference.trim(),
        profileCompleted: false, // Client fills height, weight, DOB, phone & goals on login

        // Auto-generate 12 scheduled sessions
        autoSchedule: {
          enabled: true,
          startDate,
          scheduleOption: scheduleOption === 'custom' ? 'CUSTOM' : scheduleOption,
          targetDays,
          time: effectiveTime,
          sessionCount: 12,
          location: trainingMode === 'online' ? 'Online Video Call (Zoom / Google Meet)' : 'The Push Fitness Studio',
          sessionType: trainingMode === 'online' ? 'Online 1-on-1 Live Coaching' : 'Offline 1-on-1 Studio Session'
        }
      };

      const created = await api.createClient(payload);
      showToast(`🎉 ${created.name} onboarded! 12 ${trainingMode === 'online' ? 'Online' : 'Studio'} sessions auto-scheduled on ${getTargetDayNames()} at ${effectiveTime}.`);
      onClientAdded(created);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to create client', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl my-8 space-y-5 animate-fade-in relative">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                <span>Quick Add Client</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fast 1-minute onboarding. Client completes body metrics & goals on login.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Client Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Password and Training Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Client Login Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white font-mono placeholder-slate-600 focus:border-emerald-500 outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Default: client123 (editable)</span>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Training Mode <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTrainingMode('offline')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    trainingMode === 'offline'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>🏋️ Offline Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTrainingMode('online')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    trainingMode === 'online'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>🌐 Online Live</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {trainingMode === 'offline' ? 'In-person coaching at Studio' : 'Virtual sessions via Zoom / Meet'}
              </span>
            </div>
          </div>

          {/* Row 3: Training Days (Option 1 vs Option 2 vs Custom) */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Training Days (3 Days / Week)</span>
              </label>
              <span className="text-[11px] font-semibold text-emerald-400">{getTargetDayNames()}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScheduleOption('MWF')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition text-center ${
                  scheduleOption === 'MWF'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                Mon / Wed / Fri
              </button>

              <button
                type="button"
                onClick={() => setScheduleOption('TTS')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition text-center ${
                  scheduleOption === 'TTS'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                Tue / Thu / Sat
              </button>

              <button
                type="button"
                onClick={() => setScheduleOption('custom')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition text-center ${
                  scheduleOption === 'custom'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                Custom Days
              </button>
            </div>

            {/* If Custom Days selected */}
            {scheduleOption === 'custom' && (
              <div className="pt-2 flex flex-wrap items-center gap-1.5 animate-fade-in">
                {DAY_LABELS.map(d => {
                  const isSelected = customDays.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleCustomDay(d.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                        isSelected 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Row 4: Timings and Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Session Timing <span className="text-red-400">*</span>
              </label>
              {!isCustomTime ? (
                <div className="flex space-x-1.5">
                  <select
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-emerald-500"
                  >
                    {PRESET_TIMES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCustomTime(true)}
                    className="px-2.5 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-[11px] font-semibold"
                    title="Type custom time"
                  >
                    Custom
                  </button>
                </div>
              ) : (
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    placeholder="e.g. 11:30 AM"
                    value={customTimeInput}
                    onChange={(e) => setCustomTimeInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomTime(false)}
                    className="px-2.5 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-[11px] font-semibold"
                  >
                    Presets
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Start Date (First Session) <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Row 5: Prepaid Package & Billing (Pre-filled ₹18,000 for 12 Sessions) */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Prepaid Coaching Package</span>
                  <span className="text-[10px] text-slate-400">Charged beforehand • 12 Sessions</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-400">₹{Number(monthlyPrice).toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block">/ 12 Sessions</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-emerald-500/20">
              <div>
                <label className="text-slate-400 text-[11px] font-semibold block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs"
                >
                  <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] font-semibold block mb-1">UPI Ref / Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. GPay UPI Txn Ref"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs placeholder-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Client Self-Onboarding Notice */}
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start space-x-2.5 text-[11px] text-slate-400 leading-relaxed">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Client Self-Onboarding Active:</strong> The client will be asked to add their <span className="text-emerald-400">profile photo, birthdate, phone number, height, weight, and fitness goals</span> when they log into the client portal.
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <span>Adding Client...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>⚡ Onboard Client & Schedule 12 Sessions</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
