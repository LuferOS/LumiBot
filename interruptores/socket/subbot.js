import { startSubBot, MSG } from '../../nucleo/subs.js';
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
    // 🔥 LUMIBOT OVERRIDE: Respetar .bots off
    if (global.subbotsMuted) {
      return m.reply("╭⋯ ⚠️ *SUBBOTS APAGADOS* ⋯》\n┊ El sistema principal ha apagado los subbots.\n┊ No puedes generar códigos en este momento.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》");
    }

    const db = global.db.data;
    
    // Verificación de apertura de registros
    if (db.settings?.registrationEnabled === false) {
      return m.reply("╭⋯ ⚠️ *SISTEMA CERRADO* ⋯》\n┊ El sistema de subbots está temporalmente cerrado\n┊ por mantenimiento o falta de espacio.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》");
    }

    // Restricción a chat privado por seguridad
    if (m.isGroup) {
      return m.reply("╭⋯ 🛑 *POR SEGURIDAD* ⋯》\n┊ Este comando expone códigos sensibles.\n┊ Escríbeme al *privado* para generar tu subbot.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》");
    }

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}
    
    // Verificamos el cooldown (120 segundos)
    const cooldown = 120_000
    if (new Date() - (user.Subs || 0) < cooldown) {
      const remaining = Math.ceil((cooldown - (new Date() - user.Subs)) / 1000);
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      return m.reply(`⏳ *ESPERA*\n\nTiempo restante: *${timeStr}*\n\n> 💙 *LumiBot*`);
    }

    const isCode = /^(code)$/.test(command)
    const isCommands = /^(code|qr)$/.test(command)
    const isCommand = isCommands ? true : false
    
    // 🔥 CORRECCIÓN GLOBAL DE PAÍSES (SOPORTE INTERNACIONAL)
    let rawPhone = args[0] ? args[0].replace(/\D/g, '') : m.sender.split('@')[0];
    if (rawPhone.startsWith('0')) rawPhone = rawPhone.replace(/^0+/, '');
    if (rawPhone.length === 10 && rawPhone.startsWith('3')) rawPhone = '57' + rawPhone; // Colombia fallback
    if (rawPhone.startsWith('52') && !rawPhone.startsWith('521') && rawPhone.length >= 12) rawPhone = '521' + rawPhone.slice(2); // México
    if (rawPhone.startsWith('54') && !rawPhone.startsWith('549') && rawPhone.length >= 11) rawPhone = '549' + rawPhone.slice(2); // Argentina
    if (rawPhone.startsWith('56') && !rawPhone.startsWith('569') && rawPhone.length >= 10) rawPhone = '569' + rawPhone.slice(2); // Chile
    if (rawPhone.startsWith('598') && rawPhone.length === 11) rawPhone = rawPhone; // Uruguay

    const phone = rawPhone;
    
    // Uso de los nuevos textos hermosos del layout MSG
    const caption = isCode ? MSG.codeInstructions(usedPrefix, phone) : MSG.qrInstructions(usedPrefix);
    commandFlags[m.sender] = true;

    await startSubBot(m, client, caption, isCode, phone, m.chat, commandFlags, isCommand)
    
    // Registramos la marca de tiempo de la operación
    user.Subs = new Date() * 1
  }
};
