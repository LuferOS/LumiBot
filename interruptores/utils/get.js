import fetch from 'node-fetch'
import { format } from 'util'

export default {
  command: ['get', 'fetch', 'extraer'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    const text = args[0];
    
    if (!text) {
      return m.reply(`╭⋯ ⚠️ *SINTAXIS INCOMPLETA* ⋯》\n┊ Bro, necesito un enlace para interceptar datos.\n┊ Ejemplo: ${usedPrefix + command} https://api.github.com\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
    
    if (!/^https?:\/\//.test(text)) {
      return m.reply(`╭⋯ 🛑 *URL INVÁLIDA* ⋯》\n┊ Eso no tiene formato de enlace, wey. Empieza con http:// o https:// si quieres que funcione.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
    }
    
    try {
      await m.react('🕒')
      const _url = new URL(text);
      const params = new URLSearchParams(_url.searchParams);
      const url = `${_url.origin}${_url.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      
      const res = await fetch(url);
      const contentType = res.headers.get('content-type') || '';
      const contentLength = parseInt(res.headers.get('content-length') || '0');

      if (contentLength > 100 * 1024 * 1024) {
        await m.react('✖️')
        return m.reply(`╭⋯ 📦 *CARGA EXCESIVA* ⋯》\n┊ El archivo pesa más de 100MB (${(contentLength / 1024 / 1024).toFixed(2)} MB).\n┊ No voy a saturar la RAM descargando eso.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
      }
      
      if (/text|json/.test(contentType)) {
        const buffer = await res.buffer();
        try {
          const json = JSON.parse(buffer.toString());
          await m.reply(`╭⋯ 📡 *INTERCEPCIÓN JSON* ⋯》\n\n${format(json).slice(0, 65536)}\n\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
        } catch {
          await m.reply(`╭⋯ 📄 *INTERCEPCIÓN DE TEXTO* ⋯》\n\n${buffer.toString().slice(0, 65536)}\n\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
        }
      } else {
        const buffer = await res.buffer();
        // Envía el archivo usando el wrapper de tu base
        await client.sendFile(m.chat, buffer, 'file', text, m);
      }
      await m.react('✔️')
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en get.js:", e);
      await m.react('✖️')
      return m.reply(`╭⋯ ❌ *FALLO DE CONEXIÓN* ⋯》\n┊ El servidor destino me tiró la puerta en la cara o el enlace está roto.\n┊ ⊳ *Detalles:* ${e.message}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
};
