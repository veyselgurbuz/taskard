# Proje Devir Dokümanı: Taskard

> Bu doküman, claude.ai üzerinde yapılan planlama oturumunun çıktısıdır (26 Ekim 2026).
> Claude Code bu dosyayı projenin başlangıç kaynağı olarak kullanır. Buradaki kararlar
> proje sahibiyle birlikte alınmıştır, değiştirilmeden önce proje sahibine danışılmalıdır.

**Proje sahibi:** Veysel Gürbüz. 12+ yıl .NET/C# full-stack deneyimi, JavaScript biliyor, React Native ve TypeScript'te yeni.

---

## 1. Proje özeti

**Uygulama adı:** Taskard ("task" + "card"). Görevler kart görünümünde gösterilir, isim bu fikri yansıtır.
**Paket kimliği:** `com.veyselgurbuz.taskard` (geçici, Faz 1 sonunda kesinleşecek, bkz. Bölüm 2.1)
**Repo / proje klasörü adı:** `taskard`

Kullanıcının görev (iş) girip her göreve zorunlu bir öncelik bağladığı, tarih/saat seçip hatırlatıcı kurabildiği, isterse görevi cihaz takvimine ekleyebildiği bir mobil task planner / to-do uygulaması.

İlk hedef basit ama genişlemeye açık bir MVP. İlerleyen fazlarda kullanıcının öncelik etiketlerini kişiselleştirmesi, tekrarlayan görevler, çoklu hatırlatıcı ve bulut senkronizasyonu eklenecek. Bu yüzden MVP'deki her yapısal karar ileriki fazları zorlaştırmayacak şekilde alınmıştır.

**Proje sahibinin ikincil hedefi:** Bu proje bir öğrenme ve portföy projesidir. React Native/TypeScript öğrenmek, ileride .NET backend ile uçtan uca bir çözüm ortaya koymak. Bu nedenle kod okunabilir, iyi yapılandırılmış ve açıklanabilir olmalı.

---

## 2. Alınan kararlar ve gerekçeleri

Her karar için `docs/decisions/` altında bir ADR açılacak (bkz. Bölüm 8).

### ADR-0001: Teknoloji, Expo + React Native + TypeScript
- **Alternatifler:** .NET MAUI, Flutter.
- **Gerekçe:**
  - Bildirim ve takvim için resmi, bakımı süren paketler var (`expo-notifications`, `expo-calendar`).
  - Proje sahibinin Mac'i yok. MAUI ile iOS derlemesi Mac gerektiriyor, Expo'da EAS Build ile iOS derlemesi bulutta yapılıyor.
  - İş piyasasında React Native talebi MAUI'den yüksek, React bilgisi web React'e de taşınıyor.
  - AI destekli geliştirmede bu ekosistemde örnek ve doküman zenginliği daha fazla.
- **Backend (Faz 4):** ASP.NET Core Web API (proje sahibinin uzmanlık alanı).

### ADR-0002: Platform, iOS + Android
- Proje sahibi iPhone kullanıyor, yedekte Android cihazı var.
- Geliştirme sırasında test Expo Go ile yapılır. Expo Go yetmediğinde (native modül ihtiyacı) EAS ile development build'e geçilir.
- Yayın: App Store ve Google Play, EAS Build/Submit ile.

### ADR-0003: Veri, offline-first, senkronizasyona hazır
- **MVP:** Veriler sadece cihazda, SQLite (`expo-sqlite`). Tip güvenliği için hafif bir ORM (Drizzle önerilir, kurulumda güncel uyumluluk doğrulanmalı). Hesap/giriş yok.
- **Faz 4:** ASP.NET Core Web API + kimlik doğrulama + senkronizasyon.
- **Senkronizasyona hazırlık kuralları (MVP'den itibaren zorunlu):**
  - Tüm ID'ler UUID, otomatik artan sayı kullanılmaz.
  - Her kayıtta `createdAt`, `updatedAt` (UTC).
  - Silme yumuşak silmedir (`deletedAt`), fiziksel silme yapılmaz.
  - Veri erişimi repository arayüzlerinin arkasındadır. Ekranlar ve hook'lar doğrudan SQL veya ORM çağırmaz.
  - "Cihaza özel" alanlar (`notificationId`, `calendarEventId`) ileride senkronize edilmeyecek şekilde işaretlenir.
- **Önemli not:** Hatırlatıcılar her durumda cihazda planlanan yerel bildirimlerdir. Bulut, hatırlatıcı mekanizmasını değiştirmez.

### ADR-0004: Çok dil, i18n altyapısı baştan
- Kütüphane: `expo-localization` + `i18next` + `react-i18next`.
- Kodda sabit metin yok, tüm metinler çeviri anahtarı üzerinden.
- Varsayılan dil cihaz dilinden gelir, kullanıcı uygulama içinden değiştirebilir.
- Tarih, saat ve sayılar `Intl` ile dile göre biçimlenir. Çoğul kuralları i18next ile.
- **Dil dalgaları:**
  - Faz 1 (MVP): Türkçe, İngilizce.
  - Dalga 2: Almanca, İspanyolca, Fransızca, Rusça.
  - Dalga 3: Arapça (RTL, tüm ekranların aynalanması ve ayrı test gerekir), Çince (Basitleştirilmiş).
- Proje sahibi TR ve EN dışındaki çevirileri doğrulayamaz. Yayın öncesi anadil kontrolü önerilir.

### ADR-0005: Öncelik modeli, seviye ve etiket ayrımı
- Görevde öncelik **seviye** olarak (1-5) saklanır, isim olarak değil.
- Renk seviyeye bağlıdır. Etiket ayrı çözülür: kullanıcı etiketi varsa o, yoksa çeviri anahtarı.
- Kullanıcı en fazla 5 seviye kullanır, seviye eklenemez veya silinemez (Faz 2'de sadece isimler değişir).

| Seviye | Varsayılan etiket (TR / EN) | Renk |
|---|---|---|
| 5 | Çok Yüksek / Very High | Kırmızı |
| 4 | Yüksek / High | Turuncu |
| 3 | Orta / Medium | Amber (saf sarı değil, okunabilirlik için) |
| 2 | Düşük / Low | Mavi |
| 1 | Çok Düşük / Very Low | Yeşil |

- Kullanıcının özel etiketi (Faz 2) olduğu gibi saklanır ve dil değişince çevrilmez.
- Öncelik asla sadece renkle ifade edilmez, metin etiketi de görünür (erişilebilirlik).
- Öncelik renklerinin açık ve koyu mod için ayrı tonları vardır (koyu zeminde okunabilirlik için).

### ADR-0006: Stil, StyleSheet + tema token'ları, koyu mod desteği
- **Alternatif:** NativeWind (Tailwind sözdizimi).
- **Gerekçe:**
  - Proje sahibi React Native'de yeni. Önce RN'in kendi stil sistemini öğrenmek, ek bir soyutlama katmanı eklememek tercih edildi.
  - Ek bağımlılık ve derleme yapılandırması yok, Expo SDK yükseltmelerinde sürpriz riski düşük.
  - Token'lar tek dosyada olduğu için tasarım tutarlılığı ve `code-reviewer` agent'ının "sabit renk" kontrolü basit.
- **Uygulama kuralları:**
  - Stiller `StyleSheet.create` ile tanımlanır. Bileşen içinde satır içi (inline) stil nesnesi yalnızca dinamik değerler için kullanılır.
  - Tüm renk, boşluk, yazı boyutu, yazı ağırlığı, köşe yarıçapı ve gölge değerleri `src/theme/` altında token olarak tanımlanır.
  - Renkler anlamsal isimlerle tanımlanır (örn. `background`, `surface`, `textPrimary`, `textSecondary`, `border`, `priority5` ... `priority1`), ham renk adlarıyla değil.
  - **Koyu mod:** Açık ve koyu olmak üzere iki renk paleti vardır, diğer token'lar ortaktır. Bileşenler renkleri bir tema hook'u (örn. `useTheme()`) üzerinden alır, hiçbir bileşen doğrudan palet import etmez.
  - **Tema seçimi:** Kullanıcı ayarlardan Açık / Koyu / Sistem seçer. Varsayılan "Sistem"dir ve cihazın görünüm ayarı değiştiğinde uygulama anında güncellenir. Seçim `Settings` tablosunda saklanır.
  - Durum çubuğu, navigasyon başlıkları, modal arka planları, tarih/saat seçici ve açılış ekranı (splash) da temaya uyar.
  - Her iki modda da metin/zemin kontrastı erişilebilirlik standartlarına (WCAG AA) uygun olmalıdır.
- **Gelecek:** İleride Tailwind öğrenilmek istenirse NativeWind'e geçiş ayrı bir öğrenme fazı olarak planlanabilir. Token'lar tek yerde olduğu için geçiş kolaydır.

### 2.1 Açık kararlar (takip listesi)

Bu liste `PROJECT.md` içinde de "Açık kararlar" bölümü olarak tutulur. `doc-keeper` her faz kapanışında bu listeyi kontrol eder ve süresi gelen maddeleri Veysel'e hatırlatır.

| Konu | Mevcut durum | Kesinleşme zamanı |
|---|---|---|
| **Paket kimliği** (`app.json` içindeki iOS `bundleIdentifier` ve Android `package`) | Geçici olarak `com.veyselgurbuz.taskard` kullanılır | **Faz 1 sonunda ZORUNLU.** Seçenekler: kişisel ad (`com.veyselgurbuz`), GitHub kullanıcı adı (`io.github.<kullanici>`), uygulamaya özel alan adı (örn. `app.taskard`), stüdyo/marka adı. İlk mağaza yüklemesinden sonra değiştirilemez. |
| **Veri modeli: cihaza özel alanlar ve `completedAt`** | Bölüm 3'teki haliyle kabul edildi (`notificationId` ve `calendarEventId` senkronize edilmez, tamamlanma `completedAt` ile tutulur) | Faz 3 planlamasında tekrar gözden geçirilir ("iptal", "ertelendi" gibi durumlar istenirse `status` alanı eklenir) |
| **"Taskard" adının müsaitliği** | claude.ai'de yapılan hızlı web taramasında bu adla bir uygulamaya rastlanmadı. Resmi kontrol yapılmadı | İlk mağaza yüklemesinden önce: App Store ve Google Play araması, TÜRKPATENT marka sorgusu, alan adı (örn. `taskard.app`) kontrolü. Sonuç Veysel'e raporlanır. |

### 2.2 Claude Code'un önereceği, Veysel'in onaylayacağı konular

Bu konular kritik değildir. Claude Code Faz 1 uygulama planını sunarken kendi önerisini gerekçesiyle yazar, Veysel onaylar.

| Konu | claude.ai'deki ön öneri |
|---|---|
| Liste ekranının varsayılan sıralaması | Önce tamamlanmamışlar, sonra öncelik (yüksekten düşüğe), sonra tarih (yakından uzağa) |
| MVP'deki tek hatırlatıcının türü | "Belirli saat" ve "X dakika önce" seçenekleri (model ikisini de destekliyor) |
| ORM | Drizzle (güncel Expo SDK ile uyumluluğu doğrulanarak) |
| GitHub akışı | Her plan adımı için feature branch + Pull Request, `main`'e PR ile birleştirme (portföy açısından görünür süreç) |

---

## 3. Veri modeli

### Task
| Alan | Tip | Kurallar |
|---|---|---|
| `id` | UUID | Cihazda üretilir |
| `title` | text | Zorunlu, boş olamaz, en fazla 200 karakter |
| `description` | text | Opsiyonel |
| `priorityLevel` | int | Zorunlu, 1-5 |
| `dueAt` | UTC ISO tarih-saat | Opsiyonel |
| `timeZone` | IANA string | Görev oluşturulduğundaki saat dilimi |
| `completedAt` | UTC | Doluysa görev tamamlanmış |
| `recurrenceRule` | RRULE (RFC 5545) | Faz 3'e kadar boş kalır |
| `calendarEventId` | string | Opsiyonel, cihaza özel, senkronize edilmez |
| `createdAt` / `updatedAt` / `deletedAt` | UTC | `deletedAt` yumuşak silme |

### Reminder (bir Task'ın 0..N Reminder'ı)
| Alan | Tip | Kurallar |
|---|---|---|
| `id` | UUID | |
| `taskId` | UUID | Task'a bağlı |
| `type` | `absolute` \| `relative` | |
| `remindAt` | UTC | `absolute` ise zorunlu |
| `offsetMinutes` | int | `relative` ise zorunlu, `dueAt`'e göre (örn. 15 = 15 dk önce) |
| `notificationId` | string | İşletim sisteminin döndürdüğü ID, cihaza özel, senkronize edilmez |
| `createdAt` / `updatedAt` / `deletedAt` | UTC | |

- MVP arayüzü görev başına tek hatırlatıcıya izin verir, ama model baştan çoklu yapıdadır.

### Priority
- Varsayılan 5 seviye kodda sabittir: `{ level, colorToken, i18nKey }`.
- `PriorityLabelOverride` tablosu (`level` PK 1-5, `customLabel`, `updatedAt`): Faz 2'de kullanılacak. Şema MVP'de oluşturulabilir, arayüzü yoktur.

### Settings
- Anahtar-değer tablosu: dil, tema (açık/koyu/sistem) vb.

### İleriye dönük not
- Faz 3'te tekrarlayan görevlerin her bir örneğinin tamamlanmasını takip etmek için ayrı bir yapı (örn. `TaskOccurrence`) gerekebilir. Faz 3 planlamasında değerlendirilecek, MVP'de yapılmayacak.

---

## 4. Faz planı

### Faz 1: MVP (şimdi)
**Kapsam:**
- Görev oluşturma, düzenleme, silme (yumuşak), tamamlandı işaretleme / geri alma.
- Zorunlu: başlık + öncelik. Opsiyonel: açıklama, tarih/saat.
- 5 sabit öncelik, renk şeridi + metin rozeti.
- Liste: önceliğe ve tarihe göre sıralama, önceliğe göre filtreleme, tamamlananları gizle/göster.
- Görev detayında tek hatırlatıcı (yerel bildirim).
- Opsiyonel "Takvime ekle" anahtarı (cihaz takvimine etkinlik yazma, görev güncellenince/silinince etkinliği güncelleme/silme).
- İzinler: bildirim ve takvim izni, kullanıcı ilgili özelliği ilk kullandığında istenir. Reddedilirse uygulama çökmez, kullanıcıya açıklama ve ayarlara yönlendirme gösterilir.
- i18n: TR + EN, ayarlardan dil değiştirme.
- Tema: açık / koyu / sistem.
- Yerel SQLite, offline çalışma.

**Kabul kriterleri:**
- [ ] Başlığı veya önceliği olmayan görev kaydedilemez, kullanıcıya anlaşılır hata gösterilir.
- [ ] "27 Ekim 2026 10:00, X projesi toplantısına katıl, Çok Yüksek" görevi oluşturulabilir, listede kırmızı şerit ve "Çok Yüksek" rozetiyle görünür.
- [ ] Hatırlatıcı kurulan görev için belirtilen zamanda bildirim gelir (uygulama kapalıyken de).
- [ ] Görevin tarihi değiştirilince eski bildirim iptal edilip yenisi planlanır. Görev silinince veya tamamlanınca bildirim iptal edilir.
- [ ] "Takvime ekle" açıkken cihaz takviminde etkinlik oluşur, görev güncellenince etkinlik de güncellenir, görev silinince etkinlik silinir.
- [ ] Bildirim veya takvim izni reddedildiğinde uygulama çalışmaya devam eder ve kullanıcı bilgilendirilir.
- [ ] Dil TR/EN arasında değiştirilince tüm metinler, öncelik etiketleri ve tarih biçimleri değişir.
- [ ] Ayarlardan Açık / Koyu / Sistem tema seçilebilir. "Sistem" seçiliyken cihazın görünüm ayarı değişince uygulama anında güncellenir. Tüm ekranlar, modallar ve öncelik renkleri her iki modda okunabilir.
- [ ] Uygulama kapatılıp açıldığında veriler ve tema/dil tercihleri korunur.
- [ ] Hiçbir ekranda sabit (çevrilmemiş) metin yoktur.
- [ ] Domain ve repository katmanı için unit testler yazılmış ve geçiyor.
- [ ] iPhone'da Expo Go (veya development build) üzerinde uçtan uca test edilmiş.
- [ ] **Paket kimliği (bundle identifier) Veysel ile netleştirilmiş ve kesinleşmiştir** (bkz. Bölüm 2.1). Bu kriter karşılanmadan Faz 1 kapatılamaz ve mağazaya hiçbir yükleme yapılamaz.

### Faz 2: Öncelik kişiselleştirme
- Kullanıcı 5 seviyenin etiketini kendisi belirler (örn. 5 = "Acil", 1 = "Önemsiz"), varsayılana dönebilir.
- Dalga 2 dilleri eklenebilir.

### Faz 3: Tekrarlama ve çoklu hatırlatıcı
- Tekrar seçici bileşeni: her gün, hafta içi, haftanın belirli günleri, özel (RRULE ile).
- Bir göreve birden fazla hatırlatıcı (örn. "Her gün 6 bardak su iç", 09:00, 13:00, 17:00).
- Tekrarlayan görevde "bugünkü örnek tamamlandı" mantığı.

### Faz 4+: Genişleme
- ASP.NET Core Web API backend, kimlik doğrulama, senkronizasyon (backend'de unit/integration test ve Azure deploy).
- Dalga 3 dilleri (Arapça RTL, Çince).
- "Gerçek alarm" desteği (Android exact alarm, iOS AlarmKit, platform ve sürüm kısıtları araştırılacak).
- Widget, istatistikler.

---

## 5. Tasarım yönergeleri

- **Navigasyon:** Expo Router.
- **Stil ve tema:** `StyleSheet` + tema token'ları, açık ve koyu mod baştan desteklenir. Ayrıntılı kurallar ADR-0006'da. Bileşenlerde sabit renk kodu kullanılmaz.
- **MVP ekranları:**
  1. Görev listesi (ana ekran): sıralama/filtre, boş durum ekranı, "yeni görev" butonu.
  2. Görev oluştur/düzenle (modal): başlık, açıklama, öncelik seçici (5 renkli seçenek), tarih/saat seçici, hatırlatıcı, takvime ekle anahtarı.
  3. Görev detayı.
  4. Ayarlar: dil, tema, izin durumları.
- **Görev kartı:** Solda öncelik renginde dikey şerit, başlık, tarih/saat, öncelik rozeti (renk + metin), tamamlama kutusu.
- **Erişilebilirlik:** Yeterli kontrast, dokunma alanları en az 44pt, ekran okuyucu etiketleri.
- Jenerik ve "şablon" görünümden kaçınılır, sade ama özenli bir görsel dil hedeflenir.

---

## 6. Claude Code skill ve plugin'leri

**Bu bölümdeki tüm skill, plugin ve MCP sunucularını Claude Code kendisi kurar, Veysel bunun için izin vermiştir.**

Kurulum kuralları:
- Komut satırı karşılıkları kullanılır (örn. `claude plugin marketplace add ...`, `claude plugin install ...`). CLI ile kurulamayan bir şey olursa alternatif olarak `npx skills add <repo> --agent claude-code` denenir.
- Kurulum mümkünse **proje kapsamında** yapılır ve proje ayarlarına (`.claude/settings.json`) işlenir, böylece repo'yu klonlayan herkes aynı yapılandırmayı alır.
- Kurulumdan sonra her plugin'in yüklendiği doğrulanır ve gerçek skill/agent adları listelenir (Bölüm 9'daki agent tanımları bu adlara göre yazılır).
- Plugin'lerin etkinleşmesi için oturumun yeniden başlatılması gerekiyorsa Claude Code bunu Veysel'e açıkça söyler ve kaldığı adımı not eder.
- Bir kurulum etkileşimli onay gerektirir veya başarısız olursa Veysel'e tam olarak hangi komutu çalıştırması gerektiği söylenir.

Kurulacaklar (aşağıdaki komutlar etkileşimli karşılıklarıdır, Claude Code CLI eşdeğerini kullanır):

| # | Skill / Plugin | Kaynak | Kullanım amacı |
|---|---|---|---|
| 1 | **Expo** (resmi) | `expo/skills` marketplace | UI geliştirme (Expo Router, stil, navigasyon, animasyon), veri çekme, Tailwind/NativeWind kurulumu, EAS deploy, SDK yükseltme |
| 2 | **Frontend Design** | Anthropic resmi plugin marketplace | Jenerik "AI görünümü"nden kaçınan, özgün ve cilalı arayüz tasarımı |
| 3 | **PR Review Toolkit** | Anthropic resmi plugin marketplace | `code-reviewer` agent'ının kullandığı uzman review agent'ları |
| 4 | **React Native Best Practices** | `callstackincubator/agent-skills` | RN performans ve mimari kontrolleri (`code-reviewer` agent'ı kullanır) |
| 5 | **Context7 MCP** | Anthropic resmi plugin marketplace veya Upstash | Expo, React Native, i18next, Drizzle gibi kütüphanelerin **sürüme özel güncel dokümanlarını** çekmek. "Ezberden sürüm yazılmaz" kuralının (Bölüm 7) pratik karşılığı |

Etkileşimli komut karşılıkları (Claude Code CLI eşdeğerini kullanır):

```
# 1. Expo
/plugin marketplace add expo/skills
/plugin install expo

# 2. Frontend Design ve 3. PR Review Toolkit
# Anthropic'in resmi marketplace'inden, /plugin menüsünde adlarıyla aranarak

# 4. Callstack
/plugin marketplace add callstackincubator/agent-skills
/plugin install react-native-best-practices@callstack-agent-skills

# 5. Context7
# Resmi marketplace'te "Context7" olarak aranır, yoksa Upstash'in güncel kurulum talimatı izlenir
```

Kullanım kuralları:
- Arayüz geliştirmede **Expo `building-native-ui`** ve **Frontend Design** birlikte kullanılır: yapı ve native davranış için Expo, görsel özen için Frontend Design. Çelişki olursa Bölüm 5'teki tasarım yönergeleri ve tema token'ları önceliklidir.
- Yeni bir kütüphane kurulurken veya API kullanımından emin olunmadığında Context7 ile güncel doküman kontrol edilir.

Faz 4 notu: Backend başladığında .NET / ASP.NET Core için uygun skill'ler aynı kurallarla araştırılıp Veysel'e önerilir (Bölüm 9.5 yol haritası).

Kurulum komutları zamanla değişebilir. Çalışmazsa güncel komut ilgili reponun README'sinden doğrulanmalı.

---

## 7. Kodlama kuralları

- **Dil:** Kod, değişken, fonksiyon, dosya adları ve commit mesajları İngilizce. Dokümantasyon (`docs/`) Türkçe.
- TypeScript `strict` modda. `any` kullanılmaz.
- ESLint + Prettier.
- Paket ve SDK sürümleri kurulum anında güncel Expo SDK'ya göre seçilir, ezberden sürüm yazılmaz. `npx expo install` tercih edilir.
- Katmanlı yapı (öneri, Claude Code nihai hale getirir):
  ```
  app/                 → Expo Router ekranları
  src/
    domain/            → Varlık tipleri, iş kuralları, validasyon (UI ve DB'den bağımsız)
    data/              → SQLite şeması, migration'lar, repository implementasyonları
    services/          → Bildirim, takvim, izin servisleri (platform API sarmalayıcıları)
    features/          → Özellik bazlı bileşen ve hook'lar (tasks, settings)
    i18n/              → Çeviri dosyaları ve yapılandırma
    theme/             → Tasarım token'ları
  ```
- Test: Jest + React Native Testing Library. Domain ve repository katmanı öncelikli test edilir.
- Git: Ana dal `main`. Her iş için feature branch. Conventional Commits (`feat:`, `fix:`, `docs:` ...).
- Proje sahibi React Native'de yeni olduğundan, önemli veya alışılmadık kod kararlarında kısa açıklama yapılır.

---

## 8. Dokümantasyon yapısı ve kuralları

Proje sahibi için sürecin sürekli dokümante edilmesi önemlidir. Yapı:

```
README.md                    → Proje nedir, kurulum, çalıştırma, doküman haritası
CLAUDE.md                    → Claude Code talimatları (kısa, docs'a referans verir)
docs/
  PROJECT.md                 → ANA DOKÜMAN: amaç, kapsam, karar özeti, güncel durum
  PROJECT_BRIEF.md           → Bu dosya (tarihsel başlangıç kaydı, değiştirilmez)
  data-model.md              → Varlıklar, alanlar, ilişkiler
  decisions/                 → ADR'ler (ADR-0001 ... ADR-0007, sonrakiler)
  phases/                    → Faz PLANLARI (kapsam + kabul kriterleri)
    phase-1-mvp.md
  progress/                  → Faz RAPORLARI
    phase-1-report.md
  feedback/                  → Yayın sonrası geri bildirimler (FB-0001-kisa-baslik.md)
  CHANGELOG.md               → Keep a Changelog formatı, SemVer
```

**Progress raporu şablonu** (her faz için):
- Tarih aralığı ve durum (devam ediyor / tamamlandı)
- Yapılan işler
- Kullanılan teknolojiler ve paketler
- Kapatılan açıklar / karşılanan kabul kriterleri
- Plandan sapmalar ve nedenleri
- Bilinen sorunlar, kalan işler
- Öğrenilenler (proje sahibinin öğrenme hedefi için)

**Feedback dosyası şablonu:** Kaynak, tarih, istek/sorun, karar, ilgili ADR (varsa), çözüldüğü sürüm.

**Zorunlu kurallar (CLAUDE.md'ye de yazılacak):**
1. Her görev tamamlandığında ilgili `progress/` dosyası ve `CHANGELOG.md` güncellenir.
2. Mimari veya kapsam kararı değişirse yeni ADR açılır (eski ADR silinmez, "yerini aldı" olarak işaretlenir) ve `PROJECT.md` revize edilir.
3. Doküman güncellemeleri ilgili kod değişikliğiyle aynı commit'te yapılır.
4. Faz bitiminde progress raporu tamamlanır ve `PROJECT.md`'deki "güncel durum" bölümü güncellenir.

---

## 9. Agent'lar ve kalite kapısı

Geliştirme, üç özel subagent ile kalite ve dokümantasyon kontrolünden geçer. Agent'lar `.claude/agents/` altında tanımlanır.

### 9.1 `code-reviewer` agent'ı
- **Yetki:** Sadece okuma. Read, Grep, Glob ve Bash (yalnızca `git diff`, `git log`, lint, `tsc --noEmit`, test çalıştırma). **Edit/Write yetkisi yoktur, kodu değiştirmez.**
- **Önceden yüklenecek skill'ler (`skills:` alanı):** `react-native-best-practices` (Callstack). Ayrıca PR Review Toolkit agent'larından (code-reviewer, silent-failure-hunter, type-design-analyzer, pr-test-analyzer) yararlanılır. Kurulumdan sonra gerçek skill/agent adları doğrulanmalı.
- **Girdi:** Son adımın diff'i + CLAUDE.md + ilgili docs. Geliştiricinin gerekçeleri verilmez (bağımsız bakış için).
- **Projeye özel kontrol listesi:**
  - Çevrilmemiş sabit metin var mı?
  - Tema token'ı yerine sabit renk/boyut kullanılmış mı? Bileşen paleti doğrudan mı import ediyor (`useTheme()` yerine)?
  - Stiller `StyleSheet.create` ile mi tanımlı, gereksiz inline stil var mı?
  - Yeni ekran veya bileşen koyu modda da doğru görünüyor mu?
  - Ekran veya bileşen doğrudan SQL/ORM çağırıyor mu (repository ihlali)?
  - Fiziksel silme var mı (`deletedAt` yerine)?
  - UUID dışında ID üretimi var mı? `updatedAt` güncellenmiş mi?
  - Görev güncellenince/silinince/tamamlanınca bildirim ve takvim etkinliği doğru güncelleniyor/iptal ediliyor mu?
  - Öncelik sadece renkle mi gösteriliyor (metin etiketi eksik mi)?
  - İzin reddi senaryosu ele alınmış mı?
  - Tarihler UTC saklanıp yerel saatte mi gösteriliyor?
  - Yutulan hata, `any` kullanımı, test edilmemiş iş kuralı var mı?
  - Erişilebilirlik etiketleri ve dokunma alanları uygun mu?
- **Çıktı formatı:** Her bulgu `[Kritik | Önemli | Öneri] dosya:satır, sorun, önerilen çözüm`. Sonunda karar: `ONAY` veya `DÜZELTME GEREKLİ`.

### 9.2 `unit-test-writer` agent'ı
- **Yetki:** Read, Grep, Glob, Bash (test çalıştırma), Write/Edit **sadece test dosyalarında** (`__tests__/`, `*.test.ts(x)`). Uygulama koduna dokunmaz. Test yazarken hata bulursa düzeltmez, raporlar.
- **Mobil:** Jest + React Native Testing Library, `jest-expo` preset'i. Expo bildirim/takvim modülleri mock'lanır.
- **Backend (Faz 4):** xUnit, FluentAssertions, NSubstitute; entegrasyon testleri için `WebApplicationFactory` + Testcontainers.
- **Kapsam hedefi:** Domain ve data katmanında en az %80. Arayüzde kritik akışlar (görev oluşturma validasyonu, tamamlama, silme).
- **Test isimlendirme:** Davranışı anlatan açık isimler (örn. `should reject task without priority`).
- **Çıktı:** Yazılan testler, çalıştırma sonucu, kapsam özeti, bulunan olası hatalar.

### 9.3 `doc-keeper` agent'ı
- **Amaç:** Bölüm 8'deki dokümantasyon kurallarının her adımda eksiksiz uygulanması. Veysel için sürecin şeffaf ve izlenebilir olması.
- **Yetki:** Read, Grep, Glob, Bash (yalnızca `git diff`, `git log`, `git status`). Write/Edit **sadece** `docs/` altında (`docs/PROJECT_BRIEF.md` hariç, o dosya değiştirilmez) ve kök dizindeki `README.md` üzerinde. Uygulama koduna, testlere ve `CLAUDE.md`'ye dokunmaz. `CLAUDE.md` için değişiklik gerekiyorsa öneri olarak raporlar.
- **Girdi:** Adımın diff'i, `code-reviewer` sonucu (bulgular ve karar), `unit-test-writer` sonucu (test ve kapsam özeti), ana oturumun kısa adım özeti.
- **Görevleri:**
  - `progress/phase-N-report.md`: yapılan iş, kullanılan teknoloji/paket, karşılanan kabul kriterleri, plandan sapmalar, bilinen sorunlar (düzeltilmeyen "Öneri" bulguları dahil), öğrenilenler.
  - `CHANGELOG.md`: `[Unreleased]` altına Added / Changed / Fixed / Removed kayıtları.
  - `phases/phase-N-*.md`: karşılanan kabul kriterlerinin kutucuklarını işaretler.
  - `PROJECT.md`: "güncel durum" bölümü ve karar özeti.
  - `data-model.md`: şema veya migration değiştiyse günceller.
  - `README.md`: kurulum, çalıştırma veya test komutları değiştiyse günceller.
  - `feedback/`: ilgili geri bildirimin durumunu ve çözüldüğü sürümü işler.
  - **ADR:** Yeni bir karar alındıysa ADR taslağını yazar. Karar uydurmaz, sadece ana oturumda veya Veysel ile alınmış kararı kaydeder. Yerini alan ADR'yi "yerini aldı" olarak işaretler, silmez.
- **Tutarlılık kontrolü:** Dokümanlar ile kod arasında çelişki görürse (örn. `data-model.md` ile gerçek şema farklı, README'deki komut çalışmıyor) düzeltmeye çalışmadan önce raporlar.
- **Yazım kuralları:** Dokümanlar Türkçe, kısa ve somut. Tarih formatı `YYYY-MM-DD`. Em dash (—) kullanılmaz, yerine virgül kullanılır.
- **Çıktı:** Güncellenen dosyaların listesi, her birinde neyin değiştiği, tespit edilen tutarsızlıklar ve `CLAUDE.md` için varsa öneriler.

### 9.4 Kalite kapısı akışı (Definition of Done)
```
Geliştirme (ana oturum)
  → unit-test-writer: testleri yazar ve çalıştırır
  → lint + tsc + tüm testler
  → code-reviewer: diff'i inceler
  → Kritik/Önemli bulgu varsa geliştiriciye döner, düzeltilir, tekrar review
    (en fazla 3 tur, sonra Veysel'e danışılır)
  → doc-keeper: dokümanları günceller, tutarlılık kontrolü yapar
  → kod + testler + dokümanlar tek commit
```
- Review onayı, geçen testler ve güncel dokümanlar olmadan bir iş "bitti" sayılmaz. Bu kural CLAUDE.md'ye yazılır.
- Faz bitiminde `doc-keeper` ayrıca faz kapanış modunda çalışır: progress raporunu "tamamlandı" olarak kapatır, `PROJECT.md`'yi bir sonraki faza hazır hale getirir ve Veysel için kısa bir faz özeti çıkarır.
- Akış `.claude/skills/ship/SKILL.md` altında `/ship` komutu olarak tanımlanır, Veysel tek komutla çalıştırır.
- Deterministik güvence: Git pre-commit hook'u (husky + lint-staged) ile lint, tip kontrolü ve ilgili testler geçmeden commit yapılamaz.
- Review, test ve doküman agent'ları her dosyada değil, faz planındaki her adımın sonunda çalıştırılır.
- "Öneri" seviyesindeki bulgular düzeltilmezse progress raporundaki "bilinen sorunlar" bölümüne yazılır.

### 9.5 Agent yol haritası (gelecek agent'lar)
Claude Code oturumlar arasında hafıza tutmadığı için gelecek agent'ların zamanında önerilmesi bu yol haritasına ve aşağıdaki kurallara dayanır. Yol haritası `PROJECT.md` içinde ayrı bir bölüm olarak da tutulur.

| Agent | Görevi | Tetikleyici |
|---|---|---|
| `i18n-agent` | Dalga 2/3 çevirileri, eksik ve kullanılmayan anahtar kontrolü, RTL kontrolleri | Dalga 2 dillerine başlama kararı alındığında |
| `release-agent` | EAS Build/Submit, sürüm numarası, sürüm notları, mağaza metinleri | İlk TestFlight / Play Console iç test yüklemesinden önce |
| `security-reviewer` | API güvenliği, kimlik doğrulama, token saklama, OWASP kontrolleri | Faz 4 başlarken (backend ve kimlik doğrulama) |
| `unit-test-writer` genişletmesi veya ayrı `dotnet-test-writer` | xUnit, entegrasyon testleri, Testcontainers | Faz 4'te ilk .NET projesi oluşturulduğunda |

**Kural 1, tetikleyici kontrolü:** `doc-keeper` faz kapanış modunda bu tabloyu kontrol eder. Tetikleyicisi gerçekleşmiş veya bir sonraki fazda gerçekleşecek agent varsa faz özetinde Veysel'e "şu agent'ın zamanı geldi" diye önerir. Ana oturum da bir tetikleyici olayı (örn. Faz 4'ün başlaması) fark ederse aynı öneriyi yapar.

**Kural 2, tekrar eden iş tespiti:** Aynı türde manuel iş üç kez tekrarlanırsa (örn. her seferinde elle sürüm notu yazmak, aynı kontrolü elle yapmak) Claude Code bunu yeni bir agent veya skill adayı olarak Veysel'e önerir. Öneri, yol haritasına "aday" olarak eklenir.

**Kural 3, onay ve kayıt:** Hiçbir agent Veysel'in onayı olmadan oluşturulmaz. Onaylanan her yeni agent için ADR açılır, bu tablo ve Bölüm 9.4'teki akış (gerekiyorsa) güncellenir. Agent'ın yetki sınırları mevcut üç agent'taki prensiple tanımlanır: her agent yalnızca kendi sorumluluk alanındaki dosyalara yazabilir.

**Not:** Yeni bir agent'ın tasarımı (yetkileri, sınırları, akıştaki yeri) istenirse önce claude.ai'de planlanıp sonra Claude Code'a taşınabilir.

---

## 10. Claude Code için ilk oturum talimatları

Bu dosyayı okuduktan sonra şu sırayla ilerle ve her ana adımda proje sahibinden onay al:

1. **Ortam kontrolü:** Node.js (LTS), Git ve gerekli araçların kurulu olup olmadığını kontrol et, eksikleri proje sahibinin onayıyla kur.
2. **Proje oluşturma:** Proje sahibinin belirttiği dizinde güncel Expo şablonuyla (TypeScript, Expo Router) `taskard` adıyla projeyi oluştur. `app.json` içinde uygulama adını "Taskard", iOS `bundleIdentifier` ve Android `package` değerlerini `com.veyselgurbuz.taskard` olarak ayarla.
3. **Git ve GitHub:** Repoyu başlat, proje sahibinin verdiği GitHub reposuna bağla.
4. **Dokümantasyon iskeleti:** Bölüm 8'deki yapıyı oluştur. Bu dosyayı `docs/PROJECT_BRIEF.md` olarak taşı. Bu dosyadan türeterek `PROJECT.md` (Bölüm 2.1 "Açık kararlar" tablosu dahil), ADR-0001 ... ADR-0006, `data-model.md`, `phases/phase-1-mvp.md`, boş `progress/phase-1-report.md`, `CHANGELOG.md` ve `README.md` dosyalarını oluştur.
5. **CLAUDE.md:** Kısa tut. Proje özeti (2-3 cümle), komutlar (çalıştırma, test, lint), kodlama kuralları (Bölüm 7), dokümantasyon kuralları (Bölüm 8) ve `docs/` dosyalarına referanslar.
6. **Skill ve plugin kurulumu:** Bölüm 6'daki kurulum kurallarına göre tüm skill ve plugin'leri kendin kur, doğrula ve gerçek adlarını raporla. Yeniden başlatma gerekiyorsa Veysel'e bildir, yeniden başladığında 7. adımdan devam et.
7. **Agent'lar ve kalite kapısı:** Bölüm 9'a göre `.claude/agents/code-reviewer.md`, `.claude/agents/unit-test-writer.md`, `.claude/agents/doc-keeper.md` ve `/ship` skill'ini oluştur. Jest + RNTL kurulumunu ve pre-commit hook'unu yap. Üç agent'ı küçük bir örnek üzerinde deneyerek çalıştığını Veysel'e göster. Bu kurulumu ADR-0007 olarak kaydet.
8. **Faz 1 uygulama planı:** Plan modunda, Faz 1'i küçük ve test edilebilir adımlara böl (örn. tema + i18n altyapısı → veri katmanı + testler → liste ekranı → oluştur/düzenle → bildirimler → takvim → ayarlar). Planda Bölüm 2.2'deki konular için kendi önerini gerekçesiyle yaz. Planı proje sahibine sun, onay almadan kodlamaya başlama.
9. İlk commit: iskelet + dokümanlar + agent tanımları.
