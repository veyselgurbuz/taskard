# ADR-0002: Platform, iOS + Android

- **Tarih:** 2026-10-26
- **Durum:** Kabul edildi
- **Karar verenler:** Veysel Gürbüz (claude.ai planlama oturumu)

## Bağlam

Proje sahibi iPhone kullanıyor, yedekte bir Android cihazı var. Uygulama iki mağazada da yayınlanmak isteniyor.

## Karar

- Hedef platformlar **iOS ve Android**.
- Geliştirme sırasında test **Expo Go** ile yapılır. Expo Go yetmediğinde (Expo Go'da bulunmayan native modül ihtiyacı) **EAS ile development build**'e geçilir.
- Yayın **App Store ve Google Play**'e, **EAS Build/Submit** ile yapılır.

## Gerekçe

- Proje sahibinin günlük cihazı iPhone, uçtan uca test bu cihazda yapılabilir.
- Expo Go kurulum gerektirmeden hızlı geri bildirim sağlar.
- EAS, Mac olmadan iOS derlemesi ve mağaza gönderimi sağlar.

## Sonuçlar

- iPhone'daki Expo Go yalnızca en güncel SDK'yı çalıştırır. SDK yükseltmeleri ertelenirse development build'e geçmek gerekir.
- Web hedefi şablonda mevcut ama kapsam dışıdır, test edilmez.
- İlk mağaza yüklemesinden önce paket kimliği kesinleşmelidir (bkz. [PROJECT.md](../PROJECT.md) Açık kararlar).
