import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getRpgClass } from '../data/rpgClasses';
import { 
  UserCheck, 
  Sparkles, 
  RefreshCw, 
  MapPin, 
  Flame, 
  Trophy, 
  ShieldAlert, 
  Swords 
} from 'lucide-react';

const TAB_TITLES = {
  leaderboard: {
    title: "Tabla General & Podio",
    subtitle: "Clasificación en tiempo real y cortes de los domingos",
    icon: Trophy,
    color: "text-amber-400"
  },
  missions: {
    title: "Mis Misiones Personales",
    subtitle: "Anota tus ejercicios, repeticiones y meta Bomba de Tiempo",
    icon: Flame,
    color: "text-emerald-400"
  },
  cards: {
    title: "Mis Cartas Secretas",
    subtitle: "Inventario de cartas dominicales acumuladas (máx 2 en mano)",
    icon: Sparkles,
    color: "text-purple-400"
  },
  admin: {
    title: "Panel de Administrador",
    subtitle: "Crear misiones, repartir cartas y gestionar atletas",
    icon: ShieldAlert,
    color: "text-purple-300"
  }
};

export default function ActiveUserBanner({ currentTab, onOpenSwitchUser, onOpenClassModal }) {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) return null;

  const heroClass = getRpgClass(currentUser.rpgClassId);
  const tabInfo = TAB_TITLES[currentTab] || TAB_TITLES.leaderboard;
  const TabIcon = tabInfo.icon;

  const currentLevel = currentUser.level || 1;
  const xp = currentUser.xp || 0;
  const xpInLevel = xp % 1000;
  const progressPct = Math.min(100, (xpInLevel / 1000) * 100);

  return (
    <div className="mb-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 p-3 sm:p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Active Hero Identity */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with RPG Frame */}
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${heroClass.frameColor} p-0.5 flex-shrink-0 shadow-lg`}>
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-xl sm:text-2xl">
              {currentUser.avatar || heroClass.icon}
            </div>
          </div>

          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Atleta Activo:
              </span>
              <h2 className="text-sm sm:text-base font-black text-white truncate">
                {currentUser.username}
              </h2>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {heroClass.badge}
              </span>
              {isAdmin && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  👑 Admin
                </span>
              )}
            </div>

            {/* Current Section & XP indicator */}
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Estás en: <strong className="text-white">{tabInfo.title}</strong></span>
              </span>
              <span className="text-slate-600 hidden xs:inline">·</span>
              <span className="text-slate-400 text-[11px] font-mono hidden xs:inline">
                Nivel {currentLevel} ({xp} XP)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons (Cambiar de perfil & Cambiar de clase) */}
        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          <button
            onClick={onOpenClassModal}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            title="Cambiar avatar o clase RPG"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Clase RPG</span>
          </button>

          <button
            onClick={onOpenSwitchUser}
            className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm"
            title="Cambiar de jugador / Seleccionar otro perfil"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cambiar Perfil</span>
          </button>
        </div>

      </div>
    </div>
  );
}
