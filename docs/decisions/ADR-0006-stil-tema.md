# ADR-0006: Stil, StyleSheet + tema token'ları, koyu mod desteği

- **Tarih:** 2026-10-26
- **Durum:** Kabul edildi
- **Karar verenler:** Veysel Gürbüz (claude.ai planlama oturumu)

## Bağlam

Uygulama açık ve koyu modu baştan destekleyecek. Proje sahibi React Native'de yeni ve önce platformun kendi stil sistemini öğrenmek istiyor.

## Değerlendirilen alternatifler

| Seçenek | Artı | Eksi |
|---|---|---|
| **`StyleSheet` + tema token'ları** | Ek bağımlılık yok, RN'in kendi sistemini öğretir, SDK yükseltmelerinde sürpriz riski düşük | Tailwind'e göre daha uzun stil kodu |
| NativeWind (Tailwind sözdizimi) | Kısa sözdizimi, web Tailwind bilgisi taşınır | Ek soyutlama, derleme yapılandırması, öğrenme yükü |

## Karar

`StyleSheet.create` + `src/theme/` altındaki tema token'ları kullanılır.

### Uygulama kuralları

- Stiller `StyleSheet.create` ile tanımlanır. Bileşen içinde satır içi (inline) stil nesnesi yalnızca dinamik değerler için kullanılır.
- Tüm renk, boşluk, yazı boyutu, yazı ağırlığı, köşe yarıçapı ve gölge değerleri `src/theme/` altında token olarak tanımlanır.
- Renkler anlamsal isimlerle tanımlanır (örn. `background`, `surface`, `textPrimary`, `textSecondary`, `border`, `priority5` ... `priority1`), ham renk adlarıyla tanımlanmaz.
- **Koyu mod:** Açık ve koyu olmak üzere iki renk paleti vardır, diğer token'lar ortaktır. Bileşenler renkleri bir tema hook'u (örn. `useTheme()`) üzerinden alır, hiçbir bileşen doğrudan palet import etmez.
- **Tema seçimi:** Kullanıcı ayarlardan Açık / Koyu / Sistem seçer. Varsayılan "Sistem"dir ve cihazın görünüm ayarı değiştiğinde uygulama anında güncellenir. Seçim `Settings` tablosunda saklanır.
- Durum çubuğu, navigasyon başlıkları, modal arka planları, tarih/saat seçici ve açılış ekranı (splash) da temaya uyar.
- Her iki modda da metin/zemin kontrastı WCAG AA standardına uygun olmalıdır.

## Gerekçe

- Önce RN'in kendi stil sistemini öğrenmek, ek bir soyutlama katmanı eklememek tercih edildi.
- Token'lar tek dosyada olduğu için tasarım tutarlılığı ve `code-reviewer` agent'ının "sabit renk" kontrolü basittir.

## Sonuçlar

- İleride Tailwind öğrenilmek istenirse NativeWind'e geçiş ayrı bir öğrenme fazı olarak planlanabilir. Token'lar tek yerde olduğu için geçiş kolaydır.
- Bileşenlerde sabit renk kodu kullanılmaz, `code-reviewer` bunu bulgu olarak raporlar.
