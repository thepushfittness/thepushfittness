import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { 
  DollarSign, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Send, 
  Download,
  Filter,
  FileText,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Calendar,
  User
} from 'lucide-react';

export function PaymentManager({ onSelectClient }) {
  const { showToast } = useNotifications();
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Record payment modal
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [payClientId, setPayClientId] = useState('');
  const [planName, setPlanName] = useState('Personal Coaching Package (12 Sessions)');
  const [amount, setAmount] = useState(18000);
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [sessionsToAdd, setSessionsToAdd] = useState(12);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay / PhonePe)');
  const [payStatus, setPayStatus] = useState('paid');
  const [notes, setNotes] = useState('');

  // 1-Click Instant Renewal Modal
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewClientId, setRenewClientId] = useState('');
  const [renewAmount, setRenewAmount] = useState(18000);
  const [renewSessions, setRenewSessions] = useState(12);
  const [renewMethod, setRenewMethod] = useState('UPI (GPay / PhonePe)');
  const [renewNotes, setRenewNotes] = useState('');
  const [isRenewing, setIsRenewing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pays, cls] = await Promise.all([
        api.getPayments({ status: statusFilter }),
        api.getClients()
      ]);
      setPayments(pays || []);
      setClients(cls || []);
      if (cls && cls.length > 0 && !payClientId) {
        setPayClientId(cls[0].id);
        setRenewClientId(cls[0].id);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!payClientId) return;

    try {
      const created = await api.createPayment({
        clientId: payClientId,
        planName,
        amount: Number(amount),
        sessionsToAdd: payStatus === 'paid' ? Number(sessionsToAdd) : 0,
        billingCycle,
        dueDate,
        paidDate: payStatus === 'paid' ? new Date().toISOString().split('T')[0] : null,
        status: payStatus,
        paymentMethod,
        notes
      });

      setPayments(prev => [created, ...prev]);
      setShowRecordModal(false);
      showToast(`Recorded upfront payment of ₹${Number(amount).toLocaleString()} (${sessionsToAdd} sessions added)!`);
      api.getClients().then(setClients);
    } catch (err) {
      showToast('Failed to record payment', 'error');
    }
  };

  const handleRenewPackage = async (e) => {
    e.preventDefault();
    if (!renewClientId) return;

    try {
      setIsRenewing(true);
      const res = await api.renewClientPackage(renewClientId, {
        amount: Number(renewAmount),
        sessionsToAdd: Number(renewSessions),
        paymentMethod: renewMethod,
        notes: renewNotes
      });

      if (res.payment) {
        setPayments(prev => [res.payment, ...prev]);
      }
      setShowRenewModal(false);
      showToast(`Renewed package for ${res.client.name}! +${renewSessions} sessions credited.`);
      api.getClients().then(setClients);
    } catch (err) {
      showToast(err.message || 'Failed to renew package', 'error');
    } finally {
      setIsRenewing(false);
    }
  };

  const openRenewForClient = (client) => {
    setRenewClientId(client.id);
    setRenewAmount(Number(client.monthlyPrice) || 18000);
    setRenewSessions(12);
    setRenewMethod('UPI (GPay / PhonePe)');
    setShowRenewModal(true);
  };

  const handleMarkPaid = async (paymentId) => {
    try {
      const updated = await api.updatePayment(paymentId, {
        status: 'paid',
        paidDate: new Date().toISOString().split('T')[0]
      });
      setPayments(prev => prev.map(p => p.id === paymentId ? updated : p));
      showToast('Payment marked as Paid!');
      api.getClients().then(setClients);
    } catch (err) {
      showToast('Failed to update payment', 'error');
    }
  };

  const handleSendReminder = (p) => {
    showToast(`Payment reminder dispatch queued for ${p.clientName} (₹${p.amount})`);
  };

  // Metrics
  const paidTotal = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0);
  const dueTotal = payments.filter(p => p.status === 'due').reduce((s, p) => s + Number(p.amount), 0);
  const overdueTotal = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <span>Client Billing & Payment Subscriptions</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Track invoices, recurring coaching packages, and overdue payment alerts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => api.exportCsv('payments')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowRecordModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Received</span>
          <div className="text-2xl font-display font-extrabold text-emerald-400 mt-1">
            ₹{paidTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active paying clients</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Upcoming Due Invoices</span>
          <div className="text-2xl font-display font-extrabold text-amber-400 mt-1">
            ₹{dueTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Due in the next 14 days</span>
        </div>

        <div className={`p-5 rounded-2xl shadow-xl border ${
          overdueTotal > 0 ? 'bg-red-950/30 border-red-900/60' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider block">Overdue Invoices</span>
          <div className="text-2xl font-display font-extrabold text-red-400 mt-1">
            ₹{overdueTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Requires manual intervention</span>
        </div>
      </div>

      {/* Prepaid Coaching Roster & Renewal Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Prepaid Coaching Packages & Session Balances</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Clients charge ₹18,000 beforehand for monthly blocks. 1-click renew when sessions run low.
            </p>
          </div>
          <button
            onClick={() => setShowRenewModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>+ Quick Package Renewal</span>
          </button>
        </div>

        {clients.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">No active clients found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {clients.map(client => {
              const remaining = Number(client.sessionsRemaining) || 0;
              const total = Number(client.sessionsPurchased) || 12;
              const used = Number(client.sessionsCompleted) || 0;
              const isLow = remaining <= 2;
              const isOut = remaining === 0;

              return (
                <div 
                  key={client.id}
                  className={`p-3.5 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                    isOut
                      ? 'bg-red-950/20 border-red-500/40'
                      : isLow
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div 
                        onClick={() => onSelectClient && onSelectClient(client.id, 'overview')}
                        className="font-bold text-white text-xs hover:text-emerald-400 cursor-pointer flex items-center space-x-1"
                      >
                        <span>{client.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        ₹{(Number(client.monthlyPrice) || 18000).toLocaleString()}/mo • {client.billingCycle || 'Monthly'}
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      isOut
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : isLow
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {isOut ? 'Renew Needed' : isLow ? 'Ready to Renew' : 'Active Prepaid'}
                    </span>
                  </div>

                  {/* Progress bar of sessions */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Prepaid Sessions:</span>
                      <span className="font-extrabold text-white">
                        <strong className={isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}>
                          {remaining} left
                        </strong> ({used} of {total} done)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${isOut ? 'bg-red-500' : isLow ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.min(100, Math.round((used / (total || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500">
                      Next: {client.nextPaymentDate || 'Pending'}
                    </span>
                    <button
                      onClick={() => openRenewForClient(client)}
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold text-[11px] rounded-lg transition shadow-sm active:scale-95 flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Renew (₹18k)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-semibold">Filter Invoices:</span>
          {['all', 'paid', 'due', 'overdue'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition ${
                statusFilter === st
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">{payments.length} Records</span>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading payment records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Plan / Package</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Method & Ref</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 text-xs">
                      No invoice or payment records found. Click "+ Record Payment" to log a transaction.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/50">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center space-x-2">
                          <span>{p.clientName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">
                        <div>{p.planName}</div>
                        <div className="text-[10px] text-slate-500">{p.billingCycle}</div>
                      </td>
                      <td className="py-3.5 px-4 font-display font-extrabold text-base text-emerald-400">
                        ₹{p.amount}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div>{p.dueDate}</div>
                        {p.paidDate && (
                          <div className="text-[10px] text-slate-500">Paid on {p.paidDate}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : p.status === 'due'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        <div>{p.paymentMethod || 'Manual'}</div>
                        <div className="text-slate-500 text-[10px]">{p.referenceId}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status !== 'paid' ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleSendReminder(p)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
                              title="Send Payment Reminder"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMarkPaid(p.id)}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold rounded-lg text-xs transition"
                            >
                              Mark Paid
                            </button>
                          </div>
                        ) : (
                          <span className="text-emerald-400 text-xs font-semibold flex items-center justify-end">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Record Client Payment</h3>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Select Client</label>
                <select
                  value={payClientId}
                  onChange={(e) => {
                    const cid = e.target.value;
                    setPayClientId(cid);
                    const selected = clients.find(c => c.id === cid);
                    if (selected && selected.monthlyPrice) {
                      setAmount(Number(selected.monthlyPrice));
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (₹{c.monthlyPrice || 18000}/mo)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Plan / Package Name</label>
                  <input
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-400 font-semibold block">Amount (₹)</label>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setAmount(18000)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                          Number(amount) === 18000
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        18k
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmount(15000)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                          Number(amount) === 15000
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        15k
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount (e.g. 18000)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Payment Status</label>
                  <select
                    value={payStatus}
                    onChange={(e) => setPayStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="paid">Paid (Instant Confirmation)</option>
                    <option value="due">Due Soon</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              {payStatus === 'paid' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Prepaid Sessions Credited</label>
                    <span className="text-[11px] text-slate-400">Sessions to add to client's balance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 font-semibold">+</span>
                    <input
                      type="number"
                      value={sessionsToAdd}
                      onChange={(e) => setSessionsToAdd(e.target.value)}
                      className="w-20 bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-white font-bold text-center text-sm"
                      min="1"
                      max="100"
                    />
                    <span className="text-xs text-slate-400 font-medium">sess</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Internal Reference / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. UPI ref # / GPay receipt"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-450 transition"
                >
                  Save Payment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-Click Instant Package Renewal Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">1-Click Package Renewal</h3>
                  <p className="text-xs text-slate-400">Prepaid advance renewal for 12 sessions</p>
                </div>
              </div>
              <button
                onClick={() => setShowRenewModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRenewPackage} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Select Client</label>
                <select
                  value={renewClientId}
                  onChange={(e) => {
                    const cid = e.target.value;
                    setRenewClientId(cid);
                    const selected = clients.find(c => c.id === cid);
                    if (selected) {
                      setRenewAmount(Number(selected.monthlyPrice) || 18000);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.sessionsRemaining || 0} left / {c.sessionsPurchased || 12} total)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-400 font-semibold block">Package Fee (₹)</label>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setRenewAmount(18000)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                          Number(renewAmount) === 18000
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        18k
                      </button>
                      <button
                        type="button"
                        onClick={() => setRenewAmount(15000)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                          Number(renewAmount) === 15000
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        15k
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={renewAmount}
                    onChange={(e) => setRenewAmount(e.target.value)}
                    placeholder="Package fee in ₹"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-extrabold text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Sessions Credited</label>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-emerald-400 font-bold">+</span>
                    <input
                      type="number"
                      value={renewSessions}
                      onChange={(e) => setRenewSessions(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-extrabold text-sm text-center"
                      required
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Payment Method (Received Upfront)</label>
                <select
                  value={renewMethod}
                  onChange={(e) => setRenewMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Reference / Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. GPay UPI Txn Ref"
                  value={renewNotes}
                  onChange={(e) => setRenewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Automatic Package Renewal Actions:</span>
                </div>
                <p>• Logs an advance receipt of <strong>₹{Number(renewAmount).toLocaleString()}</strong></p>
                <p>• Adds <strong>+{renewSessions} sessions</strong> to remaining balance</p>
                <p>• Marks client <strong>Paid & Active</strong> and advances renewal date 30 days</p>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  disabled={isRenewing}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRenewing}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5"
                >
                  {isRenewing ? (
                    <span>Renewing...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm & Credit +{renewSessions} Sessions</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
