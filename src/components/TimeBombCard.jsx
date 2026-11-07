import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateTimeBombGoal, resolveTimeBombStatus } from '../lib/storage';
import { Timer, AlertTriangle, CheckCircle2, XCircle, ShieldCheck, Flame, Save } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TimeBombCard() {
  const { currentUser, isAdmin } = useAuth();
  const [goalText, setGoalText] = useState(currentUser?.timeBomb?.goal || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const bomb = currentUser?.timeBomb || { goal: '', status: 'pending' };
  const hasShield = (currentUser?.cards || []).some(c => c.specialEffect === 'CANCEL_BOMB_PENALTY');

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    await updateTimeBombGoal(currentUser.id, goalText);
    setSaving(false);
    setIsEditing(false);
  };

  const handleStatusChange = async (newStatus) => {
    if (!currentUser) return;
    const res = await resolveTimeBombStatus(currentUser, newStatus);
    if (res && newStatus === 'completed') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border-2 border-rose-500/40 p-6 sm:p-7 shadow-2xl shadow-rose-950/30">
      
      {/* Background flare */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Left: Info & Goal */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Timer className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-rose-400">
              Misión Bomba de Tiempo ⏱️
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              +50 XP / -50 XP
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white">
            Tu Gran Meta Personal del Mes
          </h3>

          <p className="text-xs sm:text-sm text-slate-300">
            Ponte una meta personal para este mes de Noviembre. 
            <strong> Cumplirla te otorga +50 XP</strong>. ¡Pero cuidado! No llegar a cumplirla te <strong>restará 50 XP</strong>.
          </p>

          {/* Goal Display / Input */}
          <div className="pt-2">
            {currentUser ? (
              isEditing || !bomb.goal ? (
                <form onSubmit={handleSaveGoal} className="flex flex-col sm:flex-row gap-2 max-w-xl">
                  <input
                    type="text"
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    placeholder="Ej: Correr 5 km en ayunas 3 veces por semana, cero azúcar 15 días..."
                    className="flex-1 bg-slate-950 border border-rose-500/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2.5 bg-rose-500 hover:bg-rose-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Guardando...' : 'Fijar Meta'}</span>
                  </button>
                </form>
              ) : (
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <p className="text-sm font-semibold text-white">
                      "{bomb.goal}"
                    </p>
                  </div>
                  {bomb.status === 'pending' && (
                    <button
                      onClick={() => {
                        setGoalText(bomb.goal);
                        setIsEditing(true);
                      }}
                      className="text-xs text-slate-400 hover:text-white underline font-medium flex-shrink-0"
                    >
                      Editar
                    </button>
                  )}
                </div>
              )
            ) : (
              <p className="text-xs text-amber-400 italic">
                Inicia sesión con tu código para definir tu Bomba de Tiempo.
              </p>
            )}
          </div>

          {/* Shield status */}
          {hasShield && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1.5 rounded-xl max-w-fit">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Tienes la carta <strong>Escudo Anti-Bomba</strong>: Estás protegido contra la penalización de -50 XP.</span>
            </div>
          )}
        </div>

        {/* Right: Status & Actions */}
        {currentUser && (
          <div className="flex flex-col items-center sm:items-end gap-2 flex-shrink-0 pt-2 md:pt-0">
            <span className="text-xs font-semibold text-slate-400">Estado de tu Bomba:</span>
            
            <div className="flex items-center gap-2">
              {bomb.status === 'completed' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡CUMPLIDA! (+50 XP)</span>
                </div>
              )}

              {bomb.status === 'failed' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-black">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>FALLIDA (-50 XP)</span>
                </div>
              )}

              {bomb.status === 'pending' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black">
                  <Timer className="w-4 h-4 text-amber-400" />
                  <span>EN PROCESO</span>
                </div>
              )}
            </div>

            {/* Complete / Fail Buttons (Admin or User resolution) */}
            {bomb.goal && (
              <div className="flex items-center gap-2 mt-1">
                {bomb.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-black border border-emerald-500/40 text-xs font-bold rounded-lg transition-all"
                  >
                    Marcar Cumplida
                  </button>
                )}
                {bomb.status !== 'failed' && (
                  <button
                    onClick={() => handleStatusChange('failed')}
                    className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold rounded-lg transition-all"
                  >
                    Marcar Fallida
                  </button>
                )}
                {bomb.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange('pending')}
                    className="px-2.5 py-1 text-slate-400 hover:text-white text-xs underline"
                  >
                    Resetear
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
