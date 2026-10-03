import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Camera, 
  CheckCircle2, 
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export function ProfileSettingsModal({ isOpen, onClose }) {
  const { user, refreshMe } = useAuth();
  const { showToast } = useNotifications();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name,
        email,
        phone,
        avatar
      };
      if (newPassword.trim()) {
        payload.password = newPassword.trim();
      }

      await api.updateProfile(payload);
      await refreshMe();
      showToast('Profile & credentials updated successfully!');
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Account & Login Settings</h3>
              <p className="text-xs text-slate-400">Update your email, password, and profile</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Avatar Preview & URL */}
          <div className="flex items-center space-x-4 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80">
            <img 
              src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
              alt={name}
              className="w-14 h-14 rounded-full border-2 border-emerald-500 object-cover" 
            />
            <div className="flex-1">
              <label className="text-slate-400 font-semibold block mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Login Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">You will use this email to log in.</span>
          </div>

          {/* Phone */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Change Password */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">New Password (leave blank to keep current)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-white outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-450 disabled:bg-emerald-600/50 text-slate-950 font-bold transition flex items-center justify-center space-x-1"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
