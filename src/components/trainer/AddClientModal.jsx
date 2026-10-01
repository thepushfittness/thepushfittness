import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { X, User, Dumbbell, Apple, DollarSign, Plus, Trash2 } from 'lucide-react';

export function AddClientModal({ isOpen, onClose, onClientAdded }) {
  const { showToast } = useNotifications();
  const [activeStep, setActiveStep] = useState(1); // 1: Personal, 2: Fitness, 3: Nutrition, 4: Package

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '1995-05-15',
    gender: 'Female',
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

    // Package
    planName: 'Performance Hybrid Package',
    monthlyPrice: 380,
    billingCycle: 'Monthly',
    sessionsPurchased: 12,
    paymentStatus: 'due',
    nextPaymentDate: new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],

    customFields: {}
  });

  const [customKey, setCustomKey] = useState('');
  const [customVal, setCustomVal] = useState('');

  if (!isOpen) return null;

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
      const created = await api.createClient(formData);
      showToast(`Client ${created.name} onboarded successfully!`);
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
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessica Miller"
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
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Water (ml)</label>
                  <input
                    type="number"
                    value={formData.waterTargetMl}
                    onChange={(e) => setFormData({ ...formData, waterTargetMl: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-blue-400"
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
                  <label className="text-slate-400 font-semibold block mb-1">Monthly Price ($)</label>
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
                  <label className="text-slate-400 font-semibold block mb-1">Next Payment Date</label>
                  <input
                    type="date"
                    value={formData.nextPaymentDate}
                    onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
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
