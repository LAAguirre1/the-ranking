export const RPG_CLASSES = [
  {
    id: "warrior",
    name: "Guerrero del Acero",
    title: "Tanque & Fuerza Pura",
    icon: "⚔️",
    badge: "Guerrero",
    frameColor: "from-amber-500 via-orange-600 to-red-600",
    bgGradient: "bg-gradient-to-br from-amber-950/60 to-red-950/40",
    border: "border-amber-500/50",
    glow: "shadow-amber-500/20",
    motto: "La fuerza no se negocia: se forja repetición a repetición."
  },
  {
    id: "paladin",
    name: "Paladín Sagrado",
    title: "Defensor Imparable",
    icon: "🛡️",
    badge: "Paladín",
    frameColor: "from-yellow-400 via-amber-300 to-yellow-600",
    bgGradient: "bg-gradient-to-br from-yellow-950/60 to-slate-900",
    border: "border-yellow-400/50",
    glow: "shadow-yellow-500/20",
    motto: "Disciplina inquebrantable y voluntad de hierro."
  },
  {
    id: "rogue",
    name: "Asesino de las Sombras",
    title: "Agilidad & Rapidez Extrema",
    icon: "🥷",
    badge: "Pícaro",
    frameColor: "from-emerald-400 via-teal-500 to-slate-800",
    bgGradient: "bg-gradient-to-br from-emerald-950/60 to-slate-950",
    border: "border-emerald-400/50",
    glow: "shadow-emerald-500/20",
    motto: "Rápido como el viento, letal como el cronómetro."
  },
  {
    id: "mage",
    name: "Mago del Tiempo",
    title: "Estratega de Resistencia",
    icon: "🧙‍♂️",
    badge: "Mago",
    frameColor: "from-indigo-500 via-purple-500 to-pink-500",
    bgGradient: "bg-gradient-to-br from-indigo-950/60 to-purple-950/40",
    border: "border-indigo-400/50",
    glow: "shadow-indigo-500/20",
    motto: "El esfuerzo constante conjura la verdadera transformación."
  },
  {
    id: "ranger",
    name: "Cazador Forestal",
    title: "Dominio de Running & Trail",
    icon: "🏹",
    badge: "Cazador",
    frameColor: "from-lime-400 via-emerald-600 to-teal-700",
    bgGradient: "bg-gradient-to-br from-lime-950/60 to-emerald-950/40",
    border: "border-lime-400/50",
    glow: "shadow-lime-500/20",
    motto: "Ningún sendero es demasiado largo si mantienes el paso."
  },
  {
    id: "dragon_knight",
    name: "Caballero del Dragón",
    title: "Potencia & Resistencia Mítica",
    icon: "🐉",
    badge: "Dragón",
    frameColor: "from-red-500 via-rose-600 to-orange-500",
    bgGradient: "bg-gradient-to-br from-red-950/60 to-orange-950/40",
    border: "border-red-500/50",
    glow: "shadow-red-500/20",
    motto: "El fuego del esfuerzo quema las excusas."
  },
  {
    id: "monk",
    name: "Monje del Trueno",
    title: "Calistenia & Control Total",
    icon: "⚡",
    badge: "Monje",
    frameColor: "from-cyan-400 via-blue-500 to-indigo-600",
    bgGradient: "bg-gradient-to-br from-cyan-950/60 to-blue-950/40",
    border: "border-cyan-400/50",
    glow: "shadow-cyan-500/20",
    motto: "Mente en calma, cuerpo de relámpago."
  },
  {
    id: "beast",
    name: "Berserker Bestial",
    title: "Explosividad & Furia Cardio",
    icon: "🐺",
    badge: "Berserker",
    frameColor: "from-orange-500 via-red-600 to-rose-700",
    bgGradient: "bg-gradient-to-br from-orange-950/60 to-rose-950/40",
    border: "border-orange-500/50",
    glow: "shadow-orange-500/20",
    motto: "Sin piedad contra el cansancio."
  },
  {
    id: "valkyrie",
    name: "Valquiria Heroica",
    title: "Espíritu de Campeona",
    icon: "⚔️",
    badge: "Valquiria",
    frameColor: "from-fuchsia-400 via-purple-500 to-cyan-400",
    bgGradient: "bg-gradient-to-br from-fuchsia-950/60 to-purple-950/40",
    border: "border-fuchsia-400/50",
    glow: "shadow-fuchsia-500/20",
    motto: "Honor, constancia y victoria en el podio."
  },
  {
    id: "titan",
    name: "Titán Acorazado",
    title: "Levantador Colosal",
    icon: "🦾",
    badge: "Titán",
    frameColor: "from-slate-400 via-zinc-500 to-slate-700",
    bgGradient: "bg-gradient-to-br from-slate-900 to-zinc-900",
    border: "border-slate-400/50",
    glow: "shadow-slate-500/20",
    motto: "Estructura de hierro, corazón implacable."
  },
  {
    id: "warlord",
    name: "Comandante Supremo",
    title: "Líder de la Conquista",
    icon: "👑",
    badge: "Líder",
    frameColor: "from-amber-400 via-yellow-500 to-amber-600",
    bgGradient: "bg-gradient-to-br from-amber-950/60 to-yellow-950/40",
    border: "border-amber-400/50",
    glow: "shadow-amber-500/20",
    motto: "Comandando la tabla hacia el primer puesto."
  },
  {
    id: "necromancer",
    name: "Hechicero del Renacer",
    title: "Resurrección Post-Agujetas",
    icon: "🔮",
    badge: "Renacido",
    frameColor: "from-violet-500 via-purple-600 to-slate-900",
    bgGradient: "bg-gradient-to-br from-violet-950/60 to-purple-950/40",
    border: "border-violet-500/50",
    glow: "shadow-violet-500/20",
    motto: "Caer está permitido, rendirse jamás."
  }
];

export function getRpgClass(classId) {
  return RPG_CLASSES.find(c => c.id === classId) || RPG_CLASSES[0];
}
