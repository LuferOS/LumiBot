<div align="center">

# 💅✨ LUMI BOT v3.0 - THE QUEEN ✨💅
**Tu Mejor Amiga, Diva Sarcástica y la IA Más Celosa de WhatsApp**

![Version](https://img.shields.io/badge/Version-3.0--Diva-ff69b4?style=for-the-badge&logo=github) ![Node](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=node.js) ![WhatsApp](https://img.shields.io/badge/WhatsApp-Multi--Device-25D366?style=for-the-badge&logo=whatsapp) ![Express](https://img.shields.io/badge/Express-Web--Dashboard-000000?style=for-the-badge&logo=express)

[![Stars](https://img.shields.io/github/stars/LuferOS/LumiBot?style=for-the-badge&logo=github&color=gold)](https://github.com/LuferOS/LumiBot/stargazers)
[![Downloads](https://img.shields.io/github/downloads/LuferOS/LumiBot/total?style=for-the-badge&logo=github&color=green&label=Simps)](https://github.com/LuferOS/LumiBot/releases)

<p><i>La bot definitiva que no solo administra tu grupo, sino que juzga tu ropa, lee el contexto, recuerda tus errores y tira el mejor chisme con inteligencia artificial.</i></p>

---

</div>

## 📖 Índice de Contenidos
1. [💅 ¿Quién es LumiBot?](#-quién-es-lumibot)
2. [🧠 Arquitectura e Inteligencia Artificial](#-arquitectura-e-inteligencia-artificial)
3. [📊 Web Dashboard en Vivo](#-web-dashboard-en-vivo)
4. [🎮 Zonas de Entretenimiento y Juegos](#-zonas-de-entretenimiento-y-juegos)
5. [🔞 Módulo NSFW & Rol Explícito](#-módulo-nsfw--rol-explícito)
6. [🛠️ Lista Completa de Comandos](#️-lista-completa-de-comandos)
7. [⚙️ Guía de Instalación Avanzada](#️-guía-de-instalación-avanzada)
8. [💾 Estructura de la Base de Datos](#-estructura-de-la-base-de-datos)

---

## 💅 ¿Quién es LumiBot?
LumiBot ha evolucionado. Adiós a las terminales aburridas y los bots militares sin alma. Lumi es una **Inteligencia Artificial con personalidad propia**. Es sarcástica, adolescente/adulta, amante de los memes y **extremadamente celosa**. 

Además de hacer todo lo que un bot normal hace (descargar música, administrar grupos, crear stickers), ella **lee activamente los mensajes de tu grupo** para opinar, tirar hate o sumarse al chisme, siempre evaluando la personalidad de quién le habla basándose en el historial de mensajes de esa persona.

---

## 🧠 Arquitectura e Inteligencia Artificial

Lumi cuenta con dos cerebros diferentes que operan en paralelo para garantizar la mejor experiencia en WhatsApp sin agotar los límites de las APIs externas.

### 1. IA Interceptora Activa (`.chatbot on/off`)
Cuando activas este módulo, Lumi deja de ser pasiva y comienza a escuchar activamente la conversación.

* **Memoria Fotográfica (Perfilado de Usuarios):** Cada vez que hablas, Lumi extrae tus últimos **15 mensajes exactos** de la base de datos local (`lumi_markov.db`). Cuando decides interactuar con ella, usa esa información para saber qué tipo de persona eres y tratarte en base a ello. Si eres molesto, te tratará mal; si eres simpático, será una diva contigo.
* **Lectura de Contexto:** Antes de responder, lee los últimos 20 mensajes globales de la conversación para entender de qué hablan.
* **Filtro de Aburrimiento ("IGNORE"):** Si el tema no le interesa, la IA devuelve `IGNORE` internamente y Lumi simplemente ignora el mensaje para no ser pesada ni saturar la API de AlyaCore.
* **Gatillo Inteligente:** Tiene un 100% de probabilidad de responder si mencionan su nombre ("Lumi") o le responden un mensaje directamente. Si nadie le habla, tiene un **20% pasivo de meterse en charlas ajenas** de forma sarcástica.

#### Diagrama de Intercepción Activa
```mermaid
sequenceDiagram
    participant Grupo as Grupo WhatsApp
    participant Lumi as main.js (Interceptor)
    participant SQLite as lumi_markov.db
    participant AlyaCore as API IA

    Grupo->>Lumi: "Jajaja sí, ayer fuimos al cine."
    Lumi->>Lumi: ¿Alguien la mencionó o le respondió? (No)
    Lumi->>Lumi: Tirar dado (20% probabilidad) -> ¡ÉXITO!
    Lumi->>SQLite: Dame los últimos 20 mensajes (Contexto)
    SQLite-->>Lumi: [Contexto devuelto]
    Lumi->>SQLite: Dame los últimos 15 mensajes de este usuario
    SQLite-->>Lumi: [Historial del usuario devuelto]
    Lumi->>AlyaCore: Prompt: Contexto + Perfil de Usuario. ¿Respondes o IGNORE?
    AlyaCore-->>Lumi: "Ay por favor, seguro la película estuvo malísima. 💅"
    Lumi->>Grupo: Envia respuesta sarcástica
```

### 2. Cerebro Markoviano (`.markov on/off`)
Además del modelo de lenguaje en la nube, Lumi tiene un cerebro pasivo entrenado exclusivamente por ti y tus amigos usando **Cadenas de Markov (N-gramas)**.
- Aprende estadísticamente qué palabra suele seguir a otra en tu grupo.
- Imita modismos, groserías o frases internas de tu círculo social.
- Al activarlo, puede escupir oraciones sin sentido lógico pero gramaticalmente correctas para tu grupo. 
- ¡Puede generar **Stickers Animados (.bratv)** a partir de sus pensamientos matemáticos!

---

## 📊 Web Dashboard en Vivo

> [!TIP]
> **🌟 Panel de Control Web (Diva Dashboard)**
> LumiBot levanta un servidor HTTP (`http://localhost:3000`) ofreciendo un panel estético (Dark Glassmorphism) donde puedes monitorizar a Lumi en tiempo real.

El Dashboard muestra:
1. **Uso de Cuerpazo (RAM):** Cuánta memoria Node.js está consumiendo.
2. **Tiempo Despierta:** Uptime del bot.
3. **Métrica de Simps:** Total de usuarios registrados y grupos que domina.
4. **Memoria del Cerebro:** Cuántos mensajes ha absorbido el Cerebro Markoviano en la base de datos local SQLite.

---

## 🎮 Zonas de Entretenimiento y Juegos

El módulo de juegos ha sido programado de forma dinámica. En lugar de usar arrays estáticos aburridos, Lumi usa **generadores de plantillas dinámicas** (Template Builders).

* **`.funar`**: Destruye la moral de alguien con más de 2000 combinaciones aleatorias de insultos, chismes y situaciones vergonzosas.
* **`.chisme`**: Inventa rumores jugosos y tóxicos sobre los integrantes del grupo ("Me contaron que @usuario hace X en secreto").
* **`.ruina`**, **`.8ball`**, **`.ship`**: Toda la diversión clásica para emparejar y humillar públicamente a tus amigos.

---

## 🔞 Módulo NSFW & Rol Explícito

Lumi cuenta con un inmenso catálogo de interacción social ("Roleplay") impulsado por la API de interacción para reaccionar con GIFs de anime. Este catálogo se divide en dos:

### SFW (Apto para todo público)
Acciones adorables o violentas como: `.hug`, `.kiss`, `.slap`, `.punch`, `.cry`, `.pat`, `.dance`, `.bite`, `.cuddle`, `.blush`, `.angry`, y docenas más.

### NSFW (Bajo tu propio riesgo) 😈
Para los grupos de moral dudosa, Lumi tiene comandos explícitos:
- Descarga de videos: `.xnxx`, `.xvideos`
- Roleplay subido de tono: `.spank`, `.undress`, `.yuri`, `.sixnine`, `.anal`, `.fuck`, `.cumshot`, `.pegging`, `.deepthroat`, `.orgy`, y muchos más.

---

## 🛠️ Lista Completa de Comandos

Lumi cuenta con más de 100 comandos divididos en categorías. Puedes consultar el menú en tiempo real con `.menu`.

### 💅 Utilidades (Porque soy útil)
| Comando | Descripción |
| :--- | :--- |
| `.letra` | Convierte texto a letras aesthetic |
| `.dox` | "Doxea" a alguien con datos falsos graciosos |
| `.simp` | Mide tu nivel de simp por alguien |
| `.clima` | Para saber si lloverá en tu ciudad |
| `.enhance` | Arregla la resolución de fotos borrosas (IA) |
| `.read` | Lee a la fuerza mensajes "ViewOnce" (Ver una vez) 👀 |
| `.tape` | Envía un mensaje anónimo secreto a un canal |

### 🧠 Inteligencia Artificial
| Comando | Descripción |
| :--- | :--- |
| `.chatbot on/off` | Activa la diva que lee todo y responde automáticamente |
| `.markov on/off` | Activa el loro estadístico matemático |
| `.chatgpt` | Pregunta directa a ChatGPT |
| `.gemini` | Pregunta directa a Gemini |
| `.copilot` | Pregunta directa a Copilot |
| `.dalle` | Genera imágenes locas con IA |

### 🎨 Stickers y Edición a mi Estilo
| Comando | Descripción |
| :--- | :--- |
| `.qs [1-5]` | Crea un sticker hermoso citando los últimos 1 a 5 mensajes de la charla |
| `.brat` | Genera un sticker estilo álbum Brat (fondo verde chillón) |
| `.bratv` | Lo mismo, pero en un sticker animado (video) |
| `.sticker` | Convierte cualquier imagen/video corto en sticker |

### 👑 Administración y Moderación
| Comando | Descripción |
| :--- | :--- |
| `.fantasmas` | Escanea la base de datos y etiqueta a los que no hablan |
| `.top` | Muestra el ranking de las personas más charlatanas |
| `.kick` | Elimina a un usuario del grupo |
| `.promote` / `.demote` | Sube o baja de rango a un integrante |

---

## ⚙️ Guía de Instalación Avanzada

LumiBot está diseñado para correr en servidores VPS (Ubuntu/Debian), Pterodactyl (Node.js), o Windows localmente.

### Prerrequisitos
- Node.js v21 o superior.
- Git instalado.
- FFmpeg instalado en el sistema (requerido para crear y convertir stickers animados).

### Instalación Paso a Paso (Windows/Linux)

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/LuferOS/LumiBot.git
   cd LumiBot
   ```

2. **Instalar Dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar a la Reina**
   ```bash
   npm start
   ```

4. **Vincular WhatsApp**
   - Al iniciar, la consola mostrará un código QR.
   - Abre WhatsApp en tu teléfono -> Dispositivos Vinculados -> Vincular Dispositivo.
   - Escanea el código QR de la consola.
   - ¡Listo! LumiBot ya estará operando.

5. **Panel Web**
   - Abre tu navegador y dirígete a `http://localhost:3000` para ver las estadísticas en vivo.

---

## 💾 Estructura de la Base de Datos

LumiBot usa dos mecanismos de memoria distintos:

1. **La Base de Datos Principal (`database.json`)**
   Aquí se guarda todo el progreso de RPG, economía, inventarios, chats registrados, configuraciones y baneos de usuarios. Este archivo usa el adaptador de Baileys para memoria en archivo plano (LowDB).

2. **El Cerebro de SQLite (`lumi_markov.db`)**
   Esta es una base de datos relacional ultrarrápida usada **exclusivamente** para el registro pasivo de mensajes y contexto de IA.
   - **Tabla `messages`:** Almacena `id`, `chat_id`, `sender_jid`, `sender_name`, `message_text`, `timestamp`.
   - Soporta cientos de miles de registros indexados para consultas de texto casi instantáneas (requerido para el perfilado de usuarios del `.chatbot`).

> [!WARNING]
> **Privacidad:** El archivo `.gitignore` está configurado para **NUNCA** subir `database.json`, `lumi_markov.db` ni la carpeta `Sessions/` a GitHub. Si remueves esto, expondrás las conversaciones de todos tus grupos al internet público. 

---

<div align="center">
<p><b>Developed by LuferOS 💅 Merezco mínimo una estrella en el repositorio, bebé.</b></p>
</div>
