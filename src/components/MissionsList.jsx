import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MISSIONS_DATA } from '../data/missions';
import { recordProgress } from '../lib/storage';
import TimeBombCard from './TimeBombCard';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  CheckCircle, 
  Sparkles, 
  Dumbbell, 
  Bike, 
  Footprints, 
  Zap, 
  Activity, 
  Timer, 
  Mountain, 
  Shield, 
  Compass, 
  Trophy, 
  HeartHandshake, 
  Crosshair,
  Plus,
  AlertCircle
} from 'lucide-react';

const ICON_MAP = {
  Dumbbell,
  Flame,
  Zap,
  Bike,
  Footprints,
  Activity,
  Timer,
  Mountain,
  Shield,
  Compass,
  Sparkles,
  Trophy,
  HeartHandshake,
  Crosshair
};

export default function MissionsList({ onOpenLogin }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'secondary'
  const [customInputs, setCustomInputs] = useState({});
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const missions = activeTab === 'main' ? MISSIONS_DATA.mainMissions : MISSIONS_DATA.secondaryMissions;

  const handleAddQty = async (mission, qtyToAdd) => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }

    const num = Number(qtyToAdd);
    if (isNaN(num) || num <= 0) return;

    const res = await recordProgress(currentUser, mission, num);
    if (res.success) {
      if (res.justCompleted) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setFeedbackMsg(`🎉 ¡Felicitaciones! Completaste la Misión ${mission.code} (+${mission.xp} XP)`);
      } else {
        setFeedbackMsg(`✅ Sumaste ${num} ${mission.unit} a la Misión ${mission.code} (${res.newQty}/${mission.targetQty})`);
      }
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleCompleteAll = async (mission) => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    const currentQty = currentUser.progress?.[mission.id]?.qty || 0;
    const diff = mission.targetQty - currentQty;
    if (diff > 0) {
      await handleAddQty(mission, diff);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Time Bomb Challenge */}
      <TimeBombCard />

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Rules Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-bold text-white">
            Regla de Oro: Las misiones se cumplen una única vez en el mes.
          </p>
          <p className="text-slate-400">
            Puedes ir anotando tus avances parciales (ej: 20 sentadillas en una semana, 30 en otra...). 
            Los <strong>XP</strong> se acreditan automáticamente al alcanzar la meta total (100%).
          </p>
        </div>
      </div>

      {/* Main vs Secondary Switcher */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'main'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Misiones Principales (A - E)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'main' ? 'bg-black/20 text-black' : 'bg-emerald-500/10 text-emerald-400'}`}>
              100 XP c/u
            </span>
          </button>

          <button
            onClick={() => setActiveTab('secondary')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'secondary'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Misiones Secundarias (a - j)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'secondary' ? 'bg-black/20 text-black' : 'bg-teal-500/10 text-teal-400'}`}>
              50 XP c/u
            </span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:block">
          Total: {missions.length} misiones
        </span>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((mission) => {
          const userProgress = currentUser?.progress?.[mission.id] || { qty: 0, completed: false };
          const currentQty = userProgress.qty || 0;
          const isCompleted = userProgress.completed;
          const percentage = Math.min(100, Math.round((currentQty / mission.targetQty) * 100));
          const IconComponent = ICON_MAP[mission.icon] || Flame;

          return (
            <div
              key={mission.id}
              className={`relative rounded-2xl p-5 transition-all border ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top row: Code Badge + Title + XP */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {mission.code}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                      <span>{mission.title}</span>
                      {isCompleted && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 inline" />
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <IconComponent className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{mission.category}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono border ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    +{mission.xp} XP
                  </span>
                </div>
              </div>

              {/* Progress Bar & Numbers */}
              <div className="space-y-1.5 my-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={isCompleted ? 'text-emerald-400' : 'text-slate-400'}>
                    {isCompleted ? '¡Misión Cumplida!' : 'Progreso actual:'}
                  </span>
                  <span className="font-mono text-slate-200">
                    <strong className="text-emerald-400">{currentQty}</strong> / {mission.targetQty} {mission.unit} ({percentage}%)
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isCompleted
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm shadow-emerald-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons (Log increments) */}
              {!isCompleted ? (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Quick increment buttons based on target quantity */}
                    {mission.targetQty >= 50 ? (
                      <>
                        <button
                          onClick={() => handleAddQty(mission, 10)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleAddQty(mission, 25)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all"
                        >
                          +25
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAddQty(mission, 1)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleAddQty(mission, 5)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all"
                        >
                          +5
                        </button>
                      </>
                    )}

                    {/* Custom input */}
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="Otro"
                        value={customInputs[mission.id] || ''}
                        onChange={(e) => setCustomInputs({ ...customInputs, [mission.id]: e.target.value })}
                        className="w-14 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-center text-white focus:outline-none focus:border-emerald-500"
                      />
                      {customInputs[mission.id] && (
                        <button
                          onClick={() => {
                            handleAddQty(mission, customInputs[mission.id]);
                            setCustomInputs({ ...customInputs, [mission.id]: '' });
                          }}
                          className="p-1 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Complete All Button */}
                  <button
                    onClick={() => handleCompleteAll(mission)}
                    className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 text-xs font-bold rounded-lg transition-all"
                  >
                    Completar Misión
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span>🏆 Completado este mes</span>
                  <span className="font-mono text-emerald-300">+{mission.xp} XP Añadidos</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
