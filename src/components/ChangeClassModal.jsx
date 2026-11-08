import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RPG_CLASSES } from '../data/rpgClasses';
import { updateUserRpgClass } from '../lib/storage';
import { Sparkles, X, Check, Shield, Sword } from 'lucide-react';

export default function ChangeClassModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState(currentUser?.rpgClassId || 'warrior');
  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  if (!isOpen || !currentUser) return null;

  const activeClass = RPG_CLASSES.find(c => c.id === selectedClassId) || RPG_CLASSES[0];

  const handleSelect = async (rpgClass) => {
    setSelectedClassId(rpgClass.id);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await updateUserRpgClass(currentUser.id, activeClass);
    setLoading(false);
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-800 flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selección de Avatar RPG</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Elige tu Clase de Héroe
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Personaliza el avatar y título de <strong className="text-emerald-400">{currentUser.username}</strong> en el podio.
          </p>
        </div>

        {/* Selected Hero Preview Banner */}
        <div className={`mt-4 p-4 rounded-2xl border ${activeClass.border} ${activeClass.bgGradient} flex-shrink-0 transition-all shadow-lg`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${activeClass.frameColor} p-0.5 flex-shrink-0 shadow-lg`}>
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-3xl">
                {activeClass.icon}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-white border border-white/20">
                  {activeClass.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white truncate">
                  {activeClass.name}
                </h3>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                {activeClass.title}
              </p>
              <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-1">
                "{activeClass.motto}"
              </p>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2 pr-1 custom-scroll">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Todas las Clases Disponibles ({RPG_CLASSES.length}):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {RPG_CLASSES.map((cls) => {
              const isSelected = selectedClassId === cls.id;
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => handleSelect(cls)}
                  className={`relative p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? `bg-slate-850 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg`
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl drop-shadow">{cls.icon}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs font-bold shadow">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="mt-2 min-w-0">
                    <p className="text-xs font-black text-white truncate">
                      {cls.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {cls.badge}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Puedes cambiar de clase las veces que quieras.
          </span>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            {savedMsg ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Clase Guardada!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Equipando...' : 'Equipar Esta Clase'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
