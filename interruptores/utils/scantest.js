export default {
  command: ['testvt'],
  category: 'tools',
  run: async (client, m, args) => {
    const key = 'KEY_VIRUSTOTAL'.trim()
    const url = 'google.com'

    try {
      await m.reply("┊ 📡 Probando autenticación v3 con el nodo central...")
      
      const res = await fetch('https://www.virustotal.com/api/v3/urls', {
        method: 'POST',
        headers: { 
          'x-apikey': key,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `url=${url}`
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error.message)

      m.reply(`✅ ¡CONEXIÓN EXITOSA!\n┊ La API v3 está activa.\n┊ ID de análisis: ${data.data.id}`)
    } catch (e) {
      m.reply(`❌ ERROR DE AUTENTICACIÓN:\n┊ Mensaje: ${e.message}\n┊ (Si dice Wrong API Key, tu cuenta NO está verificada)`)
    }
  }
}
