import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Leaderboard from './components/Leaderboard';
import MissionsList from './components/MissionsList';
import CardsInventory from './components/CardsInventory';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import ChangePinModal from './components/ChangePinModal';
import FirebaseConfigModal from './components/FirebaseConfigModal';
import { UserCheck, Trophy, Sparkles, ShieldCheck } from 'lucide-react';

function MainApp() {
  const { currentUser, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState('leaderboard'); // 'leaderboard' | 'missions' | 'cards' | 'admin'
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100">
      
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        
        {/* Welcome guest banner if not logged in */}
        {!currentUser && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-sm font-bold text-white">
                  ¡El Juego del Mes de Noviembre ya comenzó!
                </p>
                <p className="text-xs text-slate-400">
                  Entra con tu usuario y código <strong className="text-emerald-400 font-mono">1234</strong> para marcar tus misiones y ver tus cartas.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-md transition-all self-start sm:self-auto"
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-400">
            The Ranking · Competencia Deportiva Mensual · Noviembre
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
