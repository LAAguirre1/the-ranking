import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSundaySnapshots } from '../lib/storage';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

export default function Leaderboard({ onOpenMissions }) {
  const { users, currentUser } = useAuth();
  const [activeView, setActiveView] = useState('live'); // 'live' | 'snapshots'
  const [selectedSnapshotId, setSelectedSnapshotId] = useState(null);

  const snapshots = getSundaySnapshots();

  // Filter out admin or show players
  const players = users.filter(u => u.role !== 'admin');
  
  // Sort by XP descending
  const sortedPlayers = [...players].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  const first = sortedPlayers[0];
  const second = sortedPlayers[1];
  const third = sortedPlayers[2];
  const restOfPlayers = sortedPlayers.slice(3);

  const selectedSnapshot = snapshots.find(s => s.id === selectedSnapshotId) || snapshots[0];

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Competencia Oficial · Mes de Noviembre</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Tabla General de Posiciones
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              ¡Cada repetición cuenta! Sube de nivel cada <strong className="text-emerald-400">1.000 XP</strong>. 
              El podio se actualiza en tiempo real y cada Domingo se consolida la clasificación.
            </p>
          </div>

          {/* View Mode Toggle: En vivo vs Domingos */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveView('live')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeView === 'live'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ En Vivo
            </button>
            <button
              onClick={() => {
                setActiveView('snapshots');
                if (snapshots.length > 0 && !selectedSnapshotId) {
                  setSelectedSnapshotId(snapshots[0].id);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'snapshots'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Cortes de Domingo ({snapshots.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeView === 'live' ? (
        <>
          {/* THE OLYMPIC PODIUM */}
          <div className="relative pt-8 pb-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto items-end">
              
              {/* 2ND PLACE (SILVER) */}
              {second ? (
                <div className="flex flex-col items-center animate-fade-in order-1">
                  <div className="relative mb-2 flex flex-col items-center">
                    <span className="text-3xl sm:text-4xl drop-shadow-md">{second.avatar || "🥈"}</span>
                    <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-300 text-slate-900 shadow">
                      2°
                    </span>
                  </div>
                  <div className="w-full text-center">
                    <p className="font-extrabold text-xs sm:text-sm text-slate-200 truncate px-1">
                      {second.username}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 font-mono">
                      {second.xp} XP
                    </p>
                    <span className="text-[10px] text-slate-400">Nivel {second.level}</span>
                  </div>
                  {/* Stand */}
                  <div className="w-full h-28 sm:h-36 mt-3 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700/80 border-t border-x border-slate-500/40 flex flex-col items-center justify-center p-2 shadow-lg">
                    <span className="text-xl sm:text-2xl font-black text-slate-300">2</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Plata</span>
                  </div>
                </div>
              ) : <div className="order-1" />}

              {/* 1ST PLACE (GOLD) */}
              {first ? (
                <div className="flex flex-col items-center animate-fade-in order-2">
                  <div className="relative mb-2 flex flex-col items-center">
                    <Crown className="w-7 h-7 text-amber-400 animate-bounce mb-0.5" />
                    <span className="text-4xl sm:text-5xl drop-shadow-lg">{first.avatar || "🥇"}</span>
                    <span className="absolute -top-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/30">
                      1°
                    </span>
                  </div>
                  <div className="w-full text-center">
                    <p className="font-black text-sm sm:text-base text-amber-300 truncate px-1">
                      {first.username}
                    </p>
                    <p className="text-xs sm:text-sm font-extrabold text-amber-400 font-mono">
                      {first.xp} XP
                    </p>
                    <span className="text-[11px] text-emerald-400 font-bold">Nivel {first.level}</span>
                  </div>
                  {/* Stand */}
                  <div className="w-full h-36 sm:h-48 mt-3 rounded-t-2xl bg-gradient-to-t from-amber-950/80 via-amber-900/40 to-amber-600/30 border-t-2 border-x-2 border-amber-400/60 flex flex-col items-center justify-center p-2 shadow-2xl shadow-amber-500/10">
                    <Trophy className="w-6 h-6 text-amber-400 mb-1" />
                    <span className="text-2xl sm:text-3xl font-black text-amber-300">1</span>
                    <span className="text-[10px] text-amber-200 uppercase font-black tracking-widest">LÍDER</span>
                  </div>
                </div>
              ) : <div className="order-2" />}

              {/* 3RD PLACE (BRONZE) */}
              {third ? (
                <div className="flex flex-col items-center animate-fade-in order-3">
                  <div className="relative mb-2 flex flex-col items-center">
                    <span className="text-3xl sm:text-4xl drop-shadow-md">{third.avatar || "🥉"}</span>
                    <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-700 text-white shadow">
                      3°
                    </span>
                  </div>
                  <div className="w-full text-center">
                    <p className="font-extrabold text-xs sm:text-sm text-slate-200 truncate px-1">
                      {third.username}
                    </p>
                    <p className="text-[11px] font-bold text-amber-500 font-mono">
                      {third.xp} XP
                    </p>
                    <span className="text-[10px] text-slate-400">Nivel {third.level}</span>
                  </div>
                  {/* Stand */}
                  <div className="w-full h-20 sm:h-28 mt-3 rounded-t-2xl bg-gradient-to-t from-amber-950 to-orange-950/80 border-t border-x border-amber-700/40 flex flex-col items-center justify-center p-2 shadow-lg">
                    <span className="text-xl sm:text-2xl font-black text-amber-600">3</span>
                    <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wider">Bronce</span>
                  </div>
                </div>
              ) : <div className="order-3" />}

            </div>
          </div>

          {/* POSITIONS LIST (FULL TABLE) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Clasificación Completa ({players.length} Atletas)</span>
              </h2>
              <span className="text-xs text-slate-400">
                1.000 XP = 1 Nivel
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {sortedPlayers.map((player, index) => {
                const rank = index + 1;
                const isMe = currentUser?.id === player.id;
                
                // Count completed missions
                const completedCount = Object.values(player.progress || {}).filter(p => p.completed).length;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 transition-all ${
                      isMe 
                        ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500' 
                        : 'hover:bg-slate-850/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank badge */}
                      <div className="w-8 flex-shrink-0 text-center">
                        {rank === 1 && <span className="text-lg">🥇</span>}
                        {rank === 2 && <span className="text-lg">🥈</span>}
                        {rank === 3 && <span className="text-lg">🥉</span>}
                        {rank > 3 && (
                          <span className="font-extrabold font-mono text-sm text-slate-400">
                            #{rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <span className="text-2xl flex-shrink-0">{player.avatar || "🏃"}</span>

                      {/* Name & status */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold truncate ${isMe ? 'text-emerald-400' : 'text-slate-100'}`}>
                            {player.username}
                          </p>
                          {isMe && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold uppercase">
                              Tú
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span>Nivel <strong className="text-slate-200">{player.level}</strong></span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-slate-400" />
                            {completedCount} misiones
                          </span>
                          {player.cards?.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="text-amber-400 font-medium">
                                🃏 {player.cards.length} {player.cards.length === 1 ? 'carta' : 'cartas'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* XP & Progress Bar */}
                    <div className="flex items-center gap-3 flex-shrink-0 text-right">
                      <div>
                        <span className="text-sm sm:text-base font-black font-mono text-emerald-400">
                          {player.xp} XP
                        </span>
                        <div className="w-20 sm:w-28 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            style={{ width: `${Math.min(100, ((player.xp % 1000) / 1000) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* SUNDAY SNAPSHOTS VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>Historial de Domingos</span>
              </h2>
              <p className="text-xs text-slate-400">
                Cada domingo se congela la tabla para ver quién se llevó el podio semanal.
              </p>
            </div>
          </div>

          {snapshots.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">Aún no hay cortes dominicales guardados</p>
              <p className="text-xs text-slate-500 mt-1">
                El Administrador puede congelar el podio cada domingo desde el Panel Admin.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Snapshot selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {snapshots.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSnapshotId(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedSnapshot?.id === s.id
                        ? 'bg-emerald-500 text-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Snapshot table */}
              {selectedSnapshot && (
                <div className="border border-slate-800 rounded-xl overflow-hidden mt-3">
                  <div className="divide-y divide-slate-800">
                    {selectedSnapshot.standings.map((st) => (
                      <div key={st.userId} className="flex items-center justify-between p-3 bg-slate-950/40">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm w-6 text-slate-400">
                            #{st.rank}
                          </span>
                          <span>{st.avatar}</span>
                          <span className="font-bold text-sm text-slate-200">{st.username}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          {st.xp} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
