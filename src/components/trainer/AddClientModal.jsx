import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { X, User, Dumbbell, Apple, DollarSign, Plus, Trash2, Camera, Upload, Calendar, Clock, CheckCircle2, Sparkles, Check } from 'lucide-react';

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

export function AddClientModal({ isOpen, onClose, onClientAdded }) {
  const { showToast } = useNotifications();
  const [activeStep, setActiveStep] = useState(1); // 1: Personal, 2: Fitness, 3: Nutrition, 4: Package

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'client123',
    phone: '',
    avatar: MALE_AVATAR_PRESETS[0],
    allowClientPhotoUpload: true,
    dateOfBirth: '1995-05-15',
    gender: 'Male',
    occupation: '',
    emergencyContact: '',
    startDate: new Date().toISOString().split('T')[0],
    trainingType: 'Hybrid (1-on-1 + App Coaching)',
    trainingFrequency: '4x per week',
    currentGoal: 'Fat Loss & Strength',
    status: 'onboarding',

    // Fitness
    heightCm: 168,
    weightKg: 65,
    targetWeightKg: 60,
    trainingExperience: 'Intermediate (1-2 years)',
    fitnessLevel: 'Intermediate',
    injuries: 'None',
    restrictions: 'None',
    equipmentAvailability: 'Commercial Gym',
    lifestyleLevel: 'Moderate (Desk job + walking)',

    // Nutrition
    dietaryPreference: 'Flexible Omnivore',
    allergies: 'None',
    foodsAvoided: 'None',
    dailyCalorieTarget: 1800,
    proteinTargetG: 130,
    carbsTargetG: 180,
    fatsTargetG: 55,
    waterTargetMl: 2800,
    nutritionNotes: '',

    // Package & Upfront Billing
    planName: 'Personal Coaching Package (12 Sessions)',
    monthlyPrice: 18000,
    billingCycle: 'Monthly',
    sessionsPurchased: 12,
    paymentStatus: 'paid', // Prepaid upfront model
    paymentMethod: 'UPI (GPay / PhonePe)',
    paymentReference: '',
    nextPaymentDate: new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],

    customFields: {}
  });

  // Auto-Schedule 3-Days/Week States
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(true);
  const [scheduleStartDate, setScheduleStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleOption, setScheduleOption] = useState('MWF'); // 'MWF' = Option 1: Mon/Wed/Fri, 'TTS' = Option 2: Tue/Thu/Sat
  const [sessionTime, setSessionTime] = useState('10:00 AM');
  const [sessionLocation, setSessionLocation] = useState('The Push Fitness Studio');

  const [customKey, setCustomKey] = useState('');
  const [customVal, setCustomVal] = useState('');

  if (!isOpen) return null;

  // Calculate live preview dates for auto-scheduling
  const getSchedulePreview = () => {
    if (!scheduleStartDate) return [];
    const targetDays = scheduleOption === 'TTS' ? [2, 4, 6] : [1, 3, 5];
    const [year, month, day] = scheduleStartDate.split('-').map(Number);
    if (!year || !month || !day) return [];
    const cur = new Date(year, month - 1, day);
    const count = Number(formData.sessionsPurchased) || 12;
    const dates = [];
    let safety = 0;
    while (dates.length < count && safety < 400) {
      if (targetDays.includes(cur.getDay())) {
        dates.push(new Date(cur));
      }
      cur.setDate(cur.getDate() + 1);
      safety++;
    }
    return dates;
  };
  const previewDates = getSchedulePreview();

  const handleAddCustomField = () => {
    if (!customKey.trim() || !customVal.trim()) return;
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [customKey.trim()]: customVal.trim()
      }
    }));
    setCustomKey('');
    setCustomVal('');
  };

  const handleRemoveCustomField = (key) => {
    setFormData(prev => {
      const copy = { ...prev.customFields };
      delete copy[key];
      return { ...prev, customFields: copy };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Client name and email are required', 'error');
      return;
    }

    try {
      const sessionCount = Number(formData.sessionsPurchased) || 12;
      const payload = {
        ...formData,
        autoSchedule: {
          enabled: autoScheduleEnabled,
          startDate: scheduleStartDate,
          scheduleOption: scheduleOption, // 'MWF' or 'TTS'
          time: sessionTime,
          sessionCount: sessionCount,
          location: sessionLocation,
          sessionType: 'Personal Training Session'
        }
      };
      const created = await api.createClient(payload);
      showToast(`Client ${created.name} onboarded successfully!${autoScheduleEnabled ? ` ${sessionCount} coaching sessions auto-scheduled on ${scheduleOption === 'TTS' ? 'Tue/Thu/Sat' : 'Mon/Wed/Fri'}.` : ''}`);
      onClientAdded(created);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to create client', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl my-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white">Add New Client to Roster</h2>
            <p className="text-xs text-slate-400">Initialize profile, health metrics, and coaching subscription</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-xs">
          {[
            { step: 1, label: 'Personal', icon: User },
            { step: 2, label: 'Fitness & Health', icon: Dumbbell },
            { step: 3, label: 'Nutrition', icon: Apple },
            { step: 4, label: 'Plan & Package', icon: DollarSign }
          ].map(s => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(s.step)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl font-bold transition ${
                  isCurrent ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* STEP 1: PERSONAL INFORMATION */}
          {activeStep === 1 && (
            <div className="space-y-4">
              {/* Client Avatar Selector */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={formData.avatar}
                      alt="Avatar Preview"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md bg-slate-900 shrink-0"
                      onError={(e) => {
                        e.target.src = formData.gender === 'Female' ? FEMALE_AVATAR_PRESETS[0] : MALE_AVATAR_PRESETS[0];
                      }}
                    />
                    <div>
                      <label className="text-slate-200 font-bold block text-xs">Client Avatar & Profile Photo</label>
                      <p className="text-[11px] text-slate-400">Choose an athletic avatar preset, upload a photo, or paste a URL</p>
                    </div>
                  </div>

                  <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs cursor-pointer flex items-center space-x-1.5 transition self-start sm:self-auto">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setFormData(prev => ({ ...prev, avatar: ev.target.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Quick Preset Avatars */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Choose from {formData.gender === 'Female' ? 'Female' : 'Male'} Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newGender = formData.gender === 'Female' ? 'Male' : 'Female';
                        const newPresets = newGender === 'Female' ? FEMALE_AVATAR_PRESETS : MALE_AVATAR_PRESETS;
                        setFormData(prev => ({ ...prev, gender: newGender, avatar: newPresets[0] }));
                      }}
                      className="text-emerald-400 hover:underline font-semibold"
                    >
                      Switch to {formData.gender === 'Female' ? 'Male' : 'Female'} Presets
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(formData.gender === 'Female' ? FEMALE_AVATAR_PRESETS : MALE_AVATAR_PRESETS).map((presetUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatar: presetUrl }))}
                        className={`relative rounded-xl overflow-hidden border-2 transition ${
                          formData.avatar === presetUrl ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20' : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={presetUrl} alt="Preset" className="w-10 h-10 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase shrink-0">Or Image URL:</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.avatar.startsWith('data:') ? '(Uploaded photo from device)' : formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Client Login Password</label>
                  <input
                    type="text"
                    placeholder="client123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => {
                      const newGender = e.target.value;
                      const isFemale = newGender === 'Female';
                      const defaultAvatar = isFemale ? FEMALE_AVATAR_PRESETS[0] : MALE_AVATAR_PRESETS[0];
                      setFormData(prev => ({
                        ...prev,
                        gender: newGender,
                        avatar: prev.avatar.startsWith('data:') ? prev.avatar : defaultAvatar
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Attorney, Architect, Engineer"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="Name & Contact Phone"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Primary Goal</label>
                  <input
                    type="text"
                    placeholder="Fat Loss, Hypertrophy, Mobility"
                    value={formData.currentGoal}
                    onChange={(e) => setFormData({ ...formData, currentGoal: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Training Frequency</label>
                  <input
                    type="text"
                    placeholder="3x per week"
                    value={formData.trainingFrequency}
                    onChange={(e) => setFormData({ ...formData, trainingFrequency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FITNESS & HEALTH */}
          {activeStep === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Current Weight (kg)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Target Weight (kg)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={formData.targetWeightKg}
                    onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Injuries, Limitations or Joint Pain</label>
                <input
                  type="text"
                  placeholder="e.g. Previous knee ACL reconstruction or lower back tightness"
                  value={formData.injuries}
                  onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Equipment Access</label>
                <input
                  type="text"
                  placeholder="e.g. Full Commercial Gym, Home Gym, Dumbbells only"
                  value={formData.equipmentAvailability}
                  onChange={(e) => setFormData({ ...formData, equipmentAvailability: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 3: NUTRITION TARGETS */}
          {activeStep === 3 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Daily Calories</label>
                  <input
                    type="number"
                    value={formData.dailyCalorieTarget}
                    onChange={(e) => setFormData({ ...formData, dailyCalorieTarget: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={formData.proteinTargetG}
                    onChange={(e) => setFormData({ ...formData, proteinTargetG: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={formData.carbsTargetG}
                    onChange={(e) => setFormData({ ...formData, carbsTargetG: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={formData.fatsTargetG}
                    onChange={(e) => setFormData({ ...formData, fatsTargetG: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Water (ml)</label>
                  <input
                    type="number"
                    value={formData.waterTargetMl}
                    onChange={(e) => setFormData({ ...formData, waterTargetMl: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-blue-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Allergies & Restrictions</label>
                <input
                  type="text"
                  placeholder="e.g. Shellfish, dairy intolerance, peanuts"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 4: PACKAGE & BILLING */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Package / Plan Name</label>
                  <input
                    type="text"
                    value={formData.planName}
                    onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Monthly Price (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Sessions Included</label>
                  <input
                    type="number"
                    value={formData.sessionsPurchased}
                    onChange={(e) => setFormData({ ...formData, sessionsPurchased: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Next Renewal Date</label>
                  <input
                    type="date"
                    value={formData.nextPaymentDate}
                    onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Upfront Advance Payment Options */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-bold text-xs">Prepaid Billing Status (Charged Beforehand)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Prepaid Model
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentStatus: 'paid' })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      formData.paymentStatus === 'paid'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold text-[10px] uppercase">Paid Upfront</span>
                      {formData.paymentStatus === 'paid' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-xs font-semibold text-white mt-0.5">₹{formData.monthlyPrice.toLocaleString()} Paid in Advance</div>
                    <div className="text-[10px] text-slate-400">Activates {formData.sessionsPurchased} sessions immediately</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentStatus: 'due' })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      formData.paymentStatus === 'due'
                        ? 'bg-amber-500/15 border-amber-500 text-white font-bold shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold text-[10px] uppercase">Payment Pending</span>
                      {formData.paymentStatus === 'due' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-xs font-semibold text-white mt-0.5">Pay on 1st Session</div>
                    <div className="text-[10px] text-slate-400">Mark as payment due</div>
                  </button>
                </div>

                {formData.paymentStatus === 'paid' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-slate-400 text-[11px] font-semibold block mb-1">Payment Method</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                      >
                        <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe / Paytm)</option>
                        <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                        <option value="Cash">Cash (Handed in Studio)</option>
                        <option value="Debit / Credit Card">Debit / Credit Card</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 text-[11px] font-semibold block mb-1">Payment Reference (Optional)</label>
                      <input
                        type="text"
                        placeholder="UPI UTR or Txn ID"
                        value={formData.paymentReference}
                        onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* AUTO-SCHEDULE 3-DAYS/WEEK DIRECTLY FROM START DATE */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-bold text-sm">Auto-Schedule Coaching Sessions (3 Days/Week)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={autoScheduleEnabled} 
                      onChange={(e) => setAutoScheduleEnabled(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                <p className="text-slate-400 text-xs">
                  Automatically populates all {formData.sessionsPurchased || 12} package sessions on your calendar 3 days a week directly from the start date.
                </p>

                {autoScheduleEnabled && (
                  <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 space-y-4">
                    {/* Start Date Picker */}
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1 text-xs flex items-center justify-between">
                        <span>Training Start Date (First Session)</span>
                        <span className="text-slate-500 text-[11px]">Sessions generated from this day</span>
                      </label>
                      <input
                        type="date"
                        value={scheduleStartDate}
                        onChange={(e) => setScheduleStartDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white text-xs"
                        required
                      />
                    </div>

                    {/* 2 Selectable Schedule Options */}
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1.5 text-xs">
                        Select 3-Days Weekly Schedule:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Option 1 */}
                        <div
                          onClick={() => setScheduleOption('MWF')}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition relative ${
                            scheduleOption === 'MWF'
                              ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${scheduleOption === 'MWF' ? 'text-emerald-400' : 'text-slate-400'}`}>
                              Option 1
                            </span>
                            {scheduleOption === 'MWF' && (
                              <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="font-extrabold text-white text-xs mt-1">
                            Monday • Wednesday • Friday
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Standard MWF schedule with weekends off
                          </p>
                        </div>

                        {/* Option 2 */}
                        <div
                          onClick={() => setScheduleOption('TTS')}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition relative ${
                            scheduleOption === 'TTS'
                              ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${scheduleOption === 'TTS' ? 'text-emerald-400' : 'text-slate-400'}`}>
                              Option 2
                            </span>
                            {scheduleOption === 'TTS' && (
                              <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="font-extrabold text-white text-xs mt-1">
                            Tuesday • Thursday • Saturday
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            TTS split with Sunday & Monday off
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Time & Location */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1 text-xs">Session Time</label>
                        <select
                          value={sessionTime}
                          onChange={(e) => setSessionTime(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white text-xs"
                        >
                          {[
                            '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
                            '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
                          ].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1 text-xs">Training Studio</label>
                        <input
                          type="text"
                          value={sessionLocation}
                          onChange={(e) => setSessionLocation(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Dynamic Schedule Preview */}
                    {previewDates && previewDates.length > 0 && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-1">
                        <div className="flex items-center text-emerald-400 font-bold space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Auto-Schedule Preview: {previewDates.length} Sessions Queued</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          • Session #1: <strong className="text-white">{previewDates[0].toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong> at {sessionTime}
                        </p>
                        <p className="text-slate-300 text-[11px]">
                          • Session #{previewDates.length}: <strong className="text-white">{previewDates[previewDates.length - 1].toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                        </p>
                        <p className="text-slate-400 text-[10px] mt-1 italic">
                          All sessions will be directly editable and reschedulable anytime in your Coaching Calendar.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Custom Fields Manager */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-slate-300 font-semibold block">Add Custom Field</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Field Name (e.g. Target Marathon)"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={customVal}
                    onChange={(e) => setCustomVal(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="px-3 py-1.5 bg-slate-800 text-emerald-400 font-bold rounded-xl"
                  >
                    + Add
                  </button>
                </div>

                {Object.entries(formData.customFields).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center bg-slate-950 p-2 rounded-lg text-slate-300">
                    <span>{k}: <strong className="text-white">{v}</strong></span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(k)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
              >
                Back
              </button>
            ) : <div />}

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
              >
                Cancel
              </button>
              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-450"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 text-slate-950 font-display font-extrabold rounded-xl hover:bg-emerald-450 shadow-lg shadow-emerald-500/20"
                >
                  Create & Onboard Client
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
