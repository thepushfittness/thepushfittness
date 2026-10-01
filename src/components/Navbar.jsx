import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Dumbbell, 
  Bell, 
  UserCheck, 
  Users, 
  LogOut, 
  RefreshCw, 
  ShieldCheck, 
  User, 
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  MessageSquare
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab }) {
  const { user, isTrainer, isClient, switchAccount, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead, showToast } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  const demoAccounts = [
    { label: "Coach Alex Rivera", role: "trainer", desc: "Admin / Head Coach", tag: "Trainer" },
    { label: "Sarah Chen", role: "client", clientId: "client-1", desc: "Active (92% Adherence)", tag: "Client" },
    { label: "Marcus Vance", role: "client", clientId: "client-2", desc: "Strength Athlete (96% Adh)", tag: "Client" },
    { label: "David Miller", role: "client", clientId: "client-3", desc: "⚠️ Overdue & Inactive", tag: "Needs Attention" },
    { label: "Elena Rostova", role: "client", clientId: "client-4", desc: "Onboarding (Step 5)", tag: "Client" },
    { label: "Jordan Taylor", role: "client", clientId: "client-5", desc: "Paused (Rehab Protocol)", tag: "Client" }
  ];

  const handleSwitch = async (acc) => {
    try {
      await switchAccount(acc.role, acc.clientId);
      setShowAccountSwitcher(false);
      showToast(`Switched account to ${acc.label} (${acc.role})`);
    } catch (err) {
      showToast('Account switch failed', 'error');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(isTrainer ? 'dashboard' : 'workout')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <Dumbbell className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-white">
                  thepush<span className="text-emerald-400">fittness</span>
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  isTrainer 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}>
                  {isTrainer ? 'Trainer Admin' : 'Client Portal'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Personal Training & Client Management OS
              </p>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition shadow-sm"
                title="Switch active user to test Trainer and Client roles"
              >
                <div className={`w-2 h-2 rounded-full ${isTrainer ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
                <span className="max-w-[120px] sm:max-w-none truncate font-semibold">
                  {user?.name || 'Switch Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showAccountSwitcher && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                    <span>Role & Account Switcher</span>
                    <span className="text-[10px] text-emerald-400">Demo Testing</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {demoAccounts.map((acc, idx) => {
                      const isCurrent = (acc.role === 'trainer' && isTrainer) || (acc.clientId && user?.clientId === acc.clientId);
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSwitch(acc)}
                          className={`w-full text-left px-3 py-2.5 hover:bg-slate-800/80 transition flex items-center justify-between ${
                            isCurrent ? 'bg-emerald-950/30 text-emerald-300' : 'text-slate-200'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold flex items-center space-x-1.5">
                              <span>{acc.label}</span>
                              {acc.tag === 'Needs Attention' && (
                                <span className="bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.2 rounded font-bold">Alert</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{acc.desc}</div>
                          </div>
                          {isCurrent && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-emerald-400 hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No notifications right now
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-3 text-xs transition cursor-pointer hover:bg-slate-800 ${
                            !n.isRead ? 'bg-slate-800/50 border-l-2 border-emerald-400' : 'text-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-slate-100 flex items-center space-x-1.5">
                              {n.type === 'payment' && <DollarSign className="w-3.5 h-3.5 text-amber-400" />}
                              {n.type === 'workout' && <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />}
                              {n.type === 'session' && <Calendar className="w-3.5 h-3.5 text-cyan-400" />}
                              {n.type === 'inactivity' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                              <span>{n.title}</span>
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(n.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={user?.name}
                className="w-8 h-8 rounded-full border border-slate-700 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
