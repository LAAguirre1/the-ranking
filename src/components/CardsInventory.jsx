import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { playSecretCard } from '../lib/storage';
import { Sparkles, ShieldCheck, Zap, Flame, Lock, Info, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const ICON_MAP = {
  Zap,
  ShieldCheck,
  Flame,
  Sparkles
};

export default function CardsInventory({ onOpenLogin }) {
  const { currentUser } = useAuth();
  const [playingId, setPlayingId] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  const cards = currentUser?.cards || [];
  const maxSlots = 2;

  const handlePlayCard = async (card) => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }

    setPlayingId(card.id);
    const res = await playSecretCard(currentUser, card.id);
    setPlayingId(null);

    if (res.success) {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
      setSuccessNotice(`✨ ¡Jugaste "${card.name}"! ${card.xpValue > 0 ? `+${card.xpValue} XP otorgados.` : 'Efecto activado.'}`);
      setTimeout(() => setSuccessNotice(null), 5000);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-purple-900/40 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Cartas Secretas de Domingo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Tu Inventario de Cartas ({cards.length}/{maxSlots})
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Cada <strong>Domingo</strong> recibes una nueva carta secreta. 
              Tú decides el momento exacto para jugarla, pero <strong>solo puedes acumular un máximo de 2 cartas sin usar</strong> en tu poder.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800">
            <span className="text-2xl">🃏</span>
            <div>
              <p className="text-xs text-slate-400">Capacidad en mano:</p>
              <p className="text-sm font-extrabold text-purple-300 font-mono">
                {cards.length} de {maxSlots} espacios ocupados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success alert */}
      {successNotice && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 font-bold text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[0, 1].map((slotIndex) => {
          const card = cards[slotIndex];

          if (card) {
            const Icon = ICON_MAP[card.icon] || Sparkles;
            return (
              <div
                key={card.instanceId || card.id}
                className="relative rounded-3xl overflow-hidden bg-slate-900 border border-purple-500/40 p-6 shadow-xl flex flex-col justify-between group hover:border-purple-400 transition-all"
              >
                {/* Gradient background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color || 'from-purple-600 to-indigo-700'} opacity-10 group-hover:opacity-15 transition-opacity`} />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {card.tagline}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">
                      {card.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    {card.xpValue > 0 ? `+${card.xpValue} XP` : 'Efecto Estratégico'}
                  </span>

                  <button
                    onClick={() => handlePlayCard(card)}
                    disabled={playingId === card.id}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{playingId === card.id ? 'Activando...' : 'Jugar Esta Carta'}</span>
                  </button>
                </div>
              </div>
            );
          }

          // Empty Slot
          return (
            <div
              key={`empty_slot_${slotIndex}`}
              className="rounded-3xl border-2 border-dashed border-slate-800 bg-slate-950/40 p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400">
                  Espacio #{slotIndex + 1} Disponible
                </p>
                <p className="text-xs text-slate-600 mt-1 max-w-xs">
                  Aquí se colocará la carta que el Administrador reparta el próximo Domingo.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rules Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">
            Regla de Capacidad:
          </p>
          <p>
            Si ya tienes 2 cartas en tu poder al llegar el domingo, no podrás recibir una nueva hasta que juegues alguna de las que tienes guardadas. ¡Aprovéchalas antes de que venza la semana!
          </p>
        </div>
      </div>

    </div>
  );
}
