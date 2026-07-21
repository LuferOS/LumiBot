import fetch from 'node-fetch';
import { getDevice } from 'baileys-next';
import fs from 'fs';
import axios from 'axios';
import moment from 'moment-timezone';

const menuObject = {
system: `┏━━〔 𝐒𝐲𝐬𝐭𝐞𝐦 〕━━⬣
┃ ➪ .𝐦𝐞𝐧𝐮 • .𝐡𝐞𝐥𝐩 • .𝐡
┃ ✦ Muestra el menú completo.

┃ ➪ .𝐩𝐢𝐧𝐠 • .𝐩 • .𝐥𝐚𝐭
┃ ✦ Velocidad del sistema.

┃ ➪ .𝐫𝐞𝐩𝐨𝐫𝐭 • .𝐛𝐮𝐠 • .𝐬𝐮𝐠𝐞𝐫𝐞𝐧𝐜𝐢𝐚
┃ ✦ Envía un reporte de bug o sugerencia a los desarrolladores del bot.

┃ ➪ .𝐫𝐞𝐩𝐨
┃ ✦ Mira el código fuente del bot (Link Preview).

┃ ➪ .𝐜𝐨𝐧𝐭𝐚𝐜𝐭𝐨
┃ ✦ Obtén mi contacto directo (VCard).

┃ ➪ .𝐛𝐨𝐭𝐨𝐧𝐞𝐬
┃ ✦ Prueba los botones interactivos (Native Flow).

┃ ➪ .𝐬𝐞𝐭𝐩𝐫𝐞𝐟𝐢𝐱 • .𝐩𝐫𝐞𝐟𝐢𝐱
┃ ✦ Modifica prefijo.

┃ ➪ .𝐬𝐞𝐭𝐩𝐫𝐢𝐦𝐚𝐫𝐲 • .𝐩𝐫𝐢𝐦𝐚𝐫𝐲
┃ ✦ Establece el bot primario para este grupo.

┃ ➪ .𝐬𝐭𝐨psub • .𝐥𝐨𝐠𝐨𝐮𝐭𝐬𝐮𝐛 • .𝐝𝐞𝐭𝐞𝐧𝐞𝐫𝐬𝐮𝐛
┃ ✦ Detiene y cierra la sesión de tu sub-bot.

┃ ➪ .𝐯𝐢𝐧𝐜𝐮𝐥𝐚𝐫 • .𝐬𝐞𝐫𝐛𝐨𝐭
┃ ✦ Vincula un sub-bot usando Código o QR (Menú interactivo).

┃ ➪ .𝐬𝐲𝐬𝐭𝐞𝐦 • .𝐬𝐲𝐬 • .𝐢𝐧𝐟𝐨
┃ ✦ Muestra componentes reales del sistema asignado.

┃ ➪ .𝐩𝐫𝐞𝐦𝐢𝐮𝐦 • .𝐩𝐫𝐨 • .𝐯𝐢𝐩
┃ ✦ Mira los beneficios y comandos VIP.`,

owner: `┏━━〔 𝐎𝐰𝐧𝐞𝐫 〕━━⬣
┃ ➪ .𝐬𝐭𝐚𝐭𝐮𝐬 • .𝐛𝐨𝐭𝐬𝐭𝐚𝐭𝐮𝐬 • .𝐞𝐬𝐭𝐚𝐝𝐨
┃ ✦ Muestra el estado del sistema y del bot.

┃ ➪ .𝐛𝐨𝐭𝐬 • .𝐬𝐮𝐛𝐛𝐨𝐭𝐬 • .𝐥𝐢𝐬𝐭𝐚-𝐛𝐨𝐭𝐬
┃ ✦ Muestra la lista de sub-bots activos/sesiones.

┃ ➪ .𝐝𝐞𝐥𝐨𝐰𝐧𝐞𝐫 • .𝐫𝐞𝐦𝐨𝐯𝐞𝐨𝐰𝐧𝐞𝐫 • .𝐫𝐦𝐨𝐰𝐧𝐞𝐫
┃ ✦ Quita un owner del bot.

┃ ➪ .𝐞𝐯𝐚𝐥 • .𝐞 • .𝐞𝐱𝐞𝐜𝐮𝐭𝐞
┃ ✦ Ejecuta cualquier código JavaScript en tiempo real capturando la consola.

┃ ➪ .𝐣𝐨𝐢𝐧 • .𝐮𝐧𝐢𝐫𝐬𝐞
┃ ✦ Une al bot a un grupo mediante un enlace.

┃ ➪ .𝐥𝐨𝐠𝐨𝐮𝐭 • .𝐜𝐞𝐫𝐫𝐚𝐫𝐬𝐞𝐬𝐢𝐨𝐧 • .𝐝𝐞𝐬𝐜𝐨𝐧𝐞𝐜𝐭𝐚𝐫
┃ ✦ Cierra sesión actual

┃ ➪ .𝐨𝐰𝐧𝐞𝐫𝐬 • .𝐝𝐮𝐞ñ𝐨𝐬 • .𝐩𝐫𝐨𝐩𝐢𝐞𝐭𝐚𝐫𝐢𝐨𝐬
┃ ✦ Muestra la información de los propietarios del bot.

┃ ➪ .𝐫 • .𝐫𝐮𝐧 • .𝐞𝐱𝐞𝐜
┃ ✦ Ejecuta comandos en la terminal del servidor.

┃ ➪ .𝐫𝐞𝐬𝐭𝐚𝐫𝐭 • .𝐫𝐞𝐢𝐧𝐢𝐜𝐢𝐚𝐫
┃ ✦ Reinicia el bot.

┃ ➪ .𝐬𝐞𝐭𝐨𝐰𝐧𝐞𝐫 • .𝐧𝐞𝐰𝐨𝐰𝐧𝐞𝐫 • .𝐚𝐝𝐝𝐨𝐰𝐧𝐞𝐫
┃ ✦ Añade un nuevo owner al bot con un rol opcional.

┃ ➪ .𝐮𝐩𝐝𝐚𝐭𝐞 • .𝐚𝐜𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐫
┃ ✦ Actualiza el bot desde el repositorio (Git) mostrando los cambios.

┃ ➪ .𝐛𝐚𝐧𝐛𝐨𝐭 • .𝐮𝐧𝐛𝐚𝐧𝐛𝐨𝐭
┃ ✦ Vetar a un usuario del bot.

┃ ➪ .𝐛𝐚𝐧𝐠𝐫𝐨𝐮𝐩 • .𝐮𝐧𝐛𝐚𝐧𝐠𝐫𝐨𝐮𝐩
┃ ✦ Vetar a un grupo del bot.

┃ ➪ .𝐚𝐝𝐝
┃ ✦ Forzar a añadir a alguien.

┃ ➪ .𝐛𝐨𝐭𝐬 [𝐨𝐧/𝐨𝐟𝐟]
┃ ✦ (👑 Solo LuferOS) Apaga o enciende todos los clones/subbots.

┃ ➪ .𝐜𝐨𝐝𝐞𝐨𝐧 / .𝐜𝐨𝐝𝐞𝐨𝐟𝐟
┃ ✦ (👑 Solo LuferOS) Abre o cierra el registro de subbots (.code/.qr).

┃ ➪ .𝐝𝐞𝐬𝐚𝐜𝐭𝐢𝐯𝐚𝐭𝐞
┃ ✦ (👑 Solo LuferOS) Apaga permanentemente el bot en un grupo específico.`,

group: `┏━━〔 𝐆𝐫𝐨𝐮𝐩 〕━━⬣
┃ ➪ .𝐚𝐥𝐞𝐫𝐭𝐬 • .𝐚𝐥𝐞𝐫𝐭𝐚𝐬 • .𝐚𝐝𝐦𝐢𝐧𝐚𝐥𝐞𝐫𝐭𝐬
┃ ✦ Activa o desactiva las notificaciones de administración del grupo.

┃ ➪ .𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤 • .𝐚𝐧𝐭𝐢𝐞𝐧𝐥𝐚𝐜𝐞 • .𝐚𝐧𝐭𝐢𝐠𝐩
┃ ✦ Bloquea enlaces de otros grupos

┃ ➪ .𝐚𝐧𝐭𝐢𝐭𝐨𝐱𝐢𝐜 • .𝐚𝐧𝐭𝐢𝐭𝐨𝐱𝐢𝐜𝐨𝐬 • .𝐚𝐧𝐭𝐢𝐭𝐱
┃ ✦ Sistema anti-toxicidad.

┃ ➪ .𝐛𝐨𝐭
┃ ✦ Enciende o apaga el bot en el grupo actual usando "on" u "off".

┃ ➪ .𝐛𝐲𝐞 • .𝐬𝐚𝐲𝐛𝐲𝐞 • .𝐝𝐞𝐬𝐩𝐞𝐝𝐢𝐝𝐚
┃ ✦ Activa o desactiva las despedidas automatitas.

┃ ➪ .𝐜𝐥𝐨𝐬𝐞 • .𝐜𝐞𝐫𝐫𝐚𝐫
┃ ✦ Cerrar el grupo.

┃ ➪ .𝐤𝐢𝐜𝐤𝐦𝐞 • .𝐚𝐮𝐭𝐨𝐤𝐢𝐜𝐤
┃ ✦ Auto-expúlsate del grupo.

┃ ➪ .𝐝𝐞𝐥 • .𝐝𝐞𝐥𝐞𝐭𝐞 • .𝐛𝐨𝐫𝐫𝐚𝐫
┃ ✦ Elimina mensajes (respondiendo a ellos).

┃ ➪ .𝐝𝐞𝐥𝐰𝐚𝐫𝐧 • .𝐮𝐧𝐰𝐚𝐫𝐧
┃ ✦ Quitar advertencia.

┃ ➪ .𝐝𝐞𝐦𝐨𝐭𝐞 • .𝐝𝐞𝐬𝐜𝐞𝐧𝐝𝐞𝐫 • .𝐪𝐮𝐢𝐭𝐚𝐫𝐝𝐚𝐝𝐦𝐢𝐧
┃ ✦ Quitar admin.

┃ ➪ .𝐢𝐧𝐟𝐨𝐠𝐫𝐨𝐮𝐩 • .𝐢𝐧𝐟𝐨𝐠𝐩 • .𝐢𝐧𝐠𝐩
┃ ✦ Muestra la información detallada del grupo.

┃ ➪ .𝐤𝐢𝐜𝐤 • .𝐬𝐚𝐜𝐚𝐫 • .𝐪𝐮𝐢𝐭𝐚𝐫
┃ ✦ Expulsa a un integrante o a varios por prefijo de país.

┃ ➪ .𝐥𝐢𝐧𝐤 • .𝐥𝐢𝐧𝐤𝐠𝐫𝐨𝐮𝐩 • .𝐠𝐫𝐮𝐩𝐨
┃ ✦ Link del grupo.

┃ ➪ .𝐨𝐧𝐥𝐲𝐚𝐝𝐦𝐢𝐧 • .𝐬𝐨𝐥𝐨𝐚𝐝𝐦𝐢𝐧 • .𝐚𝐝𝐦𝐢𝐧𝐨𝐧𝐥𝐲
┃ ✦ Solo admins usan el Bot.

┃ ➪ .𝐨𝐩𝐞𝐧 • .𝐚𝐛𝐫𝐢𝐫
┃ ✦ Abrir el grupo.

┃ ➪ .𝐩𝐫𝐨𝐦𝐨𝐭𝐞 • .𝐚𝐬𝐜𝐞𝐧𝐝𝐞𝐫 • .𝐡𝐚𝐜𝐞𝐫𝐚𝐝𝐦𝐢𝐧
┃ ✦ Dar admin

┃ ➪ .𝐬𝐞𝐭𝐰𝐚𝐫𝐧𝐥𝐢𝐦𝐢𝐭 • .𝐰𝐚𝐫𝐧𝐥𝐢𝐦𝐢𝐭
┃ ✦ Definir advertencias máximas.

┃ ➪ .𝐭𝐚𝐠 • .𝐭𝐠
┃ ✦ Mención invisible

┃ ➪ .𝐚𝐥𝐥 • .𝐭𝐨𝐝𝐨𝐬 • .𝐢𝐧𝐯𝐨𝐜𝐚𝐫
┃ ✦ Menciona todos

┃ ➪ .𝐭𝐨𝐩𝐚𝐜𝐭𝐢𝐯𝐨𝐬 • .𝐚𝐜𝐭𝐢𝐯𝐨𝐬
┃ ✦ Usuarios activos.

┃ ➪ .𝐭𝐨𝐩𝐢𝐧𝐚𝐜𝐭𝐢𝐯𝐨𝐬 • .𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚𝐬
┃ ✦ Ver inactivos.

┃ ➪ .𝐰𝐚𝐫𝐧 • .𝐚𝐝𝐯𝐞𝐫𝐭𝐢𝐫 • .𝐚𝐯𝐢𝐬𝐨
┃ ✦ Advertencias usuarios.

┃ ➪ .𝐰𝐞𝐥𝐜𝐨𝐦𝐞 • .𝐛𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐚 • .𝐬𝐞𝐭𝐰𝐞𝐥𝐜𝐨𝐦𝐞
┃ ✦ Activa o desactiva los mensajes de bienvenida.`,

fun: `┏━━〔 𝐅𝐮𝐧 〕━━⬣
┃ ➪ .8𝐛𝐚𝐥 • .8𝐛𝐚𝐥𝐥 • .8𝐛𝐨𝐥𝐚
┃ ✦ Responde una pregunta estilo bola 8 (8-ball).

┃ ➪ .𝐭𝐨𝐩
┃ ✦ Crea un top 10 aleatorio con un tema.

┃ ➪ .𝐜𝐡𝐢𝐬𝐦𝐞
┃ ✦ Te cuento un secreto turbio ☕

┃ ➪ .𝐫𝐮𝐢𝐧𝐚
┃ ✦ Lee cómo arruinarás tu vida 🔮

┃ ➪ .𝐯𝐞𝐫𝐝𝐚𝐝
┃ ✦ Verdad incómoda 🎯

┃ ➪ .𝐫𝐞𝐭𝐨
┃ ✦ Retos extremos 🥵

┃ ➪ .𝐜𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐝𝐚𝐝
┃ ✦ Medidor de amor 💖

┃ ➪ .𝐬𝐮𝐞𝐫𝐭𝐞
┃ ✦ Descubre tu suerte hoy 🍀`,

utils: `┏━━〔 𝐔𝐭𝐢𝐥𝐬 〕━━⬣
┃ ➪ .𝐫𝐞𝐚𝐝
┃ ✦ Extrae y reenvía medios de visualización única.

┃ ➪ .𝐭𝐨𝐢𝐦𝐠 • .𝐢𝐦𝐠 • .𝐭𝐨𝐢𝐦𝐚𝐠𝐞
┃ ✦ Extrae un sticker o gif view-once y lo convierte en imagen.

┃ ➪ .𝐥𝐞𝐭𝐫𝐚
┃ ✦ Letras aesthetic ✨

┃ ➪ .𝐝𝐨𝐱
┃ ✦ Doxear a alguien (falso) 💻

┃ ➪ .𝐜𝐥𝐢𝐦𝐚
┃ ✦ Pa saber si te vas a mojar

┃ ➪ .𝐭𝐫𝐚𝐧𝐬𝐥𝐚𝐭𝐞
┃ ✦ Traductor

┃ ➪ .𝐞𝐧𝐡𝐚𝐧𝐜𝐞
┃ ✦ Arregla tus fotos pixeladas 🤡

┃ ➪ .𝐬𝐬
┃ ✦ Tomar capturita web`,

downloads: `┏━━〔 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐬 〕━━⬣
┃ ➪ .𝐚𝐩𝐤 • .𝐚𝐩𝐤𝐝𝐥 • .𝐚𝐩𝐤𝐝
┃ ✦ Descarga archivos APK de Android desde Uptodown.

┃ ➪ .𝐟𝐛 • .𝐟𝐚𝐜𝐞𝐛𝐨𝐨𝐤 • .𝐟𝐛𝐝𝐥
┃ ✦ Descarga videos de Facebook / Reels.

┃ ➪ .𝐢𝐠 • .𝐢𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 • .𝐢𝐠𝐝𝐥
┃ ✦ Descarga videos, fotos, reels o historias de Instagram.

┃ ➪ .𝐬𝐜𝐩𝐥𝐚𝐲 • .𝐬𝐜𝐝𝐥 • .𝐬𝐜
┃ ✦ Descarga canciones de SoundCloud

┃ ➪ .𝐬𝐩𝐨𝐭𝐢𝐟𝐲 • .𝐬𝐩 • .𝐬𝐩𝐨𝐭𝐢𝐟𝐲𝐝𝐥
┃ ✦ Busca y descarga canciones de Spotify.

┃ ➪ .𝐭𝐢𝐤𝐭𝐨𝐤 • .𝐭𝐭 • .𝐭𝐤
┃ ✦ Busca y descarga videos de TikTok. Usa: .tiktok [enlace/búsqueda]

┃ ➪ .𝐭𝐤𝐚𝐮𝐝𝐢𝐨 • .𝐭𝐭𝐚𝐮𝐝𝐢𝐨 • .𝐭𝐭𝐚
┃ ✦ Busca y descarga audios de TikTok.

┃ ➪ .𝐲𝐭𝐦𝐩3 • .𝐩𝐥𝐚𝐲 • .𝐩𝐥𝐚𝐲𝐚𝐮𝐝𝐢𝐨
┃ ✦ Busca y descarga audio de YouTube.

┃ ➪ .𝐲𝐭𝐦𝐩4 • .𝐯𝐢𝐝𝐞𝐨 • .𝐩𝐥𝐚𝐲𝐯𝐢𝐝𝐞𝐨
┃ ✦ Busca y descarga video de YouTube.`,

search: `┏━━〔 𝐒𝐞𝐚𝐫𝐜𝐡 〕━━⬣
┃ ➪ .𝐩𝐢𝐧 • .𝐩𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭
┃ ✦ Busca imágenes en Pinterest.

┃ ➪ .𝐬𝐜𝐬𝐞𝐚𝐫𝐜𝐡 • .𝐬𝐜𝐛𝐮𝐬𝐜𝐚𝐫 • .𝐬𝐜𝐛
┃ ✦ Busca canciones de SoundCloud

┃ ➪ .𝐬𝐡𝐚𝐳𝐚𝐦 • .𝐰𝐡𝐚𝐭𝐬𝐨𝐧𝐠 • .𝐚𝐮𝐝𝐝
┃ ✦ Identifica una canción desde un audio o video citado. Usa: responde con .shazam

┃ ➪ .𝐬𝐩𝐬𝐞𝐚𝐫𝐜𝐡 • .𝐬𝐩𝐨𝐭𝐢𝐟𝐲𝐬𝐞𝐚𝐫𝐜𝐡 • .𝐬𝐩𝐬
┃ ✦ Busca canciones en Spotify.

┃ ➪ .𝐭𝐭𝐬𝐞𝐚𝐫𝐜𝐡 • .𝐭𝐢𝐤𝐭𝐨𝐤𝐬𝐞𝐚𝐫𝐜𝐡 • .𝐭𝐭𝐬
┃ ✦ Busca videos en TikTok.

┃ ➪ .𝐲𝐭𝐬𝐞𝐚𝐫𝐜𝐡 • .𝐲𝐭𝐬 • .𝐩𝐥𝐚𝐲𝐬
┃ ✦ Busca videos en YouTube. Usa: .yt [búsqueda]`,

stickers: `┏━━〔 𝐒𝐭𝐢𝐜𝐤𝐞𝐫 〕━━⬣
┃ ➪ .𝐛𝐫𝐚𝐭
┃ ✦ Convierte texto o mensaje respondido en sticker estilo brat.

┃ ➪ .𝐞𝐦𝐨𝐣𝐢𝐦𝐢𝐱 • .𝐞𝐤𝐢𝐭𝐜𝐡𝐞𝐧 • .𝐞𝐦𝐨𝐣𝐢𝐤𝐢𝐭𝐜𝐡𝐞𝐧
┃ ✦ Combina dos emojis y los convierte en un sticker usando Emoji Kitchen.

┃ ➪ .𝐬 • .𝐬𝐭𝐢𝐜𝐤𝐞𝐫 • .𝐬𝐭𝐢𝐤𝐞𝐫
┃ ✦ Convierte imágenes, videos o GIFs en stickers optimizados.

┃ ➪ .𝐪𝐮𝐨𝐭𝐞𝐬𝐭𝐢𝐜𝐤𝐞𝐫
┃ ✦ Crea sticker de cita (quote) 💭`,

games: `┏━━〔 𝐆𝐚𝐦𝐞𝐬 & 𝐁𝐞𝐭𝐬 〕━━⬣
┃ ➪ .𝐚𝐩𝐨𝐬𝐭𝐚𝐫 • .𝐛𝐞𝐭
┃ ✦ Apuesta tus coins (mínimo 10). Tienes un 50% de probabilidad de ganar el doble.

┃ ➪ .𝐪𝐮𝐢𝐳 • .𝐭𝐫𝐢𝐯𝐢𝐚
┃ ✦ Responde preguntas interactivas y gana coins y experiencia.

┃ ➪ .𝐭𝐨𝐩𝐪𝐮𝐢𝐳 • .𝐪𝐮𝐢𝐳𝐛𝐨𝐚𝐫𝐝
┃ ✦ Muestra a los más cerebritos del grupo/bot con más victorias en el Quiz.`,

profile: `┏━━〔 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 〕━━⬣
┃ ➪ .𝐝𝐢𝐯𝐨𝐫𝐜𝐞 • .𝐝𝐢𝐯𝐨𝐫𝐜𝐢𝐚𝐫 • .𝐬𝐞𝐩𝐚𝐫𝐚𝐫
┃ ✦ Solicitar divorcio.

┃ ➪ .𝐞𝐛𝐨𝐚𝐫𝐝 • .𝐱𝐩𝐫𝐚𝐧𝐤 • .𝐥𝐞𝐯𝐞𝐥𝐛𝐨𝐚𝐫𝐝
┃ ✦ Muestra el ranking de usuarios por XP y nivel.

┃ ➪ .𝐥𝐯𝐥 • .𝐥𝐞𝐯𝐞𝐥 • .𝐧𝐢𝐯𝐞𝐥
┃ ✦ Muestra tu nivel y experiencia en el grupo.

┃ ➪ .𝐦𝐚𝐫𝐫𝐲 • .𝐜𝐚𝐬𝐚𝐫 • .𝐦𝐚𝐭𝐫𝐢𝐦𝐨𝐧𝐢𝐨
┃ ✦ Solicitar matrimonio.

┃ ➪ .𝐩𝐟𝐩 • .𝐟𝐨𝐭𝐨 • .𝐟𝐨𝐭𝐨𝐩𝐞𝐫𝐟𝐢𝐥
┃ ✦ Muestra la foto de perfil de WhatsApp.

┃ ➪ .𝐩𝐫𝐨𝐟𝐢𝐥𝐞 • .𝐩𝐞𝐫𝐟𝐢𝐥 • .𝐦𝐞
┃ ✦ Muestra tu perfil o el de un usuario mencionado.

┃ ➪ .𝐬𝐞𝐭𝐛𝐢𝐫𝐭𝐡 • .𝐬𝐞𝐭𝐛𝐢𝐫𝐭 • .𝐜𝐮𝐦𝐩𝐥𝐞
┃ ✦ Define tu fecha de cumpleaños.

┃ ➪ .𝐬𝐞𝐭𝐠𝐞𝐧𝐫𝐞 • .𝐠é𝐧𝐞𝐫𝐨 • .𝐠𝐞𝐧𝐞𝐫𝐨
┃ ✦ Define tu género en el perfil del grupo.`,

interaction: `┏━━〔 𝐈𝐧𝐭𝐞𝐫𝐚𝐜𝐭𝐢𝐨𝐧 〕━━⬣
┃ ➪ .𝐦𝐢𝐞𝐝𝐨 • .𝐦𝐢𝐞𝐝𝐨𝐬
┃ ✦ Descubre el miedo de un usuario aleatorio.

┃ ➪ .𝐟𝐮𝐧𝐚𝐫
┃ ✦ Funa a alguien del grupo aleatoriamente.

┃ ➪ .𝐚𝐧𝐠𝐫𝐲 • .𝐞𝐧𝐨𝐣𝐚𝐝𝐨 • .𝐞𝐧𝐨𝐣𝐚𝐝𝐚
┃ ✦ Expresar Enojo

┃ ➪ .𝐛𝐚𝐤𝐚 • .𝐭𝐨𝐧𝐭𝐨 • .𝐭𝐨𝐧𝐭𝐚
┃ ✦ Llamar Tonto/a

┃ ➪ .𝐛𝐚𝐭𝐡 • .𝐛𝐚ñ𝐨 • .𝐛𝐚ñ𝐚𝐫
┃ ✦ Tomar un Baño

┃ ➪ .𝐛𝐢𝐭𝐞 • .𝐦𝐨𝐫𝐝𝐞𝐫 • .𝐦𝐨𝐫𝐝𝐢𝐬𝐜𝐨
┃ ✦ Dar una Mordida

┃ ➪ .𝐛𝐥𝐞𝐡 • .𝐥𝐞𝐧𝐠𝐮𝐚 • .𝐛𝐮𝐫𝐥𝐚𝐫𝐬𝐞
┃ ✦ Sacar la Lengua

┃ ➪ .𝐛𝐥𝐨𝐰𝐤𝐢𝐬𝐬 • .𝐥𝐚𝐧𝐳𝐚𝐫𝐛𝐞𝐬𝐨 • .𝐛𝐞𝐬𝐨𝐯𝐨𝐥𝐚𝐝𝐨
┃ ✦ Lanzar un Beso

┃ ➪ .𝐛𝐥𝐮𝐬𝐡 • .𝐬𝐨𝐧𝐫𝐨𝐣𝐚𝐫𝐬𝐞 • .𝐬𝐨𝐧𝐫𝐨𝐣𝐚𝐝𝐨
┃ ✦ Sonrojarse

┃ ➪ .𝐛𝐨𝐧𝐤 • .𝐠𝐨𝐥𝐩𝐞𝐚𝐫 • .𝐩𝐨𝐫𝐫𝐚𝐳𝐨
┃ ✦ Dar un Bonk

┃ ➪ .𝐛𝐨𝐫𝐞𝐝 • .𝐚𝐛𝐮𝐫𝐫𝐢𝐝𝐨 • .𝐚𝐛𝐮𝐫𝐫𝐢𝐝𝐚
┃ ✦ Expresar Aburrimiento

┃ ➪ .𝐛𝐮𝐥𝐥𝐲 • .𝐦𝐨𝐥𝐞𝐬𝐭𝐚𝐫 • .𝐢𝐧𝐭𝐢𝐦𝐢𝐝𝐚𝐫
┃ ✦ Molestar a Alguien

┃ ➪ .𝐜𝐚𝐥𝐥 • .𝐥𝐥𝐚𝐦𝐚𝐫 • .𝐥𝐥𝐚𝐦𝐚𝐝𝐚
┃ ✦ Llamar por Teléfono

┃ ➪ .𝐜𝐚𝐫𝐫𝐲 • .𝐜𝐚𝐫𝐠𝐚𝐫 • .𝐚𝐥𝐳𝐚𝐫
┃ ✦ Cargar a Alguien

┃ ➪ .𝐜𝐥𝐚𝐩 • .𝐚𝐩𝐥𝐚𝐮𝐝𝐢𝐫 • .𝐚𝐩𝐥𝐚𝐮𝐬𝐨
┃ ✦ Aplaudir

┃ ➪ .𝐜𝐨𝐟𝐟𝐞𝐞 • .𝐜𝐚𝐟𝐞 • .𝐭𝐨𝐦𝐚𝐫𝐜𝐚𝐟𝐞
┃ ✦ Tomar Café

┃ ➪ .𝐜𝐨𝐥𝐝 • .𝐟𝐫𝐢𝐨 • .𝐟𝐫í𝐨
┃ ✦ Tener Frío

┃ ➪ .𝐜𝐨𝐦𝐟𝐨𝐫𝐭 • .𝐜𝐨𝐧𝐬𝐨𝐥𝐚𝐫 • .𝐚𝐧𝐢𝐦𝐚𝐫
┃ ✦ Consolar a Alguien

┃ ➪ .𝐜𝐨𝐧𝐟𝐮𝐬𝐞𝐝 • .𝐜𝐨𝐧𝐟𝐮𝐧𝐝𝐢𝐝𝐨 • .𝐜𝐨𝐧𝐟𝐮𝐧𝐝𝐢𝐝𝐚
┃ ✦ Estar Confundido/a

┃ ➪ .𝐜𝐫𝐢𝐧𝐠𝐞 • .𝐩𝐞𝐧𝐚 • .𝐩𝐞𝐧𝐚𝐣𝐞𝐧𝐚
┃ ✦ Dar Cringe

┃ ➪ .𝐜𝐫𝐲 • .𝐥𝐥𝐨𝐫𝐚𝐫 • .𝐥𝐥𝐚𝐧𝐭𝐨
┃ ✦ Llorar

┃ ➪ .𝐜𝐮𝐝𝐝𝐥𝐞 • .𝐚𝐜𝐮𝐫𝐫𝐮𝐜𝐚𝐫𝐬𝐞 • .𝐚𝐜𝐮𝐫𝐫𝐮𝐜𝐚𝐫
┃ ✦ Acurrucarse

┃ ➪ .𝐜𝐮𝐫𝐢𝐨𝐮𝐬 • .𝐜𝐮𝐫𝐢𝐨𝐬𝐨 • .𝐜𝐮𝐫𝐢𝐨𝐬𝐚
┃ ✦ Estar Curioso/a

┃ ➪ .𝐝𝐚𝐧𝐜𝐞 • .𝐛𝐚𝐢𝐥𝐚𝐫 • .𝐛𝐚𝐢𝐥𝐞
┃ ✦ Bailar

┃ ➪ .𝐝𝐫𝐚𝐦𝐚𝐭𝐢𝐜 • .𝐝𝐫𝐚𝐦𝐦𝐚𝐭𝐢𝐜𝐨 • .𝐝𝐫𝐚𝐦𝐚𝐭𝐢𝐜𝐚
┃ ✦ Hacer un Drama

┃ ➪ .𝐝𝐫𝐚𝐰 • .𝐝𝐢𝐛𝐮𝐣𝐚𝐫 • .𝐝𝐢𝐛𝐮𝐣𝐨
┃ ✦ Dibujar

┃ ➪ .𝐝𝐫𝐮𝐧𝐤 • .𝐛𝐨𝐫𝐫𝐚𝐜𝐡𝐨 • .𝐛𝐨𝐫𝐫𝐚𝐜𝐡𝐚
┃ ✦ Estar Borracho/a

┃ ➪ .𝐞𝐚𝐭 • .𝐜𝐨𝐦𝐞𝐫 • .𝐜𝐨𝐦𝐢𝐞𝐧𝐝𝐨
┃ ✦ Comer

┃ ➪ .𝐟𝐚𝐜𝐞𝐩𝐚𝐥𝐦 • .𝐩𝐚𝐥𝐦𝐚𝐝𝐚 • .𝐝𝐞𝐜𝐞𝐩𝐜𝐢𝐨𝐧
┃ ✦ Hacer Facepalm

┃ ➪ .𝐟𝐞𝐞𝐝 • .𝐚𝐥𝐢𝐦𝐞𝐧𝐭𝐚𝐫 • .𝐝𝐚𝐫𝐜𝐨𝐦𝐞𝐫
┃ ✦ Alimentar a Alguien

┃ ➪ .𝐠𝐚𝐦𝐢𝐧𝐠 • .𝐣𝐮𝐠𝐚𝐫 • .𝐯𝐢𝐝𝐞𝐨𝐣𝐮𝐞𝐠𝐨𝐬
┃ ✦ Jugar Videojuegos

┃ ➪ .𝐡𝐚𝐧𝐝𝐡𝐨𝐥𝐝 • .𝐭𝐨𝐦𝐚𝐫𝐦𝐚𝐧𝐨 • .𝐚𝐠𝐚𝐫𝐫𝐚𝐫𝐦𝐚𝐧𝐨
┃ ✦ Tomarse de la Mano

┃ ➪ .𝐡𝐚𝐧𝐝𝐬𝐡𝐚𝐤𝐞 • .𝐚𝐩𝐫𝐞𝐭𝐨𝐧 • .𝐬𝐚𝐥𝐮𝐝𝐨𝐦𝐚𝐧𝐨
┃ ✦ Estrechar Manos

┃ ➪ .𝐡𝐚𝐩𝐩𝐲 • .𝐟𝐞𝐥𝐢𝐳 • .𝐚𝐥𝐞𝐠𝐫𝐞
┃ ✦ Estar Feliz

┃ ➪ .𝐡𝐞𝐚𝐭 • .𝐜𝐚𝐥𝐨𝐫 • .𝐬𝐨𝐟𝐨𝐜𝐚𝐝𝐨
┃ ✦ Tener Calor

┃ ➪ .𝐡𝐢𝐠𝐡𝐟𝐢𝐯𝐞 • .𝐜𝐡𝐨𝐜𝐚𝐫𝐦𝐚𝐧𝐨𝐬 • .𝐜𝐡𝐨𝐜𝐚𝐥𝐚
┃ ✦ Chocar los Cinco

┃ ➪ .𝐡𝐮𝐠 • .𝐚𝐛𝐫𝐚𝐳𝐚𝐫 • .𝐚𝐛𝐫𝐚𝐳𝐨
┃ ✦ Dar un Abrazo

┃ ➪ .𝐢𝐦𝐩𝐫𝐞𝐠𝐧𝐚𝐭𝐞 • .𝐞𝐦𝐛𝐚𝐫𝐚𝐳𝐚𝐫 • .𝐩𝐫𝐞ñ𝐚𝐫
┃ ✦ Embarazar

┃ ➪ .𝐣𝐮𝐦𝐩 • .𝐬𝐚𝐥𝐭𝐚𝐫 • .𝐬𝐚𝐥𝐭𝐨
┃ ✦ Saltar

┃ ➪ .𝐤𝐚𝐛𝐞𝐝𝐨𝐧 • .𝐫𝐢𝐧𝐜𝐨𝐧𝐞𝐚𝐫 • .𝐚𝐜𝐨𝐫𝐫𝐚𝐥𝐚𝐫
┃ ✦ Hacer Kabedon

┃ ➪ .𝐩𝐚𝐭𝐞𝐚𝐫 • .𝐩𝐚𝐭𝐚𝐝𝐚 • .𝐩𝐚𝐭𝐚𝐝𝐚𝐬
┃ ✦ Dar una Patada

┃ ➪ .𝐤𝐢𝐥𝐥 • .𝐦𝐚𝐭𝐚𝐫 • .𝐚𝐬𝐞𝐬𝐢𝐧𝐚𝐫
┃ ✦ Matar a Alguien

┃ ➪ .𝐤𝐢𝐬𝐬 • .𝐛𝐞𝐬𝐚𝐫 • .𝐛𝐞𝐬𝐨
┃ ✦ Dar un Beso

┃ ➪ .𝐤𝐢𝐬𝐬𝐜𝐡𝐞𝐞𝐤 • .𝐛𝐞𝐬𝐨𝐦𝐞𝐣𝐢𝐥𝐥𝐚 • .𝐛𝐞𝐬𝐨𝐜𝐚𝐜𝐡𝐞𝐭𝐞
┃ ✦ Besar en la Mejilla

┃ ➪ .𝐥𝐚𝐩𝐩𝐢𝐥𝐥𝐨𝐰 • .𝐫𝐞𝐠𝐚𝐳𝐨 • .𝐚𝐥𝐦𝐨𝐡𝐚𝐝𝐚𝐦𝐮𝐬𝐥𝐨
┃ ✦ Recostarse en el Regazo

┃ ➪ .𝐥𝐚𝐮𝐠𝐡 • .𝐫𝐞𝐢𝐫 • .𝐫𝐢𝐬𝐚
┃ ✦ Reírse

┃ ➪ .𝐥𝐢𝐜𝐤 • .𝐥𝐚𝐦𝐞𝐫 • .𝐥𝐚𝐦𝐢𝐝𝐚
┃ ✦ Lamer

┃ ➪ .𝐥𝐨𝐯𝐞 • .𝐚𝐦𝐚𝐫 • .𝐚𝐦𝐨𝐫
┃ ✦ Expresar Amor

┃ ➪ .𝐥𝐮𝐫𝐤 • .𝐚𝐜𝐞𝐜𝐡𝐚𝐫 • .𝐯𝐢𝐠𝐢𝐥𝐚𝐫
┃ ✦ Acechar

┃ ➪ .𝐧𝐨𝐝 • .𝐚𝐬𝐞𝐧𝐭𝐢𝐫 • .𝐬𝐢
┃ ✦ Asentir

┃ ➪ .𝐧𝐨𝐦 • .𝐦𝐚𝐬𝐭𝐢𝐜𝐚𝐫 • .𝐜𝐨𝐦𝐞𝐫𝐬𝐞
┃ ✦ Masticar

┃ ➪ .𝐧𝐨𝐩𝐞 • .𝐧𝐨 • .𝐧𝐞𝐠𝐚𝐫
┃ ✦ Decir que No

┃ ➪ .𝐧𝐲𝐚 • .𝐦𝐢𝐚𝐮 • .𝐠𝐚𝐭𝐨
┃ ✦ Hacer Nya

┃ ➪ .𝐩𝐚𝐭 • .𝐚𝐜𝐚𝐫𝐢𝐜𝐢𝐚𝐫 • .𝐜𝐚𝐫𝐢𝐜𝐢𝐚
┃ ✦ Acariciar la Cabeza

┃ ➪ .𝐩𝐞𝐜𝐤 • .𝐛𝐞𝐬𝐢𝐭𝐨 • .𝐩𝐢𝐜𝐨𝐭𝐚𝐳𝐨
┃ ✦ Dar un Besito

┃ ➪ .𝐩𝐞𝐞𝐤 • .𝐚𝐬𝐨𝐦𝐚𝐫𝐬𝐞 • .𝐦𝐢𝐫𝐚𝐫
┃ ✦ Asomarse

┃ ➪ .𝐩𝐨𝐤𝐞 • .𝐩𝐢𝐜𝐚𝐫 • .𝐦𝐨𝐥𝐞𝐬𝐭𝐚𝐫
┃ ✦ Picar con el Dedo

┃ ➪ .𝐩𝐨𝐮𝐭 • .𝐩𝐮𝐜𝐡𝐞𝐫𝐨 • .𝐛𝐞𝐫𝐫𝐢𝐧𝐜𝐡𝐞
┃ ✦ Hacer Pucheros

┃ ➪ .𝐩𝐮𝐧𝐜𝐡 • .𝐠𝐨𝐥𝐩𝐞𝐚𝐫 • .𝐩𝐮ñ𝐞𝐭𝐚𝐳𝐨
┃ ✦ Dar un Puñetazo

┃ ➪ .𝐩𝐮𝐬𝐡 • .𝐞𝐦𝐩𝐮𝐣𝐚𝐫 • .𝐞𝐦𝐩𝐮𝐣𝐞
┃ ✦ Empujar a Alguien

┃ ➪ .𝐫𝐮𝐧 • .𝐜𝐨𝐫𝐫𝐞𝐫 • .𝐡𝐮𝐢𝐫
┃ ✦ Correr

┃ ➪ .𝐬𝐚𝐝 • .𝐭𝐫𝐢𝐬𝐭𝐞 • .𝐭𝐫𝐢𝐬𝐭𝐞𝐳𝐚
┃ ✦ Estar Triste

┃ ➪ .𝐬𝐚𝐥𝐮𝐭𝐞 • .𝐬𝐚𝐥𝐮𝐝𝐚𝐫 • .𝐫𝐞𝐬𝐩𝐞𝐭𝐨
┃ ✦ Hacer Saludo Militar

┃ ➪ .𝐬𝐜𝐚𝐫𝐞𝐝 • .𝐚𝐬𝐮𝐬𝐭𝐚𝐝𝐨 • .𝐚𝐬𝐮𝐬𝐭𝐚𝐝𝐚
┃ ✦ Estar Asustado/a

┃ ➪ .𝐬𝐜𝐫𝐞𝐚𝐦 • .𝐠𝐫𝐢𝐭𝐚𝐫 • .𝐠𝐫𝐢𝐭𝐨
┃ ✦ Gritar

┃ ➪ .𝐬𝐞𝐝𝐮𝐜𝐞 • .𝐬𝐞𝐝𝐮𝐜𝐢𝐫 • .𝐜𝐨𝐪𝐮𝐞𝐭𝐞𝐚𝐫
┃ ✦ Seducir a Alguien

┃ ➪ .𝐬𝐡𝐚𝐤𝐞 • .𝐭𝐞𝐦𝐛𝐥𝐚𝐫 • .𝐬𝐚𝐜𝐮𝐝𝐢𝐫
┃ ✦ Sacudir o Temblar

┃ ➪ .𝐬𝐡𝐨𝐜𝐤𝐞𝐝 • .𝐬𝐨𝐫𝐩𝐫𝐞𝐧𝐝𝐢𝐝𝐨 • .𝐬𝐨𝐫𝐩𝐫𝐞𝐧𝐝𝐢𝐝𝐚
┃ ✦ Estar Sorprendido/a

┃ ➪ .𝐬𝐡𝐨𝐨𝐭 • .𝐝𝐢𝐬𝐩𝐚𝐫𝐚𝐫 • .𝐝𝐢𝐬𝐩𝐚𝐫o
┃ ✦ Disparar

┃ ➪ .𝐬𝐡𝐫𝐮𝐠 • .𝐞𝐧𝐜𝐨𝐠𝐞𝐫𝐬𝐞 • .𝐧𝐨𝐡𝐚𝐜𝐞𝐫
┃ ✦ Encogerse de Hombros

┃ ➪ .𝐬𝐡𝐲 • .𝐭𝐢𝐦𝐢𝐝𝐨 • .𝐭𝐢𝐦𝐢𝐝𝐚
┃ ✦ Estar Tímido/a

┃ ➪ .𝐬𝐢𝐧𝐠 • .𝐜𝐚𝐧𝐭𝐚𝐫 • .𝐜𝐚𝐧𝐭𝐨
┃ ✦ Cantar

┃ ➪ .𝐬𝐢𝐩 • .𝐬𝐨𝐫𝐛𝐨 • .𝐭𝐨𝐦𝐚𝐫
┃ ✦ Tomar un Sorbo

┃ ➪ .𝐬𝐥𝐚𝐩 • .𝐜𝐚𝐜𝐡𝐞𝐭𝐚𝐝𝐚 • .𝐛𝐨𝐟𝐞𝐭𝐚𝐝𝐚
┃ ✦ Dar una Bofetada

┃ ➪ .𝐬𝐥𝐞𝐞𝐩 • .𝐝𝐨𝐫𝐦𝐢𝐫 • .𝐝𝐮𝐫𝐦𝐢𝐞𝐧𝐝𝐨
┃ ✦ Dormir

┃ ➪ .𝐬𝐦𝐢𝐥𝐞 • .𝐬𝐨𝐧𝐫𝐞𝐢𝐫 • .𝐬𝐨𝐧𝐫𝐞í𝐫
┃ ✦ Sonreír

┃ ➪ .𝐬𝐦𝐨𝐤𝐞 • .𝐟𝐮𝐦𝐚𝐫 • .𝐜𝐢𝐠𝐚𝐫𝐫𝐨
┃ ✦ Fumar

┃ ➪ .𝐬𝐦𝐮𝐠 • .𝐩𝐫𝐞𝐬𝐮𝐦𝐢𝐝𝐨 • .𝐩𝐫𝐞𝐬𝐮𝐦𝐢𝐝𝐚
┃ ✦ Presumir

┃ ➪ .𝐬𝐧𝐢𝐟𝐟 • .𝐨𝐥𝐟𝐚𝐭𝐞𝐚𝐫 • .𝐨𝐥𝐞𝐫
┃ ✦ Oler u Olfatear

┃ ➪ .𝐬𝐧𝐮𝐠𝐠𝐥𝐞 • .𝐚𝐜𝐮𝐫𝐫𝐮𝐜𝐚𝐫𝐬𝐞 • .𝐦𝐢𝐦𝐨𝐬
┃ ✦ Acurrucarse con Alguien

┃ ➪ .𝐬𝐩𝐢𝐧 • .𝐠𝐢𝐫𝐚𝐫 • .𝐯𝐮𝐞𝐥𝐭𝐚𝐬
┃ ✦ Dar Vueltas

┃ ➪ .𝐬𝐩𝐢𝐭 • .𝐞𝐬𝐜𝐮𝐩𝐢𝐫 • .𝐬𝐚𝐥𝐢𝐯𝐚
┃ ✦ Escupir

┃ ➪ .𝐬𝐭𝐚𝐫𝐞 • .𝐦𝐢𝐫𝐚𝐫 • .𝐟𝐢𝐣𝐚𝐦𝐞𝐧𝐭𝐞
┃ ✦ Mirar Fijamente

┃ ➪ .𝐬𝐭𝐞𝐩 • .𝐩𝐢𝐬𝐚𝐫 • .𝐩𝐚𝐬𝐨
┃ ✦ Pisar

┃ ➪ .𝐭𝐚𝐛𝐥𝐞𝐟𝐥𝐢𝐩 • .𝐯𝐨𝐥𝐭𝐞𝐚𝐫𝐦𝐞𝐬𝐚 • .𝐭𝐢𝐫𝐚𝐫𝐥𝐥𝐚𝐯𝐞
┃ ✦ Voltear una Mesa

┃ ➪ .𝐭𝐞𝐞𝐡𝐞𝐞 • .𝐫𝐢𝐬𝐢𝐭𝐚 • .𝐫𝐢𝐬𝐚𝐞𝐣
┃ ✦ Hacer una Risita

┃ ➪ .𝐭𝐡𝐢𝐧𝐤 • .𝐩𝐞𝐧𝐬𝐚𝐫 • .𝐩𝐞𝐧𝐬𝐚𝐧𝐝𝐨
┃ ✦ Pensar

┃ ➪ .𝐭𝐡𝐢𝐧𝐤𝐡𝐚𝐫𝐝 • .𝐩𝐞𝐧𝐬𝐚𝐫𝐦𝐮𝐜𝐡𝐨 • .𝐫𝐞𝐟𝐥𝐞𝐱𝐢𝐨𝐧
┃ ✦ Pensar Intensamente

┃ ➪ .𝐭𝐡𝐮𝐦𝐛𝐬𝐮𝐩 • .𝐩𝐮𝐥𝐠𝐚𝐫𝐚𝐫𝐫𝐢𝐛𝐚 • .𝐛𝐢𝐞𝐧
┃ ✦ Aprobar con el Pulgar

┃ ➪ .𝐭𝐢𝐜𝐤𝐥𝐞 • .𝐜𝐨𝐬𝐪𝐮𝐢𝐥𝐥𝐚𝐬 • .𝐜𝐨𝐬𝐪𝐮𝐢𝐥𝐥𝐞𝐚𝐫
┃ ✦ Hacer Cosquillas

┃ ➪ .𝐭𝐫𝐢𝐩 • .𝐭𝐫𝐨𝐩𝐞𝐳𝐚𝐫 • .𝐭𝐫𝐨𝐩𝐢𝐞𝐳𝐨
┃ ✦ Tropezar

┃ ➪ .𝐰𝐚𝐠 • .𝐦𝐨𝐯𝐞𝐫𝐜𝐨𝐥𝐚 • .𝐜𝐨𝐥𝐢𝐭𝐚
┃ ✦ Mover la Cola

┃ ➪ .𝐰𝐚𝐥𝐤 • .𝐜𝐚𝐦𝐢𝐧𝐚𝐫 • .𝐚𝐧𝐝𝐚𝐫
┃ ✦ Caminar

┃ ➪ .𝐰𝐚𝐯𝐞 • .𝐬𝐚𝐥𝐮𝐝𝐚𝐫 • .𝐡𝐨𝐥𝐚
┃ ✦ Mandar Saludos

┃ ➪ .𝐰𝐢𝐧𝐤 • .𝐠𝐮𝐢ñ𝐚𝐫 • .𝐠𝐮𝐢ñ𝐨
┃ ✦ Guiñar un Ojo

┃ ➪ .𝐲𝐚𝐰𝐧 • .𝐛𝐨𝐬𝐭𝐞𝐳𝐚𝐫 • .𝐛𝐨𝐬𝐭𝐞𝐳𝐨
┃ ✦ Bostezar

┃ ➪ .𝐲𝐞𝐞𝐭 • .𝐥𝐚𝐧𝐳𝐚𝐫 • .𝐭𝐢𝐫𝐚𝐫
┃ ✦ Lanzar (Yeet)`,

ai: `┏━━〔 𝐀𝐈 〕━━⬣
┃ ➪ .𝐜𝐡𝐚𝐭𝐠𝐩𝐭 • .𝐢𝐚 • .𝐠𝐩𝐭
┃ ✦ Habla con ChatGPT

┃ ➪ .𝐜𝐨𝐩𝐢𝐥𝐨𝐭 • .𝐜𝐨𝐩𝐢 • .𝐜𝐩𝐭
┃ ✦ Habla con copilot

┃ ➪ .𝐠𝐞𝐦𝐢𝐧𝐢 • .𝐠𝐢𝐚 • .𝐠𝐚𝐢
┃ ✦ Habla con gemini`,

stalk: `┏━━〔 𝐒𝐭𝐚𝐥𝐤 〕━━⬣
┃ ➪ .𝐭𝐭𝐩 • .𝐬𝐭𝐚𝐥𝐤𝐭𝐭 • .𝐭𝐢𝐤𝐭𝐨𝐤𝐬𝐭𝐚𝐥𝐤
┃ ✦ Inspecciona perfiles de TikTok`,

nsfw: `┏━━〔 𝐍𝐒𝐅𝐖 〕━━⬣
┃ ➪ .𝐩𝐨𝐫𝐧𝐡𝐮𝐛
┃ ✦ Descargar de Pornhub 🎬

┃ ➪ .𝐱𝐧𝐱𝐱
┃ ✦ Descargar de XNXX 🎬

┃ ➪ .𝐱𝐯𝐢𝐝𝐞𝐨𝐬
┃ ✦ Descargar de XVideos 🎬

┃ ➪ .𝐰𝐚𝐢𝐟𝐮𝐧𝐬𝐟𝐰
┃ ✦ Waifus sin censura 🔞

┃ ➪ .𝐭𝐞𝐭𝐚𝐬
┃ ✦ Imagínate... 🍒

┃ ➪ .𝐩𝐮𝐬𝐬𝐲
┃ ✦ Solo para valientes 🐱

┃ ➪ .𝐛𝐢𝐤𝐢𝐧𝐢
┃ ✦ Fotos en traje de baño 👙

┃ ➪ .𝐜𝐚𝐥𝐚𝐭𝐚
┃ ✦ Imágenes ricolinas 🔥

┃ ➪ .𝐬𝐩𝐚𝐧𝐤
┃ ✦ Nalgada 🍑👋

┃ ➪ .𝐮𝐧𝐝𝐫𝐞𝐬𝐬
┃ ✦ Encuerar 👗

┃ ➪ .𝐲𝐮𝐫𝐢
┃ ✦ Tijeras ✂️

┃ ➪ .𝐬𝐢𝐱𝐧𝐢𝐧𝐞
┃ ✦ Hacer un 69 🔄

┃ ➪ .𝐚𝐧𝐚𝐥
┃ ✦ Anal 🚪

┃ ➪ .𝐟𝐮𝐜𝐤
┃ ✦ Coger 👉👌

┃ ➪ .𝐜𝐮𝐦𝐦𝐨𝐮𝐭𝐡
┃ ✦ Corrida en boca 👄💦

┃ ➪ .𝐬𝐮𝐜𝐤𝐛𝐨𝐨𝐛𝐬
┃ ✦ Chupar tetas 🍒

┃ ➪ .𝐜𝐮𝐦𝐬𝐡𝐨𝐭
┃ ✦ Corrida 💦

┃ ➪ .𝐥𝐢𝐜𝐤𝐩𝐮𝐬𝐬𝐲
┃ ✦ Lamer un coño 🐱

┃ ➪ .𝐥𝐢𝐜𝐤𝐝𝐢𝐜𝐤
┃ ✦ Lamer polla 🍆

┃ ➪ .𝐥𝐢𝐜𝐤𝐚𝐬𝐬
┃ ✦ Lamer culo 🍑

┃ ➪ .𝐡𝐚𝐧𝐝𝐣𝐨𝐛
┃ ✦ Paja manual 🖐️

┃ ➪ .𝐠𝐫𝐨𝐩𝐞
┃ ✦ Nalgas 👐

┃ ➪ .𝐜𝐮𝐦
┃ ✦ Violar 💦💦

┃ ➪ .𝐟𝐢𝐧𝐠𝐞𝐫𝐢𝐧𝐠
┃ ✦ Dedear ✌️

┃ ➪ .𝐜𝐫𝐞𝐚𝐦𝐩𝐢𝐞
┃ ✦ Corrida interna 🦃

┃ ➪ .𝐟𝐚𝐜𝐞𝐬𝐢𝐭𝐭𝐢𝐧𝐠
┃ ✦ Sentarse en la cara 🪑

┃ ➪ .𝐟𝐮𝐭𝐚𝐧𝐚𝐫𝐢
┃ ✦ Hermafrodita hentai 🍌👧

┃ ➪ .𝐩𝐞𝐠𝐠𝐢𝐧𝐠
┃ ✦ Penetración con arnés 🏇

┃ ➪ .𝐛𝐨𝐧𝐝𝐚𝐠𝐞
┃ ✦ Ataduras eróticas ⛓️

┃ ➪ .𝐝𝐞𝐞𝐩𝐭𝐡𝐫𝐨𝐚𝐭
┃ ✦ Garganta profunda 🗣️

┃ ➪ .𝐭𝐡𝐢𝐠𝐡𝐣𝐨𝐛
┃ ✦ Sexo entre muslos 🦵

┃ ➪ .𝐲𝐚𝐨𝐢
┃ ✦ Hentai gay masculino 👨‍❤️‍👨

┃ ➪ .𝐛𝐮𝐤𝐤𝐚𝐤𝐞
┃ ✦ Eyaculación múltiple sobre alguien 🚿

┃ ➪ .𝐨𝐫𝐠𝐲
┃ ✦ Orgía 🎊

┃ ➪ .𝐠𝐫𝐚𝐛𝐛𝐨𝐨𝐛𝐬
┃ ✦ Tetas 🍒

┃ ➪ .𝐛𝐥𝐨𝐰𝐣𝐨𝐛
┃ ✦ Mamar 😮🍆

┃ ➪ .𝐛𝐨𝐨𝐛𝐣𝐨𝐛
┃ ✦ Rusa 🍒🍆

┃ ➪ .𝐟𝐚𝐩
┃ ✦ Paja 🤚

┃ ➪ .𝐟𝐨𝐨𝐭𝐣𝐨𝐛
┃ ✦ Paja con los pies 🦶

┃ ➪ .𝐬𝐪𝐮𝐢𝐫𝐭𝐢𝐧𝐠
┃ ✦ Lluvia 🌧️

┃ ➪ .𝐡𝐞𝐧𝐭𝐚𝐢𝐥𝐚
┃ ✦ Descargar videos de HentaiLA 🎬`
};

const bodyMenu = `╭━━〔 𝐋𝐔𝐌𝐈𝐁𝐎𝐓 〕━━⬣
┃ > 𝐔𝐬𝐮𝐚𝐫𝐢𝐨: $sender
┃ > 𝐁𝐨𝐭: $namebot
┃ > 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: 3.2.0
┃ > 𝐎𝐰𝐧𝐞𝐫: $owner
┃ > 𝐏𝐫𝐞𝐟𝐢𝐱: [ $prefix ]
┃ > 𝐅𝐞𝐜𝐡𝐚: $tiempo
┃ > 𝐔𝐫𝐥: $link
╰━━━━━━━━━━━━━━━━━━⬣`;

function normalize(text = '') {
  text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  return text.endsWith('s') ? text.slice(0, -1) : text;
}

export default {
  command: ['allmenu', 'help', 'menu'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const now = new Date();
      const colombianTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const tiempo = colombianTime.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '');
      const tempo = moment.tz('America/Bogota').format('hh:mm A');
      
      const db = global.db?.data || {};
      const botId = client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botSettings = db.settings?.[botId] || {};
      
      const botname = botSettings.botname || 'LumiBOT';
      const namebot = botSettings.namebot || 'Lumi';
      const banner = botSettings.banner || 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
      const owner = botSettings.owner || '573118353868@s.whatsapp.net';
      const canalId = botSettings.id || '120363169294281316@newsletter';
      const canalName = botSettings.nameid || '💅 LUMIBOT GOSSIP 💅';
      
      // ⚡ LUMIBOT OVERRIDE: Enlace corregido sin errores de sintaxis
      const link = botSettings.link || 'https://whatsapp.com/channel/0029VbCyJt3LI8YXFbH7QU1G';
      
      const isOficialBot = botId === global.client?.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const botType = isOficialBot ? 'Reina Suprema' : 'Bebé Clon';
      const users = db.users ? Object.keys(db.users).length : 0;
      const device = getDevice(m.key.id);
      const sender = db.users?.[m.sender]?.name || m.pushName || 'Usuario';
      const time = client.uptime ? formatearMs(Date.now() - client.uptime) : "Desconocido";
      
      const alias = {
        anime: ['anime', 'reacciones'],
        downloads: ['downloads', 'descargas'],
        grupo: ['grupo', 'group'],
        nsfw: ['nsfw', '+18'],
        profile: ['profile', 'perfil'],
        sockets: ['sockets', 'bots'],
        stickers: ['stickers', 'sticker'],
        utils: ['utils', 'utilidades', 'herramientas'],
        fun: ['fun', 'diversion'],
        games: ['games', 'juegos', 'apuestas', 'bet', 'casino'],
        ai: ['ai', 'ia', 'bot'],
        owner: ['owner', 'dueño', 'creador', 'system'],
        search: ['search', 'buscar'],
        interaction: ['interaction', 'interaccion'],
        stalk: ['stalk', 'stalkear']
      };
      
      const input = normalize(args[0] || '');
      const cat = Object.keys(alias).find(k => alias[k].map(normalize).includes(input));
      
      const category = cat ? `[ Chisme de: ${cat.toUpperCase()} ]` : '[ STATUS: DIVA INALCANZABLE ]';
      
      if (args[0] && !cat) {      
        return m.reply(`🙄 *Bruh*... literal ese módulo *${args[0]}* ni existe o te lo inventaste.\n> 💅 Módulos reales: *${Object.keys(alias).join(', ')}*`);
      }
      
      const sections = menuObject || {};
      let content = '';
      if (cat) {
         if (cat === 'games') content = sections.games || '';
         else if (cat === 'grupo') content = sections.group || '';
         else if (cat === 'anime') content = sections.interaction || '';
         else content = sections[cat] || '';
      } else {
         content = Object.values(sections).map(s => String(s || '')).join('\n\n');
      }
      
      // Añadir la terminación solicitada al final del contenido
      let menu = bodyMenu + '\n\n' + content + '\n\n╰〔 ⚡ 𝐋𝐔𝐌𝐈𝐁𝐎𝐓 〕⬣';
      
      const replacements = {
        $owner: owner ? (!isNaN(owner.replace(/@s\.whatsapp\.net$/, '')) ? db.users?.[owner]?.name || owner.split('@')[0] : owner) : 'LuferOS',
        $botType: botType,
        $device: device,
        $tiempo: tiempo,
        $tempo: tempo,
        $users: users.toLocaleString(),
        $link: link,
        $cat: category,
        $sender: sender,
        $botname: botname,
        $namebot: namebot,
        $prefix: usedPrefix,
        $uptime: time
      };
      
      // ⚡ LUMIBOT OVERRIDE: Escape correcto del símbolo $ en el reemplazo global
      for (const [key, value] of Object.entries(replacements)) {
        menu = menu.replace(new RegExp(`\\$${key.substring(1)}`, 'g'), value);
      }
      
      let msgPayload = {
        contextInfo: {
          mentionedJid: [m.sender]
        }
      };

      if (banner.includes('.mp4') || banner.includes('.webm')) {
        msgPayload.video = { url: banner };
        msgPayload.gifPlayback = true;
        msgPayload.caption = menu;
      } else {
        msgPayload.image = { url: banner };
        msgPayload.caption = menu;
      }

      try {
        await client.sendMessage(m.chat, msgPayload, { quoted: m });
      } catch (mediaError) {
        console.error("[LUMIBOT DEBUG] Imgur Rate Limit (429) o error de imagen, enviando texto plano:", mediaError.message);
        await client.sendMessage(m.chat, { text: menu, contextInfo: msgPayload.contextInfo }, { quoted: m });
      }
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error crítico en menú:", e);
      await m.reply(`🙄 *Bruh...* literal el menú explotó y no quiso cargar.\n> 🚩 Excusas técnicas: *${e.message}*`);
    }
  }
};

function formatearMs(ms) {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  return [dias && `${dias}d`, `${horas % 24}h`, `${minutos % 60}m`, `${segundos % 60}s`].filter(Boolean).join(" ");
}
