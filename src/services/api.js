// API Service Client for PushFitness

const API_BASE = '/api';
const SNAPSHOT_STORAGE_KEY = 'pushfitness_db_snapshot_v1';

export function getAuthToken() {
  return localStorage.getItem('pushfitness_token') || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('pushfitness_token', token);
  } else {
    localStorage.removeItem('pushfitness_token');
  }
}

export async function ensureServerSynced() {
  try {
    const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (!raw) return;
    const localSnapshot = JSON.parse(raw);
    if (!localSnapshot || !localSnapshot.lastUpdatedAt) return;

    const syncRes = await fetch(`${API_BASE}/system/sync`).then(r => r.ok ? r.json() : null).catch(() => null);
    if (syncRes && (syncRes.lastUpdatedAt || 0) < localSnapshot.lastUpdatedAt) {
      await fetch(`${API_BASE}/system/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot: localSnapshot })
      }).catch(() => null);
    }
  } catch (e) {
    console.warn('Auto-sync check skipped:', e);
  }
}

export async function backupServerSnapshot() {
  try {
    const token = getAuthToken();
    if (!token) return;
    const res = await fetch(`${API_BASE}/system/snapshot`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const snapshot = await res.json();
      if (snapshot && Array.isArray(snapshot.users)) {
        localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
      }
    }
  } catch (e) {
    // Ignore if user is client or offline
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 401) {
    // Unauthorized / session expired
    localStorage.removeItem('pushfitness_token');
    localStorage.removeItem('pushfitness_user');
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/csv')) {
    return response.blob();
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  // Whenever a mutating request succeeds, back up the latest DB state locally
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'DELETE'].includes(method) && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/admin/reset-db')) {
    if (data?.token) {
      setAuthToken(data.token);
    }
    backupServerSnapshot();
  }

  return data;
}

export const api = {
  // Auth
  login: async (email, password) => {
    await ensureServerSynced();
    const res = await request('/auth/login', { method: 'POST', body: { email, password } });
    if (res?.token) {
      setAuthToken(res.token);
      await backupServerSnapshot();
    }
    return res;
  },
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: async (email, newPassword) => {
    await ensureServerSynced();
    return request('/auth/reset-password', { method: 'POST', body: { email, newPassword } });
  },
  updateProfile: async (profileData) => {
    const res = await request('/auth/profile', { method: 'PUT', body: profileData });
    if (res?.token) {
      setAuthToken(res.token);
    }
    await backupServerSnapshot();
    return res;
  },
  demoSwitch: (role, clientId = null) => request('/auth/demo-switch', { method: 'POST', body: { role, clientId } }),
  getMe: async () => {
    await ensureServerSynced();
    return request('/auth/me');
  },

  // Dashboard Analytics
  getAnalytics: (range = 'this_month') => request(`/dashboard/analytics?range=${range}`),

  // Clients
  getClients: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/clients${query ? `?${query}` : ''}`);
  },
  getClient: (id) => request(`/clients/${id}`),
  createClient: (clientData) => request('/clients', { method: 'POST', body: clientData }),
  updateClient: (id, updates) => request(`/clients/${id}`, { method: 'PUT', body: updates }),
  archiveClient: (id) => request(`/clients/${id}/archive`, { method: 'POST' }),
  restoreClient: (id) => request(`/clients/${id}/restore`, { method: 'POST' }),
  deleteClient: (id) => request(`/clients/${id}`, { method: 'DELETE' }),

  // Programs & Workouts
  getPrograms: (clientId) => request(`/programs${clientId ? `?clientId=${clientId}` : ''}`),
  createProgram: (programData) => request('/programs', { method: 'POST', body: programData }),
  updateProgram: (id, updates) => request(`/programs/${id}`, { method: 'PUT', body: updates }),
  deleteProgram: (id) => request(`/programs/${id}`, { method: 'DELETE' }),

  // Workout Logs
  getWorkoutLogs: (clientId) => request(`/workout-logs?clientId=${clientId}`),
  createWorkoutLog: (logData) => request('/workout-logs', { method: 'POST', body: logData }),

  // Nutrition Logs
  getNutritionLogs: (clientId) => request(`/nutrition-logs?clientId=${clientId}`),
  saveNutritionLog: (logData) => request('/nutrition-logs', { method: 'POST', body: logData }),

  // Sessions
  getSessions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/sessions${query ? `?${query}` : ''}`);
  },
  createSession: (sessionData) => request('/sessions', { method: 'POST', body: sessionData }),
  updateSession: (id, updates) => request(`/sessions/${id}`, { method: 'PUT', body: updates }),
  deleteSession: (id) => request(`/sessions/${id}`, { method: 'DELETE' }),

  // Payments
  getPayments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/payments${query ? `?${query}` : ''}`);
  },
  createPayment: (paymentData) => request('/payments', { method: 'POST', body: paymentData }),
  updatePayment: (id, updates) => request(`/payments/${id}`, { method: 'PUT', body: updates }),

  // Measurements & Progress
  getMeasurements: (clientId) => request(`/measurements?clientId=${clientId}`),
  addMeasurement: (measData) => request('/measurements', { method: 'POST', body: measData }),

  // Performance Metrics
  getPerformanceMetrics: (clientId) => request(`/performance-metrics?clientId=${clientId}`),
  addPerformanceMetric: (metricData) => request('/performance-metrics', { method: 'POST', body: metricData }),

  // Progress Photos
  getProgressPhotos: (clientId) => request(`/progress-photos?clientId=${clientId}`),
  addProgressPhoto: (photoData) => request('/progress-photos', { method: 'POST', body: photoData }),
  deleteProgressPhoto: (id) => request(`/progress-photos/${id}`, { method: 'DELETE' }),

  // Notes
  getNotes: (clientId) => request(`/notes?clientId=${clientId}`),
  createNote: (noteData) => request('/notes', { method: 'POST', body: noteData }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),

  // Messages
  getMessages: (clientId) => request(`/messages?clientId=${clientId}`),
  sendMessage: (msgData) => request('/messages', { method: 'POST', body: msgData }),
  markMessagesRead: (clientId) => request('/messages/read', { method: 'PUT', body: { clientId } }),

  // Check-ins
  getCheckins: (clientId) => request(`/checkins${clientId ? `?clientId=${clientId}` : ''}`),
  submitCheckin: (checkinData) => request('/checkins', { method: 'POST', body: checkinData }),
  reviewCheckin: (id, feedback) => request(`/checkins/${id}/review`, { method: 'PUT', body: { feedback } }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Templates
  getTemplates: (type) => request(`/templates${type ? `?type=${type}` : ''}`),
  createTemplate: (templateData) => request('/templates', { method: 'POST', body: templateData }),

  // Timeline
  getTimeline: (clientId) => request(`/timeline?clientId=${clientId}`),

  // Reports
  getClientReport: (clientId) => request(`/reports/${clientId}`),

  // Export
  exportCsv: async (type) => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE}/export/${type}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Export failed');
    return res.blob();
  },

  // Database Reset
  resetDb: () => request('/admin/reset-db', { method: 'POST' })
};
