import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Download, 
  FileText, 
  ArrowUpRight, 
  PieChart as PieIcon,
  Flame,
  Award,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

export function AnalyticsView({ onSelectClient, onGenerateReport }) {
  const { showToast } = useNotifications();
  const [analytics, setAnalytics] = useState(null);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('this_month');
  const [selectedReportClientId, setSelectedReportClientId] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [anData, cls, pays] = await Promise.all([
        api.getAnalytics(timeRange),
        api.getClients(),
        api.getPayments()
      ]);
      setAnalytics(anData);
      setClients(cls || []);
      setPayments(pays || []);
      if (cls && cls.length > 0 && !selectedReportClientId) {
        setSelectedReportClientId(cls[0].id);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load business analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const handleExportCsv = async (type) => {
    try {
      const blob = await api.exportCsv(type);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pushfitness-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast(`Exported ${type}.csv successfully!`);
    } catch (err) {
      showToast('Export failed', 'error');
    }
  };

  const revenueTrendData = [
    { month: 'May', revenue: 2800 },
    { month: 'Jun', revenue: 3200 },
    { month: 'Jul', revenue: 3900 },
    { month: 'Aug', revenue: 4100 },
    { month: 'Sep', revenue: 4850 },
    { month: 'Oct (Proj)', revenue: 5200 }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <span>Business Intelligence & Performance Analytics</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Key metrics on client retention, recurring revenue, session utilization, and exportable reports.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          {[
            { id: 'this_week', label: 'Week' },
            { id: 'this_month', label: 'Month' },
            { id: 'last_3_months', label: '3 Months' },
            { id: 'this_year', label: 'Year' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                timeRange === t.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Financial & Health KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Monthly Recurring Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-emerald-400 mt-2">
            ${analytics?.projectedMRR?.toLocaleString() || 0}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Annualized Run-Rate: ${(analytics?.projectedMRR * 12)?.toLocaleString()}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Client Retention Rate</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white mt-2">
            94.2%
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">Average Lifetime: 8.4 Months</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Average Client Value (LTV)</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white mt-2">
            $2,145
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across active roster</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Session Utilization</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-display font-extrabold text-white mt-2">
            92.8%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Low no-show rate (&lt;4%)</span>
        </div>
      </div>

      {/* Revenue Growth Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-white">Monthly Revenue Trajectory</h2>
            <p className="text-xs text-slate-400">Total verified coaching income over the last 6 months</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
            +85% Growth since May
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} unit="$" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              />
              <Line type="monotone" dataKey="revenue" name="Monthly Revenue ($)" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client Retention & Lifetime Value Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Client Retention & Lifetime Value Ledger</h2>
            <p className="text-xs text-slate-400">Chronological retention tracker for every client account</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExportCsv('clients')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Clients CSV</span>
            </button>
            <button
              onClick={() => handleExportCsv('payments')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Invoices CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Renewals</th>
                <th className="py-3 px-4">Lifetime Revenue</th>
                <th className="py-3 px-4">Last Payment</th>
                <th className="py-3 px-4">Last Session</th>
                <th className="py-3 px-4">Acquisition Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-white">
                    <button
                      onClick={() => onSelectClient(c.id, 'overview')}
                      className="hover:text-emerald-400 transition"
                    >
                      {c.name}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{c.startDate}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{c.renewalsCount || 0} times</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-400">${c.lifetimeRevenue || c.monthlyPrice}</td>
                  <td className="py-3 px-4 text-slate-300">{c.lastPaymentDate || '—'}</td>
                  <td className="py-3 px-4 text-slate-300">{c.lastSessionDate || '—'}</td>
                  <td className="py-3 px-4 text-cyan-400 font-medium">{c.acquisitionSource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Report Generator Tool */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/60 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Generate Client Progress Report</h2>
            <p className="text-xs text-slate-400">
              Produce an executive summary with starting vs current weight, measurement deltas, adherence, and photo comparison.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <select
            value={selectedReportClientId}
            onChange={(e) => setSelectedReportClientId(e.target.value)}
            className="w-full sm:w-80 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.currentGoal})</option>
            ))}
          </select>

          <button
            onClick={() => onGenerateReport(selectedReportClientId)}
            className="w-full sm:w-auto px-5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs rounded-xl transition shadow-md"
          >
            Preview & Print PDF Report →
          </button>
        </div>
      </div>
    </div>
  );
}
