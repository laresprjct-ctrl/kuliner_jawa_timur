const WilayahJatim = (function () {
  const BASE = "https://raw.githubusercontent.com/cahyadsn/wilayah/master/csv/";
  const URL_KAB = BASE + "35_jawa_timur_kabupaten.csv";
  const URL_KEC = BASE + "35_jawa_timur_kecamatan.csv";
  const URL_DESA = BASE + "35_jawa_timur_desa.csv";

  const kabupaten = [];
  const kecamatan = [];
  const desa = [];
  let loaded = false;

  function parseCSV(text) {
    const rows = text.split(/\r?\n/).filter(r => r.trim() !== "");
    const head = rows[0].split(",");
    const data = rows.slice(1).map(r => r.split(","));
    return { head, data };
  }

  async function fetchCSV(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal fetch: " + url);
    return res.text();
  }

  async function loadAll() {
    if (loaded) return;

    const [rawKab, rawKec, rawDesa] = await Promise.all([
      fetchCSV(URL_KAB),
      fetchCSV(URL_KEC),
      fetchCSV(URL_DESA),
    ]);

    // Kabupaten
    {
      const { head, data } = parseCSV(rawKab);
      const nameIdx = head.findIndex(h => /nama/i.test(h));
      const codeIdx = head.findIndex(h => /kode/i.test(h));

      data.forEach(r => {
        kabupaten.push({
          id: r[codeIdx].trim(),
          name: r[nameIdx].trim(),
        });
      });
    }

    // Kecamatan
    {
      const { head, data } = parseCSV(rawKec);
      const nameIdx = head.findIndex(h => /nama/i.test(h));
      const codeIdx = head.findIndex(h => /kode/i.test(h));
      const kabIdx = head.findIndex(h => /kab/i.test(h));

      data.forEach(r => {
        kecamatan.push({
          id: r[codeIdx].trim(),
          name: r[nameIdx].trim(),
          kab_code: r[kabIdx].trim(),
        });
      });
    }

    // Desa
    {
      const { head, data } = parseCSV(rawDesa);
      const nameIdx = head.findIndex(h => /nama/i.test(h));
      const codeIdx = head.findIndex(h => /kode/i.test(h));
      const kecIdx = head.findIndex(h => /kec/i.test(h));
      const kabIdx = head.findIndex(h => /kab/i.test(h));

      data.forEach(r => {
        desa.push({
          id: r[codeIdx].trim(),
          name: r[nameIdx].trim(),
          kec_code: r[kecIdx].trim(),
          kab_code: r[kabIdx].trim(),
        });
      });
    }

    loaded = true;
  }

  function getKabupatenList() {
    return kabupaten;
  }

  function getKecamatan(kabId) {
    return kecamatan.filter(k => k.kab_code === kabId);
  }

  function getDesa(kabId, kecId) {
    return desa.filter(
      d => d.kab_code === kabId && d.kec_code === kecId
    );
  }

  return { loadAll, getKabupatenList, getKecamatan, getDesa };
})();

window.WilayahJatim = WilayahJatim;
