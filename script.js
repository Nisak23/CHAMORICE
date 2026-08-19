const PRODUCT_CODE = 'CHAMORICE-CHM-001-AUTH';
const PRODUCT_DATA = {
  product: 'CHAMORICE Chamomile Liquid Soap',
  batch: 'CHM-001',
  size: '500 mL',
  productionDate: '17 Agustus 2026',
  expiryDate: '17 Agustus 2028',
  location: 'Pasuruan, Jawa Timur',
  reseller: 'CHAMORICE Official Store',
  resellerNote: 'Nama reseller dapat disesuaikan dengan toko marketplace/mitra resmi tempat pembelian.'
};

let scanner = null;

function verify(code = document.getElementById('code')?.value.trim()) {
  const result = document.getElementById('result');
  if (!result) return;
  result.classList.remove('hide');

  if (code === PRODUCT_CODE) {
    result.className = 'result success result-enter';
    result.innerHTML = `
      <div class="result-check"><span>✓</span></div>
      <div class="result-copy">
        <div class="result-title">PRODUK ASLI</div>
        <p>Kode <strong>${PRODUCT_CODE}</strong> terdaftar dalam database CHAMORICE.</p>
        <p class="result-subtitle">Produk Anda berhasil diverifikasi dan 100% original.</p>
      </div>
      <div class="verified-grid">
        <div><span>Nama Produk</span><strong>${PRODUCT_DATA.product}</strong></div>
        <div><span>Batch / No. Batch</span><strong>${PRODUCT_DATA.batch}</strong></div>
        <div><span>Ukuran</span><strong>${PRODUCT_DATA.size}</strong></div>
        <div><span>Tanggal Pembuatan</span><strong>${PRODUCT_DATA.productionDate}</strong></div>
        <div><span>Tanggal Kadaluarsa</span><strong>${PRODUCT_DATA.expiryDate}</strong></div>
        <div><span>Lokasi Pembuatan</span><strong>${PRODUCT_DATA.location}</strong></div>
        <div class="wide"><span>Reseller Official</span><strong>${PRODUCT_DATA.reseller} <b class="verified-badge">✓</b></strong><small>${PRODUCT_DATA.resellerNote}</small></div>
      </div>
      <div class="success-note"><span>🌿</span><div><strong>Terima kasih telah memilih produk asli CHAMORICE.</strong><small>From Local Harvest to Sustainable Care.</small></div></div>`;
    requestAnimationFrame(() => result.classList.add('is-visible'));
    burstCelebration();
  } else {
    result.className = 'result error result-enter is-visible';
    result.innerHTML = '<div class="result-title">✕ PRODUK TIDAK DITEMUKAN</div><p>Kode autentikasi tidak terdaftar. Periksa kembali kode pada produk.</p>';
  }
}

function burstCelebration() {
  const result = document.getElementById('result');
  if (!result) return;
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('span');
    el.className = 'celebrate-particle';
    el.textContent = i % 3 === 0 ? '🌼' : (i % 3 === 1 ? '🍃' : '✦');
    el.style.setProperty('--x', `${(Math.random() - .5) * 92}vw`);
    el.style.setProperty('--y', `${-80 - Math.random() * 150}px`);
    el.style.setProperty('--r', `${Math.random() * 180 - 90}deg`);
    el.style.setProperty('--d', `${650 + Math.random() * 500}ms`);
    result.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
}

async function startScan() {
  if (!window.Html5Qrcode) return;
  const reader = document.getElementById('reader');
  const scan = document.getElementById('scan');
  const stop = document.getElementById('stop');
  if (!reader) return;
  reader.innerHTML = '';
  scanner = new Html5Qrcode('reader');
  try {
    await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: 220 }, (decodedText) => {
      document.getElementById('code').value = decodedText;
      verify(decodedText);
      stopScan();
    });
    scan?.classList.add('hide');
    stop?.classList.remove('hide');
  } catch (err) {
    reader.innerHTML = '<p class="scan-error">Kamera tidak dapat diakses. Silakan gunakan kode autentikasi secara manual.</p>';
  }
}

async function stopScan() {
  if (scanner) {
    try { await scanner.stop(); } catch (_) {}
    try { scanner.clear(); } catch (_) {}
    scanner = null;
  }
  document.getElementById('scan')?.classList.remove('hide');
  document.getElementById('stop')?.classList.add('hide');
}

document.querySelectorAll('.tech-item').forEach((item) => item.addEventListener('click', () => {
  document.querySelectorAll('.tech-item').forEach((el) => el.classList.remove('active'));
  item.classList.add('active');
  document.getElementById('techText').textContent = item.dataset.text || '';
}));

// Reveal-on-scroll animation for all marked sections/cards.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.setProperty('--reveal-delay', `${Math.min(index * 45, 220)}ms`);
  revealObserver.observe(el);
});

// Cursor trail: the same flair assets used by the supplied CursorTrail component,
// adapted for this plain HTML site so it works without a React runtime.
const flairImages = [
  'https://assets.codepen.io/16327/Revised+Flair.png',
  'https://assets.codepen.io/16327/Revised+Flair-1.png',
  'https://assets.codepen.io/16327/Revised+Flair-2.png',
  'https://assets.codepen.io/16327/Revised+Flair-3.png',
  'https://assets.codepen.io/16327/Revised+Flair-4.png',
  'https://assets.codepen.io/16327/Revised+Flair-5.png',
  'https://assets.codepen.io/16327/Revised+Flair-6.png',
  'https://assets.codepen.io/16327/Revised+Flair-7.png',
  'https://assets.codepen.io/16327/Revised+Flair-8.png'
];

const trail = document.getElementById('cursor-trail');
let trailIndex = 0;
let lastTrailX = null;
let lastTrailY = null;
let lastSpawn = 0;
const TRAIL_DISTANCE = 72;

function spawnTrail(x, y) {
  if (!trail) return;
  const img = document.createElement('img');
  img.src = flairImages[trailIndex++ % flairImages.length];
  img.alt = '';
  img.className = 'cursor-flair';
  const size = 34 + Math.random() * 18;
  const rotation = Math.random() * 40 - 20;
  img.style.width = `${size}px`;
  img.style.height = `${size}px`;
  img.style.left = `${x - size / 2}px`;
  img.style.top = `${y - size / 2}px`;
  img.style.setProperty('--rotation', `${rotation}deg`);
  trail.appendChild(img);
  requestAnimationFrame(() => img.classList.add('flair-show'));
  setTimeout(() => img.remove(), 950);
}

window.addEventListener('mousemove', (e) => {
  const now = performance.now();
  if (now - lastSpawn < 30) return;
  if (lastTrailX === null) {
    lastTrailX = e.clientX;
    lastTrailY = e.clientY;
    return;
  }
  const dx = e.clientX - lastTrailX;
  const dy = e.clientY - lastTrailY;
  const dist = Math.hypot(dx, dy);
  if (dist >= TRAIL_DISTANCE) {
    const count = Math.max(1, Math.floor(dist / TRAIL_DISTANCE));
    for (let i = 1; i <= count; i++) {
      const t = i / count;
      spawnTrail(lastTrailX + dx * t, lastTrailY + dy * t);
    }
    lastTrailX = e.clientX;
    lastTrailY = e.clientY;
    lastSpawn = now;
  }
});

window.addEventListener('load', () => {
  document.getElementById('loader')?.classList.add('done');
});
