import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ProfileSettingsModal } from './common/ProfileSettingsModal';
import { 
  Dumbbell, 
  Bell, 
  LogOut, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  User,
  ShieldCheck,
  Settings
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab }) {
  const { user, isTrainer, isClient, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead, showToast } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Signed out of thepushfittness');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => {
              if (isTrainer) setActiveTab('dashboard');
            }}
          >
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
            {/* Authenticated User Status Pill & Settings trigger */}
            <button
              onClick={() => setShowProfileSettings(true)}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-xs transition group cursor-pointer"
              title="Edit Profile, Email & Password"
            >
              <div className={`w-2 h-2 rounded-full ${isTrainer ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
              <span className="font-semibold text-white max-w-[140px] truncate group-hover:text-emerald-400 transition">
                {user?.name || 'Authorized User'}
              </span>
              <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50">
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

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/60 text-slate-300 border border-slate-700 text-xs font-semibold transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* User Profile Avatar */}
            <div 
              onClick={() => setShowProfileSettings(true)}
              className="flex items-center space-x-2 pl-1 cursor-pointer"
              title="Click to edit profile & login"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full border border-slate-700 hover:border-emerald-400 object-cover transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile & Login Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
      />
    </header>
  );
}
