// Función para dormir el hilo (Retraso Táctico)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  command: ['boletin', 'broadcast', 'transmitir'],
  category: 'owner',
  isOwner: true, // 🔒 Solo el Comandante puede usar esto
  run: async (client, m, args) => {
    try {
      let text = args.join(' ');
      
      // Validamos que el formato sea correcto
      if (!text.includes('|')) {
        return m.reply(`╭⋯ ⚠️ *ERROR DE SINTAXIS* ⋯》\n┊ Formato: .boletin numero1, numero2 | Mensaje\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);
      }

      // Separamos los números del mensaje
      let [numerosBrutos, mensaje] = text.split('|');
      
      // Limpiamos los números y los convertimos a JIDs de WhatsApp
      let numeros = numerosBrutos.split(',').map(n => {
        let limpio = n.replace(/[^0-9]/g, '');
        return limpio + '@s.whatsapp.net';
      }).filter(n => n.length > 10); // Filtramos cosas que no parezcan números

      if (numeros.length === 0) return m.reply("┊ ⊳ No detecté objetivos válidos.");
      
      // 🛑 LÍMITE DE SEGURIDAD (Cero baneos)
      if (numeros.length > 20) {
        return m.reply("┊ ⊳ Límite excedido. Máximo 20 objetivos por ráfaga para evitar bloqueos por Spam.");
      }

      await m.react('📣');
      await m.reply(`╭⋯ 📡 *INICIANDO TRANSMISIÓN SEGURA* ⋯》\n┊ Objetivos en cola: ${numeros.length}\n┊ Modo: Stealth (Evasión de Banhammer activa)\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);

      let exitosos = 0;

      // 🔄 BUCLE DE TRANSMISIÓN CONTROLADA
      for (let i = 0; i < numeros.length; i++) {
        try {
          await client.sendMessage(numeros[i], { 
            text: `╭⋯ 📣 *COMUNICADO OFICIAL* ⋯》\n┊ ⊳ Central: LuferOS Security\n┊\n┊ ${mensaje.trim()}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》` 
          });
          
          exitosos++;
          
          // 🛡️ EL CORAZÓN DE LA DEFENSA: Retraso aleatorio
          // Esperamos entre 2 y 5 segundos antes de enviar el siguiente
          if (i < numeros.length - 1) { // No esperamos en el último mensaje
            const randomDelay = Math.floor(Math.random() * (5000 - 2000 + 1) + 2000);
            await delay(randomDelay);
          }

        } catch (e) {
          console.error(`[LUMIBOT DEBUG] Fallo de envío a ${numeros[i]}:`, e.message);
        }
      }

      // Reporte final de la operación
      await m.reply(`╭⋯ ✅ *TRANSMISIÓN FINALIZADA* ⋯》\n┊ Paquetes entregados: ${exitosos}/${numeros.length}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`);

    } catch (error) {
      console.error("[LUMIBOT ERROR]", error);
      m.reply("┊ ⊳ El núcleo de transmisión colapsó.");
    }
  }
}
