import axios from 'axios';

export default {
  name: "clima",
  alias: ["weather", "tiempo"],
  category: "utilidad",
  desc: "Extrae el reporte meteorológico OSINT de una ciudad.",
  run: async ({ sock, m, args }) => {
    if (!args[0]) return m.reply("❌ Error: Debes especificar una ciudad. Ejemplo: *.clima Bogota*");
    
    const ciudad = args.join(' ');
    m.reply(`Buscando satélites meteorológicos sobre: ${ciudad}...`);
    
    try {
      const res = await axios.get(`https://wttr.in/${encodeURIComponent(ciudad)}?format=3`);
      m.reply(`*🌍 CLIMA OSINT*\n\n${res.data.trim()}`);
    } catch (e) {
      m.reply("❌ Fallo en la intercepción del satélite. Ciudad no encontrada.");
    }
  }
};
