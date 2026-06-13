// ==========================================
// LumiBOT Web OS v5.0 - Core Client Logic
// ==========================================

const socket = io();

// 1. TABS NAVIGATION
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.style.display = 'none');
    
    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).style.display = 'block';

    if (tabId === 'tab-map' && window.cyberMap) {
      setTimeout(() => window.cyberMap.invalidateSize(), 100);
    }
  });
});

// 2. CHART.JS PERFORMANCE ECG
const ctx = document.getElementById('performanceChart').getContext('2d');
const perfChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array(20).fill(''),
    datasets: [
      {
        label: 'CPU %',
        data: Array(20).fill(0),
        borderColor: '#00ffcc',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0
      },
      {
        label: 'RAM %',
        data: Array(20).fill(0),
        borderColor: '#ff3366',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      y: { min: 0, max: 100, display: false },
      x: { display: false }
    },
    plugins: { legend: { display: false } }
  }
});

// 3. DASHBOARD STATS POLLING
async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    
    // Status
    const orb = document.getElementById('status-orb');
    const badge = document.getElementById('status-badge');
    const statusText = document.getElementById('status-text');
    
    if (data.status === 'online') {
      orb.className = 'orb';
      badge.className = 'status-badge online';
      statusText.innerText = 'SISTEMA EN LÍNEA';
    } else {
      orb.className = 'orb offline';
      badge.className = 'status-badge offline';
      statusText.innerText = 'DESCONECTADO (ESCANEAR QR)';
    }

    // Host Hardware
    const cpuLoad = data.hardware?.cpuLoad || 0;
    const ramPct = data.hardware?.ramUsagePct || 0;

    document.getElementById('val-cpu-model').innerText = data.hardware?.cpuModel || 'CPU';
    document.getElementById('val-cpu-load').innerText = cpuLoad;
    document.getElementById('bar-cpu').style.width = cpuLoad + '%';
    
    document.getElementById('val-ram-pct').innerText = ramPct;
    if(data.hardware) {
      document.getElementById('val-ram-gb').innerText = `${data.hardware.usedGb} GB / ${data.hardware.totalGb} GB`;
      document.getElementById('val-os').innerText = data.hardware.os;
      document.getElementById('val-node').innerText = data.hardware.node;
    }
    document.getElementById('bar-ram').style.width = ramPct + '%';
    
    // Update Chart
    perfChart.data.datasets[0].data.shift();
    perfChart.data.datasets[0].data.push(cpuLoad);
    perfChart.data.datasets[1].data.shift();
    perfChart.data.datasets[1].data.push(ramPct);
    perfChart.update();

    // LumiBot Stats
    document.getElementById('val-uptime').innerText = data.uptime;
    document.getElementById('val-chats').innerText = data.chats;
    document.getElementById('val-users').innerText = data.users;

    // Markov Data
    document.getElementById('val-markov-msg').innerText = data.markov.messages.toLocaleString();
    document.getElementById('val-markov-size').innerText = data.markov.sizeMb;

  } catch (err) {}
}

fetchStats();
setInterval(fetchStats, 3000);

// 4. ACTION BUTTONS
async function actionBtn(action) {
  if (!confirm(`¿Confirmar orden táctica: ${action.toUpperCase()}?`)) return;
  try {
    const res = await fetch(`/api/action/${action}`, { method: 'POST' });
    const json = await res.json();
    alert(json.message || 'Orden enviada.');
  } catch (e) {
    alert('Error enviando la orden.');
  }
}

// 5. LIVE LOGS (SOCKET INTERCEPTOR)
const liveLogsOut = document.getElementById('live-logs-out');
socket.on('sys_log', (logStr) => {
  liveLogsOut.innerHTML += logStr;
  // Limitar a los últimos 5000 caracteres para no trabar el navegador
  if (liveLogsOut.innerHTML.length > 50000) {
    liveLogsOut.innerHTML = liveLogsOut.innerHTML.substring(liveLogsOut.innerHTML.length - 20000);
  }
  liveLogsOut.scrollTop = liveLogsOut.scrollHeight;
});


// 6. CYBER MAPA (LEAFLET)
const countryCoordinates = {
  "57": { name: "Colombia", coords: [4.5709, -74.2973] },
  "52": { name: "México", coords: [23.6345, -102.5528] },
  "54": { name: "Argentina", coords: [-38.4161, -63.6167] },
  "51": { name: "Perú", coords: [-9.1900, -75.0152] },
  "56": { name: "Chile", coords: [-35.6751, -71.5430] },
  "34": { name: "España", coords: [40.4637, -3.7492] },
  "1":  { name: "USA/Canadá", coords: [37.0902, -95.7129] },
  "55": { name: "Brasil", coords: [-14.2350, -51.9253] },
  "58": { name: "Venezuela", coords: [6.4238, -66.5897] },
  "593":{ name: "Ecuador", coords: [-1.8312, -78.1834] },
  "591":{ name: "Bolivia", coords: [-16.2902, -63.5887] },
  "502":{ name: "Guatemala", coords: [15.7835, -90.2308] }
};

const map = L.map('cyber-map', { center: [10, -50], zoom: 3, zoomControl: false, attributionControl: false });
window.cyberMap = map;
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

socket.on('ws_traffic', (data) => {
  let matchedCountry = null;
  const prefix3 = data.sender.substring(0,3), prefix2 = data.sender.substring(0,2), prefix1 = data.sender.substring(0,1);
  if (countryCoordinates[prefix3]) matchedCountry = countryCoordinates[prefix3];
  else if (countryCoordinates[prefix2]) matchedCountry = countryCoordinates[prefix2];
  else if (countryCoordinates[prefix1]) matchedCountry = countryCoordinates[prefix1];

  if (matchedCountry) {
    const lat = matchedCountry.coords[0] + (Math.random() * 2 - 1);
    const lng = matchedCountry.coords[1] + (Math.random() * 2 - 1);
    const color = data.isOut ? '#ff3366' : '#00ffcc';

    const circle = L.circleMarker([lat, lng], { radius: 6, fillColor: color, color: color, weight: 1, opacity: 1, fillOpacity: 0.8 }).addTo(map);
    circle._path.classList.add('map-pulse');

    document.getElementById('last-ping-country').innerText = `Ping: ${matchedCountry.name}`;
    document.getElementById('ping-details').innerText = `${data.isOut ? 'Enviando a' : 'Recibiendo de'} +${data.sender.substring(0,4)}... ${data.isGroup ? '(Grupo)' : '(Privado)'}`;

    setTimeout(() => map.removeLayer(circle), 15000);
  }
});


// 7. EDITOR DE ARCHIVOS (MONACO)
let monacoInstance = null;
let currentFilePath = '';
const treeItems = document.getElementById('tree-items');
const saveBtn = document.getElementById('save-file-btn');
const currentFileName = document.getElementById('current-file-name');

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
  monacoInstance = monaco.editor.create(document.getElementById('monaco-container'), {
    value: "// Selecciona un archivo para comenzar a editar.",
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true
  });

  // Atajo Ctrl+S
  monacoInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function() {
    saveBtn.click();
  });
});

async function loadDirectory(pathStr = '') {
  try {
    const res = await fetch(`/api/fs/list?path=${encodeURIComponent(pathStr)}`);
    return await res.json();
  } catch(e) { return []; }
}

async function renderRoot() {
  treeItems.innerHTML = '<div class="loading">Cargando...</div>';
  const rootFiles = await loadDirectory('');
  treeItems.innerHTML = '';
  
  rootFiles.forEach(f => {
    if (f.name === 'node_modules' || f.name === '.git' || f.name.includes('.db') || f.name.includes('.json')) return;
    const div = document.createElement('div');
    div.className = f.isDirectory ? 'tree-folder' : 'tree-file';
    div.innerText = (f.isDirectory ? '📁 ' : '📄 ') + f.name;
    
    div.onclick = () => {
      if (!f.isDirectory) openFile(f.path, f.name);
    };
    treeItems.appendChild(div);
  });
}

async function openFile(filePath, fileName) {
  try {
    const res = await fetch(`/api/fs/read?path=${encodeURIComponent(filePath)}`);
    if(!res.ok) throw new Error();
    const content = await res.text();
    
    currentFilePath = filePath;
    currentFileName.innerText = 'Editando: ' + fileName;
    
    if (monacoInstance) {
      const isHtml = fileName.endsWith('.html');
      const isCss = fileName.endsWith('.css');
      const lang = isHtml ? 'html' : (isCss ? 'css' : 'javascript');
      
      monaco.editor.setModelLanguage(monacoInstance.getModel(), lang);
      monacoInstance.setValue(content);
    }
    
    saveBtn.disabled = false;
  } catch(e) {
    alert("Error abriendo archivo.");
  }
}

saveBtn.onclick = async () => {
  if (!monacoInstance || !currentFilePath) return;
  saveBtn.innerText = 'Guardando...';
  try {
    const res = await fetch('/api/fs/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: currentFilePath, content: monacoInstance.getValue() })
    });
    if(res.ok) {
      saveBtn.innerText = '✅ Guardado';
      setTimeout(() => saveBtn.innerText = '💾 Guardar (Ctrl+S)', 2000);
    } else throw new Error();
  } catch(e) {
    saveBtn.innerText = '❌ Error';
    setTimeout(() => saveBtn.innerText = '💾 Guardar (Ctrl+S)', 2000);
  }
};

renderRoot();


// 8. TERMINAL TÁCTICA
const termIn = document.getElementById('term-in');
const termOut = document.getElementById('term-out');

termIn.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const cmd = termIn.value.trim();
    if (!cmd) return;
    termOut.innerHTML += `\n<span style="color:#fff">root@lumibot:~#</span> ${cmd}\n`;
    if (cmd === 'clear') {
      termOut.innerHTML = '[LumiBOT OS] Shell remoto iniciado.\n------------------------------------------------------\n';
      termIn.value = '';
      return;
    }
    socket.emit('terminal_cmd', cmd);
    termIn.value = '';
    termOut.scrollTop = termOut.scrollHeight;
  }
});

socket.on('terminal_out', (output) => {
  termOut.innerHTML += output.replace(/\n/g, '<br>');
  termOut.scrollTop = termOut.scrollHeight;
});
