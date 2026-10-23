/**
 * Ankara Sayınlar — veri bağlantısı
 * Bu kod Google E-Tablo'nuzda çalışır ve uygulamanın tüm kayıtlarını
 * "Veriler" sayfasında tutar (tikler, aidat, hesap bilgisi, ev ihtiyaçları).
 *
 * TEK YAPMANIZ GEREKEN: aşağıdaki EV_SIFRESI'ni kendi şifrenizle değiştirin.
 * Bu şifreyi uygulamayı ilk açtığınızda bir kez gireceksiniz.
 */
const EV_SIFRESI = "1234";

const SAYFA = "Veriler";
const ANAHTAR_KURALI = /^(months|needs|settings)\/[A-Za-z0-9_.-]{1,60}$/;

function sayfa_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SAYFA);
  if (!sh) {
    sh = ss.insertSheet(SAYFA);
    sh.appendRow(["anahtar", "deger", "guncelleme"]);
    sh.setFrozenRows(1);
    ilkVeriler_(sh);
  }
  return sh;
}

// İlk kurulumda mevcut bilgiler otomatik eklenir
function ilkVeriler_(sh) {
  const simdi = new Date();
  const veriler = [
    ["months/2026-10", { aidat: true, aski: true, gaz: true, elektrik: true, internet: true, amt: { aidat: 2280 } }],
    ["settings/aidat", { amount: 2280 }],
    ["settings/hesap", { ad: "Osan Apartmanı Yöneticiliği", iban: "TR780003200000000153809380", banka: "TEB Bankası, Dikmen Şubesi" }]
  ];
  veriler.forEach(function (r) { sh.appendRow([r[0], JSON.stringify(r[1]), simdi]); });
}

function cevap_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function hepsi_() {
  const degerler = sayfa_().getDataRange().getValues();
  const data = {};
  for (let i = 1; i < degerler.length; i++) {
    const k = degerler[i][0];
    if (!k) continue;
    try { data[k] = JSON.parse(degerler[i][1]); } catch (e) {}
  }
  return data;
}

function doGet(e) {
  if (String(e.parameter.pin || "") !== EV_SIFRESI) return cevap_({ ok: false, error: "pin" });
  return cevap_({ ok: true, data: hepsi_() });
}

function doPost(e) {
  let b;
  try { b = JSON.parse(e.postData.contents); } catch (x) { return cevap_({ ok: false, error: "bad" }); }
  if (String(b.pin || "") !== EV_SIFRESI) return cevap_({ ok: false, error: "pin" });
  if (!ANAHTAR_KURALI.test(String(b.key || ""))) return cevap_({ ok: false, error: "bad" });

  const kilit = LockService.getScriptLock();
  kilit.waitLock(10000);
  try {
    const sh = sayfa_();
    const anahtarlar = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map(function (r) { return r[0]; });
    const satir = anahtarlar.indexOf(b.key) + 1;
    if (b.action === "set") {
      const v = JSON.stringify(b.value || {});
      if (v.length > 20000) return cevap_({ ok: false, error: "bad" });
      if (satir > 1) sh.getRange(satir, 2, 1, 2).setValues([[v, new Date()]]);
      else sh.appendRow([b.key, v, new Date()]);
    } else if (b.action === "delete") {
      if (satir > 1) sh.deleteRow(satir);
    } else {
      return cevap_({ ok: false, error: "bad" });
    }
    return cevap_({ ok: true, data: hepsi_() });
  } finally {
    kilit.releaseLock();
  }
}

// İsterseniz Apps Script'te bu fonksiyonu bir kez çalıştırıp kurulumu deneyebilirsiniz
function kurulumTesti() {
  Logger.log(JSON.stringify(hepsi_(), null, 2));
}
