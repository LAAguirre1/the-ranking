import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, X, Check, AlertCircle } from 'lucide-react';

export default function ChangePinModal({ isOpen, onClose }) {
  const { currentUser, changePin } = useAuth();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPin.trim().length < 4) {
      setError('El PIN debe tener al menos 4 dígitos o caracteres.');
      return;
    }

    if (newPin !== confirmPin) {
      setError('Los códigos PIN no coinciden.');
      return;
    }

    setLoading(true);
    const ok = await changePin(newPin.trim());
    setLoading(false);

    if (ok) {
      setSuccess('¡Tu código PIN ha sido actualizado con éxito!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
    } else {
      setError('Ocurrió un error al actualizar el PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-extrabold text-white">
            Cambiar Código PIN
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Hola <strong className="text-white">{currentUser.username}</strong>. Actualiza tu PIN para que solo tú puedas ingresar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Nuevo PIN (mínimo 4 caracteres):
            </label>
            <input
              type="password"
              maxLength={8}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="••••"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-center text-lg font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Confirmar Nuevo PIN:
            </label>
            <input
              type="password"
              maxLength={8}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="••••"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-center text-lg font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all"
          >
            {loading ? 'Guardando...' : 'Actualizar mi PIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
