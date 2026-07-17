export default {
  command: ['premium', 'pro', 'vip'],
  category: 'main',
  run: async (client, m, args, usedPrefix, command) => {
    const menu = `╭⋯ 💎 *LUMIBOT PREMIUM (PRO)* 💎 ⋯》
┊ Estos son los comandos exclusivos para 
┊ usuarios con suscripción activa.
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 🕵️‍♂️ *.investigar* [numero]
┊ ↳ Investiga la identidad real de una persona si se encuentra en bases de datos.
┊
┊ 📧 *.email* [correo]
┊ ↳ Verifica si un correo fue filtrado junto con sus contraseñas y sitios web.
┊
┊ 📍 *.dox*
┊ ↳ Doxea la ubicación real de una persona.
┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┊ 💳 *PLANES Y PRECIOS* 💳
┊ 🔹 Semanal: $4 USD
┊ 🔹 Mensual: $10 USD
┊ 🔹 Trimestral: $25 USD
┊ 🔹 Anual: $110 USD
┊
┊ ✨ *BENEFICIOS EXTRA*
┊ ✔️ Prioridad alta en reportes y soporte.
┊ ✔️ Acceso anticipado a nuevas funciones.
┊ ✔️ Sin límites de uso en comandos básicos.
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》

> ⚡ _Para adquirir la versión PRO, contacta al propietario del bot._`

    await m.react('💎')
    await client.reply(m.chat, menu, m)
  }
}
