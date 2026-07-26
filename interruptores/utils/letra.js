export default {
  command: ['letra', 'aesthetic', 'font'],
  category: 'utils',
  run: async (client, m, args) => {
    if (!args.length) return m.reply('🙄 *Bruh, dime qué quieres que escriba* 💅\n> Literal, no leo mentes. Uso: .letra hola bb');
    const text = args.join(' ');
    // Convert to full-width text for aesthetic vaporwave feel
    const aesthetic = text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 33 && code <= 126) return String.fromCharCode(code + 0xFEE0);
      return c;
    }).join('');
    await m.reply(`✨ ${aesthetic} ✨`);
  }
}
