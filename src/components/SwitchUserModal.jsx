import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRpgClass } from '../data/rpgClasses';
import { X, UserCheck, KeyRound, LogOut, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function SwitchUserModal({ isOpen, onClose }) {
  const { users, currentUser, login, logout } = useAuth();
  const [targetUser, setTargetUser] = useState(null);
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSelectUser = (user) => {
    setTargetUser(user);
    setPin('1234');
    setError('');
  };

  const handleSwitchSubmit = (e) => {
    e.preventDefault();
    if (!targetUser) return;

    const res = login(targetUser.username, pin);
    if (!res.success) {
      setError(res.message);
    } else {
      setSuccess(`¡Has cambiado al atleta "${targetUser.username}"!`);
      setTimeout(() => {
        setSuccess('');
        setTargetUser(null);
        onClose();
      }, 700);
    }
  };

  const handleDirectLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-3 border-b border-slate-800 flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Cambio de Perfil de Atleta</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            ¿Quién está jugando ahora?
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentUser ? (
              <>Sesión actual: <strong className="text-emerald-400 font-bold">{currentUser.username}</strong> ({currentUser.rpgClassName || 'Héroe'}). Elige otro para cambiar.</>
            ) : (
              <>Selecciona tu perfil de atleta para ingresar al juego.</>
            )}
          </p>
        </div>

        {/* Players List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1 custom-scroll">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Selecciona un Atleta ({users.length}):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {users.map((u) => {
              const isCurrent = currentUser?.id === u.id;
              const isSelected = targetUser?.id === u.id;
              const heroClass = getRpgClass(u.rpgClassId);

              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectUser(u)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                      : isCurrent
                      ? 'bg-emerald-950/20 border-emerald-500/50'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${heroClass.frameColor} p-0.5 flex-shrink-0 shadow`}>
                      <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center text-lg">
                        {u.avatar || heroClass.icon}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-black text-white truncate">
                          {u.username}
                        </p>
                        {isCurrent && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-black">
                            ACTIVO
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {heroClass.badge} · {u.xp || 0} XP
                      </p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Confirmation Form for selected user */}
        {targetUser && (
          <form onSubmit={handleSwitchSubmit} className="pt-3 border-t border-slate-800 space-y-3 flex-shrink-0 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">
                Ingresando como: <strong className="text-emerald-400 font-bold">{targetUser.username}</strong>
              </span>
              <span className="text-[11px] text-slate-500">PIN por defecto: 1234</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="password"
                  maxLength={8}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 tracking-widest"
                  required
                  autoFocus
                />
                <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>Cambiar Ahora</span>
                <Check className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-bold bg-rose-500/10 p-2 rounded-xl text-center">
                {error}
              </p>
            )}
            {success && (
              <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-xl text-center">
                {success}
              </p>
            )}
          </form>
        )}

        {/* Footer: Close session / spectator mode */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs flex-shrink-0">
          {currentUser ? (
            <button
              onClick={handleDirectLogout}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión (Modo Espectador)</span>
            </button>
          ) : (
            <span className="text-slate-500">Modo Espectador activo</span>
          )}

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white ml-auto"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
