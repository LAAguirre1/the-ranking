import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStoredFirebaseConfig, saveFirebaseConfig, getFirebaseInstance } from '../lib/firebase';
import { seedInitialUsersToFirebase } from '../lib/storage';
import { Cloud, X, Check, AlertCircle, ExternalLink, RefreshCw, ShieldAlert } from 'lucide-react';

export default function FirebaseConfigModal({ isOpen, onClose }) {
  const { isAdmin } = useAuth();
  const currentConfig = getStoredFirebaseConfig();
  const [configJson, setConfigJson] = useState(
    currentConfig ? JSON.stringify(currentConfig, null, 2) : ''
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Security barrier: only the Admin can access or edit credentials
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/50 rounded-2xl p-6 text-center shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white">Acceso Denegado</h3>
          <p className="text-xs text-slate-300 mt-1.5">
            Solo el <strong>Administrador (Admin)</strong> tiene autorización para ver o modificar la conexión a la base de datos de Firebase.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let parsed;
      // Handle either clean JSON or JS object copied from Firebase console
      const cleaned = configJson
        .replace(/(const|let|var)\s+firebaseConfig\s*=\s*/, '')
        .replace(/;$/, '')
        .trim();

      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        // Fallback for unquoted keys in JS object: { apiKey: "..." }
        parsed = new Function(`return ${cleaned}`)();
      }

      if (!parsed || !parsed.apiKey || !parsed.projectId) {
        throw new Error('La configuración debe contener al menos "apiKey" y "projectId".');
      }

      saveFirebaseConfig(parsed);
      setLoading(true);

      // Re-init and attempt seed
      const { isLive } = getFirebaseInstance();
      if (isLive) {
        await seedInitialUsersToFirebase();
      }

      setLoading(false);
      setSuccess('¡Firebase Cloud conectado y sincronizado con éxito! La página se recargará para aplicar.');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Formato inválido: ' + err.message);
    }
  };

  const handleDisconnect = () => {
    saveFirebaseConfig(null);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              Conexión Firebase Cloud (Gratis)
            </h3>
            <p className="text-xs text-slate-400">
              Sincroniza el juego en tiempo real para todos tus amigos
            </p>
          </div>
        </div>

        {/* Step-by-step guide */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 mb-4 text-xs text-slate-300">
          <p className="font-bold text-white flex items-center gap-1.5">
            <span>Guía rápida en 3 pasos:</span>
            <a 
              href="https://console.firebase.google.com/" 
              target="_blank" 
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-0.5 ml-auto"
            >
              <span>Ir a Firebase Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Crea un proyecto en Firebase (Plan Gratuito Spark).</li>
            <li>Activa <strong>Cloud Firestore</strong> (en modo de prueba o con reglas públicas para lectura/escritura).</li>
            <li>En Configuración de Proyecto, añade una App Web y pega aquí el objeto <code className="text-emerald-300">firebaseConfig</code>.</li>
          </ol>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Pega tu configuración de Firebase:
            </label>
            <textarea
              rows={7}
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "tu-app.firebaseapp.com",\n  "projectId": "tu-app-id",\n  "storageBucket": "tu-app.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Conectando...' : 'Guardar y Conectar Cloud'}</span>
            </button>

            {currentConfig && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-3 py-2.5 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Desconectar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
