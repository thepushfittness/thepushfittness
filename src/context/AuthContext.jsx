import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [clientProfile, setClientProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    async function initAuth() {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        setUser(res.user);
        setClientProfile(res.clientProfile || null);
      } catch (err) {
        console.warn('Session expired or invalid:', err);
        setAuthToken(null);
        setUser(null);
        setClientProfile(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.login(email, password);
      setAuthToken(res.token);
      setUser(res.user);
      setClientProfile(res.clientProfile || null);
      return res;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setClientProfile(null);
  };

  const switchAccount = async (role, clientId = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.demoSwitch(role, clientId);
      setAuthToken(res.token);
      setUser(res.user);
      setClientProfile(res.clientProfile || null);
      return res;
    } catch (err) {
      setError(err.message || 'Failed to switch account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshMe = async () => {
    try {
      const res = await api.getMe();
      setUser(res.user);
      setClientProfile(res.clientProfile || null);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  const isTrainer = user?.role === 'trainer';
  const isClient = user?.role === 'client';

  return (
    <AuthContext.Provider
      value={{
        user,
        clientProfile,
        loading,
        error,
        isTrainer,
        isClient,
        login,
        logout,
        switchAccount,
        refreshMe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
