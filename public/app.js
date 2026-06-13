// ==========================================
// LumiBOT Web OS - Core Client Logic
// ==========================================

const socket = io();

// 1. TABS NAVIGATION
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Quitar active de todos
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.style.display = 'none');
    
    // Activar el seleccionado
    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).style.display = 'block';

    // Fix map render issue when unhidden
    if (tabId === 'tab-map' && window.cyberMap) {
      setTimeout(() => window.cyberMap.invalidateSize(), 100);
    }
  });
});

// 2. DASHBOARD STATS POLLING
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
    document.getElementById('val-cpu-model').innerText = data.hardware?.cpuModel || 'CPU';
    document.getElementById('val-cpu-load').innerText = data.hardware?.cpuLoad || 0;
    document.getElementById('bar-cpu').style.width = (data.hardware?.cpuLoad || 0) + '%';
    
    document.getElementById('val-ram-pct').innerText = data.hardware?.ramUsagePct || 0;
    if(data.hardware) {
      document.getElementById('val-ram-gb').innerText = `${data.hardware.usedGb} GB / ${data.hardware.totalGb} GB`;
      document.getElementById('val-os').innerText = data.hardware.os;
      document.getElementById('val-node').innerText = data.hardware.node;
    }
    document.getElementById('bar-ram').style.width = (data.hardware?.ramUsagePct || 0) + '%';
    
    // LumiBot Stats
    document.getElementById('val-uptime').innerText = data.uptime;
    document.getElementById('val-chats').innerText = data.chats;
    document.getElementById('val-users').innerText = data.users;

    // Markov Data
    document.getElementById('val-markov-msg').innerText = data.markov.messages.toLocaleString();
    document.getElementById('val-markov-size').innerText = data.markov.sizeMb;

  } catch (err) {
    console.error('Error fetching stats:', err);
  }
}

fetchStats();
setInterval(fetchStats, 3000);

// 3. CYBER MAPA (LEAFLET)
// Diccionario básico de prefijos telefónicos a Coordenadas (Lat, Lng)
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

const map = L.map('cyber-map', {
  center: [10, -50], // Centrado entre América y Europa
  zoom: 3,
  zoomControl: false,
  attributionControl: false
});
window.cyberMap = map;

// Capa de mapa oscuro (CartoDB Dark Matter)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 19
}).addTo(map);

const markers = [];

// Escuchar tráfico de Socket.IO
socket.on('ws_traffic', (data) => {
  // data = { sender: '573123456789', isGroup: true, isOut: false }
  
  // Extraer prefijo probando hasta 3 dígitos
  let matchedCountry = null;
  const prefix3 = data.sender.substring(0,3);
  const prefix2 = data.sender.substring(0,2);
  const prefix1 = data.sender.substring(0,1);

  if (countryCoordinates[prefix3]) matchedCountry = countryCoordinates[prefix3];
  else if (countryCoordinates[prefix2]) matchedCountry = countryCoordinates[prefix2];
  else if (countryCoordinates[prefix1]) matchedCountry = countryCoordinates[prefix1];

  if (matchedCountry) {
    // Añadir pequeña aleatoriedad a la coordenada para que no se superpongan exactamente
    const lat = matchedCountry.coords[0] + (Math.random() * 2 - 1);
    const lng = matchedCountry.coords[1] + (Math.random() * 2 - 1);

    const color = data.isOut ? '#ff3366' : '#00ffcc'; // Saliente = rojo, Entrante = verde neón

    const circle = L.circleMarker([lat, lng], {
      radius: 6,
      fillColor: color,
      color: color,
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map);

    // Animación de pulso css
    circle._path.classList.add('map-pulse');

    document.getElementById('last-ping-country').innerText = `Ping: ${matchedCountry.name}`;
    document.getElementById('ping-details').innerText = `${data.isOut ? 'Enviando a' : 'Recibiendo de'} +${data.sender.substring(0,4)}... ${data.isGroup ? '(Grupo)' : '(Privado)'}`;

    // Quitar después de unos segundos para no llenar la RAM
    setTimeout(() => {
      map.removeLayer(circle);
    }, 15000);
  }
});


// 4. EDITOR DE ARCHIVOS (WEB OS FILE MANAGER)
let currentFilePath = '';
const treeItems = document.getElementById('tree-items');
const editor = document.getElementById('code-editor');
const saveBtn = document.getElementById('save-file-btn');
const currentFileName = document.getElementById('current-file-name');

async function loadDirectory(pathStr = '') {
  try {
    const res = await fetch(`/api/fs/list?path=${encodeURIComponent(pathStr)}`);
    const files = await res.json();
    return files;
  } catch(e) {
    return [];
  }
}

async function renderRoot() {
  treeItems.innerHTML = '<div class="loading">Cargando...</div>';
  const rootFiles = await loadDirectory('');
  treeItems.innerHTML = '';
  
  rootFiles.forEach(f => {
    // Ocultar node_modules para no petar la web
    if (f.name === 'node_modules' || f.name === '.git') return;
    
    const div = document.createElement('div');
    div.className = f.isDirectory ? 'tree-folder' : 'tree-file';
    div.innerText = (f.isDirectory ? '📁 ' : '📄 ') + f.name;
    
    div.onclick = () => {
      if (f.isDirectory) {
        // En una implementación avanzada, abriría carpetas anidadas.
        // Aquí mantendremos simpleza o permitimos navegar 1 nivel abajo
        alert('Navegación de subcarpetas en beta. Puedes editar archivos raíz y de carpetas principales buscando por path directamente en el server si agregamos un input.');
      } else {
        openFile(f.path, f.name);
      }
    };
    treeItems.appendChild(div);
  });
}

// Cargar un archivo al textarea
async function openFile(filePath, fileName) {
  try {
    const res = await fetch(`/api/fs/read?path=${encodeURIComponent(filePath)}`);
    if(!res.ok) throw new Error('No se puede leer');
    const content = await res.text();
    
    currentFilePath = filePath;
    currentFileName.innerText = 'Editando: ' + fileName;
    editor.value = content;
    editor.disabled = false;
    saveBtn.disabled = false;
  } catch(e) {
    alert("Error abriendo archivo. Asegúrese de que es de texto.");
  }
}

// Guardar archivo
saveBtn.onclick = async () => {
  saveBtn.innerText = 'Guardando...';
  try {
    const res = await fetch('/api/fs/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: currentFilePath, content: editor.value })
    });
    if(res.ok) {
      saveBtn.innerText = '✅ Guardado';
      setTimeout(() => saveBtn.innerText = '💾 Guardar Cambios', 2000);
    } else {
      throw new Error();
    }
  } catch(e) {
    saveBtn.innerText = '❌ Error';
    setTimeout(() => saveBtn.innerText = '💾 Guardar Cambios', 2000);
  }
};

renderRoot(); // Init File Tree

// Soportar TABS en el textarea
editor.addEventListener('keydown', function(e) {
  if (e.key == 'Tab') {
    e.preventDefault();
    var start = this.selectionStart;
    var end = this.selectionEnd;
    this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 1;
  }
});


// 5. TERMINAL TÁCTICA
const termIn = document.getElementById('term-in');
const termOut = document.getElementById('term-out');

termIn.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const cmd = termIn.value.trim();
    if (!cmd) return;
    
    // Escribir el comando en pantalla
    termOut.innerHTML += `\n<span style="color:#fff">root@lumibot:~#</span> ${cmd}\n`;
    
    if (cmd === 'clear') {
      termOut.innerHTML = '[LumiBOT OS] Shell remoto iniciado.\n------------------------------------------------------\n';
      termIn.value = '';
      return;
    }
    
    // Enviar por socket
    socket.emit('terminal_cmd', cmd);
    termIn.value = '';
    
    // Autoscroll
    termOut.scrollTop = termOut.scrollHeight;
  }
});

socket.on('terminal_out', (output) => {
  termOut.innerHTML += output.replace(/\n/g, '<br>');
  termOut.scrollTop = termOut.scrollHeight;
});
