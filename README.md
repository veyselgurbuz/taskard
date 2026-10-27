# Taskard

Görevlerin kart görünümünde gösterildiği, offline çalışan bir mobil görev planlayıcı. Her göreve zorunlu bir öncelik bağlanır, tarih/saat ve hatırlatıcı kurulabilir, görev cihaz takvimine eklenebilir.

**Teknoloji:** Expo (SDK 58) · React Native · TypeScript · Expo Router · SQLite
**Platformlar:** iOS, Android
**Durum:** Faz 1 (MVP) öncesi, proje kurulumu

> Bu proje aynı zamanda bir öğrenme ve portföy projesidir. Kararlar ve gerekçeleri [docs/decisions/](docs/decisions/) altında tutulur.

## Gereksinimler

- Node.js LTS (geliştirme ortamında v24 kullanılıyor)
- Git
- Telefonda [Expo Go](https://expo.dev/go) uygulaması

## Kurulum

```bash
git clone https://github.com/veyselgurbuz/taskard.git
cd taskard
npm install
```

## Çalıştırma

```bash
npx expo start
```

Terminalde çıkan QR kodu iPhone'da Kamera, Android'de Expo Go ile okutun.

## Kontroller

```bash
npm run lint            # ESLint (Prettier kuralları dahil)
npm run typecheck       # tip kontrolü (tsc --noEmit)
npm test                # Jest + React Native Testing Library
npm run test:watch      # testleri izleme modunda çalıştırır
npm run test:coverage   # kapsam raporu, src/domain ve src/data için eşik %80
npm run format          # Prettier ile tüm dosyaları biçimlendirir
npx expo-doctor         # bağımlılık ve yapılandırma kontrolü
```

### Pre-commit hook

`npm install` sırasında husky hook'u otomatik kurar (`prepare` script'i). Her commit'te şunlar çalışır:

- Değişen `ts/tsx/js` dosyalarında `eslint --fix` ve ilgili testler (`jest --findRelatedTests`).
- Değişen JSON dosyalarında Prettier.
- Tüm projede tip kontrolü (`tsc --noEmit`).

Hook `--no-verify` ile atlanmaz. Ayrıntı: [ADR-0007](docs/decisions/ADR-0007-agentlar-kalite-kapisi.md).

## Klasör yapısı

```
src/
  app/        Expo Router ekranları
  domain/     Varlık tipleri, iş kuralları, validasyon (testleri __tests__/ altında)
docs/         Proje dokümantasyonu (Türkçe)
```

Diğer katmanlar (`data`, `services`, `features`, `i18n`, `theme`) Faz 1 ile birlikte eklenecek.

## Doküman haritası

| Doküman | İçerik |
|---|---|
| [docs/PROJECT.md](docs/PROJECT.md) | **Ana doküman:** amaç, kapsam, karar özeti, güncel durum, açık kararlar |
| [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md) | Planlama oturumunun çıktısı (tarihsel kayıt) |
| [docs/data-model.md](docs/data-model.md) | Veri modeli |
| [docs/decisions/](docs/decisions/) | Mimari karar kayıtları (ADR) |
| [docs/phases/](docs/phases/) | Faz planları ve kabul kriterleri |
| [docs/progress/](docs/progress/) | Faz raporları |
| [docs/feedback/](docs/feedback/) | Yayın sonrası geri bildirimler |
| [CHANGELOG.md](CHANGELOG.md) | Sürüm değişiklikleri |
| [CLAUDE.md](CLAUDE.md) | Claude Code talimatları |

## Lisans

Copyright (c) 2026 Veysel Gürbüz. Tüm hakları saklıdır.

Kaynak kod inceleme amacıyla herkese açıktır, ancak açık kaynak lisansıyla dağıtılmamaktadır. Kodun kopyalanması, değiştirilmesi veya dağıtılması için izin gereklidir.
