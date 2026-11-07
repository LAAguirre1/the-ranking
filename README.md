# 🏆 THE RANKING - Competencia Deportiva Noviembre

Aplicación web gamificada para seguimiento de retos físicos mensuales, diseñada para desplegarse gratis en **GitHub Pages** y sincronizar en tiempo real con **Firebase Cloud Firestore**.

---

## 👥 Usuarios Precargados (Código PIN Inicial: `1234`)

Todos los atletas están registrados con el código temporal `1234`. Cada participante puede cambiar su PIN a uno personal haciendo clic en la **llave 🔑** en la barra superior.

1. `Oveja.loca.25` (🐑)
2. `Princesa.avena.13` (🥣)
3. `Caballedo.chicorita.67` (🌿)
4. `Huevo.revuelto.33` (🍳)
5. `Chocolate.rico.19` (🍫)
6. `El.menos.fitness.02` (🛋️)
7. `Miau.miau` (🐱)
* **Administrador**: `Admin` (👑) con código `1234`.

---

## ⚡ Reglas del Juego Implementadas

1. **Nivel y Experiencia (XP)**:
   * Todos inician en **Nivel 1**.
   * Se requiere **1.000 XP** para subir de nivel ($\text{Nivel} = \lfloor \frac{\text{XP}}{1000} \rfloor + 1$).
2. **Misiones Principales (A – E / 100 XP c/u)** y **Secundarias (a – j / 50 XP c/u)**:
   * **Único cumplimiento**: No otorga más XP por repetir una vez alcanzado el 100%.
   * **Registro parcial acumulativo**: Los atletas pueden anotar cuántas repeticiones o kilómetros hicieron en el día (ej: 20 sentadillas hoy, 30 la próxima semana...). La recompensa de XP se acredita al llegar a la meta.
3. **Misión Bomba de Tiempo ⏱️**:
   * Cada jugador define su meta personal del mes.
   * Cumplirla otorga **+50 XP**.
   * No cumplirla descuenta **-50 XP**.
4. **Cartas Secretas de Domingo 🃏**:
   * Cada domingo el administrador reparte una carta secreta.
   * Límite en mano: **máximo 2 cartas sin usar**.
5. **Podio y Cortes Dominicales**:
   * Podio olímpico interactivo (🥇 1°, 🥈 2°, 🥉 3°).
   * El administrador puede congelar la tabla cada domingo para el registro histórico.

---

## 🚀 Cómo Ejecutar en Local

```bash
# Instalar dependencias (ya instaladas)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

---

## ☁️ Despliegue 100% Gratuito

### Opción A: Desplegar en GitHub Pages (Recomendado y Automático)
1. Sube este proyecto a un repositorio en GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: The Ranking Noviembre app"
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```
2. En GitHub, ve a **Settings > Pages > Build and deployment > Source** y elige **GitHub Actions**.
3. El workflow `.github/workflows/deploy.yml` compilará y desplegará la web en minutos en `https://TU_USUARIO.github.io/TU_REPOSITORIO/`.

### Opción B: Conectar Firebase Cloud Firestore (Gratis)
1. Entra a [Firebase Console](https://console.firebase.google.com/) y crea un proyecto gratuito (**Spark Plan**).
2. Ve a **Cloud Firestore** y créalo (en modo de prueba o con las reglas de `firestore.rules`).
3. En la configuración del proyecto, agrega una app web y copia el objeto `firebaseConfig`.
4. Abre la web de *The Ranking*, haz clic en el botón **"Conectar Firebase"** en la barra superior y pega la configuración.
5. Haz clic en **"Guardar y Conectar Cloud"**. Con eso, todos los jugadores verán los puntos y el podio actualizándose en tiempo real en sus celulares.
