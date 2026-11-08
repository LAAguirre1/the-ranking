import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Leaderboard from './components/Leaderboard';
import MissionsList from './components/MissionsList';
import CardsInventory from './components/CardsInventory';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import ChangePinModal from './components/ChangePinModal';
import ChangeClassModal from './components/ChangeClassModal';
import FirebaseConfigModal from './components/FirebaseConfigModal';

function MainApp() {
  const { currentUser, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState('leaderboard'); // 'leaderboard' | 'missions' | 'cards' | 'admin'
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100 selection:bg-emerald-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onOpenClassModal={() => setIsClassModalOpen(true)}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Main Content Area (padding-bottom for mobile bottom navigation bar) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 md:pb-8">
        
        {/* Welcome guest banner if not logged in */}
        {!currentUser && (
          <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  ¡El Juego del Mes de Noviembre está en curso!
                </p>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Ingresa con tu usuario y código <strong className="text-emerald-400 font-mono">1234</strong> para marcar tus misiones y ver tus cartas.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-md transition-all self-start sm:self-auto"
            >
              Elegir mi Jugador
            </button>
          </div>
        )}

        {/* Dynamic Views */}
        {currentTab === 'leaderboard' && (
          <Leaderboard onOpenMissions={() => setCurrentTab('missions')} />
        )}

        {currentTab === 'missions' && (
          <MissionsList onOpenLogin={() => setIsLoginOpen(true)} />
        )}

        {currentTab === 'cards' && (
          <CardsInventory onOpenLogin={() => setIsLoginOpen(true)} />
        )}

        {currentTab === 'admin' && isAdmin && (
          <AdminPanel onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)} />
        )}
      </main>

      {/* Footer (Desktop visible, clean on mobile) */}
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
