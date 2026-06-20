import axios from "axios"
import FormData from "form-data"
import fetch from "node-fetch"

function generateUniqueFilename(mime) {
  const ext = mime.split("/")[1] || "bin"
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let id = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  return `${id}.${ext}`
}

async function uploadCatbox(buffer, mime) {
  const form = new FormData()
  form.append("reqtype", "fileupload")
  form.append("fileToUpload", buffer, { filename: generateUniqueFilename(mime) })

  const res = await axios.post("https://catbox.moe/user/api.php", form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  if (typeof res.data !== "string" || !res.data.startsWith("https://")) {
    throw new Error("Respuesta inválida del host: " + JSON.stringify(res.data))
  }
  return res.data
}

async function uploadUguu(buffer) {
  const form = new FormData()
  form.append("files[]", buffer, generateUniqueFilename("image/jpeg"))

  const res = await axios.post("https://uguu.se/upload.php", form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  const data = res.data
  const url = data?.files?.[0]?.url
  if (!url) throw new Error("Respuesta inválida del host: " + JSON.stringify(data))
  return url
}

async function uploadQuax(buffer, mime) {
  const form = new FormData()
  form.append("file", buffer, { filename: generateUniqueFilename(mime), contentType: mime })

  const res = await axios.post("https://qu.ax/upload.php", form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  const data = res.data
  if (!data?.files?.[0]?.url) throw new Error("Respuesta inválida del host: " + JSON.stringify(data))
  return data.files[0].url
}

async function uploadAuto(buffer, mime) {
  try {
    return await uploadCatbox(buffer, mime)
  } catch {
    try {
      return await uploadUguu(buffer)
    } catch {
      return await uploadQuax(buffer, mime)
    }
  }
}

export default {
  command: ["upscale", "mejorar", "escala"],
  category: "utils",
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const q = m.quoted || m
      const mime = q?.mimetype || q?.msg?.mimetype || ''

      if (!mime) {
          return m.reply(`🙄 *Bruh, literal dónde está la foto?* 💅\n> Responde a una foto para mejorar su resolución.`)
      }
      
      if (!/^image\/(jpe?g|png|webp)$/i.test(mime)) {
          return m.reply(`🙄 *Amiga, eso no es una foto* 💅\n> Manda un JPG o PNG normalito.`)
      }

      let scale = 2
      if (args[0] && !isNaN(args[0])) {
          scale = parseInt(args[0])
          if (scale < 1 || scale > 20) return m.reply(`🙄 *Escala inválida* 💅\n> Usa un valor entre 1 y 20. Ejemplo: .upscale 4`)
      }

      await m.react('🕒')
      const buffer = await q.download?.()
      
      if (!buffer) {
          await m.react('✖️')
          return m.reply(`🙄 *Bruh, la foto no bajó* 💅\n> Pásala de nuevo.`)
      }

      m.reply(`> ✨ Subiendo imagen y mejorando resolución (Escala ${scale}x)... ¡Espera un toque! 💅`)

      const imgUrl = await uploadAuto(buffer, mime)
      const alyaUrl = `https://api.alyacore.xyz/tools/upscale?method=url&url=${encodeURIComponent(imgUrl)}&resolucion=${scale}&key=LumiBot-alya`
      
      const response = await fetch(alyaUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      const json = await response.json()

      if (!json.status) {
          await m.react('✖️')
          return m.reply(`🙄 *Error en la API* 💅\n> La API de AlyaCore rechazó la solicitud.\n> ${json.message || ''}`)
      }

      const finalUrl = json.result
      await client.sendMessage(m.chat, { image: { url: finalUrl }, caption: `✨ *IMAGEN MEJORADA (${scale}x)* ✨\n> Literal le quité lo Android 💅` }, { quoted: m })
      await m.react('✔️')
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en upscale.js:", e)
      await m.react('✖️')
      await m.reply(`🙄 *Bruh, todo explotó* 💅\n> Algo reventó feo procesando la foto.\n> 🚩 Detalle: ${e?.message || String(e)}`)
    }
  }
}
