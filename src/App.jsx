import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ActiveUserBanner from './components/ActiveUserBanner';
import GuestWelcomeHub from './components/GuestWelcomeHub';
import LockedView from './components/LockedView';
import Leaderboard from './components/Leaderboard';
import MissionsList from './components/MissionsList';
import CardsInventory from './components/CardsInventory';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import SwitchUserModal from './components/SwitchUserModal';
import ChangePinModal from './components/ChangePinModal';
import ChangeClassModal from './components/ChangeClassModal';
import FirebaseConfigModal from './components/FirebaseConfigModal';

function MainApp() {
  const { currentUser, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState('leaderboard'); // 'leaderboard' | 'missions' | 'cards' | 'admin'
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSwitchUserOpen, setIsSwitchUserOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // When a guest selects a user from the welcome hub
  const handleSelectFromWelcome = (user) => {
    setIsLoginOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100 selection:bg-emerald-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenSwitchUser={() => setIsSwitchUserOpen(true)}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onOpenClassModal={() => setIsClassModalOpen(true)}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-5 pb-24 md:pb-8">
        
        {/* LOGGED IN: Contextual Banner indicating WHO and WHERE you are */}
        {currentUser ? (
          <ActiveUserBanner
            currentTab={currentTab}
            onOpenSwitchUser={() => setIsSwitchUserOpen(true)}
            onOpenClassModal={() => setIsClassModalOpen(true)}
          />
        ) : (
          /* GUEST MODE: Clear Welcome Portal */
          currentTab === 'leaderboard' && (
            <div className="mb-6">
              <GuestWelcomeHub onSelectUser={handleSelectFromWelcome} />
            </div>
          )
        )}

        {/* Dynamic Views */}
        {currentTab === 'leaderboard' && (
          <Leaderboard onOpenMissions={() => setCurrentTab('missions')} />
        )}

        {currentTab === 'missions' && (
          currentUser ? (
            <MissionsList onOpenLogin={() => setIsLoginOpen(true)} />
          ) : (
            <LockedView 
              tabName="Misiones y Entrenamientos" 
              onOpenLogin={() => setIsLoginOpen(true)} 
            />
          )
        )}

        {currentTab === 'cards' && (
          currentUser ? (
            <CardsInventory onOpenLogin={() => setIsLoginOpen(true)} />
          ) : (
            <LockedView 
              tabName="Cartas Secretas de Domingo" 
              onOpenLogin={() => setIsLoginOpen(true)} 
            />
          )
        )}

        {currentTab === 'admin' && (
          isAdmin ? (
            <AdminPanel onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)} />
          ) : (
            <LockedView 
              tabName="Panel de Administrador" 
              onOpenLogin={() => setIsLoginOpen(true)} 
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="hidden md:block border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-1.5">
          <p className="font-semibold text-slate-400">
            The Ranking · Fitness RPG Quest · Noviembre
          </p>
          <p className="text-[11px]">
            1.000 XP para subir de nivel · Misiones de único cumplimiento · Cartas secretas dominicales (máx 2 en mano)
          </p>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <SwitchUserModal
        isOpen={isSwitchUserOpen}
        onClose={() => setIsSwitchUserOpen(false)}
      />

      <ChangePinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
      />

      <ChangeClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
      />

      <FirebaseConfigModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
