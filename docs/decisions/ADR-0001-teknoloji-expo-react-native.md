# ADR-0001: Teknoloji, Expo + React Native + TypeScript

- **Tarih:** 2026-10-26
- **Durum:** Kabul edildi
- **Karar verenler:** Veysel Gürbüz (claude.ai planlama oturumu)

## Bağlam

Taskard iOS ve Android'de çalışacak, yerel bildirim ve cihaz takvimi kullanacak bir görev uygulamasıdır. Proje sahibinin 12+ yıl .NET/C# deneyimi var, React Native ve TypeScript'te yeni. Proje sahibinin Mac'i yok. Proje aynı zamanda bir öğrenme ve portföy projesidir.

## Değerlendirilen alternatifler

| Seçenek | Artı | Eksi |
|---|---|---|
| **Expo + React Native + TypeScript** | Resmi bildirim/takvim paketleri, EAS ile Mac'siz iOS derlemesi, geniş ekosistem | Proje sahibi için yeni dil ve framework |
| .NET MAUI | Proje sahibinin uzmanlık alanına yakın | iOS derlemesi Mac gerektirir, iş piyasasında talep daha düşük |
| Flutter | Güçlü UI araçları | Dart öğrenmek gerekir, web React'e taşınan bilgi yok |

## Karar

Mobil uygulama **Expo + React Native + TypeScript** ile geliştirilir. Faz 4'teki backend **ASP.NET Core Web API** olur.

## Gerekçe

- Bildirim ve takvim için resmi, bakımı süren paketler var (`expo-notifications`, `expo-calendar`).
- Expo'da EAS Build ile iOS derlemesi bulutta yapılır, Mac gerekmez.
- İş piyasasında React Native talebi MAUI'den yüksek, React bilgisi web React'e de taşınır.
- AI destekli geliştirmede bu ekosistemde örnek ve doküman zenginliği daha fazla.
- Backend proje sahibinin uzmanlık alanında kalır.

## Sonuçlar

- Paket sürümleri kurulum anında güncel Expo SDK'ya göre `npx expo install` ile seçilir, ezberden sürüm yazılmaz.
- Proje Expo SDK 58 ile başlatıldı (2026-10-26).
- Önemli veya alışılmadık kod kararlarında proje sahibi için kısa açıklama yapılır.
