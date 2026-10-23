# Ankara Sayınlar

Aybüke, Ezgican ve Aybala'nın sırayla ödediği ev faturaları, aidat ve ev ihtiyaçları için telefon uygulaması.

- **Fatura ve Aidatlar:** her ay sırası gelen kişinin kutusu, aidat tutarı ve hesap bilgisi, Ekim 2026 – Aralık 2028 ödeme takvimi
- **Ev İhtiyaçları:** ortak alışveriş listesi
- Her değişiklikte WhatsApp'a hazır mesaj

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Uygulamanın kendisi |
| `manifest.webmanifest` | Telefona uygulama olarak eklenme ayarları |
| `icons/` | Ana ekran ikonları |
| `apps-script/Code.gs` | Google E-Tablo bağlantısı (GitHub'da çalışmaz, E-Tablo'ya kopyalanır) |

Veriler Google E-Tablo'daki **Veriler** sayfasında tutulur. Uygulama ev şifresiyle açılır; şifre `Code.gs` dosyasındaki `EV_SIFRESI` satırında belirlenir.
