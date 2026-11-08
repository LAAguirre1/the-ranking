import { INITIAL_CARDS } from './missions';

export const INITIAL_USERS = [
  {
    id: "user_oveja",
    username: "Oveja.loca.25",
    pin: "1234",
    role: "player",
    avatar: "⚔️",
    rpgClassId: "warrior",
    rpgClassName: "Guerrero del Acero",
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
    id: "user_princesa",
    username: "Princesa.avena.13",
    pin: "1234",
    role: "player",
    avatar: "⚔️",
    rpgClassId: "valkyrie",
    rpgClassName: "Valquiria Heroica",
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
    avatar: "🏹",
    rpgClassId: "ranger",
    rpgClassName: "Cazador Forestal",
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
    avatar: "🛡️",
    rpgClassId: "paladin",
    rpgClassName: "Paladín Sagrado",
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
    avatar: "🧙‍♂️",
    rpgClassId: "mage",
    rpgClassName: "Mago del Tiempo",
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
    avatar: "🥷",
    rpgClassId: "rogue",
    rpgClassName: "Asesino de las Sombras",
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
    avatar: "⚡",
    rpgClassId: "monk",
    rpgClassName: "Monje del Trueno",
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
    rpgClassId: "warlord",
    rpgClassName: "Comandante Supremo",
    level: 1,
    xp: 0,
    timeBomb: {
      goal: "Coordinar y conquistar el mes",
      status: "pending",
      completedAt: null
    },
    cards: [],
    progress: {},
    history: []
  }
];
