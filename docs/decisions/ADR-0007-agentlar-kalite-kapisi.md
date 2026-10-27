# ADR-0007: Agent'lar ve kalite kapısı

- **Tarih:** 2026-10-27
- **Durum:** Kabul edildi
- **Karar verenler:** Veysel Gürbüz (claude.ai planlama oturumu, Brief Bölüm 9), uygulama ayrıntıları Claude Code ilk kurulum oturumu

## Bağlam

Proje sahibi React Native'de yeni ve süreci izlenebilir tutmak istiyor. Her plan adımında kodun bağımsız gözle incelenmesi, testlerin yazılması ve dokümanların güncel kalması gerekiyor. Bunun hem Claude Code agent'larıyla (yargı gerektiren işler) hem de Git hook'larıyla (deterministik kontroller) güvence altına alınması hedefleniyor.

## Değerlendirilen alternatifler

| Seçenek | Artı | Eksi |
|---|---|---|
| **Özel agent'lar + `/ship` skill'i + pre-commit hook** | Her adımda aynı akış, bağımsız review, deterministik alt sınır | Agent yetki sınırlarının bir kısmı talimatla korunuyor |
| Yalnızca CI (GitHub Actions) | Yerelden bağımsız | Hata commit'ten sonra yakalanır, review ve doküman işini çözmez |
| Elle kontrol listesi | Kurulum yok | Unutulmaya açık, tekrarlanabilir değil |

## Karar

### Agent'lar (`.claude/agents/`)

| Agent | Yetki | Görev |
|---|---|---|
| `code-reviewer` | Read, Grep, Glob, Bash (git diff/log, lint, typecheck, test). Yazma yok. | Diff'i CLAUDE.md, ADR'ler ve proje kontrol listesine göre inceler, `[Kritik/Önemli/Öneri]` bulgular ve `ONAY` / `DÜZELTME GEREKLİ` kararı verir. `react-native-best-practices` skill'i önceden yüklenir. |
| `unit-test-writer` | Read, Grep, Glob, Bash (test), Write/Edit yalnızca test dosyalarında | Jest + RNTL testleri yazar ve çalıştırır, hata bulursa düzeltmez, raporlar. |
| `doc-keeper` | Read, Grep, Glob, Bash (git), Write/Edit yalnızca `docs/`, `README.md`, `CHANGELOG.md` | Progress raporu, CHANGELOG, faz planı, PROJECT.md, ADR taslakları. `PROJECT_BRIEF.md` ve `CLAUDE.md`'ye dokunmaz. |

### `/ship` skill'i (`.claude/skills/ship/SKILL.md`)

`unit-test-writer` → lint + typecheck + test → `code-reviewer` (en fazla 3 tur) → `doc-keeper` → kod + test + doküman tek commit. Push ve PR için Veysel'e sorulur.

### Test altyapısı

- `jest` + `jest-expo` preset'i + `@testing-library/react-native`, `npx expo install` ile SDK 58 uyumlu sürümler.
- Testler kodun yanında `__tests__/` klasöründe, `*.test.ts(x)` adıyla.
- Kapsam `src/domain` ve `src/data` için ölçülür, eşik %80 (`npm run test:coverage`).

### Biçimlendirme ve pre-commit hook

- Prettier (`singleQuote`, `printWidth: 100`, `trailingComma: all`), ESLint'e `eslint-plugin-prettier` ile bağlı. Markdown dosyaları Prettier dışında (Türkçe dokümanların tabloları elle düzenleniyor).
- husky + lint-staged. Pre-commit: değişen `ts/tsx/js` dosyalarında `eslint --fix` ve `jest --findRelatedTests`, değişen JSON dosyalarında Prettier, ardından tüm projede `tsc --noEmit`. `--no-verify` kullanılmaz.

## Gerekçe

- Review agent'ına geliştiricinin gerekçeleri verilmez, böylece bağımsız bakış korunur.
- Her agent yalnızca kendi sorumluluk alanına yazar, birbirinin işini bozamaz.
- Hook, agent'lar atlansa bile lint, tip ve test hatasının `main`'e girmesini engeller.

## Sonuçlar

- **Brief'ten sapmalar:**
  - `doc-keeper` kök dizindeki `CHANGELOG.md`'ye de yazabilir (CHANGELOG kök dizinde tutulduğu için, bkz. PROJECT.md).
  - Alt agent'lar başka agent çağıramadığı için PR Review Toolkit agent'ları (`silent-failure-hunter`, `type-design-analyzer`) `code-reviewer` içinden değil, `/ship` akışında ana oturumdan paralel çalıştırılır. `code-reviewer` onların bakış açısını kendi kontrol listesinde de uygular.
- **Bilinen sınır:** Bash komutlarının ve dosya yollarının kısıtlanması agent talimatıyla sağlanır, araç düzeyinde zorlanmaz. Gerekirse ileride agent'a özel hook'larla sertleştirilir.
- Yeni agent'lar `PROJECT.md` "Agent yol haritası" kurallarına göre, Veysel onayı ve yeni ADR ile eklenir.
