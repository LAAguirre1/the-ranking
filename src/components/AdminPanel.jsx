import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  createNewUser, 
  updateUser, 
  giveSecretCard, 
  resolveTimeBombStatus, 
  saveSundaySnapshot, 
  seedInitialUsersToFirebase 
} from '../lib/storage';
import { INITIAL_CARDS } from '../data/missions';
import { getFirebaseInstance } from '../lib/firebase';
import { 
  ShieldAlert, 
  UserPlus, 
  Sparkles, 
  Key, 
  Save, 
  Camera, 
  CloudUpload, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  Timer
} from 'lucide-react';

const AVATAR_OPTIONS = ['🐑', '🥣', '🌿', '🍳', '🍫', '🛋️', '🐱', '🏃', '🏋️', '🥊', '🚴', '🦁', '⚡', '🔥'];

export default function AdminPanel({ onOpenFirebaseModal }) {
  const { users } = useAuth();
  const { isLive } = getFirebaseInstance();

  // Create User State
  const [newUsername, setNewUsername] = useState('');
  const [newPin, setNewPin] = useState('1234');
  const [newAvatar, setNewAvatar] = useState('🏃');
  const [userSuccess, setUserSuccess] = useState('');

  // Card distribution
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCardId, setSelectedCardId] = useState(INITIAL_CARDS[0].id);
  const [cardMsg, setCardMsg] = useState(null);

  // Snapshot status
  const [snapshotMsg, setSnapshotMsg] = useState('');
  const [cloudSyncMsg, setCloudSyncMsg] = useState('');

  // Edit PIN inline state
  const [editingUserId, setEditingUserId] = useState(null);
  const [editPinValue, setEditPinValue] = useState('');

  const players = users.filter(u => u.role !== 'admin');

  // Handle Add Player
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    await createNewUser({
      username: newUsername.trim(),
      pin: newPin.trim() || '1234',
      avatar: newAvatar
    });

    setUserSuccess(`¡Usuario "${newUsername}" creado con éxito con PIN ${newPin}!`);
    setNewUsername('');
    setNewPin('1234');
    setTimeout(() => setUserSuccess(''), 4000);
  };

  // Handle Give Card
  const handleGiveCard = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    const card = INITIAL_CARDS.find(c => c.id === selectedCardId);
    if (!card) return;

    const res = await giveSecretCard(selectedUserId, card);
    if (res.success) {
      setCardMsg({ type: 'success', text: `¡Carta "${card.name}" entregada correctamente! (Tiene ${res.count}/2 cartas)` });
    } else {
      setCardMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setCardMsg(null), 5000);
  };

  // Give Random Card to all eligible players
  const handleDistributeAll = async () => {
    let countGiven = 0;
    let skipped = 0;

    for (const player of players) {
      if ((player.cards || []).length < 2) {
        const randomCard = INITIAL_CARDS[Math.floor(Math.random() * INITIAL_CARDS.length)];
        await giveSecretCard(player.id, randomCard);
        countGiven++;
      } else {
        skipped++;
      }
    }

    setCardMsg({
      type: 'success',
      text: `Reparto Dominical Completo: Se entregó carta a ${countGiven} jugadores. (${skipped} no recibieron porque ya tenían 2 cartas acumuladas).`
    });
    setTimeout(() => setCardMsg(null), 6000);
  };

  // Save Sunday snapshot
  const handleTakeSnapshot = () => {
    const sorted = [...players].sort((a, b) => (b.xp || 0) - (a.xp || 0));
    const snap = saveSundaySnapshot(null, sorted);
    setSnapshotMsg(`📸 ¡Corte Dominical guardado como "${snap.name}"!`);
    setTimeout(() => setSnapshotMsg(''), 4000);
  };

  // Seed to Firebase Cloud
  const handleSeedCloud = async () => {
    if (!isLive) {
      onOpenFirebaseModal();
      return;
    }
    setCloudSyncMsg('Subiendo datos a Firebase Firestore...');
    const ok = await seedInitialUsersToFirebase();
    if (ok) {
      setCloudSyncMsg('☁️ ¡Base de datos en la nube actualizada y sincronizada!');
    } else {
      setCloudSyncMsg('Error al sincronizar con Firebase.');
    }
    setTimeout(() => setCloudSyncMsg(''), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Zona de Control Exclusiva</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Panel de Administrador
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Crea nuevos participantes, reparte las cartas secretas de cada Domingo, supervisa las metas de la Bomba de Tiempo y congela el ranking semanal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={handleTakeSnapshot}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Congelar Tabla Dominical</span>
            </button>

            <button
              onClick={handleSeedCloud}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <CloudUpload className="w-4 h-4" />
              <span>Sincronizar Cloud</span>
            </button>
          </div>
        </div>

        {snapshotMsg && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl">
            {snapshotMsg}
          </div>
        )}
        {cloudSyncMsg && (
          <div className="mt-4 p-3 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-xl">
            {cloudSyncMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. CREAR NUEVO PERFIL */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-white text-base">
              Crear Nuevo Perfil de Jugador
            </h3>
          </div>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Nombre o Nickname del Jugador:
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Ej: Fiera.del.fitness.99"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Código PIN Inicial:
                </label>
                <input
                  type="text"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="1234"
                  maxLength={8}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Elegir Avatar:
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setNewAvatar(av)}
                      className={`text-xl p-1.5 rounded-lg border transition-all ${
                        newAvatar === av
                          ? 'bg-emerald-500/20 border-emerald-500 scale-110'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {userSuccess && (
              <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                {userSuccess}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrar y Dar Acceso</span>
            </button>
          </form>
        </div>

        {/* 2. REPARTIDOR DOMINICAL DE CARTAS SECRETAS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-extrabold text-white text-base">
                Reparto de Cartas de Domingo 🃏
              </h3>
            </div>
            <button
              type="button"
              onClick={handleDistributeAll}
              className="text-[11px] font-bold text-purple-300 hover:text-white bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30 transition-colors"
            >
              Reparto Masivo
            </button>
          </div>

          <form onSubmit={handleGiveCard} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Selecciona Jugador:
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              >
                <option value="">-- Elige a quién entregar la carta --</option>
                {players.map((p) => {
                  const cardCount = (p.cards || []).length;
                  return (
                    <option key={p.id} value={p.id}>
                      {p.avatar} {p.username} ({cardCount}/2 cartas en mano)
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Selecciona la Carta Secreta:
              </label>
              <select
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {INITIAL_CARDS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.tagline})
                  </option>
                ))}
              </select>
            </div>

            {cardMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                cardMsg.type === 'success' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {cardMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Entregar Carta Secreta</span>
            </button>
          </form>
        </div>

      </div>

      {/* 3. LISTADO & GESTIÓN DE JUGADORES */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-white text-base">
              Participantes Registrados ({players.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Administra PINs y evalúa metas de Bomba de Tiempo
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {players.map((player) => {
            const bomb = player.timeBomb || { goal: '', status: 'pending' };
            const isEditingPin = editingUserId === player.id;

            return (
              <div key={player.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/40 transition-colors">
                
                {/* Info */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{player.avatar || "🏃"}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-extrabold text-white">
                        {player.username}
                      </p>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {player.xp} XP (Nivel {player.level})
                      </span>
                    </div>

                    {/* PIN display or edit */}
                    <div className="flex items-center gap-2 mt-1">
                      {isEditingPin ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editPinValue}
                            onChange={(e) => setEditPinValue(e.target.value)}
                            maxLength={8}
                            placeholder="Nuevo PIN"
                            className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-emerald-400 font-mono"
                          />
                          <button
                            onClick={async () => {
                              if (editPinValue.trim()) {
                                await updateUser(player.id, { pin: editPinValue.trim() });
                              }
                              setEditingUserId(null);
                            }}
                            className="p-1 bg-emerald-500 text-black rounded text-[10px] font-bold"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="p-1 text-slate-400 hover:text-white text-[10px]"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Key className="w-3 h-3 text-amber-400" />
                          <span>PIN: <strong className="font-mono text-slate-200">{player.pin || '1234'}</strong></span>
                          <button
                            onClick={() => {
                              setEditingUserId(player.id);
                              setEditPinValue(player.pin || '1234');
                            }}
                            className="text-[10px] text-emerald-400 underline hover:text-emerald-300 ml-1"
                          >
                            Cambiar
                          </button>
                        </div>
                      )}
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-purple-300">
                        🃏 {(player.cards || []).length}/2 cartas
                      </span>
                    </div>
                  </div>
                </div>

                {/* Time Bomb evaluation */}
                <div className="flex items-center gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 self-start md:self-auto">
                  <Timer className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Bomba de Tiempo:</p>
                    <p className="text-xs font-semibold text-slate-200 truncate max-w-[180px] sm:max-w-[220px]">
                      {bomb.goal || <span className="italic text-slate-500">Sin meta fijada</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => resolveTimeBombStatus(player, 'completed')}
                      title="Marcar como cumplida (+50 XP)"
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        bomb.status === 'completed'
                          ? 'bg-emerald-500 text-black'
                          : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                      }`}
                    >
                      +50
                    </button>
                    <button
                      onClick={() => resolveTimeBombStatus(player, 'failed')}
                      title="Marcar como fallida (-50 XP)"
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        bomb.status === 'failed'
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-950 text-rose-400 hover:bg-rose-900'
                      }`}
                    >
                      -50
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
