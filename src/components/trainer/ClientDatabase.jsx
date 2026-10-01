import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  Archive, 
  RotateCcw, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Activity, 
  Flame, 
  X, 
  Eye, 
  Download,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

export function ClientDatabase({ onSelectClient, onOpenAddClient, initialFilter = 'all' }) {
  const { showToast } = useNotifications();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [adherenceFilter, setAdherenceFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Confirmation modal state for permanent delete
  const [deleteConfirmClient, setDeleteConfirmClient] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await api.getClients({
        status: statusFilter,
        paymentStatus: paymentFilter,
        adherenceStatus: adherenceFilter,
        source: sourceFilter,
        search
      });
      setClients(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load clients', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [statusFilter, paymentFilter, adherenceFilter, sourceFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchClients();
  };

  const handleArchive = async (id, name, e) => {
    e.stopPropagation();
    try {
      await api.archiveClient(id);
      showToast(`Archived client ${name}. Historical data is preserved.`);
      fetchClients();
    } catch (err) {
      showToast('Failed to archive client', 'error');
    }
  };

  const handleRestore = async (id, name, e) => {
    e.stopPropagation();
    try {
      await api.restoreClient(id);
      showToast(`Restored client ${name} to active roster.`);
      fetchClients();
    } catch (err) {
      showToast('Failed to restore client', 'error');
    }
  };

  const handleDeletePermanent = async () => {
    if (!deleteConfirmClient) return;
    try {
      await api.deleteClient(deleteConfirmClient.id);
      showToast(`Permanently deleted ${deleteConfirmClient.name}`);
      setDeleteConfirmClient(null);
      fetchClients();
    } catch (err) {
      showToast('Failed to delete client', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">Active</span>;
      case 'onboarding':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">Onboarding</span>;
      case 'paused':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">Paused</span>;
      case 'archived':
        return <span className="bg-slate-700/50 text-slate-400 border border-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-full">Archived</span>;
      case 'expired':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">Expired</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[11px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="text-emerald-400 font-semibold text-xs flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Paid</span>;
      case 'due':
        return <span className="text-amber-400 font-semibold text-xs flex items-center"><Calendar className="w-3 h-3 mr-1" /> Due Soon</span>;
      case 'overdue':
        return <span className="text-red-400 font-extrabold text-xs flex items-center bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30"><AlertTriangle className="w-3 h-3 mr-1" /> Overdue</span>;
      default:
        return <span className="text-slate-400 text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Client Database & Roster</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage athlete lifecycle, program assignments, health profiles, and retention tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => api.exportCsv('clients')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddClient}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by client name, email, phone, or goal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center space-x-1 text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="onboarding">Onboarding</option>
            <option value="paused">Paused</option>
            <option value="expired">Expired</option>
            <option value="archived">Archived</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Payment: All</option>
            <option value="paid">Paid</option>
            <option value="due">Due Soon</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Adherence Filter */}
          <select
            value={adherenceFilter}
            onChange={(e) => setAdherenceFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Adherence: All</option>
            <option value="Excellent">Excellent (&gt;80%)</option>
            <option value="Good">Good (65-79%)</option>
            <option value="Needs Attention">Needs Attention (&lt;65%)</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Source: All</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
            <option value="Website">Website</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Existing client">Existing client</option>
          </select>

          {(statusFilter !== 'all' || paymentFilter !== 'all' || adherenceFilter !== 'all' || sourceFilter !== 'all' || search) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setPaymentFilter('all');
                setAdherenceFilter('all');
                setSourceFilter('all');
                setSearch('');
              }}
              className="text-xs text-red-400 hover:underline flex items-center space-x-1 ml-auto"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading clients roster...</div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No clients match your filter criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filters or adding a new client to your roster.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Lifecycle Status</th>
                  <th className="py-3 px-4">Primary Goal</th>
                  <th className="py-3 px-4">Adherence</th>
                  <th className="py-3 px-4">Sessions</th>
                  <th className="py-3 px-4">Billing</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectClient(c.id, 'overview')}
                    className="hover:bg-slate-800/50 cursor-pointer transition group"
                  >
                    {/* Client info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center space-x-1.5">
                            <span>{c.name}</span>
                            {c.needsAttentionReasons && c.needsAttentionReasons.length > 0 && (
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" title="Needs Attention" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span className="flex items-center"><Mail className="w-2.5 h-2.5 mr-0.5" />{c.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(c.status)}
                    </td>

                    {/* Goal */}
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      <div>{c.currentGoal}</div>
                      <div className="text-[10px] text-slate-500">{c.trainingType}</div>
                    </td>

                    {/* Adherence */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              c.adherenceScore >= 80 
                                ? 'bg-emerald-400' 
                                : c.adherenceScore >= 65 
                                ? 'bg-blue-400' 
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${c.adherenceScore}%` }}
                          />
                        </div>
                        <span className={`font-bold ${
                          c.adherenceScore >= 80 ? 'text-emerald-400' : c.adherenceScore >= 65 ? 'text-blue-400' : 'text-red-400'
                        }`}>
                          {c.adherenceScore}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{c.adherenceStatus}</div>
                    </td>

                    {/* Sessions */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {c.sessionsCompleted} <span className="text-slate-500 font-normal">/ {c.sessionsPurchased}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-medium">
                        {c.sessionsRemaining} remaining
                      </div>
                    </td>

                    {/* Billing */}
                    <td className="py-3.5 px-4">
                      <div>{getPaymentBadge(c.paymentStatus)}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        ${c.monthlyPrice}/mo • Next: {c.nextPaymentDate}
                      </div>
                    </td>

                    {/* Last Activity */}
                    <td className="py-3.5 px-4 text-slate-400">
                      {c.lastActivityDate ? (
                        <span>{new Date(c.lastActivityDate).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-slate-600">Never</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onSelectClient(c.id, 'overview')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Open Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {c.status === 'archived' ? (
                          <button
                            onClick={(e) => handleRestore(c.id, c.name, e)}
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 transition"
                            title="Restore Client to Active"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleArchive(c.id, c.name, e)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                            title="Archive Client (Preserves Data)"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteConfirmClient(c)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition"
                          title="Permanently Delete Client"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Permanent Delete */}
      {deleteConfirmClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-900/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-950/80 flex items-center justify-center border border-red-800">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete Client?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you absolutely sure you want to permanently delete <strong className="text-white">{deleteConfirmClient.name}</strong>? All workouts, nutrition logs, photos, payments, and notes linked to this account will be irreversibly wiped.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl text-[11px] text-slate-400">
              💡 Tip: If you only want to hide this client from your active dashboard without losing their history, use <strong>Archive</strong> instead.
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmClient(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePermanent}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg shadow-red-950"
              >
                Yes, Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
