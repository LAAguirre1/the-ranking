import { INITIAL_USERS } from '../data/initialData';
import { MISSIONS_DATA } from '../data/missions';
import { getFirebaseInstance } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';

const LOCAL_STORAGE_USERS = 'the_ranking_users_v1';
const LOCAL_STORAGE_SNAPSHOTS = 'the_ranking_snapshots_v1';

// Initialize local data if empty
export function getLocalUsers() {
  const data = localStorage.getItem(LOCAL_STORAGE_USERS);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing local users', e);
    return INITIAL_USERS;
  }
}

export function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent('the-ranking-storage-update', { detail: users }));
}

// Calculate level based on XP: Level 1 starts at 0 XP, each 1000 XP adds 1 level
export function calculateLevel(xp) {
  if (xp < 0) return 1;
  return Math.floor(xp / MISSIONS_DATA.levelXpRequirement) + 1;
}

// Subscribe to real-time users (either Firestore or local dispatch)
export function subscribeUsers(onUpdate) {
  const { db, isLive } = getFirebaseInstance();

  if (isLive && db) {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (!snapshot.empty) {
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort users by XP descending
        users.sort((a, b) => b.xp - a.xp);
        onUpdate(users);
      } else {
        // If Firestore is empty, seed it with local initial users
        seedInitialUsersToFirebase(INITIAL_USERS).then(() => {
          onUpdate(INITIAL_USERS);
        });
      }
    }, (error) => {
      console.warn('Firestore subscription fallback to local:', error);
      onUpdate(getLocalUsers());
    });
    return unsub;
  }

  // Local fallback
  const handleLocalUpdate = (e) => {
    onUpdate(e.detail || getLocalUsers());
  };

  window.addEventListener('the-ranking-storage-update', handleLocalUpdate);
  window.addEventListener('storage', handleLocalUpdate);
  
  // Initial fire
  const initial = getLocalUsers();
  initial.sort((a, b) => b.xp - a.xp);
  onUpdate(initial);

  return () => {
    window.removeEventListener('the-ranking-storage-update', handleLocalUpdate);
    window.removeEventListener('storage', handleLocalUpdate);
  };
}

// Seed initial users into Firestore
export async function seedInitialUsersToFirebase(users = null) {
  const { db, isLive } = getFirebaseInstance();
  if (!isLive || !db) return false;

  const usersToSeed = users || getLocalUsers();
  for (const user of usersToSeed) {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, user, { merge: true });
  }
  return true;
}

// Save or Update a single user
export async function updateUser(userId, updates) {
  const { db, isLive } = getFirebaseInstance();

  if (isLive && db) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updates);
      return true;
    } catch (e) {
      console.error('Error updating in Firestore:', e);
    }
  }

  // Update in local storage
  const users = getLocalUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveLocalUsers(users);
    return true;
  }
  return false;
}

// Change user PIN
export async function changeUserPin(userId, newPin) {
  return await updateUser(userId, { pin: newPin.trim() });
}

// Admin: Add new player
export async function createNewUser(userData) {
  const { db, isLive } = getFirebaseInstance();
  const newId = `user_${Date.now()}`;
  const newUser = {
    id: newId,
    username: userData.username.trim(),
    pin: userData.pin ? userData.pin.trim() : "1234",
    role: "player",
    avatar: userData.avatar || "🏃",
    level: 1,
    xp: 0,
    timeBomb: {
      goal: "",
      status: "pending",
      completedAt: null
    },
    cards: [],
    progress: {},
    history: []
  };

  if (isLive && db) {
    await setDoc(doc(db, 'users', newId), newUser);
  }

  const users = getLocalUsers();
  users.push(newUser);
  saveLocalUsers(users);
  return newUser;
}

// Record mission progress (supports adding partial reps, e.g. +20 sentadillas)
export async function recordProgress(user, mission, addedQty) {
  const currentProgress = user.progress?.[mission.id] || {
    qty: 0,
    completed: false,
    completedAt: null
  };

  if (currentProgress.completed) {
    return { success: false, message: "Esta misión ya fue completada este mes." };
  }

  const newQty = Math.min(mission.targetQty, (currentProgress.qty || 0) + Number(addedQty));
  const justCompleted = newQty >= mission.targetQty;

  let newXp = user.xp || 0;
  let historyEntry = null;

  if (justCompleted && !currentProgress.completed) {
    newXp += mission.xp;
    historyEntry = {
      id: `hist_${Date.now()}`,
      type: "MISSION_COMPLETED",
      title: `Misión ${mission.code}: ${mission.title}`,
      xp: mission.xp,
      timestamp: new Date().toISOString()
    };
  }

  const newLevel = calculateLevel(newXp);
  const updatedProgress = {
    ...user.progress,
    [mission.id]: {
      qty: newQty,
      completed: justCompleted,
      completedAt: justCompleted ? new Date().toISOString() : null
    }
  };

  const updatedHistory = historyEntry 
    ? [historyEntry, ...(user.history || [])]
    : (user.history || []);

  const updates = {
    progress: updatedProgress,
    xp: newXp,
    level: newLevel,
    history: updatedHistory
  };

  await updateUser(user.id, updates);
  return {
    success: true,
    justCompleted,
    newQty,
    xpGained: justCompleted ? mission.xp : 0
  };
}

// Update or resolve Time Bomb mission
export async function updateTimeBombGoal(userId, goalText) {
  const users = getLocalUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return false;

  const updatedBomb = {
    ...(user.timeBomb || {}),
    goal: goalText,
    status: user.timeBomb?.status || "pending"
  };

  return await updateUser(userId, { timeBomb: updatedBomb });
}

export async function resolveTimeBombStatus(user, newStatus) {
  // newStatus can be: "pending" | "completed" | "failed"
  const currentStatus = user.timeBomb?.status || "pending";
  if (currentStatus === newStatus) return false;

  let xpDiff = 0;
  // Revert previous if applied
  if (currentStatus === "completed") xpDiff -= MISSIONS_DATA.timeBombReward;
  if (currentStatus === "failed") xpDiff -= MISSIONS_DATA.timeBombPenalty;

  // Apply new
  if (newStatus === "completed") {
    xpDiff += MISSIONS_DATA.timeBombReward; // +50
  } else if (newStatus === "failed") {
    // Check if user has active Shield card to cancel penalty
    const hasShield = (user.cards || []).some(c => c.specialEffect === 'CANCEL_BOMB_PENALTY');
    if (!hasShield) {
      xpDiff += MISSIONS_DATA.timeBombPenalty; // -50
    }
  }

  const newXp = Math.max(0, (user.xp || 0) + xpDiff);
  const newLevel = calculateLevel(newXp);

  const historyEntry = {
    id: `hist_${Date.now()}`,
    type: "TIME_BOMB_RESOLVED",
    title: `Bomba de Tiempo: ${newStatus === 'completed' ? '¡Cumplida! (+50 XP)' : 'Fallida (-50 XP)'}`,
    xp: xpDiff,
    timestamp: new Date().toISOString()
  };

  const updates = {
    timeBomb: {
      ...(user.timeBomb || {}),
      status: newStatus,
      completedAt: newStatus !== 'pending' ? new Date().toISOString() : null
    },
    xp: newXp,
    level: newLevel,
    history: [historyEntry, ...(user.history || [])]
  };

  return await updateUser(user.id, updates);
}

// Play a secret card
export async function playSecretCard(user, cardId) {
  const cardIndex = (user.cards || []).findIndex(c => c.id === cardId);
  if (cardIndex === -1) return { success: false, message: "No posees esta carta." };

  const card = user.cards[cardIndex];
  const remainingCards = [...user.cards];
  remainingCards.splice(cardIndex, 1);

  let xpGain = card.xpValue || 0;
  let newXp = (user.xp || 0) + xpGain;
  let newLevel = calculateLevel(newXp);

  const historyEntry = {
    id: `hist_${Date.now()}`,
    type: "CARD_PLAYED",
    title: `Jugó Carta Secreta: ${card.name}`,
    xp: xpGain,
    timestamp: new Date().toISOString()
  };

  const updates = {
    cards: remainingCards,
    xp: newXp,
    level: newLevel,
    history: [historyEntry, ...(user.history || [])]
  };

  await updateUser(user.id, updates);
  return { success: true, card, xpGain };
}

// Admin gives a secret card (enforcing limit: max 2 unplayed cards)
export async function giveSecretCard(userId, card) {
  const users = getLocalUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return { success: false, message: "Usuario no encontrado." };

  const currentCards = user.cards || [];
  if (currentCards.length >= 2) {
    return {
      success: false,
      message: `${user.username} ya tiene el máximo permitido de 2 cartas sin usar.`
    };
  }

  const updatedCards = [...currentCards, { ...card, instanceId: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 4)}` }];
  await updateUser(userId, { cards: updatedCards });
  return { success: true, count: updatedCards.length };
}

// Sunday Snapshots
export function getSundaySnapshots() {
  const data = localStorage.getItem(LOCAL_STORAGE_SNAPSHOTS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveSundaySnapshot(name, standings) {
  const snapshots = getSundaySnapshots();
  const newSnapshot = {
    id: `snap_${Date.now()}`,
    name: name || `Domingo ${new Date().toLocaleDateString('es-ES')}`,
    date: new Date().toISOString(),
    standings: standings.map((u, index) => ({
      rank: index + 1,
      userId: u.id,
      username: u.username,
      avatar: u.avatar,
      xp: u.xp,
      level: u.level
    }))
  };
  snapshots.unshift(newSnapshot);
  localStorage.setItem(LOCAL_STORAGE_SNAPSHOTS, JSON.stringify(snapshots));
  return newSnapshot;
}
