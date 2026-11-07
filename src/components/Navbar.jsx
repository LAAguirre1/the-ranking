import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFirebaseInstance } from '../lib/firebase';
import { 
  Trophy, 
  Flame, 
  Key, 
  LogOut, 
  User, 
  Cloud, 
  CloudOff, 
  ShieldAlert, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Navbar({ onOpenLogin, onOpenPinModal, onOpenFirebaseModal, currentTab, setCurrentTab }) {
  const { currentUser, isAdmin, logout } = useAuth();
  const { isLive } = getFirebaseInstance();

  // Level calculations: XP % within current level (each 1000 XP)
  const userXp = currentUser?.xp || 0;
  const currentLevel = currentUser?.level || 1;
  const xpInCurrentLevel = userXp % 1000;
  const xpPercentage = Math.min(100, (xpInCurrentLevel / 1000) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[#0B101D]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo & Month */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  THE RANKING
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Noviembre
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Juego mensual de fitness & misiones
              </p>
            </div>
          </div>

          {/* Right Controls: Cloud Status + User Info / Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cloud connection button */}
            <button
              onClick={onOpenFirebaseModal}
              title={isLive ? "Conectado a Firebase Cloud (Sincronización en vivo)" : "Modo Local. Haz clic para conectar Firebase gratis"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isLive 
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40" 
                  : "bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40"
              }`}
            >
              {isLive ? <Cloud className="w-3.5 h-3.5 text-emerald-400" /> : <CloudOff className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden md:inline">{isLive ? "Firebase Online" : "Conectar Firebase"}</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Active Player Card Pill */}
                <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5">
                  <div className="text-xl" title="Avatar">{currentUser.avatar || "👤"}</div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white max-w-[110px] sm:max-w-[140px] truncate">
                        {currentUser.username}
                      </span>
                      {isAdmin && (
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-bold uppercase border border-purple-500/30">
                          Admin
                        </span>
                      )}
                    </div>
                    {/* XP & Level mini bar */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-emerald-400">
                        Nivel {currentLevel}
                      </span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                          style={{ width: `${xpPercentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {userXp} XP
                      </span>
                    </div>
                  </div>

                  {/* Change PIN button */}
                  <button
                    onClick={onOpenPinModal}
                    title="Cambiar mi código PIN (actualmente 1234)"
                    className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <Key className="w-3.5 h-3.5" />
                  </button>

                  {/* Switch / Logout */}
                  <button
                    onClick={logout}
                    title="Cerrar sesión o cambiar de jugador"
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <User className="w-4 h-4" />
                <span>Ingresar (PIN 1234)</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'leaderboard'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>🏆 Tabla & Podio</span>
          </button>

          <button
            onClick={() => setCurrentTab('missions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'missions'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>🔥 Mis Misiones</span>
          </button>

          <button
            onClick={() => setCurrentTab('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'cards'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🃏 Cartas Secretas</span>
            {currentUser?.cards?.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-black font-extrabold">
                {currentUser.cards.length}
              </span>
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>👑 Panel Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
