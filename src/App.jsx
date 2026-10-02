import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { TrainerDashboard } from './components/trainer/TrainerDashboard';
import { ClientDatabase } from './components/trainer/ClientDatabase';
import { ClientProfileView } from './components/trainer/ClientProfileView';
import { WorkoutManager } from './components/trainer/WorkoutManager';
import { SessionCalendar } from './components/trainer/SessionCalendar';
import { PaymentManager } from './components/trainer/PaymentManager';
import { CheckinManager } from './components/trainer/CheckinManager';
import { AnalyticsView } from './components/trainer/AnalyticsView';
import { AddClientModal } from './components/trainer/AddClientModal';
import { ProgressReportModal } from './components/common/ProgressReportModal';
import { ClientApp } from './components/client/ClientApp';
import { LoginView } from './components/auth/LoginView';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Calendar, 
  DollarSign, 
  ClipboardCheck, 
  TrendingUp,
  Plus
} from 'lucide-react';

export function App() {
  const { user, isTrainer, isClient, loading } = useAuth();

  // Trainer Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientProfileTab, setClientProfileTab] = useState('overview');

  // Modals
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [reportClientId, setReportClientId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-display font-medium">Initializing thepushfittness OS...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> Show Login View
  if (!user) {
    return <LoginView />;
  }

  // Handle client selection to view full profile
  const handleSelectClient = (id, tab = 'overview') => {
    setSelectedClientId(id);
    setClientProfileTab(tab);
    setActiveTab('client-profile');
  };

  // Launch report modal
  const handleOpenReport = (id) => {
    setReportClientId(id);
    setShowReportModal(true);
  };

  // Trainer Navigation items
  const trainerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'checkins', label: 'Check-ins', icon: ClipboardCheck },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Universal Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* CLIENT APP VIEW */}
      {isClient && (
        <main className="flex-1">
          <ClientApp />
        </main>
      )}

      {/* TRAINER VIEW */}
      {isTrainer && (
        <div className="flex-1 flex flex-col">
          {/* Trainer Sub-Nav Tabs (Desktop & Tablet) */}
          <div className="bg-slate-900/60 border-b border-slate-800 sticky top-16 z-30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none">
                {trainerNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.id !== 'client-profile') setSelectedClientId(null);
                      }}
                      className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Workspace Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === 'dashboard' && (
              <TrainerDashboard
                onSelectClient={handleSelectClient}
                onOpenAddClient={() => setShowAddClientModal(true)}
                onOpenSchedule={() => setActiveTab('calendar')}
                onOpenPayment={() => setActiveTab('payments')}
                onOpenProgram={() => setActiveTab('workouts')}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'clients' && (
              <ClientDatabase
                onSelectClient={handleSelectClient}
                onOpenAddClient={() => setShowAddClientModal(true)}
              />
            )}

            {activeTab === 'client-profile' && selectedClientId && (
              <ClientProfileView
                clientId={selectedClientId}
                initialTab={clientProfileTab}
                onBack={() => setActiveTab('clients')}
                onOpenSchedule={() => setActiveTab('calendar')}
                onOpenPayment={() => setActiveTab('payments')}
                onOpenProgram={() => setActiveTab('workouts')}
                onGenerateReport={handleOpenReport}
              />
            )}

            {activeTab === 'workouts' && (
              <WorkoutManager
                onSelectClient={handleSelectClient}
              />
            )}

            {activeTab === 'calendar' && (
              <SessionCalendar
                onSelectClient={handleSelectClient}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentManager
                onSelectClient={handleSelectClient}
              />
            )}

            {activeTab === 'checkins' && (
              <CheckinManager
                onSelectClient={handleSelectClient}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                onSelectClient={handleSelectClient}
                onGenerateReport={handleOpenReport}
              />
            )}
          </main>
        </div>
      )}

      {/* Global Modals */}
      <AddClientModal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onClientAdded={(newClient) => {
          handleSelectClient(newClient.id, 'overview');
        }}
      />

      <ProgressReportModal
        clientId={reportClientId}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
}
