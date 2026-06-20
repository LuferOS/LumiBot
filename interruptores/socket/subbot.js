import { startSubBot } from '../../nucleo/subs.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
let commandFlags = {}

export default {
  command: ['code', 'qr'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    const db = global.db.data;
    const user = db.users[m.sender];
    let time = user.Subs + 120000 || 0;

    // ⚡ LUMIBOT OVERRIDE: Enfriamiento de seguridad
    if (new Date() - user.Subs < 30000) {
      return client.reply(m.chat, `╭⋯ 💅 *AY, TRANQUIL@* ⋯》\n┊ Literal acabas de pedir un código. Respira.\n┊ ⊳ Inténtalo de nuevo en: *${msToTime(time - new Date())}*\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m)
    }

    const subsPath = path.join(dirname, '../../Sessions/Subs')
    const subsCount = fs.existsSync(subsPath)
      ? fs.readdirSync(subsPath).filter((dir) => {
          const credsPath = path.join(subsPath, dir, 'creds.json')
          return fs.existsSync(credsPath)
        }).length : 0
    
    // Capacidad máxima de sub-nodos (Slaves)
    const maxSubs = 70
    if (subsCount >= maxSubs) {
      return client.reply(m.chat, `╭⋯ ⚠️ *CAPACIDAD LÍMITE* ⋯》\n┊ No hay ranuras disponibles en el servidor.\n┊ ⊳ Capacidad actual: *${subsCount}/${maxSubs}*\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m)
    }

    commandFlags[m.sender] = true

    // ⚡ LUMIBOT OVERRIDE: Instrucciones de diva de enlace (Modo DIVA 💅)
    const rtx = `╭⋯ 💅 *VINCULACIÓN VIP (CÓDIGO)* ⋯》
┊ A ver cariño, presta atención que no tengo todo el día.
┊ Si quieres un pedazo de mi poder, sigue estos pasos:
┊
┊ 1️⃣ Abre los *Ajustes* de tu WhatsApp (no te pierdas, es fácil).
┊ 2️⃣ Entra a *'Dispositivos vinculados'*.
┊ 3️⃣ Dale al botón que dice *'Vincular un dispositivo'*.
┊ 4️⃣ Busca abajo la opción *'Vincular con el número de teléfono'*.
┊
┊ [!] *ADVERTENCIA DE REINA:* 👑
┊ Te voy a escupir un código de un solo uso.
┊ Tienes que ponerlo RÁPIDO antes de que me aburra y lo cancele.
┊ ¡Muévete! 💅✨
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

    const rtx2 = `╭⋯ 💅 *VINCULACIÓN VIP (QR)* ⋯》
┊ Ay, ¿sigues usando QR? Bueno, saca la cámara:
┊
┊ 1️⃣ Abre los *Ajustes* de tu WhatsApp.
┊ 2️⃣ Entra a *'Dispositivos vinculados'*.
┊ 3️⃣ Dale al botón de *'Vincular un dispositivo'*.
┊ 4️⃣ Escanea este código de inmediato.
┊
┊ [!] *ADVERTENCIA DE REINA:* 👑
┊ Tienes exactamente 60 segundos antes de que esto expire.
┊ Si parpadeas, te lo pierdes. 💅✨
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`
    
    const isCode = /^(code)$/.test(command)
    const isCommands = /^(code|qr)$/.test(command)
    const isCommand = isCommands ? true : false
    const caption = isCode ? rtx : rtx2
    
    // 🔥 CORRECCIÓN GLOBAL DE PAÍSES (SOPORTE INTERNACIONAL)
    let rawPhone = args[0] ? args[0].replace(/\\D/g, '') : m.sender.split('@')[0];
    if (rawPhone.startsWith('0')) rawPhone = rawPhone.replace(/^0+/, '');
    if (rawPhone.length === 10 && rawPhone.startsWith('3')) rawPhone = '57' + rawPhone; // Colombia fallback
    if (rawPhone.startsWith('52') && !rawPhone.startsWith('521') && rawPhone.length >= 12) rawPhone = '521' + rawPhone.slice(2); // México
    if (rawPhone.startsWith('54') && !rawPhone.startsWith('549') && rawPhone.length >= 11) rawPhone = '549' + rawPhone.slice(2); // Argentina
    if (rawPhone.startsWith('56') && !rawPhone.startsWith('569') && rawPhone.length >= 10) rawPhone = '569' + rawPhone.slice(2); // Chile
    if (rawPhone.startsWith('598') && rawPhone.length === 11) rawPhone = rawPhone; // Uruguay

    const phone = rawPhone;

    await startSubBot(m, client, caption, isCode, phone, m.chat, commandFlags, isCommand)
    
    // Registramos la marca de tiempo de la operación
    user.Subs = new Date() * 1
  }
};

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes > 0 ? minutes : ''
  seconds = (seconds < 10 && minutes !== '') ? '0' + seconds : seconds
  
  if (minutes !== '') {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds} segundos`
  }
}
