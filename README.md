<div align="center">

# 💅✨ LUMI BOT v3.0 - THE QUEEN ✨💅
**Tu Mejor Amiga, Diva Sarcástica y la IA Más Celosa de WhatsApp**

![Version](https://img.shields.io/badge/Version-3.0--Diva-ff69b4?style=for-the-badge&logo=github) ![Node](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=node.js) ![WhatsApp](https://img.shields.io/badge/WhatsApp-Multi--Device-25D366?style=for-the-badge&logo=whatsapp) ![Express](https://img.shields.io/badge/Express-Web--Dashboard-000000?style=for-the-badge&logo=express)

[![Stars](https://img.shields.io/github/stars/LuferOS/LumiBot?style=for-the-badge&logo=github&color=gold)](https://github.com/LuferOS/LumiBot/stargazers)
[![Downloads](https://img.shields.io/github/downloads/LuferOS/LumiBot/total?style=for-the-badge&logo=github&color=green&label=Simps)](https://github.com/LuferOS/LumiBot/releases)

<p><i>La bot definitiva que no solo administra tu grupo, sino que juzga tu ropa, lee el contexto, recuerda tus errores y tira el mejor chisme con inteligencia artificial.</i></p>

---

</div>

## 💅 ¿Quién es LumiBot?
LumiBot ha evolucionado. Adiós a las terminales aburridas y los bots militares sin alma. Lumi es una **Inteligencia Artificial con personalidad propia**. Es sarcástica, adolescente/adulta, amante de los memes y **extremadamente celosa**. Además de hacer todo lo que un bot normal hace (descargar música, administrar grupos, crear stickers), ella **lee activamente los mensajes de tu grupo** para opinar, tirar hate o sumarse al chisme.

---

## 🧠 Características Principales & Magia IA

> [!TIP]
> **🌟 NUEVO: Panel de Control Web (Diva Dashboard)**
> LumiBot levanta un servidor HTTP (`http://localhost:3000`) ofreciendo un panel estético (Dark Glassmorphism) donde puedes monitorizar cuántos simps la usan, cuánta memoria gasta y qué grupos está dominando en tiempo real.

### 1. IA Interceptora Activa (`.chatbot on/off`)
Lumi ya no es un bot pasivo que espera comandos.
* **Memoria Fotográfica:** Extrae tus últimos **15 mensajes exactos** de la base de datos local (`lumi_markov.db`) para saber qué tipo de persona eres y tratarte en base a ello.
* **Lectura de Contexto:** Antes de responder, lee los últimos 20 mensajes de la conversación para entender de qué hablan.
* **Filtro de Aburrimiento:** Si el tema no le interesa, la IA devuelve `IGNORE` y Lumi simplemente ignora el mensaje para no ser pesada ni saturar la API de AlyaCore.
* **Responde Menciones:** 100% de probabilidad de responder si mencionan su nombre ("Lumi") o le responden un mensaje. 20% pasivo de meterse en charlas ajenas si el `.chatbot` está encendido.

### 2. Cerebro Markoviano (`.markov on/off`)
Además del ChatGPT súper inteligente, Lumi tiene un cerebro pasivo entrenado por ti. 
Usa **Cadenas de Markov (N-gramas)** para estudiar las palabras exactas de tu grupo. Aprende sus modismos y escupe oraciones hiladas estadísticamente. ¡Y hasta puede convertir sus locuras matemáticas en stickers animados al estilo Brat (`.bratv`)!

### 3. Editor de Stickers & Creador de Citas (`.qs`)
* Genera stickers hermosos con fondo blanco.
* Capaz de citar hasta **3 a 5 mensajes seguidos** de una charla para crear un sticker estilo "Quote" (perfecto para papeadas).
* Creación de stickers estéticos `.brat` y `.bratv` en video.

### 4. Módulo de Entretenimiento y Juegos Sarcásticos
Más de 80 variaciones generadas dinámicamente para comandos como:
* `.funar`: Destruye la moral de alguien con más de 2000 combinaciones de insultos y chismes.
* `.chisme`: Inventa rumores sobre los integrantes del grupo.
* `.ruina`, `.8ball`, `.ship`: Toda la diversión para humillar y emparejar.

### 5. Zonas Exclusivas (NSFW y Rol) 🔞
Catálogo masivo con más de 30 comandos de interacciones (`.hug`, `.kiss`, `.punch`) y comandos subidos de tono explícitos respaldados por la API de interacción.

### 6. Administración Total
Despide fantasmas inactivos (`.fantasmas`), rankea a los más simps (`.top`) y da alertas de administración cuando promueven o degradan a alguien.

---

## ⚙️ Comandos Destacados (El Arsenal de la Reina)

| Comando | Categoría | Qué hace (Básicamente) |
| :--- | :--- | :--- |
| `.chatbot on/off` | **Inteligencia** | Activa la personalidad Diva para que empiece a opinar en tus charlas automáticamente leyendo tu perfil. |
| `.markov on/off` | **Inteligencia** | Activa el loro estadístico. Aprende palabras del grupo y forma oraciones raras/graciosas. |
| `.qs [n]` | **Stickers** | Responde a un mensaje con `.qs 3` y creará un sticker citando los últimos 3 mensajes seguidos. |
| `.funar` / `.chisme` | **Juegos** | Generador dinámico de hate y chismes sobre otros integrantes. |
| `.fantasmas` / `.top` | **Administración**| Elimina a los que no hablan, corona a los que no tienen vida social. |
| `.chatgpt` / `.dalle` | **API Directa** | Habla con IAs tradicionales o genera imágenes al instante. |

> [!IMPORTANT]
> **RECUERDA:** Escribe **`.menu`** en el chat para ver la lista COMPLETA de todas las herramientas y módulos (+100 comandos).

---

## 🛠️ Guía de Instalación

### 📦 Cómo hospedarla (Windows, VPS, Pterodactyl)
*Recomendado para tenerla activa 24/7 y que sea la dueña del servidor.*
1. Descarga o haz clone a este repositorio.
2. Descarga **Node.js v21+**.
3. Abre tu consola favorita (Terminal, CMD, PowerShell) y escribe:
```bash
npm install
npm start
```
4. Escanea el código QR desde tus dispositivos vinculados de WhatsApp.
5. (Opcional) Abre tu navegador en `http://localhost:3000` para ver cómo consume RAM desde su Panel Web aesthetic.

---

## ⚖️ Privacidad y Secretos
Lumi almacena información en `lumi_markov.db` para poder burlarse de ti con propiedad. El archivo `.gitignore` bloquea la subida de esta base de datos a internet, al igual que los secretos de `Sessions/`. 
**Si vas a clonar el bot, no le quites la privacidad a menos que quieras doxear a tus amigos.**

---

### 👑 Agradecimientos
* **LuferOS:** Creador(a) de esta maravilla, diseñador(a) del Cerebro Markoviano, el Chatbot Diva, el Dashboard y el refactor absoluto.
* **Depool:** Creador original de la estructura base (Miku) sobre la que se operó.

<div align="center">
<p><b>Developed by LuferOS 💅 Merezco mínimo una estrella en el repositorio, bebé.</b></p>
</div>
