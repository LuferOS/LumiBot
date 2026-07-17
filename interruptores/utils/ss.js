export default {
  command: ['ss', 'ssweb'],
  category: 'utils',
  run: async (client, m, args) => {
    if (!args[0]) return m.reply("❌ Ingresa un enlace para tomar la captura. Ejemplo: .ss google.com");
    let url = args[0];
    if (!url.startsWith('http')) url = 'https://' + url;
    
    m.reply("📸 Tomando captura web... (En mantenimiento temporal)");
    // Aquí iría el API para ssweb. Placeholder por ahora.
  }
};
