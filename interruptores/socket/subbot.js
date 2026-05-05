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
    if (new Date() - user.Subs < 120000) {
      return client.reply(m.chat, `╭⋯ ❌ *ENFRIAMIENTO ACTIVO* ⋯》\n┊ Procedimiento bloqueado por seguridad.\n┊ ⊳ Reintento disponible en: *${msToTime(time - new Date())}*\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`, m)
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

    // ⚡ LUMIBOT OVERRIDE: Instrucciones tácticas de enlace
    const rtx = `╭⋯ 🛡️ *PROTOCOLO DE ENLACE: CÓDIGO* ⋯》
┊ Siga la secuencia para vincular su nodo:
┊
┊ 1. Ingrese a Ajustes de WhatsApp.
┊ 2. Seleccione 'Dispositivos vinculados'.
┊ 3. Seleccione 'Vincular un dispositivo'.
┊ 4. Pulse 'Vincular con el número de teléfono'.
┊
┊ [!] *NOTA DE SEGURIDAD:*
┊ Este código es de un solo uso y exclusivo para 
┊ el terminal que solicitó la secuencia.
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`

    const rtx2 = `╭⋯ 🛡️ *PROTOCOLO DE ENLACE: QR* ⋯》
┊ Siga la secuencia para vincular su nodo:
┊
┊ 1. Ingrese a Ajustes de WhatsApp.
┊ 2. Seleccione 'Dispositivos vinculados'.
┊ 3. Seleccione 'Vincular un dispositivo'.
┊ 4. Escanee el código QR proyectado.
┊
┊ [!] *ADVERTENCIA:*
┊ No se recomienda el uso de cuentas personales
┊ para el despliegue de sub-nodos esclavos.
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`
    
    const isCode = /^(code)$/.test(command)
    const isCommands = /^(code|qr)$/.test(command)
    const isCommand = isCommands ? true : false
    const caption = isCode ? rtx : rtx2
    const phone = args[0] ? args[0].replace(/\D/g, '') : m.sender.split('@')[0]

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
