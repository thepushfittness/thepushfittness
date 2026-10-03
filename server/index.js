import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'pushfitness_super_secure_jwt_secret_key_2026';

app.use(cors());
app.use(express.json());

// --- Authentication Middleware & Data Isolation Guards ---

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      clientId: user.clientId || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token' });
    }
    req.user = decodedUser;
    next();
  });
}

function requireTrainer(req, res, next) {
  if (req.user?.role !== 'trainer') {
    return res.status(403).json({ error: 'Access denied: Trainer role required' });
  }
  next();
}

/**
 * CRITICAL DATA ISOLATION ENFORCER:
 * Trainer can view all. Client can ONLY access their own records.
 * Direct API manipulation with another client ID will fail with 403 Forbidden!
 */
function enforceClientIsolation(getClientIdFromReq) {
  return (req, res, next) => {
    const targetClientId = getClientIdFromReq(req);
    if (!targetClientId) return next();

    if (req.user.role === 'trainer') {
      return next(); // Trainer has holistic administrative rights
    }

    if (req.user.role === 'client' && req.user.clientId === targetClientId) {
      return next(); // Client accessing their own data
    }

    return res.status(403).json({
      error: 'Security Violation: You do not have permission to view or modify this client\'s records.'
    });
  };
}

// --- Auth Endpoints ---

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Validate password
  const isValid = user.password 
    ? (user.password === password)
    : (password === 'admin123' || password === 'client123' || password === 'password123');

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);
  const clientProfile = user.clientId ? db.getClientById(user.clientId) : null;

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId: user.clientId,
      avatar: user.avatar,
      phone: user.phone
    },
    clientProfile
  });
});

// Forgot Password endpoint
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = db.findUserByEmail(email);
  if (!user) {
    // Return friendly message without disclosing user enumeration
    return res.json({ success: true, message: 'If an account exists with this email, password reset instructions have been dispatched.' });
  }
  
  // In production, send email reset link; in this system, provide instant reset token or instructions
  res.json({
    success: true,
    message: `Password reset instructions sent for ${user.email}. Default credentials or temporary token active.`,
    isTrainer: user.role === 'trainer'
  });
});

// Reset Password endpoint
app.post('/api/auth/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User account not found' });
  }
  user.password = newPassword;
  db.save();
  res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
});

// Update Profile & Password endpoint
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  const { name, email, phone, avatar, password } = req.body;
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (name) user.name = name.trim();
  if (email) user.email = email.toLowerCase().trim();
  if (phone) user.phone = phone.trim();
  if (avatar) user.avatar = avatar.trim();
  if (password) user.password = password;

  db.save();
  res.json({
    success: true,
    message: 'Profile and credentials updated successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId: user.clientId,
      avatar: user.avatar,
      phone: user.phone
    }
  });
});

// Demo switch login (instant seamless role toggle for demo/testing)
app.post('/api/auth/demo-switch', (req, res) => {
  const { role, clientId, email } = req.body;

  let user;
  if (email) {
    user = db.findUserByEmail(email);
  } else if (role === 'trainer') {
    user = db.data.users.find(u => u.role === 'trainer');
  } else if (clientId) {
    user = db.data.users.find(u => u.clientId === clientId);
  } else {
    user = db.data.users.find(u => u.role === 'client');
  }

  if (!user) {
    return res.status(404).json({ error: 'User account not found' });
  }

  const token = generateToken(user);
  const clientProfile = user.clientId ? db.getClientById(user.clientId) : null;

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId: user.clientId,
      avatar: user.avatar,
      phone: user.phone
    },
    clientProfile
  });
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const clientProfile = user.clientId ? db.getClientById(user.clientId) : null;
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId: user.clientId,
      avatar: user.avatar,
      phone: user.phone
    },
    clientProfile
  });
});

// --- Trainer Dashboard Analytics ---
app.get('/api/dashboard/analytics', authenticateToken, requireTrainer, (req, res) => {
  const { range } = req.query;
  const analytics = db.getDashboardAnalytics(range);
  res.json(analytics);
});

// --- Client Management ---

// Get clients (Trainer sees filtered list; Client can only see their own item)
app.get('/api/clients', authenticateToken, (req, res) => {
  if (req.user.role === 'client') {
    const ownClient = db.getClientById(req.user.clientId);
    return res.json(ownClient ? [ownClient] : []);
  }

  const { status, paymentStatus, adherenceStatus, source, search } = req.query;
  const clients = db.getClients({ status, paymentStatus, adherenceStatus, source, search });
  res.json(clients);
});

// Get single client by ID (guarded)
app.get('/api/clients/:id', authenticateToken, enforceClientIsolation(req => req.params.id), (req, res) => {
  const client = db.getClientById(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json(client);
});

// Create client (Trainer only)
app.post('/api/clients', authenticateToken, requireTrainer, (req, res) => {
  try {
    const newClient = db.createClient(req.body);
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update client (Trainer or Client updating their own profile)
app.put('/api/clients/:id', authenticateToken, enforceClientIsolation(req => req.params.id), (req, res) => {
  const updated = db.updateClient(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Client not found' });
  res.json(updated);
});

// Archive client (Trainer only)
app.post('/api/clients/:id/archive', authenticateToken, requireTrainer, (req, res) => {
  const archived = db.archiveClient(req.params.id);
  if (!archived) return res.status(404).json({ error: 'Client not found' });
  res.json(archived);
});

// Restore client (Trainer only)
app.post('/api/clients/:id/restore', authenticateToken, requireTrainer, (req, res) => {
  const restored = db.restoreClient(req.params.id);
  if (!restored) return res.status(404).json({ error: 'Client not found' });
  res.json(restored);
});

// Delete client permanently (Trainer only)
app.delete('/api/clients/:id', authenticateToken, requireTrainer, (req, res) => {
  const success = db.deleteClient(req.params.id);
  if (!success) return res.status(404).json({ error: 'Client not found' });
  res.json({ success: true, message: 'Client permanently deleted.' });
});

// --- Programs & Workouts ---

app.get('/api/programs', authenticateToken, (req, res) => {
  const { clientId } = req.query;
  if (!clientId) {
    if (req.user.role === 'trainer') {
      return res.json(db.data.programs);
    }
    return res.json(db.getProgramsByClient(req.user.clientId));
  }

  // Guard isolation
  if (req.user.role === 'client' && req.user.clientId !== clientId) {
    return res.status(403).json({ error: 'Access denied to other client programs' });
  }

  res.json(db.getProgramsByClient(clientId));
});

app.post('/api/programs', authenticateToken, requireTrainer, (req, res) => {
  const program = db.createProgram(req.body);
  res.status(201).json(program);
});

app.put('/api/programs/:id', authenticateToken, requireTrainer, (req, res) => {
  const updated = db.updateProgram(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Program not found' });
  res.json(updated);
});

app.delete('/api/programs/:id', authenticateToken, requireTrainer, (req, res) => {
  db.deleteProgram(req.params.id);
  res.json({ success: true });
});

// --- Workout Logs ---

app.get('/api/workout-logs', authenticateToken, (req, res) => {
  const clientId = req.query.clientId || (req.user.role === 'client' ? req.user.clientId : null);
  if (!clientId) return res.status(400).json({ error: 'clientId required' });

  if (req.user.role === 'client' && req.user.clientId !== clientId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(db.getWorkoutLogsByClient(clientId));
});

app.post('/api/workout-logs', authenticateToken, (req, res) => {
  const logData = req.body;
  if (req.user.role === 'client') {
    logData.clientId = req.user.clientId;
  }
  const created = db.createWorkoutLog(logData);
  res.status(201).json(created);
});

// --- Nutrition Logs ---

app.get('/api/nutrition-logs', authenticateToken, (req, res) => {
  const clientId = req.query.clientId || (req.user.role === 'client' ? req.user.clientId : null);
  if (!clientId) return res.status(400).json({ error: 'clientId required' });

  if (req.user.role === 'client' && req.user.clientId !== clientId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(db.getNutritionLogsByClient(clientId));
});

app.post('/api/nutrition-logs', authenticateToken, (req, res) => {
  const logData = req.body;
  if (req.user.role === 'client') {
    logData.clientId = req.user.clientId;
  }
  const saved = db.saveNutritionLog(logData);
  res.json(saved);
});

// --- Sessions ---

app.get('/api/sessions', authenticateToken, (req, res) => {
  const filter = { ...req.query };
  if (req.user.role === 'client') {
    filter.clientId = req.user.clientId;
  }
  res.json(db.getSessions(filter));
});

app.post('/api/sessions', authenticateToken, requireTrainer, (req, res) => {
  const newSession = db.createSession(req.body);
  res.status(201).json(newSession);
});

app.put('/api/sessions/:id', authenticateToken, (req, res) => {
  // Trainer can update everything; client can request reschedule / cancel
  const updated = db.updateSession(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Session not found' });
  res.json(updated);
});

app.delete('/api/sessions/:id', authenticateToken, requireTrainer, (req, res) => {
  db.deleteSession(req.params.id);
  res.json({ success: true });
});

// --- Payments ---

app.get('/api/payments', authenticateToken, (req, res) => {
  const filter = { ...req.query };
  if (req.user.role === 'client') {
    filter.clientId = req.user.clientId;
  }
  res.json(db.getPayments(filter));
});

app.post('/api/payments', authenticateToken, requireTrainer, (req, res) => {
  const newPayment = db.createPayment(req.body);
  res.status(201).json(newPayment);
});

app.put('/api/payments/:id', authenticateToken, requireTrainer, (req, res) => {
  const updated = db.updatePayment(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Payment not found' });
  res.json(updated);
});

// --- Measurements & Progress ---

app.get('/api/measurements', authenticateToken, (req, res) => {
  const clientId = req.query.clientId || (req.user.role === 'client' ? req.user.clientId : null);
  if (!clientId) return res.status(400).json({ error: 'clientId required' });

  if (req.user.role === 'client' && req.user.clientId !== clientId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(db.getMeasurementsByClient(clientId));
});

app.post('/api/measurements', authenticateToken, (req, res) => {
  const measData = req.body;
  if (req.user.role === 'client') {
    measData.clientId = req.user.clientId;
  }
  const added = db.addMeasurement(measData);
  res.status(201).json(added);
});

// --- Performance Metrics ---

app.get('/api/performance-metrics', authenticateToken, (req, res) => {
  const clientId = req.query.clientId || (req.user.role === 'client' ? req.user.clientId : null);
  if (!clientId) return res.status(400).json({ error: 'clientId required' });

  if (req.user.role === 'client' && req.user.clientId !== clientId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(db.getPerformanceMetrics(clientId));
});

app.post('/api/performance-metrics', authenticateToken, (req, res) => {
  const metric = db.recordPerformanceMetric(req.body);
  res.status(201).json(metric);
});

// --- Progress Photos ---

app.get('/api/progress-photos', authenticateToken, (req, res) => {
  const clientId = req.query.clientId || (req.user.role === 'client' ? req.user.clientId : null);
  if (!clientId) return res.status(400).json({ error: 'clientId required' });

  if (req.user.role === 'client' && req.user.clientId !== clientId) {
    return res.status(403).json({ error: 'Access denied to other client photos' });
  }

  res.json(db.getProgressPhotos(clientId));
});

app.post('/api/progress-photos', authenticateToken, (req, res) => {
  const photoData = req.body;
  if (req.user.role === 'client') {
    photoData.clientId = req.user.clientId;
  }
  const created = db.addProgressPhoto(photoData);
  res.status(201).json(created);
});

app.delete('/api/progress-photos/:id', authenticateToken, (req, res) => {
  db.deleteProgressPhoto(req.params.id);
  res.json({ success: true });
});

// --- Notes (Strict separation: Trainer Private vs Shared) ---

app.get('/api/notes', authenticateToken, (req, res) => {
  const clientId = req.query.clientId || (req.user.role === 'client' ? req.user.clientId : null);
  if (!clientId) return res.status(400).json({ error: 'clientId required' });

  if (req.user.role === 'client' && req.user.clientId !== clientId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const isTrainer = req.user.role === 'trainer';
  res.json(db.getNotesByClient(clientId, isTrainer));
});

app.post('/api/notes', authenticateToken, requireTrainer, (req, res) => {
  const newNote = db.createNote(req.body);
  res.status(201).json(newNote);
});

app.delete('/api/notes/:id', authenticateToken, requireTrainer, (req, res) => {
  db.deleteNote(req.params.id);
  res.json({ success: true });
});

// --- Messages ---

app.get('/api/messages', authenticateToken, (req, res) => {
  const clientId = req.query.clientId || (req.user.role === 'client' ? req.user.clientId : null);
  if (!clientId) return res.status(400).json({ error: 'clientId required' });

  if (req.user.role === 'client' && req.user.clientId !== clientId) {
    return res.status(403).json({ error: 'Access denied to conversation' });
  }

  res.json(db.getMessagesByClient(clientId));
});

app.post('/api/messages', authenticateToken, (req, res) => {
  const msgData = {
    ...req.body,
    senderId: req.user.id,
    senderRole: req.user.role
  };
  if (req.user.role === 'client') {
    msgData.clientId = req.user.clientId;
  }
  const created = db.createMessage(msgData);
  res.status(201).json(created);
});

app.put('/api/messages/read', authenticateToken, (req, res) => {
  const { clientId } = req.body;
  if (!clientId) return res.status(400).json({ error: 'clientId required' });
  db.markMessagesAsRead(clientId, req.user.role);
  res.json({ success: true });
});

// --- Check-ins ---

app.get('/api/checkins', authenticateToken, (req, res) => {
  let clientId = req.query.clientId;
  if (req.user.role === 'client') {
    clientId = req.user.clientId;
  }
  res.json(db.getCheckins(clientId));
});

app.post('/api/checkins', authenticateToken, (req, res) => {
  const checkinData = req.body;
  if (req.user.role === 'client') {
    checkinData.clientId = req.user.clientId;
  }
  const created = db.submitCheckin(checkinData);
  res.status(201).json(created);
});

app.put('/api/checkins/:id/review', authenticateToken, requireTrainer, (req, res) => {
  const { feedback } = req.body;
  const reviewed = db.reviewCheckin(req.params.id, feedback);
  if (!reviewed) return res.status(404).json({ error: 'Checkin not found' });
  res.json(reviewed);
});

// --- Notifications ---

app.get('/api/notifications', authenticateToken, (req, res) => {
  res.json(db.getNotifications(req.user.id));
});

app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const updated = db.markNotificationRead(req.params.id);
  res.json(updated || { success: true });
});

app.put('/api/notifications/read-all', authenticateToken, (req, res) => {
  db.markAllNotificationsRead(req.user.id);
  res.json({ success: true });
});

// --- Templates ---

app.get('/api/templates', authenticateToken, requireTrainer, (req, res) => {
  res.json(db.getTemplates(req.query.type));
});

app.post('/api/templates', authenticateToken, requireTrainer, (req, res) => {
  const created = db.createTemplate(req.body);
  res.status(201).json(created);
});

// --- Timeline ---

app.get('/api/timeline', authenticateToken, (req, res) => {
  const clientId = req.query.clientId || (req.user.role === 'client' ? req.user.clientId : null);
  if (!clientId) return res.status(400).json({ error: 'clientId required' });

  if (req.user.role === 'client' && req.user.clientId !== clientId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(db.getTimelineEvents(clientId));
});

// --- Comprehensive Progress Report Generation ---
app.get('/api/reports/:clientId', authenticateToken, enforceClientIsolation(req => req.params.clientId), (req, res) => {
  const clientId = req.params.clientId;
  const client = db.getClientById(clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const measurements = db.getMeasurementsByClient(clientId);
  const workoutLogs = db.getWorkoutLogsByClient(clientId);
  const nutritionLogs = db.getNutritionLogsByClient(clientId);
  const sessions = db.getSessions({ clientId });
  const perfMetrics = db.getPerformanceMetrics(clientId);
  const progressPhotos = db.getProgressPhotos(clientId);
  const checkins = db.getCheckins(clientId);
  const notes = db.getNotesByClient(clientId, req.user.role === 'trainer');

  const report = {
    generatedAt: new Date().toISOString(),
    client,
    summary: {
      startingWeight: client.startingWeightKg,
      currentWeight: client.weightKg,
      weightChange: Number((client.weightKg - client.startingWeightKg).toFixed(1)),
      targetWeight: client.targetWeightKg,
      workoutAdherence: client.workoutAdherence,
      nutritionAdherence: client.nutritionAdherence,
      adherenceScore: client.adherenceScore,
      sessionsCompleted: client.sessionsCompleted,
      sessionsPurchased: client.sessionsPurchased,
      attendanceRate: client.sessionAttendance
    },
    measurements,
    workoutLogs: workoutLogs.slice(0, 10),
    nutritionLogs: nutritionLogs.slice(0, 14),
    sessions,
    performanceMetrics: perfMetrics,
    progressPhotos,
    checkins,
    notes
  };

  res.json(report);
});

// --- CSV Export (Trainer only) ---
app.get('/api/export/:type', authenticateToken, requireTrainer, (req, res) => {
  const type = req.params.type;
  let csv = '';

  if (type === 'clients') {
    csv = 'ID,Name,Email,Phone,Status,Goal,Plan,MonthlyPrice,Adherence,WeightKg,SessionsRemaining\n';
    db.data.clients.forEach(c => {
      csv += `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.status}","${c.currentGoal}","${c.planName}",${c.monthlyPrice},${c.adherenceScore}%,${c.weightKg},${c.sessionsRemaining}\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="pushfitness-clients.csv"');
    return res.send(csv);
  }

  if (type === 'payments') {
    csv = 'ID,ClientName,PlanName,Amount,Status,DueDate,PaidDate,ReferenceID\n';
    db.data.payments.forEach(p => {
      csv += `"${p.id}","${p.clientName}","${p.planName}",${p.amount},"${p.status}","${p.dueDate}","${p.paidDate || ''}","${p.referenceId}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="pushfitness-payments.csv"');
    return res.send(csv);
  }

  res.status(400).json({ error: 'Invalid export type. Supported: clients, payments' });
});

// Reset database route for fresh test setup
app.post('/api/admin/reset-db', authenticateToken, requireTrainer, (req, res) => {
  db.reset();
  res.json({ success: true, message: 'Database reset to initial demo seeds.' });
});

// Serve frontend built files in production mode
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(DIST_PATH, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`PushFitness API Backend listening on http://localhost:${PORT}`);
});

