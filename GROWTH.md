# Türkiye organik indirme yolu

Ana sayfa Türkçe; önceki İngilizce sayfa `/en/` altında korunur. Statik HTML, paket yükleme veya build gerektirmez. `CNAME` ve gizlilik metni değişmedi.

Web örneği uygulama arayüzü değildir. Tek bir cümlenin `little → küçük` çevirisini gösterir; kelime kartına kayıt veya üyelik işlemi yapmaz. Mevcut yayındaki web ürün görseli korunur.

## Kanal bağlantıları

- Instagram: `https://litooapp.com/?utm_source=instagram&utm_campaign=ig_reading_01`
- YouTube: `https://litooapp.com/?utm_source=youtube&utm_campaign=yt_reading_01`
- TikTok: `https://litooapp.com/?utm_source=tiktok&utm_campaign=tt_reading_01`

Bu bağlantılar hazırlanmıştır; sosyal hesapta paylaşılmadı. Instagram işlemleri ayrı kullanıcı onayına bağlıdır.

Android düğmeleri izin verilen kanal/kampanya etiketlerini taşır. Bu etiketlerin varlığı tamamlanmış kurulum atfı garantisi değildir; Firebase'de Install Referrer/edinme entegrasyonu ve Play raporu ayrıca doğrulanmalıdır. iOS bağlantısında sahte `pt`, `ct` veya `ppid` yok; gerçek kampanya URL'si App Store Connect'ten oluşturulunca yerleştirilir.

`assets/growth.js`, `litoo_growth` adlı yerel CustomEvent üretir: `store_click` (platform, placement) ve `demo_word_open`. Kaynak, kampanya ve locale eklenir. **Şu anda merkezi veri toplanmaz.** Kullanıcı web GA4 kimliği olmadığını doğruladı; analytics sağlayıcısı veya otomatik izleyici eklenmedi. Yalnızca tanımlı kaynaklar ve `ig/yt/tt_reading_NN` kampanyaları kabul edilir; tam URL veya keyfi query parametreleri olaylara eklenmez.

## Yayın

GitHub Pages kullanılıyorsa mevcut yayın dalı/dizini korunmalıdır. Depoda yalnızca statik dosyalar ve `CNAME` var; Pages ayarı doğrulanmadan barındırmanın Google veya GitHub olduğu kesin söylenemez. Bu değişikliği mevcut yayın yoluna dahil edin; Sites'ta farklı bir domain/proje oluşturulmadı.

Yerel önizleme: `python3 -m http.server 4175 --bind 127.0.0.1`. Türkçe ana sayfa, `/en/`, gizlilik bağlantıları, telefonda taşma ve demo aç/kapat işlemi kontrol edilmeli. `robots.txt`/`sitemap.xml` indekslenme garantisi değildir.
