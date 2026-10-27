# Mimari Karar Kayıtları (ADR)

Her önemli mimari veya kapsam kararı burada ayrı bir dosyada tutulur.

## Kurallar

- **Dosya adı:** `ADR-NNNN-kisa-baslik.md`, numaralar sıralı ve tekrar kullanılmaz.
- Karar değişirse eski ADR silinmez. Yeni ADR açılır, eskisinin durumu "Yerini aldı: ADR-NNNN" olarak işaretlenir ve [PROJECT.md](../PROJECT.md) revize edilir.
- ADR yalnızca Veysel ile veya ana oturumda alınmış bir kararı kaydeder, karar uydurmaz.

## Şablon

```markdown
# ADR-NNNN: Başlık

- **Tarih:** YYYY-MM-DD
- **Durum:** Önerildi | Kabul edildi | Yerini aldı: ADR-NNNN
- **Karar verenler:**

## Bağlam
## Değerlendirilen alternatifler
## Karar
## Gerekçe
## Sonuçlar
```

## Liste

| No | Başlık | Durum |
|---|---|---|
| [0001](ADR-0001-teknoloji-expo-react-native.md) | Teknoloji, Expo + React Native + TypeScript | Kabul edildi |
| [0002](ADR-0002-platform-ios-android.md) | Platform, iOS + Android | Kabul edildi |
| [0003](ADR-0003-veri-offline-first.md) | Veri, offline-first, senkronizasyona hazır | Kabul edildi |
| [0004](ADR-0004-i18n.md) | Çok dil, i18n altyapısı baştan | Kabul edildi |
| [0005](ADR-0005-oncelik-modeli.md) | Öncelik modeli, seviye ve etiket ayrımı | Kabul edildi |
| [0006](ADR-0006-stil-tema.md) | Stil, StyleSheet + tema token'ları, koyu mod | Kabul edildi |
| [0007](ADR-0007-agentlar-kalite-kapisi.md) | Agent'lar ve kalite kapısı | Kabul edildi |
