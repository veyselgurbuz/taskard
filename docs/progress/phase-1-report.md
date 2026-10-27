# Faz 1 Raporu: MVP

> Plan: [phases/phase-1-mvp.md](../phases/phase-1-mvp.md)

## Tarih aralığı ve durum

- **Başlangıç:** -
- **Bitiş:** -
- **Durum:** Başlamadı (Faz 1 öncesi proje kurulumu sürüyor, bkz. aşağıdaki bölüm)

## Faz öncesi kurulum işleri (Brief Bölüm 10)

Bu işler Faz 1 uygulama adımlarından önce yapılan hazırlıktır, Faz 1 kabul kriterlerine sayılmaz.

### Adım 7: Agent'lar ve kalite kapısı (2026-10-27)

Karar kaydı: [ADR-0007](../decisions/ADR-0007-agentlar-kalite-kapisi.md)

**Yapılanlar**

- Üç agent tanımlandı (`.claude/agents/`): `code-reviewer`, `unit-test-writer`, `doc-keeper`.
- `/ship` skill'i eklendi (`.claude/skills/ship/SKILL.md`): test yazımı, lint + typecheck + test, review (en fazla 3 tur), doküman, tek commit.
- Test altyapısı: Jest + `jest-expo` preset'i + React Native Testing Library. Kapsam `src/domain` ve `src/data` için ölçülür, eşik %80 `package.json` içinde `coverageThreshold` ile zorlanır.
- Prettier kuruldu ve ESLint'e bağlandı. ESLint'te `no-explicit-any` hata seviyesinde.
- husky + lint-staged pre-commit hook'u: değişen `ts/tsx/js` dosyalarında `eslint --fix` ve `jest --findRelatedTests`, JSON dosyalarında Prettier, ardından `tsc --noEmit`.
- Yeni npm script'leri: `test`, `test:watch`, `test:coverage`, `format`, `prepare`.
- Agent'ları gösterebilmek için küçük bir örnek domain modülü eklendi: `src/domain/priority.ts` (ADR-0005 öncelik seviyeleri, etiket i18n anahtarları, sıralama karşılaştırıcısı).

**Kullanılan paketler** (hepsi `devDependencies`, `npx expo install` ile)

| Paket | Amaç |
|---|---|
| `jest`, `jest-expo`, `@types/jest` | Test çalıştırıcı ve Expo preset'i |
| `@testing-library/react-native` | Bileşen testleri (RNTL) |
| `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier` | Biçimlendirme, ESLint ile entegre |
| `husky`, `lint-staged` | Pre-commit hook |

**Kalite kapısı sonucu**

- `unit-test-writer`: `src/domain/__tests__/priority.test.ts` içinde 41 test, hepsi geçiyor, `priority.ts` kapsamı %100, hata bulunmadı.
- `code-reviewer` 1. tur: DÜZELTME GEREKLİ. Önemli: geliştirme araçları `dependencies` altına kurulmuştu. Öneri: etiket anahtarı için literal tip. Öneri: kapsam eşiği `/ship` içinde zorlanmıyordu. Üçü de düzeltildi.
- `code-reviewer` 2. tur: ONAY.

**Plandan sapmalar** (ayrıntı ADR-0007 "Sonuçlar")

- `doc-keeper` kök dizindeki `CHANGELOG.md`'ye de yazabilir.
- PR Review Toolkit agent'ları `code-reviewer` içinden değil, `/ship` akışında ana oturumdan çalıştırılır (alt agent'lar başka agent çağıramıyor).
- Agent'ların Bash ve dosya yolu sınırları araç düzeyinde değil, talimat düzeyinde.

## Yapılan işler

_Faz 1 uygulama adımları henüz başlamadı._

## Kullanılan teknolojiler ve paketler

_Faz 1 için henüz yok. Kurulum paketleri yukarıda._

## Karşılanan kabul kriterleri

_Henüz yok._

## Plandan sapmalar ve nedenleri

_Henüz yok._

## Bilinen sorunlar, kalan işler

- **`tsconfig.json` içindeki `"types": ["jest"]`** (code-reviewer Öneri, düzeltilmedi): Jest global'leri (`describe`, `expect` ...) üretim kodunda da görünür hale geliyor ve diğer `@types` paketlerinin otomatik dahil edilmesi kapanıyor. İleride testlere özel bir `tsconfig` veya `@jest/globals` importu düşünülmeli.

## Öğrenilenler

- **Windows PowerShell'de `--` ayracı:** `npx expo install <paket> -- --dev` PowerShell'de `--`'yi yutar, paketler `devDependencies` yerine `dependencies`'e gider. Doğru yazım `npx expo install <paket> "--" --dev`. Bu hata kurulumda yaşandı ve `code-reviewer` tarafından yakalandı.
- **Agent ile hook'un iş bölümü:** Agent'lar yargı gerektiren işleri (review, test tasarımı, doküman) yapar, pre-commit hook ise deterministik alt sınırı (lint, tip, test) agent'lar atlansa bile korur.
- **TypeScript `as const` ve `satisfies`:** `priority.ts` içinde `as const satisfies Record<PriorityLevel, string>` hem her seviyenin bir anahtarı olduğunu derleme zamanında denetler hem de anahtarları literal tip (`'priority.high'` gibi) olarak korur. C#'taki enum + sözlük ikilisinin tip güvenli karşılığı gibi düşünülebilir.
