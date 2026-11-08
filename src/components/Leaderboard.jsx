import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSundaySnapshots } from '../lib/storage';
import { getRpgClass } from '../data/rpgClasses';
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

  const players = users.filter(u => u.role !== 'admin');
  const sortedPlayers = [...players].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  const first = sortedPlayers[0];
  const second = sortedPlayers[1];
  const third = sortedPlayers[2];

  const firstClass = getRpgClass(first?.rpgClassId);
  const secondClass = getRpgClass(second?.rpgClassId);
  const thirdClass = getRpgClass(third?.rpgClassId);

  const selectedSnapshot = snapshots.find(s => s.id === selectedSnapshotId) || snapshots[0];

  return (
    <div className="space-y-6 pb-20 md:pb-8">

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 p-5 sm:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Competencia RPG · Mes de Noviembre</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Tabla General de Posiciones
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              ¡Cada ejercicio suma experiencia! Sube de nivel cada <strong className="text-emerald-400">1.000 XP</strong>. 
              El podio se actualiza en vivo y cada domingo se congela la clasificación.
            </p>
          </div>

          {/* Toggle: En vivo vs Domingos */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveView('live')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'snapshots'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Cortes ({snapshots.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeView === 'live' ? (
        <>
          {/* THE OLYMPIC PODIUM */}
          <div className="relative pt-6 pb-2">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto items-end">
              
              {/* 2ND PLACE (SILVER) */}
              {second ? (
                <div className="flex flex-col items-center animate-fade-in order-1">
                  <div className="relative mb-2 flex flex-col items-center">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${secondClass.frameColor} p-0.5 shadow-lg`}>
                      <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl">
                        {second.avatar || secondClass.icon}
                      </div>
                    </div>
                    <span className="absolute -top-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-300 text-slate-900 shadow">
                      2°
                    </span>
                  </div>
                  <div className="w-full text-center">
                    <p className="font-extrabold text-xs sm:text-sm text-slate-200 truncate px-1">
                      {second.username}
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {secondClass.badge}
                    </span>
                    <p className="text-[11px] font-extrabold text-slate-300 font-mono">
                      {second.xp} XP
                    </p>
                  </div>
                  {/* Stand */}
                  <div className="w-full h-24 sm:h-32 mt-2 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700/80 border-t border-x border-slate-500/40 flex flex-col items-center justify-center p-2 shadow-lg">
                    <span className="text-lg sm:text-2xl font-black text-slate-300">2</span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Plata</span>
                  </div>
                </div>
              ) : <div className="order-1" />}

              {/* 1ST PLACE (GOLD) */}
              {first ? (
                <div className="flex flex-col items-center animate-fade-in order-2">
                  <div className="relative mb-2 flex flex-col items-center">
                    <Crown className="w-6 h-6 text-amber-400 animate-bounce mb-0.5" />
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${firstClass.frameColor} p-1 shadow-2xl shadow-amber-500/20`}>
                      <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl">
                        {first.avatar || firstClass.icon}
                      </div>
                    </div>
                    <span className="absolute -top-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/30">
                      1°
                    </span>
                  </div>
                  <div className="w-full text-center">
                    <p className="font-black text-xs sm:text-base text-amber-300 truncate px-1">
                      {first.username}
                    </p>
                    <span className="text-[10px] text-amber-400/90 font-black">
                      {firstClass.badge}
                    </span>
                    <p className="text-xs sm:text-sm font-black text-amber-400 font-mono">
                      {first.xp} XP
                    </p>
                  </div>
                  {/* Stand */}
                  <div className="w-full h-32 sm:h-44 mt-2 rounded-t-2xl bg-gradient-to-t from-amber-950/80 via-amber-900/40 to-amber-600/30 border-t-2 border-x-2 border-amber-400/60 flex flex-col items-center justify-center p-2 shadow-2xl shadow-amber-500/10">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mb-0.5" />
                    <span className="text-xl sm:text-3xl font-black text-amber-300">1</span>
                    <span className="text-[9px] text-amber-200 uppercase font-black tracking-widest">LÍDER</span>
                  </div>
                </div>
              ) : <div className="order-2" />}

              {/* 3RD PLACE (BRONZE) */}
              {third ? (
                <div className="flex flex-col items-center animate-fade-in order-3">
                  <div className="relative mb-2 flex flex-col items-center">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${thirdClass.frameColor} p-0.5 shadow-lg`}>
                      <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl">
                        {third.avatar || thirdClass.icon}
                      </div>
                    </div>
                    <span className="absolute -top-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-700 text-white shadow">
                      3°
                    </span>
                  </div>
                  <div className="w-full text-center">
                    <p className="font-extrabold text-xs sm:text-sm text-slate-200 truncate px-1">
                      {third.username}
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {thirdClass.badge}
                    </span>
                    <p className="text-[11px] font-extrabold text-amber-500 font-mono">
                      {third.xp} XP
                    </p>
                  </div>
                  {/* Stand */}
                  <div className="w-full h-18 sm:h-24 mt-2 rounded-t-2xl bg-gradient-to-t from-amber-950 to-orange-950/80 border-t border-x border-amber-700/40 flex flex-col items-center justify-center p-2 shadow-lg">
                    <span className="text-lg sm:text-2xl font-black text-amber-600">3</span>
                    <span className="text-[9px] text-amber-600 uppercase font-bold tracking-wider">Bronce</span>
                  </div>
                </div>
              ) : <div className="order-3" />}

            </div>
          </div>

          {/* FULL RANKINGS TABLE */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-4 sm:px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Posiciones Completas ({players.length} Atletas)</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                1.000 XP = 1 Nivel
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {sortedPlayers.map((player, index) => {
                const rank = index + 1;
                const isMe = currentUser?.id === player.id;
                const heroClass = getRpgClass(player.rpgClassId);
                const completedCount = Object.values(player.progress || {}).filter(p => p.completed).length;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 sm:p-4 transition-all ${
                      isMe 
                        ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500' 
                        : 'hover:bg-slate-850/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                      {/* Rank badge */}
                      <div className="w-7 sm:w-8 flex-shrink-0 text-center">
                        {rank === 1 && <span className="text-base sm:text-lg">🥇</span>}
                        {rank === 2 && <span className="text-base sm:text-lg">🥈</span>}
                        {rank === 3 && <span className="text-base sm:text-lg">🥉</span>}
                        {rank > 3 && (
                          <span className="font-black font-mono text-xs sm:text-sm text-slate-400">
                            #{rank}
                          </span>
                        )}
                      </div>

                      {/* RPG Avatar with Frame */}
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${heroClass.frameColor} p-0.5 flex-shrink-0 shadow`}>
                        <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center text-base sm:text-xl">
                          {player.avatar || heroClass.icon}
                        </div>
                      </div>

                      {/* Name & Class */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-xs sm:text-sm font-bold truncate ${isMe ? 'text-emerald-400' : 'text-slate-100'}`}>
                            {player.username}
                          </p>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden xs:inline">
                            {heroClass.badge}
                          </span>
                          {isMe && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold uppercase">
                              Tú
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 mt-0.5">
                          <span>Nv.<strong className="text-slate-200">{player.level}</strong></span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <Target className="w-3 h-3 text-slate-400" />
                            {completedCount}
                          </span>
                          {player.cards?.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="text-purple-300">
                                🃏 {player.cards.length}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* XP & Progress */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 text-right">
                      <div>
                        <span className="text-xs sm:text-base font-black font-mono text-emerald-400">
                          {player.xp} XP
                        </span>
                        <div className="w-14 sm:w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden ml-auto">
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
        /* SUNDAY SNAPSHOTS */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Historial de Domingos Congelados</span>
          </h2>

          {snapshots.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300">Aún no hay cortes dominicales guardados</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                El Administrador puede congelar el podio cada domingo desde el Panel Admin.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
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

              {selectedSnapshot && (
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="divide-y divide-slate-800">
                    {selectedSnapshot.standings.map((st) => (
                      <div key={st.userId} className="flex items-center justify-between p-3 bg-slate-950/40">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-xs w-5 text-slate-400">
                            #{st.rank}
                          </span>
                          <span className="text-lg">{st.avatar}</span>
                          <span className="font-bold text-xs sm:text-sm text-slate-200">{st.username}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm">
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
