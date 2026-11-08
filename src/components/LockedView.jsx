import React from 'react';
import { Lock, UserCheck, Flame, Sparkles } from 'lucide-react';

export default function LockedView({ tabName, onOpenLogin }) {
  return (
    <div className="py-12 sm:py-16 text-center max-w-md mx-auto space-y-4 px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto shadow-2xl text-emerald-400">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-black text-white">
          Ventana Exclusiva de Atleta
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Para ver tus <strong>{tabName}</strong> y registrar tu progreso personal, primero debes ingresar con tu perfil.
        </p>
      </div>

      <button
        onClick={onOpenLogin}
        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center gap-2"
      >
        <UserCheck className="w-4 h-4" />
        <span>Seleccionar mi Atleta (PIN 1234)</span>
      </button>
    </div>
  );
}
