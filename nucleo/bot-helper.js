export function getBotJid(client) {
  return client.user?.id?.split(':')[0] + '@s.whatsapp.net'
}
