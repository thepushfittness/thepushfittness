import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Flame, 
  ChevronRight, 
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
  PieChart as PieIcon,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export function TrainerDashboard({ 
  onSelectClient, 
  onOpenAddClient, 
  onOpenSchedule, 
  onOpenPayment, 
  onOpenProgram,
  setActiveTab 
}) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsData, clientsData] = await Promise.all([
        api.getAnalytics('this_month'),
        api.getClients()
      ]);
      setAnalytics(analyticsData);
      setClients(clientsData || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading Coach Alex's Command Center...</p>
        </div>
      </div>
    );
  }

  // Chart data calculations
  const adherenceDistribution = [
    { name: 'Excellent (>80%)', value: clients.filter(c => c.adherenceScore >= 80).length, color: '#10b981' },
    { name: 'Good (65-79%)', value: clients.filter(c => c.adherenceScore >= 65 && c.adherenceScore < 80).length, color: '#3b82f6' },
    { name: 'Needs Attention (<65%)', value: clients.filter(c => c.adherenceScore < 65).length, color: '#ef4444' }
  ];

  const weeklySessionData = [
    { day: 'Mon', scheduled: 4, completed: 4 },
    { day: 'Tue', scheduled: 5, completed: 5 },
    { day: 'Wed', scheduled: 3, completed: 3 },
    { day: 'Thu', scheduled: 6, completed: 5 },
    { day: 'Fri', scheduled: 5, completed: 4 },
    { day: 'Sat', scheduled: 3, completed: 2 },
    { day: 'Sun', scheduled: 1, completed: 1 }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Live Operations
            </span>
            <span className="text-xs text-slate-400">
              Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
            Trainer Command Center
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Overview of client compliance, upcoming coaching sessions, and business revenue.
          </p>
        </div>

        {/* Action Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddClient}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Client</span>
          </button>
          <button
            onClick={onOpenSchedule}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition"
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Book Session</span>
          </button>
          <button
            onClick={onOpenProgram}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Create Workout</span>
          </button>
          <button
            onClick={onOpenPayment}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition"
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Log Payment</span>
          </button>
        </div>
      </div>

      {/* 6 Key Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Active Clients */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Clients</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">
            {analytics?.activeClientsCount || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center">
            <span className="text-emerald-400 font-semibold mr-1">+{analytics?.newClientsCount || 0}</span> new this month
          </div>
        </div>

        {/* Sessions Today */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Sessions</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">
            {analytics?.sessionsScheduledToday || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {analytics?.sessionsCompletedWeek || 0} completed this week
          </div>
        </div>

        {/* Current Month Revenue */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Revenue This Month</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-emerald-400">
            ₹{analytics?.currentMonthRevenue?.toLocaleString() || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            MRR run-rate: ₹{analytics?.projectedMRR?.toLocaleString() || 0}
          </div>
        </div>

        {/* Overdue Payments */}
        <div className={`p-4 rounded-xl shadow-sm border transition ${
          analytics?.overduePaymentsTotal > 0
            ? 'bg-red-950/20 border-red-900/50 hover:border-red-700'
            : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Overdue Invoices</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-red-400">
            ₹{analytics?.overduePaymentsTotal || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {analytics?.overduePaymentsTotal > 0 ? 'Requires follow-up action' : 'Zero overdue payments'}
          </div>
        </div>

        {/* Avg Client Adherence */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Adherence</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">
            {clients.length > 0 
              ? Math.round(clients.reduce((s, c) => s + (c.adherenceScore || 0), 0) / clients.length) 
              : 100}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center font-medium">
            <CheckCircle2 className="w-3 h-3 mr-1" /> High business retention
          </div>
        </div>

        {/* Pending Check-ins */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Check-in Status</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white">
            {clients.length > 0 ? 'Up to date' : 'Ready'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            All submitted check-ins reviewed
          </div>
        </div>
      </div>

      {/* 🚨 "NEEDS ATTENTION" RADAR SECTION */}
      <div className="bg-slate-900 border-2 border-red-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Needs Attention Radar</span>
                <span className="bg-red-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {analytics?.needsAttentionList?.length || 0} Clients
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Automated detection of overdue invoices, drop in adherence, missed sessions, and inactive clients.
              </p>
            </div>
          </div>
        </div>

        {analytics?.needsAttentionList?.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">All Clients Operating at Peak Performance!</p>
            <p className="text-xs text-slate-400 mt-0.5">No overdue payments, missed workouts, or disengaged clients detected.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics?.needsAttentionList?.map((item, idx) => (
              <div 
                key={idx}
                className="bg-slate-950/80 border border-red-900/40 rounded-xl p-4 hover:border-red-600/70 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.avatar} 
                        alt={item.name} 
                        className="w-10 h-10 rounded-full border border-slate-700 object-cover" 
                      />
                      <div>
                        <h3 className="font-bold text-sm text-white">{item.name}</h3>
                        <p className="text-[11px] text-slate-400">{item.currentGoal}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      {item.adherenceScore}% Adh
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {item.reasons.map((reason, rIdx) => (
                      <div key={rIdx} className="flex items-start space-x-2 text-xs text-red-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onSelectClient(item.clientId, 'messages')}
                    className="flex items-center space-x-1 text-xs text-slate-300 hover:text-white"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Message Client</span>
                  </button>
                  <button
                    onClick={() => onSelectClient(item.clientId, 'overview')}
                    className="flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Open Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visual Charts: Weekly Attendance & Adherence Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Session Load */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Weekly Coaching Session Load</h3>
              <p className="text-xs text-slate-400">Scheduled vs Completed sessions across the training week</p>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
              This Week
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessionData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="scheduled" name="Scheduled" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Adherence Donut Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Client Adherence Portfolio</h3>
            <p className="text-xs text-slate-400">Composite compliance score based on workouts, food logs & sessions</p>
          </div>

          <div className="h-48 w-full my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adherenceDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                >
                  {adherenceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3">
            {adherenceDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value} clients</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Client Activity Stream & Acquisition Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Timeline Stream */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Live Client Activity Stream</span>
            </h3>
            <span className="text-xs text-slate-400">Real-time audit log</span>
          </div>

          <div className="space-y-3">
            {analytics?.recentActivity?.length === 0 ? (
              <p className="text-xs text-slate-400">No recent activity recorded.</p>
            ) : (
              analytics?.recentActivity?.slice(0, 6).map((event) => (
                <div 
                  key={event.id}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {event.eventType.includes('workout') && <Activity className="w-3.5 h-3.5 text-emerald-400" />}
                    {event.eventType.includes('payment') && <DollarSign className="w-3.5 h-3.5 text-amber-400" />}
                    {event.eventType.includes('session') && <Calendar className="w-3.5 h-3.5 text-cyan-400" />}
                    {event.eventType.includes('measurement') && <TrendingUp className="w-3.5 h-3.5 text-blue-400" />}
                    {!['workout', 'payment', 'session', 'measurement'].some(k => event.eventType.includes(k)) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-100">{event.title}</p>
                      <span className="text-[10px] text-slate-500">
                        {new Date(event.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{event.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Client Acquisition Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Lead Acquisition Source</h3>
            <p className="text-xs text-slate-400">Where your high-value clients originate</p>
          </div>

          <div className="space-y-3 my-4">
            {Object.entries(analytics?.acquisitionBreakdown || {}).map(([source, count], idx) => {
              const total = clients.length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{source}</span>
                    <span className="text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-1.5 rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('clients')}
            className="w-full py-2.5 text-center text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition"
          >
            Manage Client Database ({clients.length} Total) →
          </button>
        </div>
      </div>
    </div>
  );
}
