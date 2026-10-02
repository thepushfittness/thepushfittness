// API Service Client for PushFitness

const API_BASE = '/api';

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

  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (email, newPassword) => request('/auth/reset-password', { method: 'POST', body: { email, newPassword } }),
  demoSwitch: (role, clientId = null) => request('/auth/demo-switch', { method: 'POST', body: { role, clientId } }),
  getMe: () => request('/auth/me'),

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
