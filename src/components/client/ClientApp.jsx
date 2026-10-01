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
  ChevronDown
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
        setProgram(programsData[0]);
        // Initialize sets log structure
        const firstDay = programsData[0].days?.[0];
        if (firstDay) {
          const initSets = {};
          firstDay.exercises?.forEach(ex => {
            initSets[ex.id] = Array.from({ length: ex.sets || 3 }).map((_, i) => ({
              setNum: i + 1,
              weightKg: ex.targetWeightKg || 0,
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

  // Submit complete workout
  const handleFinishWorkout = async () => {
    if (!program || !program.days?.[activeDayIdx]) return;
    const currentDay = program.days[activeDayIdx];

    const exercisesCompleted = currentDay.exercises.map(ex => ({
      exerciseName: ex.name,
      sets: loggedSets[ex.id] || []
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
        exercisesCompleted
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
      showToast('Message sent to Coach Alex');
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
      showToast('Weekly check-in submitted to Coach Alex! 🎉');
      refreshMe();
    } catch (err) {
      showToast('Failed to submit check-in', 'error');
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
            <img
              src={client.avatar}
              alt={client.name}
              className="w-12 h-12 rounded-2xl border-2 border-emerald-500/50 object-cover shadow-md"
            />
            <div>
              <h1 className="text-lg font-bold text-white flex items-center space-x-1.5">
                <span>Welcome back, {client.name.split(' ')[0]}!</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h1>
              <p className="text-xs text-slate-400">
                🎯 {client.currentGoal} • <strong className="text-emerald-400">{client.workoutAdherence}%</strong> compliance
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
            <span className="text-base font-extrabold text-white mt-0.5 block">{client.weightKg} kg</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Progress</span>
            <span className="text-base font-extrabold text-emerald-400 mt-0.5 block">
              {(client.weightKg - client.startingWeightKg).toFixed(1)} kg
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sessions</span>
            <span className="text-base font-extrabold text-amber-400 mt-0.5 block">
              {client.sessionsRemaining} left
            </span>
          </div>
        </div>
      </div>

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
                        weightKg: ex.targetWeightKg || 0,
                        reps: parseInt(ex.reps) || 10,
                        completed: false,
                        rpe: ex.rpe || 8
                      }));
                    });
                    setLoggedSets(initSets);
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
                            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                              <span>Target: {ex.sets} × {ex.reps}</span>
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
                        </div>
                      </div>
                    );
                  })}
                </div>

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
                    placeholder="How did today's workout feel? Any soreness or notes for Coach Alex?"
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
              <p className="text-xs text-slate-400">No workout assigned today. Ask Coach Alex in the chat!</p>
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
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Transformation Progress Photos</h3>
              <span className="text-[11px] text-slate-400">Strictly Private</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Day 1 (Start)</span>
                <div className="h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  {beforePhoto ? (
                    <img src={beforePhoto.imageUrl} alt="Start" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-600">No start photo</div>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-center">
                <span className="text-[11px] font-bold text-emerald-400 uppercase">Current</span>
                <div className="h-64 rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/40">
                  {afterPhoto ? (
                    <img src={afterPhoto.imageUrl} alt="Current" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-600">No current photo</div>
                  )}
                </div>
              </div>
            </div>
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
                CA
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Coach Alex Rivera</h3>
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
                placeholder="Ask Coach Alex a question..."
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl my-8 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Weekly Client Accountability Check-in</h3>
                <p className="text-xs text-slate-400">Share your wellness and training progress with Coach Alex</p>
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
