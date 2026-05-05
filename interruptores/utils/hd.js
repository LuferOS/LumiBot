import crypto from 'crypto'
import fileTypePkg from 'file-type'
import { promises as fsp } from 'fs'
import os from 'os'
import path from 'path'
import { spawn } from 'child_process' //xd

const { fileTypeFromBuffer } = fileTypePkg
const fetchFn = fetch
export default {
  command: ['hd', 'enhance', 'remini'],
  category: 'utils',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const q = m.quoted || m
      const mime = q?.mimetype || q?.msg?.mimetype || ''

      if (!mime) {
          return m.reply(`╭⋯ 📸 *Falta la imagen, bro* ⋯》\n┊ Responde a una foto para subirle la calidad y dejarla nítida.\n┊ Uso: ${usedPrefix + command}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }
      
      if (!/^image\/(jpe?g|png|webp)$/i.test(mime)) {
          return m.reply(`╭⋯ 👾 *Formato no soportado* ⋯》\n┊ Ese tipo de archivo (*${mime || 'raro'}*) no me sirve.\n┊ Manda un JPG o PNG normalito.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      await m.react('🕒')
      const buffer = await q.download?.()
      
      if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 10) {
          await m.react('✖️')
          return m.reply(`╭⋯ ⚠️ *Error de descarga* ⋯》\n┊ No pude bajar la imagen original. Pásala de nuevo a ver si ahora sí agarra.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      const ft = await safeFileType(buffer)
      const inputMime = ft?.mime || mime || 'image/jpeg'
      if (!/^image\/(jpe?g|png|webp)$/i.test(inputMime)) {
          await m.react('✖️')
          return m.reply(`╭⋯ 👾 *Archivo corrupto* ⋯》\n┊ El formato interno (*${inputMime}*) no es compatible para escalarlo en HD.\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      const result = await vectorinkEnhanceFromBuffer(buffer, inputMime)

      if (!result?.ok || !result?.buffer) {
        await m.react('✖️')
        const msg = result?.error?.code || result?.error?.step || result?.error?.message || 'error'
        return m.reply(`╭⋯ 🔧 *Fallo en el servidor* ⋯》\n┊ La IA de VectorInk rechazó la imagen. Seguro está muy pesada o el server anda caído.\n┊ Info del error: ${msg}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
      }

      const caption = `╭⋯ 🔥 *IMAGEN EN HD* ⋯》\n┊ ⊳ *Resolución:* Mejorada a tope\n┊ ⊳ *Motor:* VectorInk API\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》\n> ⚡ *Powered by LuferOS*`

      await client.sendMessage(m.chat, { image: result.buffer, caption: caption }, { quoted: m })
      await m.react('✔️')
      
    } catch (e) {
      console.error("[LUMIBOT DEBUG] Error en hd.js:", e)
      await m.react('✖️')
      await m.reply(`╭⋯ ❌ *Error del sistema* ⋯》\n┊ Algo reventó feo procesando la foto.\n┊ Detalle: ${e?.message || String(e)}\n╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`)
    }
  }
}

async function safeFileType(buf) {
  try {
    return await fileTypeFromBuffer(buf)
  } catch {
    return null
  }
}

async function safeJson(res) {
  const t = await res.text().catch(() => '')
  try {
    return JSON.parse(t)
  } catch {
    return { raw: t }
  }
}

function extFromMime(mime) {
  if (/png/i.test(mime)) return 'png'
  if (/webp/i.test(mime)) return 'webp'
  return 'jpg'
}

function runFfmpeg(args, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let err = ''
    const t = setTimeout(() => {
      try {
        p.kill('SIGKILL')
      } catch {}
      reject(new Error('ffmpeg timeout'))
    }, timeoutMs)

    p.stderr.on('data', (d) => (err += d.toString()))
    p.on('error', (e) => {
      clearTimeout(t)
      reject(e)
    })
    p.on('close', (code) => {
      clearTimeout(t)
      if (code === 0) return resolve(true)
      reject(new Error(err || `ffmpeg failed (${code})`))
    })
  })
}

async function webpToPngWithFfmpeg(webpBuf, tmpDir) {
  const inPath = path.join(tmpDir, `vi_${Date.now()}_${Math.random().toString(16).slice(2)}.webp`)
  const outPath = path.join(tmpDir, `vi_${Date.now()}_${Math.random().toString(16).slice(2)}.png`)

  await fsp.writeFile(inPath, webpBuf)

  try {
    await runFfmpeg(['-y', '-i', inPath, '-frames:v', '1', outPath], 60000)
    const png = await fsp.readFile(outPath)
    return { ok: true, png }
  } catch (e) {
    return { ok: false, error: e?.message || String(e) }
  } finally {
    try {
      await fsp.unlink(inPath)
    } catch {}
    try {
      await fsp.unlink(outPath)
    } catch {}
  }
}

async function vectorinkEnhanceFromBuffer(inputBuf, inputMime) {
  const API = 'https://us-central1-vector-ink.cloudfunctions.net/upscaleImage'
  const ORIGIN = 'https://vectorink.io'
  const TIMEOUT_MS = 120000
  const UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'

  const out = {
    ok: false,
    provider: 'vectorink.io',
    meta: { request_id: crypto.randomUUID?.() || crypto.randomBytes(16).toString('hex') }
  }

  const tmpDir = path.join(os.tmpdir(), 'vectorink')
  const tmpPath = path.join(tmpDir, `img_${Date.now()}_${Math.random().toString(16).slice(2)}.${extFromMime(inputMime)}`)

  try {
    await fsp.mkdir(tmpDir, { recursive: true })
    await fsp.writeFile(tmpPath, inputBuf)

    const b64 = (await fsp.readFile(tmpPath)).toString('base64')

    const r = await fetchFn(API, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: '*/*',
        origin: ORIGIN,
        referer: `${ORIGIN}/`,
        'user-agent': UA
      },
      body: JSON.stringify({ data: { image: b64 } }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(TIMEOUT_MS) : undefined
    })

    const j = await safeJson(r)
    if (!r.ok) {
      out.error = { step: 'request', status: r.status, body: j }
      return out
    }

    const innerText = j?.result
    if (typeof innerText !== 'string' || innerText.length < 10) {
      out.error = { step: 'parse', code: 'no_result', body: j }
      return out
    }

    let inner
    try {
      inner = JSON.parse(innerText)
    } catch {
      out.error = { step: 'parse', code: 'bad_result_json', body: j }
      return out
    }

    const webpB64 = inner?.image?.b64_json
    if (!webpB64) {
      out.error = { step: 'parse', code: 'no_b64', body: inner }
      return out
    }

    const webpBuf = Buffer.from(webpB64, 'base64')

    const conv = await webpToPngWithFfmpeg(webpBuf, tmpDir)
    if (!conv.ok) {
      out.error = { step: 'convert', code: 'ffmpeg_failed', message: conv.error }
      return out
    }

    out.ok = true
    out.buffer = conv.png
    out.contentType = 'image/png'
    out.result = { image_id: inner?.image?.image_id, created: inner?.created, credits: inner?.credits }
    return out
  } catch (e) {
    out.error = { step: 'exception', message: e?.message || String(e) }
    return out
  } finally {
    try {
      await fsp.unlink(tmpPath)
    } catch {}
  }
}
