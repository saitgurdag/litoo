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

## Ortak mağaza bağlantısı

Paylaşılacak adres: `https://litooapp.com/app` (statik dizin adresi `/app/`). Android Google Play’e, iPhone/iPad App Store’a yönlenir. Masaüstü, tanınmayan cihazlar ve JavaScript kapalı olduğunda iki mağaza bağlantısı gösterilir. Yönlendirme başarısız olursa bağlantılar sayfada kalır. Yeni servis veya uygulama değişikliği gerekmez.

Mevcut izinli `utm_source` / `utm_campaign` etiketleri `/app` adresinde de kullanılabilir; Android bağlantıları `growth.js` tarafından güncellendikten sonra yönlendirme çalışır. iOS kampanya parametresi eklenmez. Yönlendirme hedefi sorgu parametrelerinden alınmaz.

## Hikâye sorusu pilotu — 23 Ekim 2026

Bu pilotta paylaşılacak profil bağlantıları:

- Instagram: `https://litooapp.com/app/?utm_source=instagram&utm_medium=organic_social&utm_campaign=story_quiz_pilot_202610&utm_content=profile`
- YouTube: `https://litooapp.com/app/?utm_source=youtube&utm_medium=organic_social&utm_campaign=story_quiz_pilot_202610&utm_content=profile`

`utm_content=mountains_hiking_01` bu tek videoya özel doğrudan bağlantılarda
kullanılabilir. Profil bağlantısı birden çok video tarafından paylaşılır; profil
ziyaretini otomatik olarak tek bir videoya atfetmeyin.

Android'de etiketler hem mevcut üst seviye UTM parametrelerinde hem de URL
kodlanmış `referrer` alanında korunur. Firebase SDK'sı bu kurulum yolunu
destekler; gerçek Play kurulumu ve ilk açılıştaki edinme raporu ayrıca kontrol
edilmeden uçtan uca atıf doğrulandı sayılmaz.

iOS'ta bu pilot ve Instagram/YouTube kaynakları için App Store Connect kampanya
oluşturucusundan alınan gerçek bağlantılar kullanılır:

- Instagram: `https://apps.apple.com/app/apple-store/id6742233378?pt=127604962&ct=ig_story_quiz_202610&mt=8`
- YouTube: `https://apps.apple.com/app/apple-store/id6742233378?pt=127604962&ct=yt_story_quiz_202610&mt=8`

Eski kampanyalar ve kaynaksız ziyaretler mevcut iOS bağlantısını korur. Apple
kampanya raporları gecikme ve en az beş kullanıcı gibi gizlilik eşiklerine
tabidir; raporda görünmemek sıfır indirme anlamına gelmez. Kampanya etiketleri
RevenueCat'teki bireysel müşteri veya gelire kendiliğinden bağlanmaz.

Merkezi web analytics sağlayıcısı eklenmedi; yerel `litoo_growth` olayı halen
yalnız bir entegrasyon noktasıdır, tıklama sayacı değildir. Yeni tracker veya
çerez yok. Regresyon: `node --test tests/growth.test.cjs`.
