import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  User, 
  ArrowLeft, 
  Dumbbell, 
  Apple, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Image as ImageIcon, 
  FileText, 
  MessageSquare, 
  ClipboardCheck, 
  Clock, 
  Flame, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Send, 
  Edit3, 
  Sparkles, 
  Download,
  Share2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

export function ClientProfileView({ 
  clientId, 
  initialTab = 'overview', 
  onBack,
  onOpenSchedule,
  onOpenPayment,
  onOpenProgram,
  onGenerateReport
}) {
  const { showToast } = useNotifications();
  const [client, setClient] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  // Tab-specific datasets
  const [programs, setPrograms] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [perfMetrics, setPerfMetrics] = useState([]);
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [timeline, setTimeline] = useState([]);

  // Modals & sub-states
  const [newMessageText, setNewMessageText] = useState('');
  const [messageCategory, setMessageCategory] = useState('general');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isNotePrivate, setIsNotePrivate] = useState(true);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  // Photo comparison state
  const [beforePhotoId, setBeforePhotoId] = useState(null);
  const [afterPhotoId, setAfterPhotoId] = useState(null);

  // Check-in review state
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [trainerFeedbackText, setTrainerFeedbackText] = useState('');

  const loadClientData = async () => {
    try {
      setLoading(true);
      const [
        clientData,
        programsData,
        workoutLogsData,
        nutritionLogsData,
        sessionsData,
        paymentsData,
        measData,
        perfData,
        photosData,
        notesData,
        messagesData,
        checkinsData,
        timelineData
      ] = await Promise.all([
        api.getClient(clientId),
        api.getPrograms(clientId),
        api.getWorkoutLogs(clientId),
        api.getNutritionLogs(clientId),
        api.getSessions({ clientId }),
        api.getPayments({ clientId }),
        api.getMeasurements(clientId),
        api.getPerformanceMetrics(clientId),
        api.getProgressPhotos(clientId),
        api.getNotes(clientId),
        api.getMessages(clientId),
        api.getCheckins(clientId),
        api.getTimeline(clientId)
      ]);

      setClient(clientData);
      setPrograms(programsData || []);
      setWorkoutLogs(workoutLogsData || []);
      setNutritionLogs(nutritionLogsData || []);
      setSessions(sessionsData || []);
      setPayments(paymentsData || []);
      setMeasurements(measData || []);
      setPerfMetrics(perfData || []);
      setProgressPhotos(photosData || []);
      setNotes(notesData || []);
      setMessages(messagesData || []);
      setCheckins(checkinsData || []);
      setTimeline(timelineData || []);

      if (photosData && photosData.length >= 2) {
        setBeforePhotoId(photosData[0].id);
        setAfterPhotoId(photosData[photosData.length - 1].id);
      } else if (photosData && photosData.length === 1) {
        setBeforePhotoId(photosData[0].id);
        setAfterPhotoId(photosData[0].id);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load client profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    try {
      const sent = await api.sendMessage({
        clientId: client.id,
        recipientId: client.userId,
        text: newMessageText,
        category: messageCategory
      });
      setMessages(prev => [...prev, sent]);
      setNewMessageText('');
      showToast('Message sent to client');
    } catch (err) {
      showToast('Failed to send message', 'error');
    }
  };

  // Handle adding trainer note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    try {
      const added = await api.createNote({
        clientId: client.id,
        title: newNoteTitle,
        content: newNoteContent,
        isPrivateToTrainer: isNotePrivate
      });
      setNotes(prev => [added, ...prev]);
      setShowAddNoteModal(false);
      setNewNoteTitle('');
      setNewNoteContent('');
      showToast(isNotePrivate ? 'Private trainer note saved' : 'Shared note added for client');
    } catch (err) {
      showToast('Failed to add note', 'error');
    }
  };

  // Handle review check-in
  const handleReviewCheckinSubmit = async (checkinId) => {
    if (!trainerFeedbackText.trim()) return;
    try {
      const updated = await api.reviewCheckin(checkinId, trainerFeedbackText);
      setCheckins(prev => prev.map(c => c.id === checkinId ? updated : c));
      setSelectedCheckin(null);
      setTrainerFeedbackText('');
      showToast('Check-in feedback delivered to client!');
    } catch (err) {
      showToast('Failed to submit feedback', 'error');
    }
  };

  // Toggle marketing consent
  const handleToggleConsent = async () => {
    try {
      const newConsent = !client.consentForMarketingPhotos;
      const updated = await api.updateClient(client.id, { consentForMarketingPhotos: newConsent });
      setClient(updated);
      showToast(`Marketing photo consent updated: ${newConsent ? 'Granted' : 'Revoked'}`);
    } catch (err) {
      showToast('Failed to update consent', 'error');
    }
  };

  if (loading || !client) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Weight progression calculation
  const weightDiff = Number((client.weightKg - client.startingWeightKg).toFixed(1));

  // Chart data for weight progress
  const weightChartData = measurements.map(m => ({
    date: new Date(m.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    weight: m.weightKg,
    bodyFat: m.bodyFatPercent
  }));

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'history', label: 'Workout History', icon: Clock },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'sessions', label: `Sessions (${client.sessionsRemaining} left)`, icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'progress', label: 'Measurements & PRs', icon: TrendingUp },
    { id: 'photos', label: 'Before & After', icon: ImageIcon },
    { id: 'notes', label: 'Trainer Notes', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'checkins', label: 'Check-ins', icon: ClipboardCheck },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];

  const beforePhoto = progressPhotos.find(p => p.id === beforePhotoId);
  const afterPhoto = progressPhotos.find(p => p.id === afterPhotoId);

  return (
    <div className="space-y-6 pb-16">
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Clients</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onGenerateReport(client.id)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Generate PDF Report</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('messages');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 text-xs font-semibold transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Message</span>
          </button>
          <button
            onClick={() => onOpenSchedule(client.id)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Session</span>
          </button>
        </div>
      </div>

      {/* Hero Client Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar & Core Bio */}
          <div className="flex items-start sm:items-center space-x-4">
            <img
              src={client.avatar}
              alt={client.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-500/40 object-cover shadow-lg"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  {client.name}
                </h1>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                  client.status === 'active' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : client.status === 'onboarding'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {client.status}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                  client.paymentStatus === 'paid'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  {client.paymentStatus === 'paid' ? 'Paid' : 'Payment Overdue'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>🎯 {client.currentGoal}</span>
                <span>•</span>
                <span>📅 Client since {new Date(client.startDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>💼 {client.occupation || 'Professional'}</span>
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
                <span className="text-slate-300">
                  Current: <strong className="text-white">{client.weightKg} kg</strong>
                </span>
                <span className={`font-semibold ${weightDiff <= 0 ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {weightDiff <= 0 ? `▼ ${Math.abs(weightDiff)} kg` : `▲ +${weightDiff} kg`} from start
                </span>
                <span className="text-slate-400">
                  Target: <strong className="text-slate-200">{client.targetWeightKg} kg</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Adherence & Session Progress Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Training Adherence</span>
              <span className="text-lg font-display font-extrabold text-emerald-400 mt-0.5 block">
                {client.workoutAdherence}%
              </span>
              <span className="text-[10px] text-slate-500">Target 4x/wk</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Nutrition Compliance</span>
              <span className="text-lg font-display font-extrabold text-cyan-400 mt-0.5 block">
                {client.nutritionAdherence}%
              </span>
              <span className="text-[10px] text-slate-500">{client.dailyCalorieTarget} kcal/day</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Package Balance</span>
              <span className="text-lg font-display font-extrabold text-amber-400 mt-0.5 block">
                {client.sessionsRemaining} left
              </span>
              <span className="text-[10px] text-slate-500">{client.sessionsCompleted} of {client.sessionsPurchased} used</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pt-6 mt-6 border-t border-slate-800/80 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fitness & Personal Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <span>Fitness Profile & Movement Background</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Height</span>
                  <span className="font-semibold text-slate-200">{client.heightCm} cm</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Current Weight</span>
                  <span className="font-semibold text-slate-200">{client.weightKg} kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Starting Weight</span>
                  <span className="font-semibold text-slate-200">{client.startingWeightKg} kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Experience</span>
                  <span className="font-semibold text-slate-200">{client.trainingExperience}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Fitness Level</span>
                  <span className="font-semibold text-slate-200">{client.fitnessLevel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Weekly Frequency</span>
                  <span className="font-semibold text-slate-200">{client.trainingFrequency}</span>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-3 space-y-2 text-xs">
                <div>
                  <span className="text-amber-400 font-semibold block">⚠️ Injuries & Limitations:</span>
                  <p className="text-slate-300 mt-0.5">{client.injuries || 'None reported'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Restrictions:</span>
                  <p className="text-slate-300 mt-0.5">{client.restrictions || 'None'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Equipment Availability:</span>
                  <p className="text-slate-300 mt-0.5">{client.equipmentAvailability}</p>
                </div>
              </div>
            </div>

            {/* Nutrition Protocol */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Apple className="w-4 h-4 text-cyan-400" />
                <span>Assigned Nutrition Protocol & Daily Targets</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Daily Target</span>
                  <span className="text-base font-bold text-white">{client.dailyCalorieTarget} kcal</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Protein Target</span>
                  <span className="text-base font-bold text-emerald-400">{client.proteinTargetG} g</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Carbs Target</span>
                  <span className="text-base font-bold text-cyan-400">{client.carbsTargetG} g</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Water Target</span>
                  <span className="text-base font-bold text-blue-400">{client.waterTargetMl} ml</span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-2">
                <p className="text-slate-300"><strong>Dietary Style:</strong> {client.dietaryPreference}</p>
                <p className="text-slate-300"><strong>Allergies:</strong> {client.allergies || 'None'}</p>
                <p className="text-slate-300"><strong>Foods Avoided:</strong> {client.foodsAvoided || 'None'}</p>
                {client.nutritionNotes && (
                  <p className="text-slate-400 italic mt-2">"{client.nutritionNotes}"</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Custom Fields, Contact & Marketing Consent */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white">Client Management Data</h2>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-500 block">Phone</span>
                  <span className="text-white font-medium">{client.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Emergency Contact</span>
                  <span className="text-white font-medium">{client.emergencyContact}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Acquisition Source</span>
                  <span className="text-emerald-400 font-semibold">{client.acquisitionSource}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Active Plan</span>
                  <span className="text-white font-medium">{client.planName} (₹{client.monthlyPrice}/mo)</span>
                </div>
              </div>

              {/* Custom Fields */}
              {client.customFields && Object.keys(client.customFields).length > 0 && (
                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Custom Fields</span>
                  {Object.entries(client.customFields).map(([k, v], idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-400">{k}:</span>
                      <span className="text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Marketing Consent */}
              <div className="border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">Marketing Photo Consent</span>
                    <span className="text-[11px] text-slate-500">Allow sharing progress photos publicly</span>
                  </div>
                  <button
                    onClick={handleToggleConsent}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      client.consentForMarketingPhotos
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {client.consentForMarketingPhotos ? 'Granted' : 'Private Only'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Notes Widget */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Coach Private Notes</span>
                </h2>
                <button
                  onClick={() => setShowAddNoteModal(true)}
                  className="text-xs text-emerald-400 font-semibold hover:underline"
                >
                  + Add Note
                </button>
              </div>
              <div className="space-y-2">
                {notes.filter(n => n.isPrivateToTrainer).slice(0, 2).map((n) => (
                  <div key={n.id} className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span className="flex items-center"><Lock className="w-3 h-3 mr-1" /> {n.title}</span>
                      <span className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 mt-1 text-[11px]">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. WORKOUTS TAB */}
      {activeTab === 'workouts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Assigned Workout Programs</h2>
              <p className="text-xs text-slate-400">Programs currently prescribed for {client.name}</p>
            </div>
            <button
              onClick={() => onOpenProgram(client.id)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 text-xs font-bold rounded-xl transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Program</span>
            </button>
          </div>

          {programs.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
              <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No workout program assigned yet</p>
              <p className="text-xs text-slate-500 mt-1">Assign an existing template or create a custom periodized program.</p>
              <button
                onClick={() => onOpenProgram(client.id)}
                className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Assign Program Now
              </button>
            </div>
          ) : (
            programs.map((prog) => (
              <div key={prog.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white">{prog.name}</h3>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {prog.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Goal: {prog.goal} • {prog.durationWeeks} Weeks • {prog.daysPerWeek}x weekly frequency
                    </p>
                  </div>
                  <div className="text-xs text-slate-400">
                    Cycle: {prog.startDate} to {prog.endDate}
                  </div>
                </div>

                {prog.notes && (
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                    <strong>Coach Instructions:</strong> {prog.notes}
                  </div>
                )}

                {/* Workout Days */}
                <div className="space-y-4">
                  {prog.days?.map((day) => (
                    <div key={day.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-emerald-400">
                            Day {day.dayNumber}: {day.name}
                          </h4>
                          <p className="text-[11px] text-slate-400">Focus: {day.focus}</p>
                        </div>
                        <span className="text-xs text-slate-500">{day.exercises?.length || 0} Exercises</span>
                      </div>

                      {/* Exercises Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="text-[11px] text-slate-500 uppercase tracking-wider border-b border-slate-800/80">
                            <tr>
                              <th className="py-2 px-3">Exercise</th>
                              <th className="py-2 px-3">Sets x Reps</th>
                              <th className="py-2 px-3">Target Wt</th>
                              <th className="py-2 px-3">RPE</th>
                              <th className="py-2 px-3">Rest</th>
                              <th className="py-2 px-3">Tempo</th>
                              <th className="py-2 px-3">Video / Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {day.exercises?.map((ex) => (
                              <tr key={ex.id} className="hover:bg-slate-900/50">
                                <td className="py-2.5 px-3">
                                  <div className="font-semibold text-white">{ex.name}</div>
                                  {ex.alternative && (
                                    <div className="text-[10px] text-slate-500">Alt: {ex.alternative}</div>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 font-medium text-emerald-400">
                                  {ex.sets} × {ex.reps}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-white">
                                  {ex.targetWeightKg ? `${ex.targetWeightKg} kg` : 'Bodyweight'}
                                </td>
                                <td className="py-2.5 px-3 text-slate-300">{ex.rpe || 8}</td>
                                <td className="py-2.5 px-3 text-slate-400">{ex.restSeconds}s</td>
                                <td className="py-2.5 px-3 text-slate-400 font-mono">{ex.tempo || '2-0-1-0'}</td>
                                <td className="py-2.5 px-3">
                                  <div className="flex items-center space-x-2">
                                    {ex.videoUrl && (
                                      <a
                                        href={ex.videoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-cyan-400 hover:underline flex items-center space-x-1"
                                      >
                                        <span>Demo</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                    {ex.notes && (
                                      <span className="text-[11px] text-slate-400 truncate max-w-[140px]" title={ex.notes}>
                                        {ex.notes}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. WORKOUT HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Completed Workout Log History</h2>
          {workoutLogs.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400">
              No workout logs recorded yet.
            </div>
          ) : (
            workoutLogs.map((log) => (
              <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{log.workoutName || 'Workout Session'}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Completed on {new Date(log.date).toLocaleDateString()} • {log.durationMinutes} mins • Total Volume: {log.totalVolumeKg?.toLocaleString()} kg
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    RPE {log.rpeOverall || 8}/10
                  </span>
                </div>

                {log.notes && (
                  <p className="text-xs text-slate-300 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                    "{log.notes}"
                  </p>
                )}

                {/* Exercises logged */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {log.exercisesCompleted?.map((ex, exIdx) => (
                    <div key={exIdx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-slate-200 block truncate">{ex.exerciseName}</span>
                      <div className="space-y-0.5 text-slate-400">
                        {ex.sets?.map((s, sIdx) => (
                          <div key={sIdx} className="flex justify-between text-[11px]">
                            <span>Set {s.setNum}:</span>
                            <span className="font-medium text-emerald-400">
                              {s.weightKg}kg × {s.reps} reps (RPE {s.rpe})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. NUTRITION TAB */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Apple className="w-5 h-5 text-emerald-400" />
              <span>Daily Food Journal & Macronutrient Compliance</span>
            </h2>

            {nutritionLogs.length === 0 ? (
              <p className="text-xs text-slate-400">No nutrition logs submitted yet.</p>
            ) : (
              nutritionLogs.map((log) => (
                <div key={log.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <span className="font-bold text-sm text-white">Log for {log.date}</span>
                      <p className="text-xs text-slate-400 mt-0.5">{log.notes || 'No extra notes'}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-xs font-semibold">
                      <span className="text-white">Calories: {log.totalCalories} / {log.targetCalories} kcal</span>
                      <span className="text-emerald-400">Protein: {log.proteinG}g</span>
                      <span className="text-cyan-400">Water: {log.waterMl}ml</span>
                    </div>
                  </div>

                  {/* Meals Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealKey) => (
                      <div key={mealKey} className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          {mealKey}
                        </span>
                        {log.meals?.[mealKey]?.length > 0 ? (
                          log.meals[mealKey].map((m, mIdx) => (
                            <div key={mIdx} className="text-slate-300 text-[11px] border-b border-slate-800/40 py-1 last:border-0">
                              <span className="font-medium text-white block truncate">{m.name}</span>
                              <span className="text-slate-500">{m.calories} kcal • {m.protein}g P</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-600 text-[11px] italic">Not logged</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. SESSIONS TAB */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Training Sessions Management</h2>
              <p className="text-xs text-slate-400">
                Package Balance: <strong className="text-emerald-400">{client.sessionsRemaining} Sessions Remaining</strong> (Used {client.sessionsCompleted} of {client.sessionsPurchased})
              </p>
            </div>
            <button
              onClick={() => onOpenSchedule(client.id)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 text-xs font-bold rounded-xl transition shadow-sm"
            >
              + Schedule New Session
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Session Type</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Trainer Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sessions.map((sess) => (
                    <tr key={sess.id} className="hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-semibold text-white">
                        <div>{sess.date}</div>
                        <div className="text-[11px] text-slate-500">{sess.time} ({sess.durationMinutes}m)</div>
                      </td>
                      <td className="py-3 px-4 text-slate-200">{sess.sessionType}</td>
                      <td className="py-3 px-4 text-slate-400">{sess.location}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          sess.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : sess.status === 'scheduled'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {sess.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">{sess.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Payment & Subscription Invoices</h2>
              <p className="text-xs text-slate-400">
                Lifetime Revenue: <strong className="text-emerald-400">₹{client.lifetimeRevenue}</strong> • Next Due Date: <strong className="text-white">{client.nextPaymentDate}</strong>
              </p>
            </div>
            <button
              onClick={() => onOpenPayment(client.id)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 text-xs font-bold rounded-xl transition shadow-sm"
            >
              + Record Payment
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Invoice / Plan</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Paid Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Reference ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-semibold text-white">{p.planName}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">₹{p.amount}</td>
                      <td className="py-3 px-4 text-slate-400">{p.dueDate}</td>
                      <td className="py-3 px-4 text-slate-300">{p.paidDate || 'Pending'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{p.referenceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. PROGRESS & MEASUREMENTS TAB */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Weight & Body Composition Progression</span>
            </h2>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={11} unit="kg" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="weight" name="Body Weight (kg)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Body Circumference Measurements (cm)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Weight (kg)</th>
                    <th className="py-2.5 px-3">Body Fat %</th>
                    <th className="py-2.5 px-3">Chest</th>
                    <th className="py-2.5 px-3">Waist</th>
                    <th className="py-2.5 px-3">Hips</th>
                    <th className="py-2.5 px-3">Arms</th>
                    <th className="py-2.5 px-3">Thighs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {measurements.map((m) => (
                    <tr key={m.id}>
                      <td className="py-2.5 px-3 font-semibold text-white">{m.date}</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">{m.weightKg}</td>
                      <td className="py-2.5 px-3 text-slate-300">{m.bodyFatPercent ? `${m.bodyFatPercent}%` : '—'}</td>
                      <td className="py-2.5 px-3 text-slate-300">{m.chestCm || '—'}</td>
                      <td className="py-2.5 px-3 text-slate-300">{m.waistCm || '—'}</td>
                      <td className="py-2.5 px-3 text-slate-300">{m.hipsCm || '—'}</td>
                      <td className="py-2.5 px-3 text-slate-300">{m.armsCm || '—'}</td>
                      <td className="py-2.5 px-3 text-slate-300">{m.thighsCm || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Lift PRs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Compound Lift Strength PRs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {perfMetrics.map((p) => (
                <div key={p.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs font-semibold text-slate-400 block">{p.exerciseName}</span>
                  <div className="text-xl font-display font-extrabold text-white">
                    {p.value} {p.unit} <span className="text-xs text-emerald-400 font-normal">× {p.reps} reps</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Est. 1RM: {p.estimated1RM} {p.unit} • {p.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. BEFORE & AFTER PHOTOS TAB */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  <span>Before & After Progress Photo Comparison</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select baseline date and current date to view transformation side-by-side.
                </p>
              </div>

              {/* Marketing Consent Badge */}
              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Marketing Consent:</span>
                <span className={`text-xs font-bold ${client.consentForMarketingPhotos ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {client.consentForMarketingPhotos ? '✓ Signed & Approved' : '✗ Private Only'}
                </span>
              </div>
            </div>

            {/* Selectors */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-400">Before Photo:</span>
                <select
                  value={beforePhotoId || ''}
                  onChange={(e) => setBeforePhotoId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                >
                  {progressPhotos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.date} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-400">After Photo:</span>
                <select
                  value={afterPhotoId || ''}
                  onChange={(e) => setAfterPhotoId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                >
                  {progressPhotos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.date} ({p.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side-by-Side Comparison Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-300">
                  <span>BEFORE: {beforePhoto?.date}</span>
                  <span className="uppercase text-[10px] text-emerald-400">{beforePhoto?.category} Angle</span>
                </div>
                {beforePhoto ? (
                  <div className="h-80 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                    <img
                      src={beforePhoto.imageUrl}
                      alt="Before"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-xs text-slate-600">No photo selected</div>
                )}
                <div className="p-3 text-xs text-slate-400">{beforePhoto?.notes || 'Baseline record.'}</div>
              </div>

              {/* After */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-300">
                  <span>AFTER: {afterPhoto?.date}</span>
                  <span className="uppercase text-[10px] text-emerald-400">{afterPhoto?.category} Angle</span>
                </div>
                {afterPhoto ? (
                  <div className="h-80 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                    <img
                      src={afterPhoto.imageUrl}
                      alt="After"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-xs text-slate-600">No photo selected</div>
                )}
                <div className="p-3 text-xs text-slate-400">{afterPhoto?.notes || 'Current transformation.'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. NOTES TAB (Trainer Private vs Client Visible) */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Client Coaching Notes</h2>
              <p className="text-xs text-slate-400">
                Securely record observations, injury protocols, and progress cues.
              </p>
            </div>
            <button
              onClick={() => setShowAddNoteModal(true)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 text-xs font-bold rounded-xl transition shadow-sm"
            >
              + Add New Note
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition shadow-lg ${
                  n.isPrivateToTrainer
                    ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-700'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                    n.isPrivateToTrainer
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {n.isPrivateToTrainer ? (
                      <>
                        <Lock className="w-2.5 h-2.5 mr-1" />
                        <span>Trainer Only (Confidential)</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-2.5 h-2.5 mr-1" />
                        <span>Visible to Client</span>
                      </>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white">{n.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[550px]">
          {/* Chat Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={client.avatar} alt={client.name} className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-xs text-white">{client.name}</h3>
                <span className="text-[10px] text-emerald-400">Direct Coaching Channel</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-500">{messages.length} messages</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No messages yet. Send a greeting to {client.name}!
              </div>
            ) : (
              messages.map((m) => {
                const isCoach = m.senderRole === 'trainer';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isCoach ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                        isCoach
                          ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-800 text-white rounded-tl-none border border-slate-700'
                      }`}
                    >
                      <p>{m.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {isCoach ? 'Coach Alex' : client.name} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder={`Message ${client.name}...`}
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 transition"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 11. CHECK-INS TAB */}
      {activeTab === 'checkins' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">Client Weekly Progress Check-ins</h2>
          {checkins.length === 0 ? (
            <p className="text-xs text-slate-400">No check-ins submitted yet by {client.name}.</p>
          ) : (
            checkins.map((chk) => (
              <div key={chk.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">Check-in for {chk.date}</h3>
                    <span className="text-xs text-slate-400">Submitted by client</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    chk.status === 'reviewed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {chk.status === 'reviewed' ? '✓ Reviewed' : 'Pending Review'}
                  </span>
                </div>

                {/* Question Responses Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Energy</span>
                    <span className="font-bold text-white">{chk.responses?.energyRating}/10</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Sleep</span>
                    <span className="font-bold text-white">{chk.responses?.sleepHours} hrs ({chk.responses?.sleepQuality}/10)</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Workouts</span>
                    <span className="font-bold text-emerald-400">{chk.responses?.workoutConsistency}/10</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Nutrition</span>
                    <span className="font-bold text-cyan-400">{chk.responses?.nutritionConsistency}/10</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-300"><strong>Pain or Discomfort:</strong> {chk.responses?.painOrDiscomfort || 'None'}</p>
                  <p className="text-slate-300"><strong>Wins This Week:</strong> {chk.responses?.winsThisWeek || '—'}</p>
                  <p className="text-slate-300"><strong>Biggest Obstacle:</strong> {chk.responses?.biggestObstacle || '—'}</p>
                  <p className="text-slate-300"><strong>Next Week Focus:</strong> {chk.responses?.nextWeekGoal || '—'}</p>
                </div>

                {/* Trainer Feedback Box */}
                {chk.trainerFeedback ? (
                  <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-emerald-400 block">Coach Alex Feedback:</span>
                    <p className="text-slate-200 leading-relaxed">{chk.trainerFeedback}</p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-xs font-semibold text-slate-300">Write Coach Feedback:</label>
                    <textarea
                      rows={2}
                      placeholder="Give encouraging critique and advice for next week..."
                      value={selectedCheckin === chk.id ? trainerFeedbackText : ''}
                      onChange={(e) => {
                        setSelectedCheckin(chk.id);
                        setTrainerFeedbackText(e.target.value);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleReviewCheckinSubmit(chk.id)}
                      className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-450 transition"
                    >
                      Deliver Feedback to Client
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 12. TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Client Chronological Timeline</h2>
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 py-2">
            {timeline.map((event) => (
              <div key={event.id} className="relative pl-6">
                <div className="absolute -left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-4 border-slate-900" />
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white">{event.title}</h3>
                    <span className="text-[10px] text-slate-500">{new Date(event.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Coaching Note for {client.name}</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Note Title</label>
                <input
                  type="text"
                  placeholder="e.g. Squat Mechanics or Injury Assessment"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Content</label>
                <textarea
                  rows={4}
                  placeholder="Write your clinical / coaching notes..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <span className="text-white font-semibold block">Privacy Level</span>
                  <span className="text-slate-400 text-[11px]">
                    {isNotePrivate ? 'Only you (trainer) can view this note.' : 'Client will see this note in their app.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotePrivate(!isNotePrivate)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                    isNotePrivate
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isNotePrivate ? '🔒 Trainer Private' : '🌐 Shared with Client'}
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs hover:bg-slate-750"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-450 transition"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
