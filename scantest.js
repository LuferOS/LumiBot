node -e "
const key = 'c3f498642fe9a8445d35f7516f76faae8c89954dd4064fb9f5cfdb166a78b147';
fetch('https://www.virustotal.com/api/v3/urls', {
  method: 'POST',
  headers: { 'x-apikey': key, 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'url=google.com'
})
.then(r => r.json())
.then(d => console.log('╭⋯ 📡 REPORTE DE CONEXIÓN ⋯》\n', d))
.catch(e => console.error('❌ ERROR:', e.message));
"
