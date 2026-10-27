# Faz 1: MVP

> Kaynak: [PROJECT_BRIEF.md](../PROJECT_BRIEF.md) Bölüm 4
> **Durum:** Planlandı, Veysel tarafından onaylandı (2026-10-27). Uygulama henüz başlamadı.
> **Rapor:** [progress/phase-1-report.md](../progress/phase-1-report.md)

## Kapsam

- Görev oluşturma, düzenleme, silme (yumuşak), tamamlandı işaretleme / geri alma.
- Zorunlu alanlar: başlık + öncelik. Opsiyonel: açıklama, tarih/saat.
- 5 sabit öncelik, renk şeridi + metin rozeti.
- Liste: önceliğe ve tarihe göre sıralama, önceliğe göre filtreleme, tamamlananları gizle/göster.
- Görev detayında tek hatırlatıcı (yerel bildirim).
- Opsiyonel "Takvime ekle" anahtarı: cihaz takvimine etkinlik yazma, görev güncellenince/silinince etkinliği güncelleme/silme.
- İzinler: bildirim ve takvim izni, kullanıcı ilgili özelliği ilk kullandığında istenir. Reddedilirse uygulama çökmez, kullanıcıya açıklama ve ayarlara yönlendirme gösterilir.
- i18n: TR + EN, ayarlardan dil değiştirme.
- Tema: açık / koyu / sistem.
- Yerel SQLite, offline çalışma.

## Ekranlar

1. **Görev listesi (ana ekran):** sıralama/filtre, boş durum ekranı, "yeni görev" butonu.
2. **Görev oluştur/düzenle (modal):** başlık, açıklama, öncelik seçici (5 renkli seçenek), tarih/saat seçici, hatırlatıcı, takvime ekle anahtarı.
3. **Görev detayı.**
4. **Ayarlar:** dil, tema, izin durumları.

**Görev kartı:** solda öncelik renginde dikey şerit, başlık, tarih/saat, öncelik rozeti (renk + metin), tamamlama kutusu.

## Kabul kriterleri

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
- [ ] **Paket kimliği (bundle identifier) Veysel ile netleştirilmiş ve kesinleşmiştir** (bkz. [PROJECT.md](../PROJECT.md) Açık kararlar). Bu kriter karşılanmadan Faz 1 kapatılamaz ve mağazaya hiçbir yükleme yapılamaz.

## Uygulama adımları

Onay: Veysel, 2026-10-27. Her adım: `feat/...` branch, geliştirme, `/ship` (test, lint/typecheck/kapsam, review, doküman, tek commit), Pull Request, Veysel onayı, squash merge.

### Planlama kararları (Brief Bölüm 2.2)

| Konu | Karar |
|---|---|
| Varsayılan sıralama | Önce tamamlanmamışlar, sonra öncelik (yüksekten düşüğe), sonra `dueAt` (yakından uzağa, tarihsizler sonda), eşitlikte `createdAt`. İkinci mod "Tarihe göre": önce `dueAt`, sonra öncelik. Tamamlananlar gösteriliyorsa listenin sonunda. |
| Hatırlatıcı türü | "Belirli saat" (`absolute`) ve "Görevden önce" (`relative`, 5, 15, 30, 60 dk, 1 gün). |
| `dueAt` silinirse göreli hatırlatıcı | Formda uyarı, kaydedilince göreli hatırlatıcı yumuşak silinir ve bildirimi iptal edilir. Geçmiş zamana hatırlatıcı validasyonla reddedilir. |
| ORM | Drizzle (`drizzle-orm/expo-sqlite`, `drizzle-kit`, `useLiveQuery`). Adım 2 başında SDK 58 uyumluluğu doğrulanır, sorun çıkarsa repository arayüzü değişmeden düz `expo-sqlite`'a geçilir ve ADR yazılır. |
| GitHub akışı | Adım başına feature branch + PR, squash merge, merge sonrası branch silinir. |

Ek teknik kararlar: state kütüphanesi yok (veri Drizzle live query, tercih React Context), UUID için `expo-crypto`, domain fonksiyonları "şimdi"yi parametre olarak alır, görev kaydetme/tamamlama/silme bildirim ve takvimi koordine eden tek bir `TaskService` üzerinden yapılır. Kullanılan tüm modüller Expo Go'da çalışır.

### Adım 1: Tema ve i18n altyapısı (`feat/theme-i18n`)
- `src/theme/`: token'lar, açık/koyu palet, her iki mod için `priority1..5` renkleri, WCAG AA kontrastını doğrulayan test.
- `ThemeProvider` + `useTheme()`, Açık/Koyu/Sistem tercihi, sistem değişimine anında uyum, `Stack` başlıkları ve `StatusBar` temaya bağlı.
- `src/i18n/`: `expo-localization` + `i18next` + `react-i18next`, `tr.json` / `en.json`, öncelik etiketleri `priority.ts` anahtarlarıyla eşleşir. `Intl` ile tarih biçimleme.
- Tercihler bellekte, kalıcılık Adım 2'de.

### Adım 2: Veri katmanı (`feat/data-layer`)
- `expo-sqlite` + Drizzle, şema (`tasks`, `reminders`, `priority_label_overrides`, `settings`), ilk migration, açılışta migration ve hata ekranı.
- Domain: `Task`, `Reminder` tipleri, validasyon, `compareTasks` sıralama/filtre, hatırlatma zamanı hesaplama.
- Repository'ler: `TaskRepository`, `ReminderRepository`, `SettingsRepository` (UUID, UTC zaman damgaları, yalnızca yumuşak silme).
- Tema ve dil tercihi `settings` tablosunda kalıcı.
- Testler: domain %80+, repository'ler Node'da bellek içi SQLite ile gerçek SQL üzerinde. `data-model.md` gerçek şemayla eşitlenir.

### Adım 3: Görev listesi (`feat/task-list`)
- Ana ekran, `TaskCard` (öncelik şeridi, başlık, tarih, renk + metin rozeti, 44pt tamamlama kutusu, ekran okuyucu etiketleri), `useTasks`.
- Sıralama modu, öncelik filtresi, tamamlananları gizle/göster, boş durum, "Yeni görev" butonu, tamamlama/geri alma.

### Adım 4: Oluştur/düzenle ve detay (`feat/task-form`)
- Oluştur/düzenle modalı, detay ekranı. Başlık, açıklama, öncelik seçici, tarih/saat seçici, çevrilmiş validasyon hataları.
- Onaylı yumuşak silme.

### Adım 5: Hatırlatıcı ve bildirimler (`feat/reminders`)
- İzin servisi (ayarlara yönlendirme dahil), bildirim servisi (`expo-notifications`, `DATE` tetikleyici, Android kanalı).
- `TaskService`: kaydetme/tarih değişimi/tamamlama/silmede bildirim iptali ve yeniden planlama, açılışta tutarlılık kontrolü.
- Formda hatırlatıcı bölümü. Bilinen sınır: Android 14+ ve Expo Go'da exact alarm izni olmadan bildirim yaklaşık zamanda gelebilir, kabul testi iPhone'da yapılır.

### Adım 6: Takvim entegrasyonu (`feat/calendar`)
- `expo-calendar` servisi, etkinlik oluştur/güncelle/sil, "Takvime ekle" anahtarı (yalnızca `dueAt` varsa), izin reddi akışı, `app.json` izin metinleri.

### Adım 7: Ayarlar (`feat/settings`)
- Dil, tema, bildirim ve takvim izin durumları. Tüm ekranların iki modda ve iki dilde son kontrolü, çevrilmemiş metin taraması.

### Adım 8: Faz kapanışı
- iPhone'da Expo Go ile uçtan uca kabul testi, erişilebilirlik ve kontrast kontrolü.
- Paket kimliğinin kesinleştirilmesi.
- `doc-keeper` faz kapanış modu.
