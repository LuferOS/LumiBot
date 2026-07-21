export default {
  command: ['botones', 'opciones'],
  category: 'info',
  desc: 'Demostración de los botones de Native Flow (Baileys-next)',
  run: async (client, m) => {
    await client.sendMessage(m.chat, {
      text: '⚡ *PRUEBA DE NATIVE FLOW* ⚡\n\nEstos son botones interactivos de WhatsApp generados por la v7 de Baileys-next.',
      footer: 'LumiBot x Baileys-next',
      buttons: [
        { text: '📋 Menú', id: '.menu' },
        { text: '⚡ Ping', id: '.ping' },
        { 
           text: '🔧 Más Opciones', 
           sections: [{
              title: '✨ Comandos Destacados',
              rows: [
                 { title: '📦 Repositorio', id: '.repo' },
                 { title: '👤 Contacto', id: '.contacto' }
              ]
           }]
        }
      ]
    }, { quoted: m });
  }
};
