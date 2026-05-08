node -e "
const key = 'API_KEY';
fetch('https://www.virustotal.com/api/v3/urls', {
  method: 'POST',
  headers: { 'x-apikey': key, 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'url=google.com'
})
.then(r => r.json())
.then(d => console.log('╭⋯ 📡 REPORTE DE CONEXIÓN ⋯》\n', d))
.catch(e => console.error('❌ ERROR:', e.message));
console.log('MODULO FUNCIONAL');
"
