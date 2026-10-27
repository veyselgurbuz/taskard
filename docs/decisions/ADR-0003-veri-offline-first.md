# ADR-0003: Veri, offline-first, senkronizasyona hazır

- **Tarih:** 2026-10-26
- **Durum:** Kabul edildi
- **Karar verenler:** Veysel Gürbüz (claude.ai planlama oturumu)

## Bağlam

MVP'de hesap ve sunucu yok, ama Faz 4'te ASP.NET Core backend ile senkronizasyon planlanıyor. MVP'deki veri kararları bu geçişi zorlaştırmamalı.

## Karar

- **MVP:** Veriler yalnızca cihazda, SQLite (`expo-sqlite`) içinde tutulur. Tip güvenliği için hafif bir ORM kullanılır (Drizzle önerilir, kurulumda güncel SDK ile uyumluluğu doğrulanır). Hesap/giriş yoktur.
- **Faz 4:** ASP.NET Core Web API + kimlik doğrulama + senkronizasyon.

### Senkronizasyona hazırlık kuralları (MVP'den itibaren zorunlu)

1. Tüm ID'ler UUID'dir, otomatik artan sayı kullanılmaz.
2. Her kayıtta `createdAt` ve `updatedAt` (UTC) bulunur.
3. Silme yumuşak silmedir (`deletedAt`), fiziksel silme yapılmaz.
4. Veri erişimi repository arayüzlerinin arkasındadır. Ekranlar ve hook'lar doğrudan SQL veya ORM çağırmaz.
5. Cihaza özel alanlar (`notificationId`, `calendarEventId`) senkronize edilmeyecek şekilde işaretlenir.

## Gerekçe

- UUID'ler farklı cihazlarda üretilen kayıtların çakışmadan birleşmesini sağlar.
- `updatedAt` ve yumuşak silme, senkronizasyonda "son değişiklik" ve "silinen kayıt" bilgisinin kaybolmamasını sağlar.
- Repository katmanı, ileride yerel kaynağın yanına uzak kaynak eklendiğinde ekranların değişmemesini sağlar.

## Sonuçlar

- **Hatırlatıcılar her durumda cihazda planlanan yerel bildirimlerdir.** Bulut, hatırlatıcı mekanizmasını değiştirmez.
- Yumuşak silinen kayıtlar zamanla birikir. Temizleme politikası Faz 4'te senkronizasyonla birlikte ele alınır.
- Veri modeli ayrıntısı: [data-model.md](../data-model.md)
