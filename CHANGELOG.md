# Changelog

Bu projedeki tüm önemli değişiklikler bu dosyada tutulur.

Biçim [Keep a Changelog](https://keepachangelog.com/tr-TR/1.1.0/) standardına, sürümleme [Semantic Versioning](https://semver.org/lang/tr/) kurallarına uyar.

## [Unreleased]

### Added

- Faz 1 uygulama planı (8 adım) ve Brief Bölüm 2.2 planlama kararları, `docs/phases/phase-1-mvp.md`.
- Expo SDK 58 şablonuyla (TypeScript, Expo Router) proje iskeleti. Uygulama adı "Taskard", geçici paket kimliği `com.veyselgurbuz.taskard`.
- Dokümantasyon iskeleti: `PROJECT.md`, `PROJECT_BRIEF.md`, `data-model.md`, ADR-0001 ... ADR-0006, Faz 1 planı, Faz 1 rapor şablonu, geri bildirim şablonu.
- `.gitattributes` ile satır sonlarının LF olarak sabitlenmesi.
- `CLAUDE.md` proje talimatları ve proje kapsamında Claude Code plugin yapılandırması (`.claude/settings.json`).
- `code-reviewer`, `unit-test-writer` ve `doc-keeper` agent'ları, `/ship` skill'i ve ADR-0007 (agent'lar ve kalite kapısı).
- Jest + `jest-expo` + React Native Testing Library test altyapısı, `src/domain` ve `src/data` için %80 kapsam eşiği.
- Prettier (ESLint'e bağlı) ve husky + lint-staged pre-commit hook'u (eslint, ilgili testler, Prettier, `tsc --noEmit`).
- npm script'leri: `test`, `test:watch`, `test:coverage`, `format`, `prepare`.
- `src/domain/priority.ts`: öncelik seviyeleri (1-5), etiket i18n anahtarları, sıralama karşılaştırıcısı ve 41 unit test.

### Changed

- ESLint: `@typescript-eslint/no-explicit-any` hata seviyesine çekildi, `coverage/` yok sayılıyor.
- `tsconfig.json`: Jest tipleri eklendi (`"types": ["jest"]`).
- `.gitignore`: `coverage/` eklendi.

### Removed

- Expo şablonundaki örnek ekranlar, bileşenler ve demo görseller.
- Expo şablonundan gelen MIT `LICENSE` dosyası. Proje şimdilik lisanssızdır, tüm hakları saklıdır.
