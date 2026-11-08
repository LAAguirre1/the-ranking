import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getFirebaseInstance } from '../lib/firebase';
import { getRpgClass } from '../data/rpgClasses';
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
  RefreshCw
} from 'lucide-react';

export default function Navbar({ 
  onOpenLogin, 
  onOpenPinModal, 
  onOpenClassModal, 
  onOpenSwitchUser,
  onOpenFirebaseModal, 
  currentTab, 
  setCurrentTab 
}) {
  const { currentUser, isAdmin, logout } = useAuth();
  const { isLive } = getFirebaseInstance();

  const userXp = currentUser?.xp || 0;
  const currentLevel = currentUser?.level || 1;
  const heroClass = getRpgClass(currentUser?.rpgClassId);

  return (
    <>
      {/* --- TOP SLIM HEADER --- */}
      <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo */}
            <div 
              onClick={() => setCurrentTab('leaderboard')}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 flex-shrink-0">
                <Trophy className="w-4 h-4 text-black" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    THE RANKING
                  </span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden xs:inline">
                    Nov
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
              {/* Cloud Status Pill */}
              <button
                onClick={onOpenFirebaseModal}
                title={isLive ? "Firebase Cloud conectado en vivo" : "Modo Local. Clic para conectar Firebase gratis"}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  isLive 
                    ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/40" 
                    : "bg-amber-950/30 text-amber-400 border-amber-800/50 hover:bg-amber-900/40"
                }`}
              >
                {isLive ? <Cloud className="w-3.5 h-3.5 text-emerald-400" /> : <CloudOff className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden sm:inline">{isLive ? "Cloud Online" : "Conectar Cloud"}</span>
              </button>

              {currentUser ? (
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-xl p-1 sm:px-2.5 sm:py-1">
                  
                  {/* Hero Class & Name Button */}
                  <button
                    onClick={onOpenClassModal}
                    title="Cambiar mi Avatar y Clase RPG"
                    className="flex items-center gap-1.5 text-left focus:outline-none"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${heroClass.frameColor} p-0.5 flex-shrink-0 shadow`}>
                      <div className="w-full h-full bg-slate-950 rounded-md flex items-center justify-center text-sm">
                        {currentUser.avatar || heroClass.icon}
                      </div>
                    </div>

                    <div className="hidden xs:block leading-none">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-black text-white max-w-[85px] sm:max-w-[120px] truncate">
                          {currentUser.username}
                        </span>
                        {isAdmin && (
                          <span className="text-[8px] bg-purple-500/20 text-purple-300 px-1 rounded font-bold">
                            ADM
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] mt-0.5">
                        <span className="font-bold text-emerald-400">Nv.{currentLevel}</span>
                        <span className="text-slate-400 font-mono">· {userXp} XP</span>
                      </div>
                    </div>
                  </button>

                  <div className="h-4 w-px bg-slate-800 mx-1" />

                  {/* Switch User Button */}
                  <button
                    onClick={onOpenSwitchUser}
                    title="Cambiar de perfil de atleta"
                    className="px-1.5 py-1 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold hidden sm:inline">Cambiar</span>
                  </button>

                  {/* Change PIN button */}
                  <button
                    onClick={onOpenPinModal}
                    title="Cambiar mi código PIN"
                    className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Key className="w-3.5 h-3.5" />
                  </button>

                  {/* Logout button */}
                  <button
                    onClick={logout}
                    title="Cerrar sesión (Modo Espectador)"
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>

                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Entrar (1234)</span>
                </button>
              )}

            </div>
          </div>

          {/* DESKTOP TABS */}
          <div className="hidden md:flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setCurrentTab('leaderboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
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

      {/* --- MOBILE BOTTOM NAVIGATION BAR --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090D16]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          
          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              currentTab === 'leaderboard'
                ? 'text-emerald-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Tabla</span>
            {currentTab === 'leaderboard' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('missions')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              currentTab === 'missions'
                ? 'text-emerald-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Misiones</span>
            {currentTab === 'missions' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('cards')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              currentTab === 'cards'
                ? 'text-purple-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Cartas</span>
            {currentUser?.cards?.length > 0 && (
              <span className="absolute top-0 right-2 w-3.5 h-3.5 rounded-full bg-amber-400 text-black text-[8px] font-black flex items-center justify-center">
                {currentUser.cards.length}
              </span>
            )}
            {currentTab === 'cards' && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-0.5" />
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                currentTab === 'admin'
                  ? 'text-purple-300 font-extrabold scale-105'
                  : 'text-purple-400/70 hover:text-purple-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Admin</span>
              {currentTab === 'admin' && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-0.5" />
              )}
            </button>
          )}

        </div>
      </nav>
    </>
  );
}
