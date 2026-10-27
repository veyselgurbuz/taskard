# Taskard, Ana Proje Dokümanı

> Projenin güncel durumunu, kapsamını ve kararlarının özetini tutan ana doküman.
> Başlangıç kaydı için [PROJECT_BRIEF.md](PROJECT_BRIEF.md) (değiştirilmez), ayrıntılı kararlar için [decisions/](decisions/).

**Proje sahibi:** Veysel Gürbüz
**Repo:** https://github.com/veyselgurbuz/taskard
**Son güncelleme:** 2026-10-27

---

## 1. Amaç

Taskard ("task" + "card"), görevlerin kart görünümünde gösterildiği bir mobil görev planlayıcıdır. Kullanıcı her göreve zorunlu bir öncelik bağlar, isterse tarih/saat ve hatırlatıcı kurar, görevi cihaz takvimine ekleyebilir.

İkincil hedef öğrenme ve portföydür: React Native/TypeScript öğrenmek ve ileride ASP.NET Core backend ile uçtan uca bir çözüm ortaya koymak. Bu nedenle kod okunabilir, iyi yapılandırılmış ve açıklanabilir olmalıdır.

## 2. Kapsam

| Faz | İçerik | Durum |
|---|---|---|
| Faz 1, MVP | Görev CRUD, 5 sabit öncelik, tek hatırlatıcı, takvime ekleme, TR/EN, açık/koyu tema, yerel SQLite | Planlandı |
| Faz 2 | Öncelik etiketlerinin kişiselleştirilmesi, Dalga 2 dilleri | Planlanmadı |
| Faz 3 | Tekrarlayan görevler, çoklu hatırlatıcı | Planlanmadı |
| Faz 4+ | ASP.NET Core Web API, kimlik doğrulama, senkronizasyon, Dalga 3 dilleri, gerçek alarm, widget | Planlanmadı |

Faz 1 kapsamı ve kabul kriterleri: [phases/phase-1-mvp.md](phases/phase-1-mvp.md)

## 3. Karar özeti

| ADR | Karar | Durum |
|---|---|---|
| [ADR-0001](decisions/ADR-0001-teknoloji-expo-react-native.md) | Expo + React Native + TypeScript, backend ASP.NET Core (Faz 4) | Kabul edildi |
| [ADR-0002](decisions/ADR-0002-platform-ios-android.md) | iOS + Android, geliştirmede Expo Go, yayında EAS | Kabul edildi |
| [ADR-0003](decisions/ADR-0003-veri-offline-first.md) | Offline-first SQLite, senkronizasyona hazır kurallar | Kabul edildi |
| [ADR-0004](decisions/ADR-0004-i18n.md) | i18n altyapısı baştan, TR + EN ile başlangıç | Kabul edildi |
| [ADR-0005](decisions/ADR-0005-oncelik-modeli.md) | Öncelik seviye (1-5) olarak saklanır, etiket ayrı çözülür | Kabul edildi |
| [ADR-0006](decisions/ADR-0006-stil-tema.md) | StyleSheet + tema token'ları, açık/koyu/sistem tema | Kabul edildi |
| [ADR-0007](decisions/ADR-0007-agentlar-kalite-kapisi.md) | 3 agent + `/ship` akışı, Jest + RNTL, Prettier, husky + lint-staged pre-commit | Kabul edildi |

### Brief'e ek olarak ilk oturumda alınan kararlar (2026-10-26)

- **Ekran klasörü `src/app/`:** Brief ekranları kök dizindeki `app/` altına koymuştu. Güncel Expo şablonu (SDK 58) `src/app/` kullanıyor, tüm kaynak kod `src/` altında tek çatıda toplandığı için şablona uyuldu.
- **`CHANGELOG.md` kök dizinde:** Keep a Changelog geleneği ve GitHub'ın beklediği konum.
- **İlk commit:** İskelet, dokümanlar ve agent tanımları tek commit olarak doğrudan `main`'e atılır. Faz 1 adımlarından itibaren her adım feature branch + Pull Request ile ilerler.
- **Repo görünürlüğü:** Public (portföy hedefi).
- **Göreli hatırlatıcı kuralı:** `relative` türündeki hatırlatıcı `dueAt`'e göre hesaplandığı için, tarihi olmayan göreve göreli hatırlatıcı kurulamaz. Faz 1 planında validasyon kuralı olarak ele alınacak.

### Faz 1 planlama kararları (2026-10-27)

Brief Bölüm 2.2 konuları Faz 1 planıyla birlikte onaylandı: varsayılan sıralama (tamamlanmamışlar, öncelik, tarih), iki hatırlatıcı türü (belirli saat ve görevden önce), ORM olarak Drizzle (Adım 2'de uyumluluk doğrulamasıyla), adım başına feature branch + PR + squash merge. Göreli hatırlatıcıda `dueAt` silinirse hatırlatıcı yumuşak silinir ve bildirimi iptal edilir. Ayrıntı: [phases/phase-1-mvp.md](phases/phase-1-mvp.md) "Uygulama adımları".

## 4. Güncel durum

**Faz:** Faz 1 öncesi, proje kurulumu (Brief Bölüm 10)
**Tarih:** 2026-10-27

Tamamlananlar:
- Ortam kontrolü (Node 24 LTS, Git, GitHub CLI).
- Expo SDK 58 şablonuyla proje oluşturuldu, uygulama adı ve paket kimliği ayarlandı.
- Public GitHub reposu oluşturuldu.
- Dokümantasyon iskeleti oluşturuldu.
- `CLAUDE.md` yazıldı, skill ve plugin'ler proje kapsamında kuruldu.
- Agent'lar ve kalite kapısı (adım 7, [ADR-0007](decisions/ADR-0007-agentlar-kalite-kapisi.md)): `code-reviewer`, `unit-test-writer`, `doc-keeper`, `/ship` skill'i, Jest + RNTL, Prettier, husky + lint-staged pre-commit. Örnek olarak `src/domain/priority.ts` ve testleri eklendi. Ayrıntı: [progress/phase-1-report.md](progress/phase-1-report.md).
- Faz 1 uygulama planı hazırlandı ve onaylandı (adım 8, [phases/phase-1-mvp.md](phases/phase-1-mvp.md)).
- İlk commit (adım 9): iskelet, dokümanlar ve agent tanımları `main`'e.

Sıradakiler:
1. Faz 1 Adım 1: Tema ve i18n altyapısı (`feat/theme-i18n`).

## 5. Açık kararlar (takip listesi)

`doc-keeper` her faz kapanışında bu listeyi kontrol eder ve süresi gelen maddeleri Veysel'e hatırlatır.

| Konu | Mevcut durum | Kesinleşme zamanı |
|---|---|---|
| **Paket kimliği** (`app.json` içindeki iOS `bundleIdentifier` ve Android `package`) | Geçici olarak `com.veyselgurbuz.taskard` kullanılıyor | **Faz 1 sonunda ZORUNLU.** Seçenekler: kişisel ad (`com.veyselgurbuz`), GitHub kullanıcı adı (`io.github.veyselgurbuz`), uygulamaya özel alan adı (örn. `app.taskard`), stüdyo/marka adı. İlk mağaza yüklemesinden sonra değiştirilemez. |
| **Veri modeli: cihaza özel alanlar ve `completedAt`** | Kabul edildi (`notificationId` ve `calendarEventId` senkronize edilmez, tamamlanma `completedAt` ile tutulur) | Faz 3 planlamasında tekrar gözden geçirilir ("iptal", "ertelendi" gibi durumlar istenirse `status` alanı eklenir) |
| **"Taskard" adının müsaitliği** | Hızlı web taramasında bu adla uygulamaya rastlanmadı, resmi kontrol yapılmadı | İlk mağaza yüklemesinden önce: App Store ve Google Play araması, TÜRKPATENT marka sorgusu, alan adı (örn. `taskard.app`) kontrolü. Sonuç Veysel'e raporlanır. |
| **Lisans** | Lisans yok, tüm hakları saklıdır (2026-10-26). Expo şablonundan gelen MIT `LICENSE` dosyası silindi. Gerekçe: ileride para kazanma ihtimali var; lisanssızdan MIT'e geçmek her an mümkün, MIT ile yayınlanan kodu geri almak mümkün değil. | Para kazanma planı netleşince yeniden değerlendirilir. Faz 4'te backend'in ayrı ve private repoda tutulması seçeneği de o zaman ele alınır. |

## 6. Agent yol haritası

Gelecekte eklenecek agent'lar ve tetikleyicileri. Kurallar için Brief Bölüm 9.5'e bakın: tetikleyici kontrolü, üç kez tekrar eden iş tespiti, onay ve ADR kaydı.

| Agent | Görevi | Tetikleyici | Durum |
|---|---|---|---|
| `i18n-agent` | Dalga 2/3 çevirileri, eksik ve kullanılmayan anahtar kontrolü, RTL kontrolleri | Dalga 2 dillerine başlama kararı alındığında | Bekliyor |
| `release-agent` | EAS Build/Submit, sürüm numarası, sürüm notları, mağaza metinleri | İlk TestFlight / Play Console iç test yüklemesinden önce | Bekliyor |
| `security-reviewer` | API güvenliği, kimlik doğrulama, token saklama, OWASP kontrolleri | Faz 4 başlarken | Bekliyor |
| `dotnet-test-writer` (veya `unit-test-writer` genişletmesi) | xUnit, entegrasyon testleri, Testcontainers | Faz 4'te ilk .NET projesi oluşturulduğunda | Bekliyor |

**Adaylar** (üç kez tekrar eden işten doğan öneriler): henüz yok.

## 7. Doküman haritası

| Dosya | İçerik |
|---|---|
| [PROJECT_BRIEF.md](PROJECT_BRIEF.md) | claude.ai planlama oturumunun çıktısı, tarihsel kayıt |
| [data-model.md](data-model.md) | Varlıklar, alanlar, ilişkiler |
| [decisions/](decisions/) | Mimari karar kayıtları (ADR) |
| [phases/](phases/) | Faz planları, kapsam ve kabul kriterleri |
| [progress/](progress/) | Faz raporları |
| [feedback/](feedback/) | Yayın sonrası geri bildirimler |
| [../CHANGELOG.md](../CHANGELOG.md) | Sürüm değişiklikleri |
