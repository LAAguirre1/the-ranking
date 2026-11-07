import { INITIAL_CARDS } from './missions';

export const INITIAL_USERS = [
  {
    id: "user_oveja",
    username: "Oveja.loca.25",
    pin: "1234",
    role: "player",
    avatar: "🐑",
    level: 1,
    xp: 0,
    timeBomb: {
      goal: "",
      status: "pending", // "pending" | "completed" | "failed"
      completedAt: null
    },
    cards: [INITIAL_CARDS[0]], // Le damos 1 carta de bienvenida
    progress: {},
    history: []
  },
  {
    id: "user_princesa",
    username: "Princesa.avena.13",
    pin: "1234",
    role: "player",
    avatar: "🥣",
    level: 1,
    xp: 0,
    timeBomb: {
      goal: "",
      status: "pending",
      completedAt: null
    },
    cards: [INITIAL_CARDS[1]],
    progress: {},
    history: []
  },
  {
    id: "user_caballedo",
    username: "Caballedo.chicorita.67",
    pin: "1234",
    role: "player",
    avatar: "🌿",
    level: 1,
    xp: 0,
    timeBomb: {
      goal: "",
      status: "pending",
      completedAt: null
    },
    cards: [INITIAL_CARDS[2]],
    progress: {},
    history: []
  },
  {
    id: "user_huevo",
    username: "Huevo.revuelto.33",
    pin: "1234",
    role: "player",
    avatar: "🍳",
    level: 1,
    xp: 0,
    timeBomb: {
      goal: "",
      status: "pending",
      completedAt: null
    },
    cards: [INITIAL_CARDS[3]],
    progress: {},
    history: []
  },
  {
    id: "user_chocolate",
    username: "Chocolate.rico.19",
    pin: "1234",
    role: "player",
    avatar: "🍫",
    level: 1,
    xp: 0,
    timeBomb: {
      goal: "",
      status: "pending",
      completedAt: null
    },
    cards: [INITIAL_CARDS[0]],
    progress: {},
    history: []
  },
  {
    id: "user_elmenos",
    username: "El.menos.fitness.02",
    pin: "1234",
    role: "player",
    avatar: "🛋️",
    level: 1,
    xp: 0,
    timeBomb: {
      goal: "",
      status: "pending",
      completedAt: null
    },
    cards: [INITIAL_CARDS[1]],
    progress: {},
    history: []
  },
  {
    id: "user_miau",
    username: "Miau.miau",
    pin: "1234",
    role: "player",
    avatar: "🐱",
    level: 1,
    xp: 0,
    timeBomb: {
      goal: "",
      status: "pending",
      completedAt: null
    },
    cards: [INITIAL_CARDS[2]],
    progress: {},
    history: []
  },
  {
    id: "user_admin",
    username: "Admin",
    pin: "1234",
    role: "admin",
    avatar: "👑",
    level: 1,
    xp: 0,
    timeBomb: {
      goal: "Coordinar y ganar el mes",
      status: "pending",
      completedAt: null
    },
    cards: [],
    progress: {},
    history: []
  }
];
