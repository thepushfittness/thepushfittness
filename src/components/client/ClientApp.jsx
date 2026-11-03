import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  Flame, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Clock, 
  Droplet, 
  Send, 
  Lock, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Zap,
  Moon,
  Smile,
  ShieldCheck,
  ChevronDown,
  Camera,
  Upload,
  Trash2,
  Image,
  X,
  UserCheck,
  User,
  Edit3,
  Phone,
  Target
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

const MALE_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80'
];

const FEMALE_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
];

export function ClientApp() {
  const { user, clientProfile, refreshMe } = useAuth();
  const { showToast } = useNotifications();
  const clientId = user?.clientId;

  const [activeTab, setActiveTab] = useState('workout'); // workout, nutrition, progress, sessions, coach
  const [loading, setLoading] = useState(true);

  // Client data states
  const [client, setClient] = useState(clientProfile || null);
  const [program, setProgram] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [perfMetrics, setPerfMetrics] = useState([]);
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [notes, setNotes] = useState([]);

  // Active workout runner state
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [loggedSets, setLoggedSets] = useState({}); // { [exId]: [ { completed, reps, weightKg } ] }
  const [exerciseNotes, setExerciseNotes] = useState({}); // { [exId]: string }
  const [conditioningDone, setConditioningDone] = useState(false);
  const [conditioningResult, setConditioningResult] = useState('');
  const [conditioningNotes, setConditioningNotes] = useState('');
  const [workoutOverallNotes, setWorkoutOverallNotes] = useState('');
  const [workoutRpe, setWorkoutRpe] = useState(8);

  // Live Rest Timer state
  const [restTimerSeconds, setRestTimerSeconds] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Nutrition logger state
  const [waterCount, setWaterCount] = useState(2500);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [newMealCategory, setNewMealCategory] = useState('lunch');
  const [newMealName, setNewMealName] = useState('');
  const [newMealCalories, setNewMealCalories] = useState(450);
  const [newMealProtein, setNewMealProtein] = useState(35);

  // Chat message state
  const [chatMessage, setChatMessage] = useState('');

  // Weekly Checkin Modal
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [chkEnergy, setChkEnergy] = useState(8);
  const [chkSleep, setChkSleep] = useState(7.5);
  const [chkSleepQuality, setChkSleepQuality] = useState(8);
  const [chkWorkouts, setChkWorkouts] = useState(9);
  const [chkNutrition, setChkNutrition] = useState(9);
  const [chkPain, setChkPain] = useState('None');
  const [chkWins, setChkWins] = useState('');
  const [chkChallenges, setChkChallenges] = useState('');
  const [chkNextGoal, setChkNextGoal] = useState('');

  // Photo comparison
  const [beforePhotoId, setBeforePhotoId] = useState(null);
  const [afterPhotoId, setAfterPhotoId] = useState(null);

  // Client Avatar changer modal state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [tempAvatar, setTempAvatar] = useState('');
  const [avatarPresetGender, setAvatarPresetGender] = useState('Male');
  const [savingAvatar, setSavingAvatar] = useState(false);

  // Client Progress Photo upload modal state
  const [showUploadPhotoModal, setShowUploadPhotoModal] = useState(false);
  const [newPhotoDate, setNewPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPhotoCategory, setNewPhotoCategory] = useState('front');
  const [newPhotoWeight, setNewPhotoWeight] = useState(70);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoNotes, setNewPhotoNotes] = useState('');
  const [newPhotoConsent, setNewPhotoConsent] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Comprehensive Client Profile Completion & Edit Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profAvatar, setProfAvatar] = useState('');
  const [profAvatarPresetGender, setProfAvatarPresetGender] = useState('Male');
  const [profGender, setProfGender] = useState('Male');
  const [profBirthdate, setProfBirthdate] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [profHeight, setProfHeight] = useState('');
  const [profWeight, setProfWeight] = useState('');
  const [profTargetWeight, setProfTargetWeight] = useState('');
  const [profGoal, setProfGoal] = useState('Fat Loss & Toning');
  const [profGoalNotes, setProfGoalNotes] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleProfAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image too large. Please select an image under 8MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfAvatar(reader.result);
      showToast('Photo selected! Click Save to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleOpenProfileModal = () => {
    if (!client) return;
    setProfAvatar(client.avatar || user?.avatar || MALE_AVATAR_PRESETS[0]);
    const gender = client.gender || 'Male';
    setProfGender(gender);
    setProfAvatarPresetGender(gender === 'Female' ? 'Female' : 'Male');
    setProfBirthdate(client.dateOfBirth || '');
    setProfPhone(client.phone || user?.phone || '');
    setProfHeight(client.heightCm || '');
    setProfWeight(client.weightKg || '');
    setProfTargetWeight(client.targetWeightKg || '');
    setProfGoal(client.currentGoal || 'Fat Loss & Toning');
    setProfGoalNotes(client.goalsList?.[0] || '');
    setShowProfileModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!client?.id) return;

    try {
      setIsSavingProfile(true);
      const updates = {
        avatar: profAvatar,
        gender: profGender,
        dateOfBirth: profBirthdate,
        phone: profPhone.trim(),
        heightCm: Number(profHeight) || 0,
        weightKg: Number(profWeight) || 0,
        targetWeightKg: Number(profTargetWeight) || 0,
        currentGoal: profGoal.trim(),
        goalsList: profGoalNotes.trim() ? [profGoalNotes.trim()] : [profGoal.trim()],
        profileCompleted: true
      };

      await api.updateProfile(updates);
      await api.updateClient(client.id, updates);

      setClient(prev => ({ ...prev, ...updates }));
      if (typeof refreshMe === 'function') refreshMe();

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast('🎉 Your fitness profile and goals have been saved! Coach Pushkar has your details.');
      setShowProfileModal(false);
    } catch (err) {
      showToast(err.message || 'Failed to save profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Load client data
  const loadClientData = async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      const [
        clientData,
        programsData,
        workoutLogsData,
        nutritionLogsData,
        sessionsData,
        measData,
        perfData,
        photosData,
        messagesData,
        checkinsData,
        notesData
      ] = await Promise.all([
        api.getClient(clientId),
        api.getPrograms(clientId),
        api.getWorkoutLogs(clientId),
        api.getNutritionLogs(clientId),
        api.getSessions({ clientId }),
        api.getMeasurements(clientId),
        api.getPerformanceMetrics(clientId),
        api.getProgressPhotos(clientId),
        api.getMessages(clientId),
        api.getCheckins(clientId),
        api.getNotes(clientId)
      ]);

      setClient(clientData);
      setWorkoutLogs(workoutLogsData || []);
      setNutritionLogs(nutritionLogsData || []);
      setSessions(sessionsData || []);
      setMeasurements(measData || []);
      setPerfMetrics(perfData || []);
      setProgressPhotos(photosData || []);
      setMessages(messagesData || []);
      setCheckins(checkinsData || []);
      setNotes(notesData || []);

      if (programsData && programsData.length > 0) {
        const activeProg = programsData.find(p => p.status === 'active') || programsData[0];
        setProgram(activeProg);
        // Initialize sets log structure
        const firstDay = activeProg.days?.[0];
        if (firstDay) {
          const initSets = {};
          firstDay.exercises?.forEach(ex => {
            initSets[ex.id] = Array.from({ length: ex.sets || 3 }).map((_, i) => ({
              setNum: i + 1,
              weightKg: (ex.targetWeights && ex.targetWeights[i] !== undefined) ? ex.targetWeights[i] : (ex.targetWeightKg || 0),
              reps: parseInt(ex.reps) || 10,
              completed: false,
              rpe: ex.rpe || 8
            }));
          });
          setLoggedSets(initSets);
        }
      }

      if (photosData && photosData.length >= 2) {
        setBeforePhotoId(photosData[0].id);
        setAfterPhotoId(photosData[photosData.length - 1].id);
      } else if (photosData && photosData.length === 1) {
        setBeforePhotoId(photosData[0].id);
        setAfterPhotoId(photosData[0].id);
      }
    } catch (err) {
      console.error('Failed to load client data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  // Timer countdown hook
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (restTimerSeconds === 0) {
      setIsTimerRunning(false);
      // Play soft chime notification
      showToast('⏰ Rest time is up! Get ready for your next set!', 'success');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restTimerSeconds]);

  const startRestTimer = (seconds = 90) => {
    setRestTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  // Toggle set completion
  const handleToggleSet = (exId, setIndex, restSeconds) => {
    setLoggedSets(prev => {
      const exSets = [...(prev[exId] || [])];
      const current = exSets[setIndex];
      const willBeCompleted = !current.completed;
      exSets[setIndex] = { ...current, completed: willBeCompleted };

      if (willBeCompleted && restSeconds) {
        startRestTimer(restSeconds);
      }

      return { ...prev, [exId]: exSets };
    });
  };

  // Add set dynamically during workout
  const handleAddSet = (exId) => {
    setLoggedSets(prev => {
      const current = prev[exId] || [];
      const lastSet = current[current.length - 1];
      const newSetNum = current.length + 1;
      const newSet = {
        setNum: newSetNum,
        weightKg: lastSet ? lastSet.weightKg : 0,
        reps: lastSet ? lastSet.reps : 10,
        completed: false,
        rpe: 8
      };
      return { ...prev, [exId]: [...current, newSet] };
    });
  };

  // Remove last set if not needed
  const handleRemoveSet = (exId) => {
    setLoggedSets(prev => {
      const current = prev[exId] || [];
      if (current.length <= 1) return prev;
      return { ...prev, [exId]: current.slice(0, -1) };
    });
  };

  // Submit complete workout
  const handleFinishWorkout = async () => {
    if (!program || !program.days?.[activeDayIdx]) return;
    const currentDay = program.days[activeDayIdx];

    const exercisesCompleted = currentDay.exercises.map(ex => ({
      exerciseName: ex.name,
      sets: loggedSets[ex.id] || [],
      notes: (exerciseNotes[ex.id] || '').trim()
    }));

    const totalVolume = exercisesCompleted.reduce((sum, ex) => {
      return sum + (ex.sets || []).reduce((sSum, s) => {
        return s.completed ? sSum + (s.weightKg * s.reps) : sSum;
      }, 0);
    }, 0);

    try {
      const newLog = await api.createWorkoutLog({
        clientId: client.id,
        workoutId: currentDay.id,
        workoutName: currentDay.name,
        durationMinutes: 50,
        totalVolumeKg: totalVolume,
        rpeOverall: workoutRpe,
        notes: workoutOverallNotes || 'Crushed it! Form felt crisp.',
        exercisesCompleted,
        conditioningCompleted: currentDay.conditioning ? {
          title: currentDay.conditioning.title || 'Conditioning Finisher',
          format: currentDay.conditioning.format || 'EMOM',
          duration: currentDay.conditioning.duration || '',
          completed: conditioningDone,
          result: conditioningResult || '',
          notes: conditioningNotes || ''
        } : null
      });

      // Celebration Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('🎉 Workout Finished & Logged! Great work!', 'success');
      setWorkoutLogs(prev => [newLog, ...prev]);
      setActiveTab('history');
      refreshMe();
    } catch (err) {
      showToast('Failed to log workout', 'error');
    }
  };

  // Water increment
  const handleAddWater = (ml) => {
    setWaterCount(prev => {
      const updated = prev + ml;
      showToast(`+${ml}ml water logged! (${updated} ml total)`);
      return updated;
    });
  };

  // Send message to coach
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    try {
      const msg = await api.sendMessage({
        clientId: client.id,
        recipientId: 'user-trainer-1',
        text: chatMessage,
        category: 'general'
      });
      setMessages(prev => [...prev, msg]);
      setChatMessage('');
      showToast('Message sent to Coach Pushkar');
    } catch (err) {
      showToast('Failed to send message', 'error');
    }
  };

  // Submit weekly checkin
  const handleSubmitCheckin = async (e) => {
    e.preventDefault();
    try {
      const submitted = await api.submitCheckin({
        clientId: client.id,
        responses: {
          energyRating: Number(chkEnergy),
          sleepHours: Number(chkSleep),
          sleepQuality: Number(chkSleepQuality),
          workoutConsistency: Number(chkWorkouts),
          nutritionConsistency: Number(chkNutrition),
          painOrDiscomfort: chkPain,
          winsThisWeek: chkWins || 'Hit all assigned workouts and meals.',
          biggestObstacle: chkChallenges || 'Busy schedule on Wednesday.',
          nextWeekGoal: chkNextGoal || 'Progressively overload squats.'
        }
      });

      setCheckins(prev => [submitted, ...prev]);
      setShowCheckinModal(false);
      showToast('Weekly check-in submitted to Coach Pushkar! 🎉');
      refreshMe();
    } catch (err) {
      showToast('Failed to submit check-in', 'error');
    }
  };

  const handleOpenAvatarModal = () => {
    setTempAvatar(client?.avatar || MALE_AVATAR_PRESETS[0]);
    setAvatarPresetGender(client?.gender === 'Female' ? 'Female' : 'Male');
    setShowAvatarModal(true);
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image too large. Please select an image under 8MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setTempAvatar(reader.result);
      showToast('Photo uploaded! Click "Save Photo" to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    if (!tempAvatar) return;
    try {
      setSavingAvatar(true);
      await api.updateProfile({ avatar: tempAvatar });
      if (client?.id) {
        await api.updateClient(client.id, { avatar: tempAvatar });
      }
      setClient(prev => ({ ...prev, avatar: tempAvatar }));
      if (typeof refreshMe === 'function') refreshMe();
      showToast('Profile photo updated successfully!');
      setShowAvatarModal(false);
    } catch (err) {
      showToast(err.message || 'Failed to update avatar', 'error');
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleOpenUploadPhotoModal = () => {
    setNewPhotoDate(new Date().toISOString().split('T')[0]);
    setNewPhotoCategory('front');
    setNewPhotoWeight(client?.weightKg || 70);
    setNewPhotoUrl('');
    setNewPhotoNotes('');
    setNewPhotoConsent(false);
    setShowUploadPhotoModal(true);
  };

  const handleProgressPhotoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image too large. Please select a photo under 10MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setNewPhotoUrl(reader.result);
      showToast('Photo loaded! Review details and save.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProgressPhoto = async (e) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) {
      showToast('Please select or upload a photo first', 'error');
      return;
    }
    try {
      setUploadingPhoto(true);
      const newPhoto = await api.addProgressPhoto({
        clientId: client.id,
        imageUrl: newPhotoUrl.trim(),
        date: newPhotoDate,
        category: newPhotoCategory,
        weightKg: Number(newPhotoWeight) || client.weightKg,
        notes: newPhotoNotes.trim(),
        marketingConsent: newPhotoConsent
      });

      const updatedPhotos = await api.getProgressPhotos(client.id);
      setProgressPhotos(updatedPhotos || []);
      setAfterPhotoId(newPhoto.id);
      if (!beforePhotoId && updatedPhotos && updatedPhotos.length > 0) {
        setBeforePhotoId(updatedPhotos[0].id);
      }

      setShowUploadPhotoModal(false);
      showToast('Progress photo added to your transformation timeline!');
    } catch (err) {
      showToast(err.message || 'Failed to save progress photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeleteProgressPhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this progress photo?')) return;
    try {
      await api.deleteProgressPhoto(photoId);
      const updatedPhotos = await api.getProgressPhotos(client.id);
      setProgressPhotos(updatedPhotos || []);
      if (beforePhotoId === photoId) {
        setBeforePhotoId(updatedPhotos?.[0]?.id || null);
      }
      if (afterPhotoId === photoId) {
        setAfterPhotoId(updatedPhotos?.[updatedPhotos.length - 1]?.id || null);
      }
      showToast('Progress photo removed');
    } catch (err) {
      showToast('Failed to delete photo', 'error');
    }
  };

  if (loading || !client) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const weightData = measurements.map(m => ({
    date: new Date(m.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    weight: m.weightKg
  }));

  const beforePhoto = progressPhotos.find(p => p.id === beforePhotoId);
  const afterPhoto = progressPhotos.find(p => p.id === afterPhotoId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 pb-28 pt-4">
      {/* Client Motivational Header Card */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={handleOpenProfileModal}
              title="Click to update your profile & photo"
            >
              <img
                src={client.avatar}
                alt={client.name}
                className="w-12 h-12 rounded-2xl border-2 border-emerald-500/50 object-cover shadow-md transition group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-700 text-emerald-400 p-0.5 rounded-full shadow">
                <Edit3 className="w-2.5 h-2.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white flex items-center space-x-1.5">
                  <span>Welcome back, {client.name.split(' ')[0]}!</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </h1>
                <button
                  type="button"
                  onClick={handleOpenProfileModal}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30 transition flex items-center space-x-1"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>My Profile & Goals</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                🎯 {client.currentGoal || 'Custom Training'} • <strong className="text-emerald-400">{client.workoutAdherence || 100}%</strong> compliance
              </p>
            </div>
          </div>

          {/* Quick Check-in Button */}
          <button
            onClick={() => setShowCheckinModal(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center space-x-1 shadow-sm"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Weekly</span>
            <span>Check-in</span>
          </button>
        </div>

        {/* 3 Quick Motivational Numbers */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-center">
          <div className="bg-slate-950/60 p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Wt</span>
            <span className="text-base font-extrabold text-white mt-0.5 block">
              {client.weightKg ? `${client.weightKg} kg` : '--'}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Progress</span>
            <span className="text-base font-extrabold text-emerald-400 mt-0.5 block">
              {(client.weightKg && client.startingWeightKg) 
                ? `${(client.weightKg - client.startingWeightKg).toFixed(1)} kg`
                : '0.0 kg'}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sessions</span>
            <span className="text-base font-extrabold text-amber-400 mt-0.5 block">
              {client.sessionsRemaining ?? 12} left
            </span>
          </div>
        </div>
      </div>

      {/* Profile Completion Reminder Banner */}
      {(!client.profileCompleted || !client.heightCm || !client.weightKg || !client.phone || !client.dateOfBirth) && (
        <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/15 to-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-white">Complete Your Fitness Profile</h4>
                <span className="bg-amber-500 text-slate-950 text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Coach Pushkar has activated your membership! Please add your photo, birthdate, WhatsApp phone, height, weight, and fitness goals so workouts can be tailored to you.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenProfileModal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-1 shrink-0"
          >
            <span>Complete Profile Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Rest Timer Widget (when running) */}
      {restTimerSeconds !== null && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border-2 border-emerald-500/80 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center space-x-4 animate-in fade-in slide-in-from-top-4">
          <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
          <div className="text-xs">
            <span className="text-slate-400 font-medium mr-1.5">Rest Timer:</span>
            <span className="font-mono text-base font-extrabold text-emerald-400">
              {Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setRestTimerSeconds(null)}
            className="text-[11px] text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. WORKOUT TAB (Mobile-Friendly Interactive Workout Logger) */}
      {activeTab === 'workout' && (
        <div className="space-y-5">
          {/* Day Selector */}
          {program && program.days && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {program.days.map((day, idx) => (
                <button
                  key={day.id}
                  onClick={() => {
                    setActiveDayIdx(idx);
                    // re-init sets for this day
                    const initSets = {};
                    day.exercises?.forEach(ex => {
                      initSets[ex.id] = Array.from({ length: ex.sets || 3 }).map((_, i) => ({
                        setNum: i + 1,
                        weightKg: (ex.targetWeights && ex.targetWeights[i] !== undefined) ? ex.targetWeights[i] : (ex.targetWeightKg || 0),
                        reps: parseInt(ex.reps) || 10,
                        completed: false,
                        rpe: ex.rpe || 8
                      }));
                    });
                    setLoggedSets(initSets);
                    setConditioningDone(false);
                    setConditioningResult('');
                    setConditioningNotes('');
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                    activeDayIdx === idx
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Day {day.dayNumber}: {day.name}
                </button>
              ))}
            </div>
          )}

          {/* Current Day Exercises Card */}
          {program && program.days?.[activeDayIdx] ? (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      {program.days[activeDayIdx].name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Focus: {program.days[activeDayIdx].focus}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                    {program.days[activeDayIdx].exercises?.length || 0} Exercises
                  </span>
                </div>

                {/* Exercises list with interactive set loggers */}
                <div className="space-y-4">
                  {program.days[activeDayIdx].exercises?.map((ex, exIdx) => {
                    const exSets = loggedSets[ex.id] || [];
                    const completedSetsCount = exSets.filter(s => s.completed).length;

                    return (
                      <div
                        key={ex.id}
                        className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 space-y-3"
                      >
                        {/* Exercise title & video link */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                              Exercise {exIdx + 1}
                            </span>
                            <h3 className="font-extrabold text-sm text-white mt-0.5">
                              {ex.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mt-1">
                              <span>
                                Target: {ex.sets} × {ex.reps}
                                {ex.targetWeights && ex.targetWeights.length > 1 && new Set(ex.targetWeights).size > 1 ? (
                                  <strong className="text-emerald-400 font-mono ml-1">
                                    ({ex.targetWeights.join(' / ')} kg)
                                  </strong>
                                ) : ex.targetWeightKg ? (
                                  <strong className="text-emerald-400 font-mono ml-1">
                                    ({ex.targetWeightKg}{typeof ex.targetWeightKg === 'number' || /^\d+(\.\d+)?$/.test(ex.targetWeightKg) ? ' kg' : ''})
                                  </strong>
                                ) : (
                                  <span className="text-slate-500 ml-1">(BW)</span>
                                )}
                              </span>
                              <span>•</span>
                              <span>Rest: {ex.restSeconds}s</span>
                              <span>•</span>
                              <span className="font-mono">Tempo: {ex.tempo || '2-0-1-0'}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {ex.videoUrl && (
                              <a
                                href={ex.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center space-x-1"
                              >
                                <span>Demo</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        {ex.notes && (
                          <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 italic">
                            💡 Coach Note: {ex.notes}
                          </p>
                        )}

                        {/* Interactive Sets Table */}
                        <div className="space-y-2 pt-1">
                          <div className="grid grid-cols-4 text-[10px] uppercase font-bold text-slate-500 px-2">
                            <span>Set</span>
                            <span>Weight (kg)</span>
                            <span>Reps</span>
                            <span className="text-right">Done</span>
                          </div>

                          {exSets.map((s, sIdx) => (
                            <div
                              key={sIdx}
                              className={`grid grid-cols-4 items-center p-2 rounded-xl text-xs transition ${
                                s.completed ? 'bg-emerald-950/30 border border-emerald-800/40' : 'bg-slate-900 border border-slate-800/60'
                              }`}
                            >
                              <span className="font-bold text-slate-300">Set {s.setNum}</span>
                              <input
                                type="number"
                                value={s.weightKg}
                                onChange={(e) => {
                                  const updated = [...exSets];
                                  updated[sIdx].weightKg = Number(e.target.value);
                                  setLoggedSets({ ...loggedSets, [ex.id]: updated });
                                }}
                                className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-bold"
                              />
                              <input
                                type="number"
                                value={s.reps}
                                onChange={(e) => {
                                  const updated = [...exSets];
                                  updated[sIdx].reps = Number(e.target.value);
                                  setLoggedSets({ ...loggedSets, [ex.id]: updated });
                                }}
                                className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white"
                              />
                              <div className="text-right">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSet(ex.id, sIdx, ex.restSeconds)}
                                  className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition font-bold text-xs ${
                                    s.completed
                                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                  }`}
                                >
                                  {s.completed ? '✓' : ''}
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Flexible Set Controls */}
                          <div className="flex items-center space-x-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleAddSet(ex.id)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Set</span>
                            </button>
                            {exSets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSet(ex.id)}
                                className="px-2.5 py-1 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800/60 rounded-lg text-xs transition"
                              >
                                Remove Last Set
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Client execution note beside sets & reps */}
                        <div className="pt-2 border-t border-slate-900">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-semibold text-slate-400">
                              📝 Notes for Coach / Variations performed
                            </label>
                            {exerciseNotes[ex.id] && (
                              <span className="text-[9px] text-emerald-400 font-semibold">Note saved</span>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Performed differently than planned? (e.g. Used dumbbells, dropped weight on set 3)"
                            value={exerciseNotes[ex.id] || ''}
                            onChange={(e) => setExerciseNotes(prev => ({ ...prev, [ex.id]: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* TODAY'S CONDITIONING FINISHER SECTION */}
                {program.days[activeDayIdx]?.conditioning && (
                  <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-5 shadow-xl space-y-4">
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>{program.days[activeDayIdx].conditioning.format || 'Conditioning Finisher'}</span>
                          </span>
                          {program.days[activeDayIdx].conditioning.isDailyVariable && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              ⚡ Added on Training Day by Coach Pushkar
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base text-white">
                          {program.days[activeDayIdx].conditioning.title || "Today's Conditioning Finisher"}
                        </h3>
                        {program.days[activeDayIdx].conditioning.duration && (
                          <p className="text-xs text-amber-400 font-semibold flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Time Cap / Duration: {program.days[activeDayIdx].conditioning.duration}</span>
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setConditioningDone(prev => !prev)}
                        className={`px-3.5 py-2 rounded-xl font-bold text-xs transition flex items-center space-x-1.5 shadow-sm ${
                          conditioningDone
                            ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{conditioningDone ? 'Completed ✓' : 'Mark Done'}</span>
                      </button>
                    </div>

                    {/* Conditioning movements & instructions */}
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Movements & Routine
                      </span>
                      <p className="text-xs text-slate-200 whitespace-pre-line font-medium leading-relaxed">
                        {program.days[activeDayIdx].conditioning.description || 'Follow coach instructions.'}
                      </p>
                    </div>

                    {program.days[activeDayIdx].conditioning.notes && (
                      <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-900/30 text-xs text-amber-300 italic">
                        💡 Coach Pacing Cue: {program.days[activeDayIdx].conditioning.notes}
                      </div>
                    )}

                    {/* Result and reflection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Your Result / Score
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 5 rounds + 8 reps, 8:45 time, or Level 9"
                          value={conditioningResult}
                          onChange={(e) => setConditioningResult(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Conditioning Feedback
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Kept steady pace, lungs burning"
                          value={conditioningNotes}
                          onChange={(e) => setConditioningNotes(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Workout Reflection & Finish Button */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Overall Session RPE (1-10):</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={workoutRpe}
                      onChange={(e) => setWorkoutRpe(Number(e.target.value))}
                      className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white font-bold text-center"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="How did today's workout feel? Any soreness or notes for Coach Pushkar?"
                    value={workoutOverallNotes}
                    onChange={(e) => setWorkoutOverallNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />

                  <button
                    onClick={handleFinishWorkout}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-display font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/20 transition transform active:scale-98"
                  >
                    Finish Workout & Log Progress 🎉
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
              <p className="text-xs text-slate-400">No workout assigned today. Ask Coach Pushkar in the chat!</p>
            </div>
          )}
        </div>
      )}

      {/* 2. NUTRITION TAB */}
      {activeTab === 'nutrition' && (
        <div className="space-y-5">
          {/* Targets Summary Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Apple className="w-5 h-5 text-emerald-400" />
              <span>Today's Nutrition & Hydration</span>
            </h2>

            {/* Macro Progress Rings/Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Calories: 1,720 / {client.dailyCalorieTarget} kcal</span>
                  <span className="text-emerald-400">98% on track</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Protein</span>
                  <span className="font-bold text-emerald-400 text-sm">138g / {client.proteinTargetG}g</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Carbs</span>
                  <span className="font-bold text-cyan-400 text-sm">165g / {client.carbsTargetG}g</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Fats</span>
                  <span className="font-bold text-amber-400 text-sm">49g / {client.fatsTargetG}g</span>
                </div>
              </div>
            </div>

            {/* Hydration Tracker */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-400 flex items-center space-x-1.5">
                  <Droplet className="w-4 h-4 text-blue-400" />
                  <span>Water Tracker: {waterCount} / {client.waterTargetMl} ml</span>
                </span>
                <span className="text-slate-400 text-[11px]">
                  {Math.round((waterCount / client.waterTargetMl) * 100)}%
                </span>
              </div>
              <div className="flex space-x-2 pt-1">
                <button
                  onClick={() => handleAddWater(250)}
                  className="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-xl border border-blue-500/30 transition"
                >
                  +250 ml (Cup)
                </button>
                <button
                  onClick={() => handleAddWater(500)}
                  className="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-xl border border-blue-500/30 transition"
                >
                  +500 ml (Bottle)
                </button>
              </div>
            </div>
          </div>

          {/* Meals of the Day */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Daily Meals</h3>
              <span className="text-[11px] text-slate-400">Coach prescribed diet</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Breakfast</span>
                  <span className="font-medium text-white">Scrambled egg whites with spinach & sourdough toast</span>
                </div>
                <span className="text-emerald-400 font-bold">470 kcal</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Lunch</span>
                  <span className="font-medium text-white">Grilled chicken breast quinoa bowl with roasted vegetables</span>
                </div>
                <span className="text-emerald-400 font-bold">510 kcal</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Dinner</span>
                  <span className="font-medium text-white">Baked salmon fillet with sweet potato and steamed broccoli</span>
                </div>
                <span className="text-emerald-400 font-bold">540 kcal</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Snack</span>
                  <span className="font-medium text-white">Greek yogurt with blueberries & whey</span>
                </div>
                <span className="text-emerald-400 font-bold">200 kcal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROGRESS TAB (Weight Charts, 1RMs, Photos) */}
      {activeTab === 'progress' && (
        <div className="space-y-5">
          {/* Weight Trend */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white">Weight Journey</h2>
                <p className="text-xs text-slate-400">Starting: {client.startingWeightKg}kg • Goal: {client.targetWeightKg}kg</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                {(client.weightKg - client.startingWeightKg).toFixed(1)} kg overall
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={11} unit="kg" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strength Progression PRs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white">Personal Record (PR) Achievements</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {perfMetrics.map(p => (
                <div key={p.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">{p.exerciseName}</span>
                  <div className="text-lg font-extrabold text-white mt-0.5">
                    {p.value} {p.unit} <span className="text-xs text-emerald-400 font-normal">× {p.reps} reps</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Est. 1RM: {p.estimated1RM}kg</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transformation Photos Comparison */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Transformation Progress Photos</span>
                </h3>
                <span className="text-[11px] text-slate-400">Strictly private between you and Coach Pushkar</span>
              </div>
              <button
                type="button"
                onClick={handleOpenUploadPhotoModal}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center space-x-1.5 shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>
            </div>

            {/* Photo Selection Controls (if more than 1 photo exists) */}
            {progressPhotos.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <label className="text-slate-400 text-[11px] font-semibold block mb-1">Select Start Photo</label>
                  <select
                    value={beforePhotoId || ''}
                    onChange={(e) => setBeforePhotoId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    {progressPhotos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.date} ({p.category || 'front'}) {p.weightKg ? `• ${p.weightKg}kg` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-semibold block mb-1">Select Current Photo</label>
                  <select
                    value={afterPhotoId || ''}
                    onChange={(e) => setAfterPhotoId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    {progressPhotos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.date} ({p.category || 'front'}) {p.weightKg ? `• ${p.weightKg}kg` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Day 1 (Start)</span>
                <div className="h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  {beforePhoto ? (
                    <img src={beforePhoto.imageUrl} alt="Start" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-3 text-xs text-slate-500">
                      <Camera className="w-6 h-6 text-slate-600 mb-1" />
                      <span>No start photo yet</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-center">
                <span className="text-[11px] font-bold text-emerald-400 uppercase">Current</span>
                <div className="h-64 rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/40">
                  {afterPhoto ? (
                    <img src={afterPhoto.imageUrl} alt="Current" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-3 text-xs text-slate-500">
                      <Camera className="w-6 h-6 text-emerald-600 mb-1" />
                      <span>No current photo yet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery of all uploaded progress photos */}
            {progressPhotos.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300 block">
                    Your Photo Timeline ({progressPhotos.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenUploadPhotoModal}
                    className="text-[11px] text-emerald-400 hover:underline font-semibold"
                  >
                    + Add Another
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {progressPhotos.map((p) => (
                    <div key={p.id} className="relative group bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col">
                      <div className="h-36 w-full overflow-hidden bg-slate-900 relative">
                        <img src={p.imageUrl} alt={p.category} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full uppercase">
                          {p.category || 'front'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteProgressPhoto(p.id)}
                          className="absolute top-2 right-2 bg-red-950/90 hover:bg-red-800 text-red-200 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="p-2.5 text-[11px] space-y-0.5">
                        <div className="flex justify-between items-center text-slate-300 font-semibold">
                          <span>{p.date}</span>
                          {p.weightKg && <span className="text-emerald-400 font-bold">{p.weightKg} kg</span>}
                        </div>
                        {p.notes && <p className="text-slate-400 italic line-clamp-2">"{p.notes}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. SESSIONS TAB */}
      {activeTab === 'sessions' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white">Your Training Package</h2>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block">{client.planName}</span>
                <span className="text-xl font-extrabold text-white mt-0.5 block">
                  {client.sessionsRemaining} Sessions Remaining
                </span>
                <span className="text-xs text-slate-500">
                  Used {client.sessionsCompleted} of {client.sessionsPurchased} total sessions
                </span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                Active
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white">Upcoming & Past Appointments</h3>
            <div className="space-y-2">
              {sessions.map(sess => (
                <div key={sess.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{sess.sessionType}</span>
                    <span className="text-slate-400 text-[11px]">{sess.date} at {sess.time} • {sess.location}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    sess.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {sess.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. COACH & MESSAGES TAB */}
      {activeTab === 'coach' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col h-[520px]">
            {/* Header */}
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
                PM
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Coach Pushkar Mayekar</h3>
                <span className="text-[10px] text-emerald-400">Head Coach • Typically replies within 1 hour</span>
              </div>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3">
              {messages.map(m => {
                const isMe = m.senderRole === 'client';
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                      isMe ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none' : 'bg-slate-800 text-white rounded-tl-none border border-slate-700'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <form onSubmit={handleSendChatMessage} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask Coach Pushkar a question..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WEEKLY CHECK-IN SUBMISSION MODAL */}
      {showCheckinModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl my-4 sm:my-8 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Weekly Client Accountability Check-in</h3>
                <p className="text-xs text-slate-400">Share your wellness and training progress with Coach Pushkar</p>
              </div>
              <button
                onClick={() => setShowCheckinModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCheckin} className="space-y-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  How was your overall energy this week? ({chkEnergy} / 10)
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={chkEnergy}
                  onChange={(e) => setChkEnergy(e.target.value)}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Average Sleep (Hours/Night)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={chkSleep}
                    onChange={(e) => setChkSleep(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Workout Consistency (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={chkWorkouts}
                    onChange={(e) => setChkWorkouts(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Any pain, joint ache, or physical discomfort?</label>
                <input
                  type="text"
                  placeholder="e.g. Mild right hamstring tightness, or none"
                  value={chkPain}
                  onChange={(e) => setChkPain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">What was your biggest win this week?</label>
                <input
                  type="text"
                  placeholder="e.g. Hit all my meal prep and increased squat weight!"
                  value={chkWins}
                  onChange={(e) => setChkWins(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">What was the hardest challenge you encountered?</label>
                <input
                  type="text"
                  placeholder="e.g. Work travel, late meetings, restaurant dinner"
                  value={chkChallenges}
                  onChange={(e) => setChkChallenges(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">#1 Priority or focus for next week:</label>
                <input
                  type="text"
                  placeholder="e.g. Drink 3L water daily and maintain 8 hours of sleep"
                  value={chkNextGoal}
                  onChange={(e) => setChkNextGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCheckinModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-450 transition"
                >
                  Submit Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT AVATAR SELECTION MODAL */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl my-4 sm:my-8 space-y-5 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Update Your Profile Photo</span>
                </h3>
                <p className="text-xs text-slate-400">Choose an athletic avatar preset or upload your photo</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Current preview */}
            <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <img
                src={tempAvatar || client.avatar}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-2xl border-2 border-emerald-500 object-cover shadow-lg"
              />
              <div className="space-y-1">
                <span className="font-bold text-white text-sm block">Selected Photo</span>
                <span className="text-slate-400 text-xs block">Visible to Coach Pushkar on your training profile</span>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-semibold">Choose an Athletic Avatar Preset</label>
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setAvatarPresetGender('Male')}
                    className={`px-2 py-0.5 rounded font-bold transition ${
                      avatarPresetGender === 'Male' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarPresetGender('Female')}
                    className={`px-2 py-0.5 rounded font-bold transition ${
                      avatarPresetGender === 'Female' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(avatarPresetGender === 'Female' ? FEMALE_AVATAR_PRESETS : MALE_AVATAR_PRESETS).map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTempAvatar(presetUrl)}
                    className={`relative rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      tempAvatar === presetUrl ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={presetUrl} alt="Preset" className="w-12 h-12 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom file upload */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-slate-300 font-semibold block">Or Upload from Phone / Computer</label>
              <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-slate-950 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl cursor-pointer text-slate-300 text-xs font-semibold transition">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Select image file (JPG, PNG, WebP)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Or custom URL */}
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] block">Or paste image URL:</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={tempAvatar.startsWith('data:') ? '' : tempAvatar}
                onChange={(e) => setTempAvatar(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
                disabled={savingAvatar}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
              >
                {savingAvatar ? 'Saving...' : 'Save Profile Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT PROGRESS PHOTO UPLOAD MODAL */}
      {showUploadPhotoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl my-4 sm:my-8 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Upload Transformation Progress Photo</span>
                </h3>
                <p className="text-xs text-slate-400">Strictly confidential between you and Coach Pushkar</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadPhotoModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveProgressPhoto} className="space-y-4">
              {/* Photo preview or file upload */}
              {newPhotoUrl ? (
                <div className="space-y-2">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/50 h-56 flex items-center justify-center">
                    <img src={newPhotoUrl} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewPhotoUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-red-950 text-white hover:text-red-400 border border-slate-700 text-xs font-bold transition"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center h-44 bg-slate-950 hover:bg-slate-850 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl cursor-pointer text-slate-400 text-xs font-semibold transition p-4 text-center">
                    <Upload className="w-8 h-8 text-emerald-400 mb-2" />
                    <span className="font-bold text-white text-sm">Tap to select photo from device</span>
                    <span className="text-[11px] text-slate-500 mt-1">Camera snap, gallery or file upload (under 10MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProgressPhotoFileUpload}
                      className="hidden"
                    />
                  </label>
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-500 block">Or paste image URL:</span>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Photo details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Date Taken</label>
                  <input
                    type="date"
                    value={newPhotoDate}
                    onChange={(e) => setNewPhotoDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Angle / Pose</label>
                  <select
                    value={newPhotoCategory}
                    onChange={(e) => setNewPhotoCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="front">Front View</option>
                    <option value="side">Side Profile</option>
                    <option value="back">Back View</option>
                    <option value="other">Other / Flex</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Body Weight (kg)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={newPhotoWeight}
                    onChange={(e) => setNewPhotoWeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none font-bold"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Notes / Reflection (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Week 4 check-in, feeling leaner, morning fasted photo..."
                  value={newPhotoNotes}
                  onChange={(e) => setNewPhotoNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadPhotoModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingPhoto || !newPhotoUrl}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
                >
                  {uploadingPhoto ? 'Saving Photo...' : 'Add to My Progress'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT PROFILE & GOALS COMPLETION MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex justify-center items-start">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl my-4 sm:my-8 space-y-5 text-xs animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <span>My Fitness Profile & Goals</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Personalize your profile so Coach Pushkar can program specifically for you
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Profile Avatar Section */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  1. Profile Photo / Avatar
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={profAvatar || MALE_AVATAR_PRESETS[0]}
                      alt="Avatar Preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-500 object-cover shadow-lg"
                    />
                    <label className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                      <Camera className="w-6 h-6 text-emerald-400" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <label className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl cursor-pointer font-bold text-xs transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfAvatarUpload}
                          className="hidden"
                        />
                      </label>
                      
                      <div className="inline-flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[11px]">
                        <button
                          type="button"
                          onClick={() => setProfAvatarPresetGender('Male')}
                          className={`px-2 py-1 rounded font-bold transition ${
                            profAvatarPresetGender === 'Male' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Male Presets
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfAvatarPresetGender('Female')}
                          className={`px-2 py-1 rounded font-bold transition ${
                            profAvatarPresetGender === 'Female' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Female Presets
                        </button>
                      </div>
                    </div>

                    {/* Presets Horizontal Row */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto pb-1 pt-1">
                      {(profAvatarPresetGender === 'Female' ? FEMALE_AVATAR_PRESETS : MALE_AVATAR_PRESETS).map((presetUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProfAvatar(presetUrl)}
                          className={`relative rounded-xl overflow-hidden border-2 transition shrink-0 ${
                            profAvatar === presetUrl
                              ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/30'
                              : 'border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={presetUrl} alt="Preset" className="w-10 h-10 object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  2. Personal & Contact Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Gender</label>
                    <select
                      value={profGender}
                      onChange={(e) => {
                        setProfGender(e.target.value);
                        if (e.target.value === 'Female') setProfAvatarPresetGender('Female');
                        if (e.target.value === 'Male') setProfAvatarPresetGender('Male');
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={profBirthdate}
                      onChange={(e) => setProfBirthdate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">WhatsApp / Phone</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={profPhone}
                        onChange={(e) => setProfPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:border-emerald-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Metrics */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  3. Height & Weight Metrics
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 175"
                      value={profHeight}
                      onChange={(e) => setProfHeight(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 outline-none"
                      required
                      min={100}
                      max={250}
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Current Weight (kg)</label>
                    <input
                      type="number"
                      step={0.1}
                      placeholder="e.g. 78.5"
                      value={profWeight}
                      onChange={(e) => setProfWeight(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 outline-none"
                      required
                      min={30}
                      max={250}
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Target Weight (kg)</label>
                    <input
                      type="number"
                      step={0.1}
                      placeholder="e.g. 72.0"
                      value={profTargetWeight}
                      onChange={(e) => setProfTargetWeight(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Primary Goals */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  4. Primary Fitness Goal & Notes for Coach Pushkar
                </label>
                
                {/* Goal chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    'Fat Loss & Toning',
                    'Muscle Hypertrophy & Bulk',
                    'Strength & Power',
                    'Athletic Conditioning',
                    'General Health & Mobility'
                  ].map((goalOption) => {
                    const isSelected = profGoal === goalOption;
                    return (
                      <button
                        key={goalOption}
                        type="button"
                        onClick={() => setProfGoal(goalOption)}
                        className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>{goalOption}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="text-slate-400 text-[11px] block mb-1 font-semibold">
                    Specific Targets, Injuries, or Dietary Notes (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={profGoalNotes}
                    onChange={(e) => setProfGoalNotes(e.target.value)}
                    placeholder="e.g. Want to drop 5kg fat before June, left shoulder clicks on heavy bench, vegetarian diet..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500 focus:border-emerald-500 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/25 transition disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSavingProfile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save My Profile & Goals</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-lg">
        <div className="max-w-md mx-auto px-4 flex items-center justify-around h-16">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex flex-col items-center justify-center space-y-1 flex-1 py-1 transition ${
              activeTab === 'workout' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="text-[10px]">Workout</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex flex-col items-center justify-center space-y-1 flex-1 py-1 transition ${
              activeTab === 'nutrition' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="w-5 h-5" />
            <span className="text-[10px]">Nutrition</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center justify-center space-y-1 flex-1 py-1 transition ${
              activeTab === 'progress' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px]">Progress</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex flex-col items-center justify-center space-y-1 flex-1 py-1 transition ${
              activeTab === 'sessions' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px]">Sessions</span>
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`flex flex-col items-center justify-center space-y-1 flex-1 py-1 transition ${
              activeTab === 'coach' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">Coach</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
