import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api, hasLocalBackup } from '../../services/api';
import { 
  Dumbbell, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  HelpCircle,
  RotateCcw,
  UserCheck
} from 'lucide-react';

export function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isWakingUp, setIsWakingUp] = useState(false);

  // Backup detection state
  const [hasBackup, setHasBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState(false);
  const [backupStatusMessage, setBackupStatusMessage] = useState('');

  // Forgot / Reset Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    setHasBackup(hasLocalBackup());
  }, []);

  const handleFillCoachCredentials = () => {
    setEmail('admin@thepushfittness.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  const handleRestoreBackup = async () => {
    try {
      setRestoringBackup(true);
      setBackupStatusMessage('Restoring client database and workout logs from this device...');
      const res = await api.restoreLocalSnapshot();
      setBackupStatusMessage(`Success! Restored ${res.clientCount || 'all'} clients & ${res.workoutLogsCount || 0} workout logs to cloud.`);
      setEmail('admin@thepushfittness.com');
      setPassword('admin123');
      setErrorMessage('');
    } catch (err) {
      setBackupStatusMessage(err.message || 'Failed to restore local backup.');
    } finally {
      setRestoringBackup(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email/ID and password.');
      return;
    }

    let wakeTimer = null;
    try {
      setLoading(true);
      setIsWakingUp(false);
      setErrorMessage('');

      // If cloud server is waking from overnight standby (Render free tier), reassure the user
      wakeTimer = setTimeout(() => {
        setIsWakingUp(true);
      }, 2500);

      await login(email.trim(), password.trim());
    } catch (err) {
      const msg = err.message || '';
      if (
        msg.includes('Failed to fetch') ||
        msg.includes('NetworkError') ||
        msg.includes('Load failed') ||
        msg.includes('502') ||
        msg.includes('503') ||
        msg.includes('Failed to connect')
      ) {
        setErrorMessage('Studio server is starting up after standby. Please wait 15–20 seconds and tap Sign In again.');
      } else {
        setErrorMessage(msg || 'Invalid email or password. Tap 1-Tap Coach Sign In below if using default credentials.');
      }
    } finally {
      if (wakeTimer) clearTimeout(wakeTimer);
      setLoading(false);
      setIsWakingUp(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !newResetPassword.trim()) {
      setErrorMessage('Please provide both your email/Coach ID and new password.');
      return;
    }
    try {
      setForgotLoading(true);
      const res = await api.resetPassword(forgotEmail.trim(), newResetPassword.trim());
      setResetSuccessMessage(res.message || 'Password successfully updated!');
      setEmail(forgotEmail.trim());
      setPassword(newResetPassword.trim());
      setTimeout(() => {
        setShowForgotModal(false);
        setResetSuccessMessage('');
      }, 1500);
    } catch (err) {
      setResetSuccessMessage('');
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-xl shadow-emerald-950/60 ring-4 ring-emerald-500/20">
            <Dumbbell className="w-9 h-9 text-slate-950 font-bold" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            thepush<span className="text-emerald-400">fittness</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Personal Training Client Management & Progress Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Sign In</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Access Coach Pushkar Mayekar portal or client workouts.
              </p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Quick Coach 1-Tap Fill Helper */}
          <div className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                CP
              </div>
              <div>
                <span className="font-semibold text-white text-xs block">Coach Pushkar</span>
                <span className="text-[10px] text-slate-400 font-mono">admin@thepushfittness.com</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillCoachCredentials}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition flex items-center space-x-1 active:scale-95 shadow-sm shadow-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>1-Tap Fill</span>
            </button>
          </div>

          {/* Device Local Backup Restore Button (if found) */}
          {hasBackup && (
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-cyan-300 flex items-center space-x-1.5">
                  <RotateCcw className={`w-3.5 h-3.5 text-cyan-400 ${restoringBackup ? 'animate-spin' : ''}`} />
                  <span>Device Backup Detected</span>
                </span>
                <button
                  type="button"
                  onClick={handleRestoreBackup}
                  disabled={restoringBackup}
                  className="px-2.5 py-1 text-[11px] bg-cyan-500 hover:bg-cyan-450 text-slate-950 font-bold rounded-lg transition"
                >
                  {restoringBackup ? 'Restoring...' : 'Restore to Cloud'}
                </button>
              </div>
              {backupStatusMessage && (
                <p className="text-[11px] text-cyan-300 font-medium">{backupStatusMessage}</p>
              )}
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl flex items-center space-x-2 text-xs text-red-300 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / ID Field */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Email Address or Coach ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thepushfittness.com (or pushkar)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 transition outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email || 'admin@thepushfittness.com');
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition"
                >
                  Forgot / Change password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 transition outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Cold-start wake up notice */}
            {loading && isWakingUp && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-center space-x-2.5 text-xs text-amber-300 animate-fadeIn">
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Connecting to studio server (waking from standby, please hold on ~20s)...</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-450 disabled:bg-emerald-600/50 text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition transform active:scale-[0.99] flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          thepushfittness.com • Secure 256-bit Encrypted Session
        </p>
      </div>

      {/* Forgot / Reset Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Reset Account Password</h3>
                <p className="text-xs text-slate-400">Instant Password Recovery</p>
              </div>
            </div>

            {resetSuccessMessage ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-emerald-300 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">{resetSuccessMessage}</span>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Your new password is now active. Returning you to sign in...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
                <p className="text-slate-400 text-[11px]">
                  Enter your Coach email or ID and choose your new password. It will update instantly on the cloud server.
                </p>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Email or Coach ID</label>
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@thepushfittness.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">New Password</label>
                  <input
                    type="text"
                    required
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    placeholder="Enter at least 4 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Tip: Default password is <span className="text-emerald-400 font-mono">admin123</span></p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold transition flex items-center justify-center space-x-1"
                  >
                    {forgotLoading ? 'Updating...' : 'Save & Sign In'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
