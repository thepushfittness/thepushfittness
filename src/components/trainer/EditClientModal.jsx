import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  X, 
  User, 
  Dumbbell, 
  Apple, 
  DollarSign, 
  Plus, 
  Trash2, 
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export function EditClientModal({ isOpen, onClose, client, initialStep = 1, onClientUpdated }) {
  const { showToast } = useNotifications();
  const [activeStep, setActiveStep] = useState(initialStep);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Female',
    occupation: '',
    emergencyContact: '',
    startDate: '',
    status: 'active',
    acquisitionSource: 'Website',
    trainingType: '',
    trainingFrequency: '',
    currentGoal: '',

    // Fitness
    heightCm: 170,
    weightKg: 70,
    startingWeightKg: 70,
    targetWeightKg: 65,
    trainingExperience: '',
    fitnessLevel: 'Intermediate',
    injuries: '',
    restrictions: '',
    equipmentAvailability: '',
    lifestyleLevel: '',

    // Nutrition
    dietaryPreference: '',
    allergies: '',
    foodsAvoided: '',
    dailyCalorieTarget: 2000,
    proteinTargetG: 140,
    carbsTargetG: 200,
    fatsTargetG: 60,
    waterTargetMl: 2500,
    nutritionNotes: '',

    // Package & Billing
    planName: '',
    monthlyPrice: 5000,
    billingCycle: 'Monthly',
    sessionsPurchased: 12,
    sessionsCompleted: 0,
    paymentStatus: 'due',
    nextPaymentDate: '',

    customFields: {}
  });

  const [customKey, setCustomKey] = useState('');
  const [customVal, setCustomVal] = useState('');

  useEffect(() => {
    if (client && isOpen) {
      setActiveStep(initialStep || 1);
      setFormData({
        name: client.name || '',
        email: client.email || '',
        password: client.password || '',
        phone: client.phone || '',
        dateOfBirth: client.dateOfBirth || '',
        gender: client.gender || 'Not specified',
        occupation: client.occupation || '',
        emergencyContact: client.emergencyContact || '',
        startDate: client.startDate || new Date().toISOString().split('T')[0],
        status: client.status || 'active',
        acquisitionSource: client.acquisitionSource || 'Website',
        trainingType: client.trainingType || 'Hybrid Coaching',
        trainingFrequency: client.trainingFrequency || '3x per week',
        currentGoal: client.currentGoal || 'General Fitness',

        heightCm: client.heightCm ?? 170,
        weightKg: client.weightKg ?? 70,
        startingWeightKg: client.startingWeightKg ?? client.weightKg ?? 70,
        targetWeightKg: client.targetWeightKg ?? 65,
        trainingExperience: client.trainingExperience || 'Beginner',
        fitnessLevel: client.fitnessLevel || 'Beginner',
        injuries: client.injuries || 'None',
        restrictions: client.restrictions || 'None',
        equipmentAvailability: client.equipmentAvailability || 'Gym',
        lifestyleLevel: client.lifestyleLevel || 'Moderate',

        dietaryPreference: client.dietaryPreference || 'Omnivore',
        allergies: client.allergies || 'None',
        foodsAvoided: client.foodsAvoided || 'None',
        dailyCalorieTarget: client.dailyCalorieTarget ?? 2000,
        proteinTargetG: client.proteinTargetG ?? 140,
        carbsTargetG: client.carbsTargetG ?? 200,
        fatsTargetG: client.fatsTargetG ?? 60,
        waterTargetMl: client.waterTargetMl ?? 2500,
        nutritionNotes: client.nutritionNotes || '',

        planName: client.planName || 'Personal Coaching Package',
        monthlyPrice: client.monthlyPrice ?? 5000,
        billingCycle: client.billingCycle || 'Monthly',
        sessionsPurchased: client.sessionsPurchased ?? 12,
        sessionsCompleted: client.sessionsCompleted ?? 0,
        paymentStatus: client.paymentStatus || 'due',
        nextPaymentDate: client.nextPaymentDate || '',

        customFields: { ...(client.customFields || {}) }
      });
    }
  }, [client, isOpen, initialStep]);

  if (!isOpen || !client) return null;

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
      setSaving(true);
      const updated = await api.updateClient(client.id, formData);
      showToast(`Saved changes for ${updated.name}!`);
      if (onClientUpdated) onClientUpdated(updated);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to update client details', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl my-8 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white">Edit Client Profile — {client.name}</h2>
            <p className="text-xs text-slate-400">Modify personal info, health metrics, nutrition targets, or billing plan</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs">
          {[
            { step: 1, label: 'Personal & Login', icon: User },
            { step: 2, label: 'Fitness & Health', icon: Dumbbell },
            { step: 3, label: 'Nutrition Targets', icon: Apple },
            { step: 4, label: 'Plan & Billing', icon: DollarSign }
          ].map(s => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(s.step)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                  isCurrent ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* TAB 1: PERSONAL & LOGIN */}
          {activeStep === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Login Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Client Login Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Set new password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-emerald-400 font-mono font-medium focus:border-emerald-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Lifecycle Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="paused">Paused</option>
                    <option value="expired">Expired</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Acquisition Source</label>
                  <select
                    value={formData.acquisitionSource}
                    onChange={(e) => setFormData({ ...formData, acquisitionSource: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                    <option value="Website">Website</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Existing client">Existing client</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FITNESS & HEALTH */}
          {activeStep === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Primary Goal</label>
                  <input
                    type="text"
                    value={formData.currentGoal}
                    onChange={(e) => setFormData({ ...formData, currentGoal: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Training Type</label>
                  <input
                    type="text"
                    value={formData.trainingType}
                    onChange={(e) => setFormData({ ...formData, trainingType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Weekly Frequency</label>
                  <input
                    type="text"
                    value={formData.trainingFrequency}
                    onChange={(e) => setFormData({ ...formData, trainingFrequency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Starting Wt (kg)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={formData.startingWeightKg}
                    onChange={(e) => setFormData({ ...formData, startingWeightKg: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Current Wt (kg)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Target Wt (kg)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={formData.targetWeightKg}
                    onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Training Experience</label>
                  <input
                    type="text"
                    value={formData.trainingExperience}
                    onChange={(e) => setFormData({ ...formData, trainingExperience: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Fitness Level</label>
                  <select
                    value={formData.fitnessLevel}
                    onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Athlete">Athlete</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Equipment Access</label>
                  <input
                    type="text"
                    value={formData.equipmentAvailability}
                    onChange={(e) => setFormData({ ...formData, equipmentAvailability: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Injuries & Limitations</label>
                  <input
                    type="text"
                    value={formData.injuries}
                    onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Movement Restrictions</label>
                  <input
                    type="text"
                    value={formData.restrictions}
                    onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NUTRITION TARGETS */}
          {activeStep === 3 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Daily Calories</label>
                  <input
                    type="number"
                    value={formData.dailyCalorieTarget}
                    onChange={(e) => setFormData({ ...formData, dailyCalorieTarget: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={formData.proteinTargetG}
                    onChange={(e) => setFormData({ ...formData, proteinTargetG: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={formData.carbsTargetG}
                    onChange={(e) => setFormData({ ...formData, carbsTargetG: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={formData.fatsTargetG}
                    onChange={(e) => setFormData({ ...formData, fatsTargetG: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Water (ml)</label>
                  <input
                    type="number"
                    value={formData.waterTargetMl}
                    onChange={(e) => setFormData({ ...formData, waterTargetMl: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-blue-400 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Dietary Style</label>
                  <input
                    type="text"
                    value={formData.dietaryPreference}
                    onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Allergies</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Foods Avoided</label>
                  <input
                    type="text"
                    value={formData.foodsAvoided}
                    onChange={(e) => setFormData({ ...formData, foodsAvoided: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Coach Nutrition Protocol Notes</label>
                <textarea
                  rows={2}
                  value={formData.nutritionNotes}
                  onChange={(e) => setFormData({ ...formData, nutritionNotes: e.target.value })}
                  placeholder="Meal timing instructions, supplements, hydration reminders..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 4: PLAN & BILLING */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Package / Plan Name</label>
                  <input
                    type="text"
                    value={formData.planName}
                    onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Monthly Price (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Billing Cycle</label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annual">Semi-Annual</option>
                    <option value="Annual">Annual</option>
                    <option value="One-Time Package">One-Time Package</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Sessions Purchased</label>
                  <input
                    type="number"
                    value={formData.sessionsPurchased}
                    onChange={(e) => setFormData({ ...formData, sessionsPurchased: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Sessions Completed</label>
                  <input
                    type="number"
                    value={formData.sessionsCompleted}
                    onChange={(e) => setFormData({ ...formData, sessionsCompleted: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="paid">Paid</option>
                    <option value="due">Due Soon</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Next Payment Date</label>
                  <input
                    type="date"
                    value={formData.nextPaymentDate}
                    onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Custom Fields Manager */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-slate-300 font-semibold block">Custom Fields</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Field Name (e.g. Target Event)"
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
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-xl"
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

          {/* Footer Action Buttons (Always visible on every tab) */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-500">
              Switch between tabs above or click Save Changes anytime.
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-450 disabled:bg-emerald-600/50 text-slate-950 font-display font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
