import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        console.log('Initializing fresh database with demo seed data...');
        this.data = JSON.parse(JSON.stringify(initialData));
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database, resetting to seed:', err);
      this.data = JSON.parse(JSON.stringify(initialData));
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.save();
    return this.data;
  }

  // --- Users & Auth ---
  findUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  // --- Clients ---
  getClients(filter = {}) {
    let clients = [...this.data.clients];
    if (filter.status && filter.status !== 'all') {
      clients = clients.filter(c => c.status === filter.status);
    }
    if (filter.paymentStatus && filter.paymentStatus !== 'all') {
      clients = clients.filter(c => c.paymentStatus === filter.paymentStatus);
    }
    if (filter.adherenceStatus && filter.adherenceStatus !== 'all') {
      clients = clients.filter(c => c.adherenceStatus === filter.adherenceStatus);
    }
    if (filter.source && filter.source !== 'all') {
      clients = clients.filter(c => c.acquisitionSource === filter.source);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      clients = clients.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.currentGoal && c.currentGoal.toLowerCase().includes(q))
      );
    }
    return clients;
  }

  getClientById(id) {
    return this.data.clients.find(c => c.id === id);
  }

  createClient(clientData) {
    const id = `client-${Date.now()}`;
    const userId = `user-${id}`;
    
    // Create companion user account for client login
    const newUser = {
      id: userId,
      email: clientData.email,
      name: clientData.name,
      role: 'client',
      clientId: id,
      password: clientData.password || 'client123',
      phone: clientData.phone || '',
      avatar: clientData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(clientData.name)}`,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);

    const newClient = {
      id,
      userId,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone || '',
      avatar: newUser.avatar,
      dateOfBirth: clientData.dateOfBirth || '',
      gender: clientData.gender || 'Not specified',
      occupation: clientData.occupation || '',
      emergencyContact: clientData.emergencyContact || '',
      startDate: clientData.startDate || new Date().toISOString().split('T')[0],
      status: clientData.status || 'onboarding',
      trainingType: clientData.trainingType || 'Hybrid Coaching',
      trainingFrequency: clientData.trainingFrequency || '3x per week',
      currentGoal: clientData.currentGoal || 'General Fitness',
      goalsList: clientData.goalsList || ['General fitness'],
      acquisitionSource: clientData.acquisitionSource || 'Website',
      heightCm: Number(clientData.heightCm) || 170,
      weightKg: Number(clientData.weightKg) || 70,
      startingWeightKg: Number(clientData.weightKg) || 70,
      targetWeightKg: Number(clientData.targetWeightKg) || 68,
      trainingExperience: clientData.trainingExperience || 'Beginner',
      fitnessLevel: clientData.fitnessLevel || 'Beginner',
      injuries: clientData.injuries || 'None',
      restrictions: clientData.restrictions || 'None',
      equipmentAvailability: clientData.equipmentAvailability || 'Gym',
      lifestyleLevel: clientData.lifestyleLevel || 'Moderate',

      dietaryPreference: clientData.dietaryPreference || 'Omnivore',
      allergies: clientData.allergies || 'None',
      foodsAvoided: clientData.foodsAvoided || 'None',
      dailyCalorieTarget: Number(clientData.dailyCalorieTarget) || 2000,
      proteinTargetG: Number(clientData.proteinTargetG) || 140,
      carbsTargetG: Number(clientData.carbsTargetG) || 200,
      fatsTargetG: Number(clientData.fatsTargetG) || 60,
      waterTargetMl: Number(clientData.waterTargetMl) || 2500,
      nutritionNotes: clientData.nutritionNotes || '',

      adherenceScore: 100,
      adherenceStatus: 'Excellent',
      workoutAdherence: 100,
      nutritionAdherence: 100,
      sessionAttendance: 100,
      checkinAdherence: 100,

      sessionsPurchased: Number(clientData.sessionsPurchased) || 10,
      sessionsCompleted: 0,
      sessionsRemaining: Number(clientData.sessionsPurchased) || 10,
      sessionsCancelled: 0,
      sessionsMissed: 0,

      planName: clientData.planName || 'Monthly Coaching',
      monthlyPrice: Number(clientData.monthlyPrice) || 300,
      billingCycle: clientData.billingCycle || 'Monthly',
      paymentStatus: clientData.paymentStatus || 'due',
      nextPaymentDate: clientData.nextPaymentDate || new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],
      amountPaidToDate: 0,
      renewalsCount: 0,
      lifetimeRevenue: 0,
      lastSessionDate: null,
      lastPaymentDate: null,
      lastActivityDate: new Date().toISOString().split('T')[0],

      onboardingStep: 1,
      customFields: clientData.customFields || {},
      consentForMarketingPhotos: !!clientData.consentForMarketingPhotos
    };

    this.data.clients.push(newClient);

    // Initial timeline event
    this.addTimelineEvent(id, 'client_created', 'Client Onboarded', `Client account created with goal: ${newClient.currentGoal}.`);

    // Initial measurement
    if (newClient.weightKg) {
      this.addMeasurement({
        clientId: id,
        date: newClient.startDate,
        weightKg: newClient.weightKg,
        bodyFatPercent: null,
        chestCm: null,
        waistCm: null,
        hipsCm: null,
        armsCm: null,
        thighsCm: null,
        customFields: {}
      });
    }

    this.save();
    return newClient;
  }

  updateClient(id, updates) {
    const idx = this.data.clients.findIndex(c => c.id === id);
    if (idx === -1) return null;
    
    this.data.clients[idx] = { ...this.data.clients[idx], ...updates, id };
    
    // Update user record if name or email changed
    const user = this.data.users.find(u => u.clientId === id);
    if (user) {
      if (updates.name) user.name = updates.name;
      if (updates.email) user.email = updates.email;
      if (updates.avatar) user.avatar = updates.avatar;
      if (updates.phone) user.phone = updates.phone;
    }

    this.save();
    return this.data.clients[idx];
  }

  archiveClient(id) {
    return this.updateClient(id, { status: 'archived' });
  }

  restoreClient(id) {
    return this.updateClient(id, { status: 'active' });
  }

  deleteClient(id) {
    const clientIdx = this.data.clients.findIndex(c => c.id === id);
    if (clientIdx === -1) return false;
    
    this.data.clients.splice(clientIdx, 1);
    this.data.users = this.data.users.filter(u => u.clientId !== id);
    this.data.programs = this.data.programs.filter(p => p.clientId !== id);
    this.data.workoutLogs = this.data.workoutLogs.filter(w => w.clientId !== id);
    this.data.nutritionLogs = this.data.nutritionLogs.filter(n => n.clientId !== id);
    this.data.sessions = this.data.sessions.filter(s => s.clientId !== id);
    this.data.payments = this.data.payments.filter(p => p.clientId !== id);
    this.data.measurements = this.data.measurements.filter(m => m.clientId !== id);
    this.data.performanceMetrics = this.data.performanceMetrics.filter(m => m.clientId !== id);
    this.data.progressPhotos = this.data.progressPhotos.filter(p => p.clientId !== id);
    this.data.notes = this.data.notes.filter(n => n.clientId !== id);
    this.data.messages = this.data.messages.filter(m => m.clientId !== id);
    this.data.checkins = this.data.checkins.filter(c => c.clientId !== id);
    this.data.timelineEvents = this.data.timelineEvents.filter(t => t.clientId !== id);
    
    this.save();
    return true;
  }

  // --- Programs & Workouts ---
  getProgramsByClient(clientId) {
    return this.data.programs.filter(p => p.clientId === clientId);
  }

  getProgramById(id) {
    return this.data.programs.find(p => p.id === id);
  }

  createProgram(programData) {
    const id = `prog-${Date.now()}`;
    const newProgram = {
      id,
      ...programData,
      status: programData.status || 'active',
      createdAt: new Date().toISOString()
    };
    this.data.programs.push(newProgram);
    
    if (newProgram.clientId) {
      this.addTimelineEvent(newProgram.clientId, 'program_assigned', 'Program Assigned', `Coach assigned new program: "${newProgram.name}".`);
      
      // Notify client
      const user = this.data.users.find(u => u.clientId === newProgram.clientId);
      if (user) {
        this.addNotification({
          userId: user.id,
          role: 'client',
          title: 'New Program Assigned!',
          message: `Coach Alex assigned you "${newProgram.name}". Check out your workouts!`,
          type: 'workout',
          link: '/workouts'
        });
      }
    }
    
    this.save();
    return newProgram;
  }

  updateProgram(id, updates) {
    const idx = this.data.programs.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.programs[idx] = { ...this.data.programs[idx], ...updates, id };
    this.save();
    return this.data.programs[idx];
  }

  deleteProgram(id) {
    this.data.programs = this.data.programs.filter(p => p.id !== id);
    this.save();
    return true;
  }

  // --- Workout Logs ---
  getWorkoutLogsByClient(clientId) {
    return this.data.workoutLogs
      .filter(w => w.clientId === clientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  createWorkoutLog(logData) {
    const id = `log-${Date.now()}`;
    const newLog = {
      id,
      ...logData,
      date: logData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    this.data.workoutLogs.push(newLog);

    // Update client last activity
    const client = this.getClientById(logData.clientId);
    if (client) {
      client.lastActivityDate = newLog.date;
      this.addTimelineEvent(
        client.id,
        'workout_completed',
        'Workout Completed',
        `Completed ${newLog.workoutName || 'Workout'} (${newLog.durationMinutes || 45} mins). Total volume: ${newLog.totalVolumeKg || 0} kg.`
      );

      // Recalculate adherence
      this.recalculateClientAdherence(client.id);
    }

    // Check for 1RM PRs from exercises completed
    if (Array.isArray(newLog.exercisesCompleted)) {
      newLog.exercisesCompleted.forEach(ex => {
        if (Array.isArray(ex.sets)) {
          ex.sets.forEach(set => {
            if (set.completed && set.weightKg > 0 && set.reps > 0) {
              const est1RM = Math.round(set.weightKg * (1 + set.reps / 30));
              this.recordPerformanceMetric({
                clientId: logData.clientId,
                exerciseName: ex.exerciseName,
                date: newLog.date,
                value: set.weightKg,
                unit: 'kg',
                reps: set.reps,
                estimated1RM: est1RM
              });
            }
          });
        }
      });
    }

    // Trainer notification
    this.addNotification({
      userId: 'user-trainer-1',
      role: 'trainer',
      title: 'Workout Completed',
      message: `${client ? client.name : 'Client'} completed "${newLog.workoutName || 'Workout'}"!`,
      type: 'workout',
      link: `/clients/${logData.clientId}?tab=workout-history`
    });

    this.save();
    return newLog;
  }

  // --- Nutrition Logs ---
  getNutritionLogsByClient(clientId) {
    return this.data.nutritionLogs
      .filter(n => n.clientId === clientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  saveNutritionLog(logData) {
    const existingIdx = this.data.nutritionLogs.findIndex(
      n => n.clientId === logData.clientId && n.date === logData.date
    );

    let result;
    if (existingIdx >= 0) {
      this.data.nutritionLogs[existingIdx] = {
        ...this.data.nutritionLogs[existingIdx],
        ...logData
      };
      result = this.data.nutritionLogs[existingIdx];
    } else {
      result = {
        id: `nutr-${Date.now()}`,
        ...logData,
        createdAt: new Date().toISOString()
      };
      this.data.nutritionLogs.push(result);
    }

    const client = this.getClientById(logData.clientId);
    if (client) {
      client.lastActivityDate = logData.date;
      this.recalculateClientAdherence(client.id);
    }

    this.save();
    return result;
  }

  // --- Sessions ---
  getSessions(filter = {}) {
    let sessions = [...this.data.sessions];
    if (filter.clientId) {
      sessions = sessions.filter(s => s.clientId === filter.clientId);
    }
    if (filter.status && filter.status !== 'all') {
      sessions = sessions.filter(s => s.status === filter.status);
    }
    return sessions.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
  }

  createSession(sessionData) {
    const client = this.getClientById(sessionData.clientId);
    const id = `sess-${Date.now()}`;
    const newSession = {
      id,
      trainerId: 'user-trainer-1',
      ...sessionData,
      clientName: client ? client.name : (sessionData.clientName || 'Client'),
      status: sessionData.status || 'scheduled',
      createdAt: new Date().toISOString()
    };
    this.data.sessions.push(newSession);

    // Notify client
    if (client) {
      const user = this.data.users.find(u => u.clientId === client.id);
      if (user) {
        this.addNotification({
          userId: user.id,
          role: 'client',
          title: 'New Session Scheduled',
          message: `Session booked for ${newSession.date} at ${newSession.time} (${newSession.sessionType}).`,
          type: 'session',
          link: '/schedule'
        });
      }
    }

    this.save();
    return newSession;
  }

  updateSession(id, updates) {
    const idx = this.data.sessions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const oldSession = this.data.sessions[idx];
    const updated = { ...oldSession, ...updates, id };
    this.data.sessions[idx] = updated;

    const client = this.getClientById(updated.clientId);
    if (client) {
      // Recalculate session counts for client
      const clientSessions = this.data.sessions.filter(s => s.clientId === client.id);
      client.sessionsCompleted = clientSessions.filter(s => s.status === 'completed').length;
      client.sessionsCancelled = clientSessions.filter(s => s.status === 'cancelled').length;
      client.sessionsMissed = clientSessions.filter(s => s.status === 'no-show').length;
      client.sessionsRemaining = Math.max(0, (client.sessionsPurchased || 0) - client.sessionsCompleted);

      if (updates.status === 'completed' && oldSession.status !== 'completed') {
        client.lastSessionDate = updated.date;
        this.addTimelineEvent(
          client.id,
          'session_completed',
          'Training Session Completed',
          `${updated.sessionType} at ${updated.location || 'Studio'} completed.`
        );
      }
      this.recalculateClientAdherence(client.id);
    }

    this.save();
    return updated;
  }

  deleteSession(id) {
    this.data.sessions = this.data.sessions.filter(s => s.id !== id);
    this.save();
    return true;
  }

  // --- Payments ---
  getPayments(filter = {}) {
    let payments = [...this.data.payments];
    if (filter.clientId) {
      payments = payments.filter(p => p.clientId === filter.clientId);
    }
    if (filter.status && filter.status !== 'all') {
      payments = payments.filter(p => p.status === filter.status);
    }
    return payments.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  }

  createPayment(paymentData) {
    const client = this.getClientById(paymentData.clientId);
    const id = `pay-${Date.now()}`;
    const newPayment = {
      id,
      ...paymentData,
      clientName: client ? client.name : (paymentData.clientName || 'Client'),
      referenceId: paymentData.referenceId || `TXN_${Date.now().toString().slice(-6)}`,
      status: paymentData.status || 'paid',
      paidDate: paymentData.status === 'paid' ? (paymentData.paidDate || new Date().toISOString().split('T')[0]) : null,
      createdAt: new Date().toISOString()
    };
    this.data.payments.push(newPayment);

    if (client && newPayment.status === 'paid') {
      client.lastPaymentDate = newPayment.paidDate;
      client.paymentStatus = 'paid';
      client.amountPaidToDate = (client.amountPaidToDate || 0) + Number(newPayment.amount);
      client.lifetimeRevenue = (client.lifetimeRevenue || 0) + Number(newPayment.amount);
      client.renewalsCount = (client.renewalsCount || 0) + 1;

      this.addTimelineEvent(
        client.id,
        'payment_received',
        'Payment Recorded',
        `Recorded ₹${newPayment.amount} for ${newPayment.planName} (${newPayment.referenceId}).`
      );
    }

    this.save();
    return newPayment;
  }

  updatePayment(id, updates) {
    const idx = this.data.payments.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const oldPayment = this.data.payments[idx];
    const updated = { ...oldPayment, ...updates, id };
    this.data.payments[idx] = updated;

    const client = this.getClientById(updated.clientId);
    if (client && updates.status === 'paid' && oldPayment.status !== 'paid') {
      client.paymentStatus = 'paid';
      client.lastPaymentDate = updated.paidDate || new Date().toISOString().split('T')[0];
      client.amountPaidToDate = (client.amountPaidToDate || 0) + Number(updated.amount);
      client.lifetimeRevenue = (client.lifetimeRevenue || 0) + Number(updated.amount);
      
      this.addTimelineEvent(
        client.id,
        'payment_received',
        'Payment Succeeded',
        `Marked invoice ₹${updated.amount} as Paid.`
      );
    }

    this.save();
    return updated;
  }

  // --- Measurements & Progress ---
  getMeasurementsByClient(clientId) {
    return this.data.measurements
      .filter(m => m.clientId === clientId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  addMeasurement(measData) {
    const id = `meas-${Date.now()}`;
    const newMeas = {
      id,
      ...measData,
      date: measData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    this.data.measurements.push(newMeas);

    const client = this.getClientById(measData.clientId);
    if (client && newMeas.weightKg) {
      client.weightKg = Number(newMeas.weightKg);
      client.lastActivityDate = newMeas.date;
      this.addTimelineEvent(
        client.id,
        'measurement_updated',
        'Measurements Logged',
        `Body weight updated to ${newMeas.weightKg} kg.`
      );
    }

    this.save();
    return newMeas;
  }

  // --- Performance Metrics ---
  getPerformanceMetrics(clientId) {
    return this.data.performanceMetrics
      .filter(p => p.clientId === clientId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  recordPerformanceMetric(metricData) {
    const id = `perf-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newMetric = {
      id,
      ...metricData,
      createdAt: new Date().toISOString()
    };
    this.data.performanceMetrics.push(newMetric);
    this.save();
    return newMetric;
  }

  // --- Progress Photos ---
  getProgressPhotos(clientId) {
    return this.data.progressPhotos
      .filter(p => p.clientId === clientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  addProgressPhoto(photoData) {
    const id = `photo-${Date.now()}`;
    const newPhoto = {
      id,
      ...photoData,
      date: photoData.date || new Date().toISOString().split('T')[0],
      marketingConsent: photoData.marketingConsent !== undefined ? photoData.marketingConsent : false,
      createdAt: new Date().toISOString()
    };
    this.data.progressPhotos.push(newPhoto);

    this.addTimelineEvent(
      photoData.clientId,
      'photo_uploaded',
      'Progress Photo Added',
      `New ${newPhoto.category || 'front'} angle photo uploaded.`
    );

    this.save();
    return newPhoto;
  }

  deleteProgressPhoto(id) {
    this.data.progressPhotos = this.data.progressPhotos.filter(p => p.id !== id);
    this.save();
    return true;
  }

  // --- Notes ---
  getNotesByClient(clientId, isTrainer = false) {
    let notes = this.data.notes.filter(n => n.clientId === clientId);
    if (!isTrainer) {
      // Clients only see non-private notes
      notes = notes.filter(n => !n.isPrivateToTrainer);
    }
    return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createNote(noteData) {
    const id = `note-${Date.now()}`;
    const newNote = {
      id,
      trainerId: 'user-trainer-1',
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.notes.push(newNote);

    this.addTimelineEvent(
      newNote.clientId,
      'note_added',
      newNote.isPrivateToTrainer ? 'Private Trainer Note Added' : 'Coach Note Shared',
      newNote.title
    );

    this.save();
    return newNote;
  }

  deleteNote(id) {
    this.data.notes = this.data.notes.filter(n => n.id !== id);
    this.save();
    return true;
  }

  // --- Messages ---
  getMessagesByClient(clientId) {
    return this.data.messages
      .filter(m => m.clientId === clientId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  createMessage(msgData) {
    const id = `msg-${Date.now()}`;
    const newMsg = {
      id,
      ...msgData,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    this.data.messages.push(newMsg);

    // Create notification for recipient
    if (newMsg.senderRole === 'client') {
      this.addNotification({
        userId: 'user-trainer-1',
        role: 'trainer',
        title: 'New Client Message',
        message: `${newMsg.clientName || 'Client'}: "${newMsg.text.slice(0, 50)}..."`,
        type: 'message',
        link: `/clients/${newMsg.clientId}?tab=messages`
      });
    } else {
      const user = this.data.users.find(u => u.clientId === newMsg.clientId);
      if (user) {
        this.addNotification({
          userId: user.id,
          role: 'client',
          title: 'Message from Coach Alex',
          message: newMsg.text.slice(0, 60),
          type: 'message',
          link: '/messages'
        });
      }
    }

    this.save();
    return newMsg;
  }

  markMessagesAsRead(clientId, currentRole) {
    let modified = false;
    this.data.messages.forEach(m => {
      if (m.clientId === clientId && m.senderRole !== currentRole && !m.isRead) {
        m.isRead = true;
        modified = true;
      }
    });
    if (modified) this.save();
    return true;
  }

  // --- Check-ins ---
  getCheckins(clientId = null) {
    let checkins = [...this.data.checkins];
    if (clientId) {
      checkins = checkins.filter(c => c.clientId === clientId);
    }
    return checkins.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  submitCheckin(checkinData) {
    const client = this.getClientById(checkinData.clientId);
    const id = `chk-${Date.now()}`;
    const newCheckin = {
      id,
      ...checkinData,
      clientName: client ? client.name : 'Client',
      status: 'pending',
      date: checkinData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      trainerFeedback: '',
      reviewedAt: null
    };
    this.data.checkins.push(newCheckin);

    if (client) {
      client.lastActivityDate = newCheckin.date;
      this.addTimelineEvent(
        client.id,
        'checkin_submitted',
        'Weekly Check-in Submitted',
        `Energy: ${newCheckin.responses.energyRating}/10, Sleep: ${newCheckin.responses.sleepHours} hrs.`
      );
      this.recalculateClientAdherence(client.id);
    }

    // Alert trainer
    this.addNotification({
      userId: 'user-trainer-1',
      role: 'trainer',
      title: 'Weekly Check-in Submitted',
      message: `${client ? client.name : 'A client'} just submitted their weekly check-in.`,
      type: 'checkin',
      link: `/clients/${checkinData.clientId}?tab=checkins`
    });

    this.save();
    return newCheckin;
  }

  reviewCheckin(id, feedback) {
    const chk = this.data.checkins.find(c => c.id === id);
    if (!chk) return null;
    chk.trainerFeedback = feedback;
    chk.status = 'reviewed';
    chk.reviewedAt = new Date().toISOString();

    const user = this.data.users.find(u => u.clientId === chk.clientId);
    if (user) {
      this.addNotification({
        userId: user.id,
        role: 'client',
        title: 'Check-in Reviewed by Coach',
        message: `Coach Alex left feedback on your weekly check-in: "${feedback.slice(0, 50)}..."`,
        type: 'checkin',
        link: '/checkin'
      });
    }

    this.save();
    return chk;
  }

  // --- Notifications ---
  getNotifications(userId) {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  addNotification(notifData) {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newNotif = {
      id,
      ...notifData,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    this.data.notifications.unshift(newNotif);
    // Keep max 100 notifications
    if (this.data.notifications.length > 100) {
      this.data.notifications = this.data.notifications.slice(0, 100);
    }
    this.save();
    return newNotif;
  }

  markNotificationRead(id) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.save();
    }
    return notif;
  }

  markAllNotificationsRead(userId) {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    this.save();
    return true;
  }

  // --- Templates ---
  getTemplates(type = null) {
    if (type) {
      return this.data.templates.filter(t => t.type === type);
    }
    return this.data.templates;
  }

  createTemplate(templateData) {
    const id = `tpl-${Date.now()}`;
    const newTpl = { id, ...templateData, createdAt: new Date().toISOString() };
    this.data.templates.push(newTpl);
    this.save();
    return newTpl;
  }

  // --- Timeline ---
  getTimelineEvents(clientId) {
    return this.data.timelineEvents
      .filter(t => t.clientId === clientId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  addTimelineEvent(clientId, eventType, title, description) {
    const event = {
      id: `tl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      clientId,
      eventType,
      title,
      description,
      timestamp: new Date().toISOString()
    };
    this.data.timelineEvents.unshift(event);
    return event;
  }

  // --- Adherence & Radar Calculation ---
  recalculateClientAdherence(clientId) {
    const client = this.getClientById(clientId);
    if (!client) return;

    // Workout adherence
    const workouts = this.data.workoutLogs.filter(w => w.clientId === clientId);
    const wAdh = Math.min(100, Math.max(20, workouts.length >= 3 ? 92 : workouts.length * 28));

    // Nutrition adherence
    const nutrition = this.data.nutritionLogs.filter(n => n.clientId === clientId);
    const nAdh = Math.min(100, Math.max(15, nutrition.length >= 2 ? 88 : nutrition.length * 30));

    // Attendance
    const sessions = this.data.sessions.filter(s => s.clientId === clientId);
    const completed = sessions.filter(s => s.status === 'completed').length;
    const missed = sessions.filter(s => s.status === 'no-show').length;
    const totalAtt = completed + missed;
    const sAtt = totalAtt > 0 ? Math.round((completed / totalAtt) * 100) : 100;

    // Checkin
    const checkins = this.data.checkins.filter(c => c.clientId === clientId);
    const cAdh = checkins.length > 0 ? 90 : 60;

    const weightedScore = Math.round(wAdh * 0.35 + nAdh * 0.25 + sAtt * 0.25 + cAdh * 0.15);
    client.adherenceScore = weightedScore;
    client.workoutAdherence = wAdh;
    client.nutritionAdherence = nAdh;
    client.sessionAttendance = sAtt;
    client.checkinAdherence = cAdh;

    if (weightedScore >= 80) client.adherenceStatus = 'Excellent';
    else if (weightedScore >= 65) client.adherenceStatus = 'Good';
    else client.adherenceStatus = 'Needs Attention';
  }

  // --- Trainer Dashboard Aggregate Analytics ---
  getDashboardAnalytics(dateRange = 'this_month') {
    const clients = this.data.clients.filter(c => c.status !== 'archived');
    const activeClients = clients.filter(c => c.status === 'active');
    const newClients = clients.filter(c => c.status === 'onboarding' || new Date(c.startDate) > new Date(Date.now() - 30*24*3600*1000));
    
    // Sessions today
    const todayStr = new Date().toISOString().split('T')[0];
    const sessionsToday = this.data.sessions.filter(s => s.date === todayStr);
    const sessionsCompletedWeek = this.data.sessions.filter(s => s.status === 'completed');

    // Payments
    const pendingPayments = this.data.payments.filter(p => p.status === 'due');
    const overduePayments = this.data.payments.filter(p => p.status === 'overdue');

    // Revenue
    const currentMonthRevenue = this.data.payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const projectedMRR = activeClients.reduce((sum, c) => sum + Number(c.monthlyPrice || 0), 0);

    // Needs attention radar items
    const needsAttentionList = [];
    clients.forEach(c => {
      const reasons = [];
      if (c.paymentStatus === 'overdue') {
        reasons.push('Payment overdue');
      }
      if (c.adherenceScore < 60) {
        reasons.push(`Low adherence score (${c.adherenceScore}%)`);
      }
      if (c.sessionsMissed > 0) {
        reasons.push(`${c.sessionsMissed} missed session(s)`);
      }
      if (c.lastActivityDate) {
        const daysInactive = Math.floor((Date.now() - new Date(c.lastActivityDate).getTime()) / (1000*3600*24));
        if (daysInactive >= 3) {
          reasons.push(`Inactive for ${daysInactive} days`);
        }
      }
      if (reasons.length > 0) {
        needsAttentionList.push({
          clientId: c.id,
          name: c.name,
          avatar: c.avatar,
          currentGoal: c.currentGoal,
          adherenceScore: c.adherenceScore,
          paymentStatus: c.paymentStatus,
          reasons
        });
      }
    });

    return {
      activeClientsCount: activeClients.length,
      totalClientsCount: clients.length,
      newClientsCount: newClients.length,
      sessionsScheduledToday: sessionsToday.length,
      sessionsCompletedWeek: sessionsCompletedWeek.length,
      pendingPaymentsTotal: pendingPayments.reduce((s, p) => s + Number(p.amount), 0),
      overduePaymentsTotal: overduePayments.reduce((s, p) => s + Number(p.amount), 0),
      currentMonthRevenue,
      projectedMRR,
      needsAttentionList,
      recentActivity: this.data.timelineEvents.slice(0, 10),
      acquisitionBreakdown: {
        Instagram: clients.filter(c => c.acquisitionSource === 'Instagram').length,
        Referral: clients.filter(c => c.acquisitionSource === 'Referral').length,
        Website: clients.filter(c => c.acquisitionSource === 'Website').length,
        WhatsApp: clients.filter(c => c.acquisitionSource === 'WhatsApp').length,
        Existing: clients.filter(c => c.acquisitionSource === 'Existing client').length,
        Other: clients.filter(c => !['Instagram', 'Referral', 'Website', 'WhatsApp', 'Existing client'].includes(c.acquisitionSource)).length
      }
    };
  }
}

export const db = new Database();
