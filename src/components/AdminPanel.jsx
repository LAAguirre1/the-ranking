import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  createNewUser, 
  updateUser, 
  giveSecretCard, 
  resolveTimeBombStatus, 
  saveSundaySnapshot, 
  seedInitialUsersToFirebase,
  createMission,
  deleteCustomMission,
  getCustomMissions
} from '../lib/storage';
import { INITIAL_CARDS } from '../data/missions';
import { RPG_CLASSES, getRpgClass } from '../data/rpgClasses';
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
  Timer,
  Swords,
  PlusCircle,
  Trash2,
  Flame,
  Dumbbell
} from 'lucide-react';

const MISSION_ICONS = [
  { label: 'Fuego', value: 'Flame' },
  { label: 'Pesas', value: 'Dumbbell' },
  { label: 'Rayo', value: 'Zap' },
  { label: 'Bici', value: 'Bike' },
  { label: 'Pasos', value: 'Footprints' },
  { label: 'Montaña', value: 'Mountain' },
  { label: 'Escudo', value: 'Shield' },
  { label: 'Cronómetro', value: 'Timer' },
  { label: 'Trofeo', value: 'Trophy' },
  { label: 'Cardio', value: 'Activity' }
];

export default function AdminPanel({ onOpenFirebaseModal }) {
  const { users } = useAuth();
  const { isLive } = getFirebaseInstance();

  // Create User State
  const [newUsername, setNewUsername] = useState('');
  const [newPin, setNewPin] = useState('1234');
  const [selectedClassId, setSelectedClassId] = useState('warrior');
  const [userSuccess, setUserSuccess] = useState('');

  // Create Mission State
  const [missionTitle, setMissionTitle] = useState('');
  const [missionCode, setMissionCode] = useState('');
  const [missionCategory, setMissionCategory] = useState('Fuerza & Resistencia');
  const [missionType, setMissionType] = useState('secondary'); // 'main' | 'secondary'
  const [missionTarget, setMissionTarget] = useState(50);
  const [missionUnit, setMissionUnit] = useState('reps');
  const [missionXp, setMissionXp] = useState(50);
  const [missionIcon, setMissionIcon] = useState('Flame');
  const [missionSuccess, setMissionSuccess] = useState('');

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

  const [activeAdminSubTab, setActiveAdminSubTab] = useState('missions'); // 'missions' | 'users' | 'cards'

  const players = users.filter(u => u.role !== 'admin');
  const customMissions = getCustomMissions();

  // Handle Add Player
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const chosenClass = getRpgClass(selectedClassId);

    await createNewUser({
      username: newUsername.trim(),
      pin: newPin.trim() || '1234',
      avatar: chosenClass.icon,
      rpgClassId: chosenClass.id,
      rpgClassName: chosenClass.name
    });

    setUserSuccess(`¡Héroe "${newUsername}" creado con éxito con clase ${chosenClass.name} y PIN ${newPin}!`);
    setNewUsername('');
    setNewPin('1234');
    setTimeout(() => setUserSuccess(''), 4000);
  };

  // Handle Create Mission
  const handleCreateMission = async (e) => {
    e.preventDefault();
    if (!missionTitle.trim()) return;

    await createMission({
      title: missionTitle.trim(),
      code: missionCode.trim() || (missionType === 'main' ? '★' : '•'),
      category: missionCategory.trim(),
      type: missionType,
      targetQty: Number(missionTarget),
      unit: missionUnit,
      xp: Number(missionXp),
      icon: missionIcon
    });

    setMissionSuccess(`¡Misión "${missionTitle}" creada y añadida al tablero! (+${missionXp} XP)`);
    setMissionTitle('');
    setMissionCode('');
    setTimeout(() => setMissionSuccess(''), 4000);
  };

  const handleDeleteCustomMission = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta misión creada?")) {
      await deleteCustomMission(id);
    }
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
      text: `Reparto Dominical: Se entregó carta a ${countGiven} jugadores. (${skipped} jugadores ya tenían 2 cartas acumuladas).`
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
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 border border-purple-800/40 shadow-xl">
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
              Crea nuevas misiones, registra atletas con clases RPG, reparte las cartas secretas y congela el podio dominical.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTakeSnapshot}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-all shadow-md"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Congelar Domingo</span>
            </button>

            <button
              onClick={handleSeedCloud}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all"
            >
              <CloudUpload className="w-4 h-4" />
              <span>Sincronizar Cloud</span>
            </button>
          </div>
        </div>

        {snapshotMsg && (
          <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl">
            {snapshotMsg}
          </div>
        )}
        {cloudSyncMsg && (
          <div className="mt-3 p-3 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-xl">
            {cloudSyncMsg}
          </div>
        )}

        {/* Sub-Tabs for Admin Sections */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-purple-900/40">
          <button
            onClick={() => setActiveAdminSubTab('missions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeAdminSubTab === 'missions'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Creador de Misiones ({customMissions.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminSubTab('users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeAdminSubTab === 'users'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Gestionar Atletas ({players.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminSubTab('cards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeAdminSubTab === 'cards'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reparto de Cartas</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: CREADOR DE MISIONES */}
      {/* ======================================================== */}
      {activeAdminSubTab === 'missions' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-5">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-extrabold text-white text-base">
                  Crear Nueva Misión para el Mes
                </h3>
                <p className="text-xs text-slate-400">
                  Agrega retos adicionales al tablero. Los atletas podrán registrar sus avances de inmediato.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateMission} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Título de la Misión:
                  </label>
                  <input
                    type="text"
                    value={missionTitle}
                    onChange={(e) => setMissionTitle(e.target.value)}
                    placeholder="Ej: 30 Dominadas estrictas, 15 km en patines..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Código / Letra:
                  </label>
                  <input
                    type="text"
                    value={missionCode}
                    onChange={(e) => setMissionCode(e.target.value)}
                    placeholder="Ej: F, G, k, l..."
                    maxLength={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-center text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Tipo de Misión:
                  </label>
                  <select
                    value={missionType}
                    onChange={(e) => {
                      const t = e.target.value;
                      setMissionType(t);
                      setMissionXp(t === 'main' ? 100 : 50);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="main">Principal (100 XP)</option>
                    <option value="secondary">Secundaria (50 XP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Meta Objetivo:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={missionTarget}
                    onChange={(e) => setMissionTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Unidad de Medida:
                  </label>
                  <select
                    value={missionUnit}
                    onChange={(e) => setMissionUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="reps">reps (repeticiones)</option>
                    <option value="km">km (kilómetros)</option>
                    <option value="min">min (minutos)</option>
                    <option value="series">series</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Recompensa XP:
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={missionXp}
                    onChange={(e) => setMissionXp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Categoría / Grupo Muscular:
                  </label>
                  <input
                    type="text"
                    value={missionCategory}
                    onChange={(e) => setMissionCategory(e.target.value)}
                    placeholder="Ej: Espalda, Calistenia, Piernas, Cardio..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Ícono Ilustrativo:
                  </label>
                  <select
                    value={missionIcon}
                    onChange={(e) => setMissionIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {MISSION_ICONS.map(i => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {missionSuccess && (
                <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  {missionSuccess}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar Misión en el Tablero</span>
              </button>
            </form>
          </div>

          {/* List of Custom Missions */}
          {customMissions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
                Misiones Creadas por el Administrador ({customMissions.length})
              </h4>
              <div className="divide-y divide-slate-800">
                {customMissions.map((cm) => (
                  <div key={cm.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {cm.code}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-white truncate">
                          {cm.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Meta: {cm.targetQty} {cm.unit} · {cm.category} · <strong className="text-emerald-400">+{cm.xp} XP</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCustomMission(cm.id)}
                      title="Eliminar misión"
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: GESTIONAR ATLETAS Y CREAR HÉROES RPG */}
      {/* ======================================================== */}
      {activeAdminSubTab === 'users' && (
        <div className="space-y-6">
          {/* Form to create Athlete */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-white text-base">
                Registrar Nuevo Atleta con Clase RPG
              </h3>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Nombre o Nickname:
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Ej: Fiera.del.asfalto.99"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Código PIN Inicial (por defecto 1234):
                  </label>
                  <input
                    type="text"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="1234"
                    maxLength={8}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* RPG Class Selector Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Selecciona su Clase RPG Inicial:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {RPG_CLASSES.map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        selectedClassId === cls.id
                          ? 'bg-slate-850 border-emerald-400 ring-1 ring-emerald-400'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xl">{cls.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{cls.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{cls.badge}</p>
                      </div>
                    </button>
                  ))}
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
                <span>Registrar Participante</span>
              </button>
            </form>
          </div>

          {/* Existing Players Table with PIN editing and Bomba de Tiempo management */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Participantes en Juego ({players.length})</span>
              </h3>
              <span className="text-xs text-slate-400">PINs y Bomba de Tiempo</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {players.map((player) => {
                const bomb = player.timeBomb || { goal: '', status: 'pending' };
                const isEditingPin = editingUserId === player.id;
                const heroClass = getRpgClass(player.rpgClassId);

                return (
                  <div key={player.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-850/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${heroClass.frameColor} p-0.5 flex-shrink-0 shadow`}>
                        <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center text-xl">
                          {player.avatar || heroClass.icon}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-extrabold text-white">
                            {player.username}
                          </p>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {heroClass.badge}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {player.xp} XP
                          </span>
                        </div>

                        {/* Inline PIN edit */}
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
                          {isEditingPin ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editPinValue}
                                onChange={(e) => setEditPinValue(e.target.value)}
                                maxLength={8}
                                className="w-20 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-emerald-400 font-mono"
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
                                OK
                              </button>
                            </div>
                          ) : (
                            <>
                              <Key className="w-3 h-3 text-amber-400" />
                              <span>PIN: <strong className="text-slate-200 font-mono">{player.pin || '1234'}</strong></span>
                              <button
                                onClick={() => {
                                  setEditingUserId(player.id);
                                  setEditPinValue(player.pin || '1234');
                                }}
                                className="text-[10px] text-emerald-400 underline ml-1"
                              >
                                Editar
                              </button>
                            </>
                          )}
                          <span className="text-slate-600">·</span>
                          <span className="text-purple-300">
                            🃏 {(player.cards || []).length}/2 cartas
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bomba de Tiempo resolution buttons */}
                    <div className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800 self-start md:self-auto">
                      <Timer className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <div className="min-w-0 pr-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Bomba:</p>
                        <p className="text-[11px] font-semibold text-slate-200 truncate max-w-[150px] sm:max-w-[190px]">
                          {bomb.goal || <span className="italic text-slate-500">Sin meta</span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => resolveTimeBombStatus(player, 'completed')}
                          className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${
                            bomb.status === 'completed'
                              ? 'bg-emerald-500 text-black'
                              : 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900'
                          }`}
                        >
                          +50
                        </button>
                        <button
                          onClick={() => resolveTimeBombStatus(player, 'failed')}
                          className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${
                            bomb.status === 'failed'
                              ? 'bg-rose-500 text-white'
                              : 'bg-rose-950/60 text-rose-400 hover:bg-rose-900'
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
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: REPARTO DE CARTAS SECRETAS */}
      {/* ======================================================== */}
      {activeAdminSubTab === 'cards' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-extrabold text-white text-base">
                Repartidor Dominical de Cartas 🃏
              </h3>
            </div>
            <button
              type="button"
              onClick={handleDistributeAll}
              className="text-xs font-bold text-purple-300 hover:text-white bg-purple-500/20 px-3 py-1.5 rounded-xl border border-purple-500/30 transition-colors"
            >
              Reparto Masivo Automático
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                required
              >
                <option value="">-- Elige un atleta --</option>
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
                Selecciona la Carta:
              </label>
              <select
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
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
      )}

    </div>
  );
}
