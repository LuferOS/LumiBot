export default {
  command: ['repo', 'script', 'sc'],
  category: 'info',
  desc: 'Muestra el código fuente del bot con vista previa enriquecida.',
  run: async (client, m) => {
    const url = 'https://github.com/LuferOS/LumiBot';
    await client.sendMessage(m.chat, {
      text: '🤖 *LUMI BOT SCRIPT* 🤖\n\nEste bot es de código abierto. ¡Puedes ver, clonar y colaborar en el repositorio oficial!\n' + url,
      linkPreview: {
        'matched-text': url,
        title: '🌟 LuferOS/LumiBot - GitHub',
        description: 'WhatsApp Bot Multi Device - Powered by LuferOS Security & Baileys-next',
        previewType: 0
      }
    }, { quoted: m });
  }
};
