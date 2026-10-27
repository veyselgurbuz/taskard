# Taskard

Görevlerin kart görünümünde gösterildiği, offline çalışan bir iOS/Android görev planlayıcı (Expo + React Native + TypeScript). Her göreve zorunlu bir öncelik (1-5) bağlanır, hatırlatıcı (yerel bildirim) kurulabilir, görev cihaz takvimine eklenebilir. Proje sahibi Veysel, 12+ yıl .NET/C# deneyimli, React Native ve TypeScript'te yeni: önemli veya alışılmadık kod kararlarını kısaca açıkla. Veysel ile Türkçe konuş.

Expo'ya özel kurallar (sürüme özel doküman, `npx expo install`, EAS, CNG): @AGENTS.md

## Komutlar

```bash
npx expo start          # geliştirme sunucusu (iPhone'da Expo Go ile)
npm run lint            # ESLint (expo lint)
npm run typecheck       # tsc --noEmit
npm test                # Jest + React Native Testing Library
npm run test:coverage   # kapsam raporu, src/domain ve src/data için eşik %80
npm run format          # Prettier ile biçimlendirme
npx expo-doctor         # bağımlılık/yapılandırma kontrolü
npx expo install <pkg>  # paket ekleme, npm install yerine HER ZAMAN bu
```

Windows/PowerShell: dev bağımlılığı `npx expo install <pkg> "--" --dev` ile eklenir. Tırnaksız `--` npm'e iletilmez ve paket `dependencies` altına düşer.

## Kodlama kuralları

- Kod, değişken, fonksiyon, dosya adları ve commit mesajları **İngilizce**. Dokümantasyon (`docs/`) **Türkçe**.
- TypeScript `strict`. `any` kullanılmaz. ESLint + Prettier.
- Paket ve SDK sürümleri ezberden yazılmaz: `npx expo install` kullan, emin olmadığın API için Context7 veya Expo'nun sürüme özel dokümanına bak.
- Katmanlar (`src/` altında):
  - `app/`: yalnızca Expo Router ekranları ve layout'lar
  - `domain/`: varlık tipleri, iş kuralları, validasyon (UI ve DB'den bağımsız)
  - `data/`: SQLite şeması, migration'lar, repository implementasyonları
  - `services/`: bildirim, takvim, izin servisleri
  - `features/`: özellik bazlı bileşen ve hook'lar
  - `i18n/`: çeviri dosyaları ve yapılandırma
  - `theme/`: tasarım token'ları
- **Test:** testler kodun yanında `__tests__/` klasöründe, `*.test.ts(x)` adıyla. Domain ve data katmanı önceliklidir.
- **Veri** ([ADR-0003](docs/decisions/ADR-0003-veri-offline-first.md)): ID'ler UUID, her kayıtta UTC `createdAt`/`updatedAt`, silme yalnızca yumuşak (`deletedAt`). Ekranlar ve hook'lar SQL/ORM çağırmaz, repository kullanır. `notificationId` ve `calendarEventId` cihaza özeldir.
- **Tarih:** UTC saklanır, yerel saatte `Intl` ile gösterilir.
- **i18n** ([ADR-0004](docs/decisions/ADR-0004-i18n.md)): ekranda sabit metin yok, her metin çeviri anahtarıyla.
- **Öncelik** ([ADR-0005](docs/decisions/ADR-0005-oncelik-modeli.md)): seviye (1-5) olarak saklanır, asla yalnızca renkle gösterilmez, metin etiketi de görünür.
- **Stil** ([ADR-0006](docs/decisions/ADR-0006-stil-tema.md)): `StyleSheet.create` + `src/theme/` token'ları. Sabit renk/boyut yok, inline stil yalnızca dinamik değer için. Renkler `useTheme()` ile alınır, palet doğrudan import edilmez. Her ekran açık ve koyu modda doğru görünmeli.
- **İzinler:** bildirim/takvim izni ilk kullanımda istenir, reddedilirse uygulama çökmez, kullanıcı bilgilendirilir.
- **Erişilebilirlik:** dokunma alanı en az 44pt, ekran okuyucu etiketleri, WCAG AA kontrast.
- **Arayüz:** Expo `building-native-ui` (yapı) ve Frontend Design (görsel özen) skill'leri birlikte kullanılır, çelişkide tema token'ları ve [Brief Bölüm 5](docs/PROJECT_BRIEF.md) önceliklidir.

## Git

- Ana dal `main`. Her Faz 1 plan adımı için feature branch + Pull Request.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:` ...).
- Pre-commit hook (husky + lint-staged) atlanmaz.

## Dokümantasyon kuralları (zorunlu)

1. Her görev tamamlandığında ilgili `docs/progress/` dosyası ve `CHANGELOG.md` güncellenir.
2. Mimari veya kapsam kararı değişirse yeni ADR açılır (eski ADR silinmez, "yerini aldı" olarak işaretlenir) ve `docs/PROJECT.md` revize edilir.
3. Doküman güncellemeleri ilgili kod değişikliğiyle aynı commit'te yapılır.
4. Faz bitiminde progress raporu tamamlanır ve `docs/PROJECT.md`'deki "güncel durum" bölümü güncellenir.
5. `docs/PROJECT_BRIEF.md` değiştirilmez. Dokümanlarda tarih `YYYY-MM-DD`, em dash kullanılmaz.

## Kalite kapısı (Definition of Done)

Bir iş ancak **review onayı + geçen testler + güncel dokümanlar** ile "bitti" sayılır. Akış her plan adımının sonunda `/ship` ile çalışır:

`unit-test-writer` → lint + typecheck + test → `code-reviewer` (Kritik/Önemli bulgu varsa düzelt ve tekrar, en fazla 3 tur, sonra Veysel'e danış) → `doc-keeper` → kod + test + doküman tek commit.

Ayrıntı: [Brief Bölüm 9](docs/PROJECT_BRIEF.md). Yeni agent önerileri için [PROJECT.md Agent yol haritası](docs/PROJECT.md).

## Dokümanlar

- [docs/PROJECT.md](docs/PROJECT.md): ana doküman, güncel durum, açık kararlar (paket kimliği Faz 1 sonunda kesinleşmeli)
- [docs/phases/phase-1-mvp.md](docs/phases/phase-1-mvp.md): Faz 1 kapsamı, kabul kriterleri, uygulama adımları
- [docs/data-model.md](docs/data-model.md): veri modeli
- [docs/decisions/](docs/decisions/): ADR'ler
- [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md): başlangıç kaydı
