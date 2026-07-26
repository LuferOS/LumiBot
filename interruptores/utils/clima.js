import axios from 'axios';

export default {
  command: ["clima", "weather", "tiempo"],
  category: "utilidad",
  desc: "Extrae el reporte meteorológico OSINT de una ciudad.",
  run: async (sock, m, args) => {
    if (!args[0]) return m.reply("❌ Error: Debes especificar una ciudad. Ejemplo: *.clima Bogota*");
    
    const ciudad = args.join(' ');
    await m.reply(`Buscando satélites meteorológicos sobre: ${ciudad}...`);
    
    try {
      const res = await axios.get(`https://wttr.in/${encodeURIComponent(ciudad)}?format=3`);
      await m.reply(`*🌍 CLIMA OSINT*\n\n${res.data.trim()}`);
    } catch (e) {
      await m.reply("❌ Fallo en la intercepción del satélite. Ciudad no encontrada.");
    }
  }
};
