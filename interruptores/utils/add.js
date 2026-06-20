// 🕒 GENERADOR DE FECHA (Hora de Colombia)
const obtenerFechaBogota = () => {
    return new Intl.DateTimeFormat('es-CO', { 
        timeZone: 'America/Bogota', 
        day: 'numeric', 
        month: 'long' 
    }).format(new Date());
}

export default {
    command: ['add'],
    category: 'grupo',
    run: async (client, m, args = [], usedPrefix = '.', command = 'add') => {
        
        if (!m.isGroup) return m.reply("Comandante, los comandos de ingreso solo operan dentro de grupos.")
        
        const accion = command.toLowerCase()

        if (args.length < 2) return m.reply(`Faltan datos. Uso correcto:\n*${usedPrefix}${command} [Número] [Nombre]*`)

        // 🧹 Limpieza y normalización del número
        let numeroObjetivo = args[0].replace(/[^0-9]/g, '')
        
        // Auto-completar prefijos comunes si el usuario no los pone
        if (numeroObjetivo.length === 10) {
            if (numeroObjetivo.startsWith('3')) numeroObjetivo = '57' + numeroObjetivo // Colombia
            else if (numeroObjetivo.startsWith('9')) numeroObjetivo = '51' + numeroObjetivo // Perú
            else if (numeroObjetivo.startsWith('1')) numeroObjetivo = '1' + numeroObjetivo // USA
            else if (numeroObjetivo.startsWith('6') || numeroObjetivo.startsWith('7')) numeroObjetivo = '34' + numeroObjetivo // España
            else if (numeroObjetivo.startsWith('4')) numeroObjetivo = '58' + numeroObjetivo // Venezuela (412, 414, etc)
        }
        
        // Formato interno de WhatsApp para algunos países
        if (numeroObjetivo.startsWith("52") && !numeroObjetivo.startsWith("521") && numeroObjetivo.length >= 12) numeroObjetivo = "521" + numeroObjetivo.slice(2);
        if (numeroObjetivo.startsWith("54") && !numeroObjetivo.startsWith("549") && numeroObjetivo.length >= 11) numeroObjetivo = "549" + numeroObjetivo.slice(2);
        
        const jid = `${numeroObjetivo}@s.whatsapp.net`
        const nombreNuevo = args.slice(1).join(' ').toUpperCase()

        try {
            // 🔍 ESCANEO DEL PERÍMETRO: Verificar si ya está en el grupo
            const groupMetadata = await client.groupMetadata(m.chat)
            const isParticipant = groupMetadata.participants.some(p => p.id === jid)

            // Si no está, intentamos agregarlo a la fuerza
            if (!isParticipant) {
                m.reply(`⏳ Ejecutando orden de adición directa para: ${nombreNuevo}...`)
                await client.groupParticipantsUpdate(m.chat, [jid], 'add')
            }
            // 👤 PROCESO PARA USUARIO NORMAL
            if (accion === 'add') {
                if (isParticipant) return m.reply("El usuario ya se encuentra en la base. No se requiere adición.")
                
                const texto = `╭⋯ 👋 *NUEVO INGRESO* ⋯》\n┊ ⊳ *Usuario:* ${nombreNuevo}\n┊ ⊳ *Contacto:* @${numeroObjetivo}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> Bienvenido/a al grupo.`
                return client.sendMessage(m.chat, { text: texto, mentions: [jid] })
            }

        } catch (error) {
            console.error("[❌ ADD ERROR]", error)
            return m.reply("❌ Operación fallida. El bot debe ser Administrador y el usuario debe tener permitida la adición directa en su configuración de privacidad.")
        }
    }
}
