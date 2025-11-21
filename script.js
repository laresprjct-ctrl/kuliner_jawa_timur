const statusEl = document.getElementById('status');
const kabEl = document.getElementById('kab');
const kecEl = document.getElementById('kec');
const desaEl = document.getElementById('desa');
const debugEl = document.getElementById('debug');

async function start() {
  try {
    statusEl.textContent = 'Memuat data Jawa Timur...';
    await window.WilayahJatim.loadAll();
    statusEl.textContent = 'Data siap. Silakan pilih Kabupaten/Kota.';

    const kabList = window.WilayahJatim.getKabupatenList();
    kabEl.innerHTML =
      '<option value="">-- Pilih --</option>' +
      kabList.map(k => `<option value="${k.id}">${k.name}</option>`).join('');

  } catch (err) {
    statusEl.textContent = 'Gagal memuat data.';
    debugEl.textContent = err.stack;
  }
}

kabEl.addEventListener('change', () => {
  const kabId = kabEl.value;
  if (!kabId) { kecEl.innerHTML = ''; desaEl.innerHTML = ''; return; }

  const kecList = window.WilayahJatim.getKecamatan(kabId);
  kecEl.innerHTML =
    '<option value="">-- Pilih --</option>' +
    kecList.map(k => `<option value="${k.id}">${k.name}</option>`).join('');

  desaEl.innerHTML = '';
});

kecEl.addEventListener('change', () => {
  const kabId = kabEl.value;
  const kecId = kecEl.value;

  if (!kecId) { desaEl.innerHTML = ''; return; }

  const desaList = window.WilayahJatim.getDesa(kabId, kecId);
  desaEl.innerHTML =
    '<option value="">-- Pilih --</option>' +
    desaList.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
});

start();
