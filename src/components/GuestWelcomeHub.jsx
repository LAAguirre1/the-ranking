import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getRpgClass } from '../data/rpgClasses';
import { Swords, UserCheck, Flame, Trophy, Sparkles, KeyRound } from 'lucide-react';

export default function GuestWelcomeHub({ onSelectUser }) {
  const { users } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/40 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
            <Swords className="w-4 h-4 text-emerald-400" />
            <span>Portal de Entrada · Mes de Noviembre</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Bienvenido a The Ranking
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Actualmente estás en <strong className="text-amber-400">Modo Espectador</strong>. 
            Para registrar tus sentadillas, flexiones, kilómetros de bici y usar tus cartas secretas, 
            <strong> selecciona tu atleta aquí abajo e ingresa con tu PIN</strong> (código inicial <code className="text-emerald-400 font-mono font-bold bg-slate-950/80 px-1.5 py-0.5 rounded">1234</code>).
          </p>
        </div>
      </div>

      {/* Select Hero Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Elige tu Perfil para Entrar ({users.length} Atletas):</span>
          </h2>
          <span className="text-xs text-slate-500">
            PIN temporal: 1234
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {users.map((u) => {
            const heroClass = getRpgClass(u.rpgClassId);
            const isAdmin = u.role === 'admin';

            return (
              <button
                key={u.id}
                onClick={() => onSelectUser(u)}
                className="group relative p-4 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-emerald-500/60 hover:bg-slate-850/80 transition-all text-left flex flex-col justify-between shadow-md hover:shadow-emerald-500/10 hover:scale-[1.02]"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${heroClass.frameColor} p-0.5 shadow-md`}>
                      <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center text-2xl">
                        {u.avatar || heroClass.icon}
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {isAdmin ? '👑 Admin' : heroClass.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors truncate">
                    {u.username}
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Nivel {u.level || 1} · <strong className="text-slate-200 font-mono">{u.xp || 0} XP</strong>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-extrabold group-hover:text-emerald-300">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Entrar con PIN</span>
                  </span>
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
