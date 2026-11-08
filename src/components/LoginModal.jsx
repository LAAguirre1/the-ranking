import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRpgClass } from '../data/rpgClasses';
import { X, KeyRound, UserCheck, Sparkles, Swords } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { users, login } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [customUsername, setCustomUsername] = useState('');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setCustomUsername(user.username);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const targetName = selectedUser ? selectedUser.username : customUsername;
    if (!targetName.trim()) {
      setError('Por favor selecciona o escribe tu nombre de usuario.');
      return;
    }

    const res = login(targetName, pin);
    if (!res.success) {
      setError(res.message);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Swords className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-xl font-black text-white">
            Ingreso de Héroes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Selecciona tu atleta e ingresa tu PIN (por defecto <span className="text-emerald-400 font-mono font-bold">1234</span>).
          </p>
        </div>

        {/* User Picker Cards with RPG Frames */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Selecciona tu personaje:
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
            {users.map((u) => {
              const isSelected = selectedUser?.id === u.id;
              const isAdmin = u.role === 'admin';
              const heroClass = getRpgClass(u.rpgClassId);

              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectUser(u)}
                  className={`flex items-center gap-2 p-2 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${heroClass.frameColor} p-0.5 flex-shrink-0 shadow`}>
                    <div className="w-full h-full bg-slate-950 rounded-md flex items-center justify-center text-sm">
                      {u.avatar || heroClass.icon}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-xs font-black truncate">
                      {u.username}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {isAdmin ? '👑 Admin' : heroClass.badge}
                    </p>
                  </div>

                  {isSelected && <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Código PIN de acceso:
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                required
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Entrar al Tablero</span>
          </button>
        </form>

        <div className="mt-3.5 text-center">
          <p className="text-[11px] text-slate-500">
            ¿Quieres cambiar tu PIN o tu Clase RPG? Puedes hacerlo dentro tocando tu avatar o la llave 🔑.
          </p>
        </div>
      </div>
    </div>
  );
}
