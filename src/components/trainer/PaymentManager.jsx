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
  FileText
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
  const [planName, setPlanName] = useState('Monthly Coaching');
  const [amount, setAmount] = useState(380);
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Stripe)');
  const [payStatus, setPayStatus] = useState('paid');
  const [notes, setNotes] = useState('');

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
        billingCycle,
        dueDate,
        paidDate: payStatus === 'paid' ? new Date().toISOString().split('T')[0] : null,
        status: payStatus,
        paymentMethod,
        notes
      });

      setPayments(prev => [created, ...prev]);
      setShowRecordModal(false);
      showToast(`Recorded payment of \$${amount} successfully!`);
    } catch (err) {
      showToast('Failed to record payment', 'error');
    }
  };

  const handleMarkPaid = async (paymentId) => {
    try {
      const updated = await api.updatePayment(paymentId, {
        status: 'paid',
        paidDate: new Date().toISOString().split('T')[0]
      });
      setPayments(prev => prev.map(p => p.id === paymentId ? updated : p));
      showToast('Payment marked as Paid!');
    } catch (err) {
      showToast('Failed to update payment', 'error');
    }
  };

  const handleSendReminder = (p) => {
    showToast(`Payment reminder dispatch queued for ${p.clientName} ($${p.amount})`);
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
            ${paidTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active paying clients</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Upcoming Due Invoices</span>
          <div className="text-2xl font-display font-extrabold text-amber-400 mt-1">
            ${dueTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Due in the next 14 days</span>
        </div>

        <div className={`p-5 rounded-2xl shadow-xl border ${
          overdueTotal > 0 ? 'bg-red-950/30 border-red-900/60' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider block">Overdue Invoices</span>
          <div className="text-2xl font-display font-extrabold text-red-400 mt-1">
            ${overdueTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Requires manual intervention</span>
        </div>
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
                {payments.map((p) => (
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
                      ${p.amount}
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
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
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
                ))}
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
                  onChange={(e) => setPayClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (${c.monthlyPrice}/mo)</option>
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
                  <label className="text-slate-400 font-semibold block mb-1">Amount ($)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
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
                    <option value="Credit Card (Stripe)">Credit Card (Stripe)</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

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
                  placeholder="Auto-renew transaction ID or receipt notes"
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
    </div>
  );
}
