# Veri Modeli

> Kaynak: [PROJECT_BRIEF.md](PROJECT_BRIEF.md) Bölüm 3, [ADR-0003](decisions/ADR-0003-veri-offline-first.md), [ADR-0005](decisions/ADR-0005-oncelik-modeli.md)
> **Durum:** Tasarım. Şema henüz koda dökülmedi. Migration'lar yazıldığında bu doküman gerçek şemayla eşitlenir.
> **Son güncelleme:** 2026-10-26

## Genel kurallar (senkronizasyona hazırlık)

- Tüm ID'ler UUID'dir, cihazda üretilir. Otomatik artan sayı kullanılmaz.
- Her kayıtta `createdAt` ve `updatedAt` (UTC) bulunur. Her değişiklikte `updatedAt` güncellenir.
- Silme yumuşak silmedir (`deletedAt`). Fiziksel silme yapılmaz.
- Veri erişimi repository arayüzlerinin arkasındadır. Ekranlar ve hook'lar doğrudan SQL veya ORM çağırmaz.
- Cihaza özel alanlar (`notificationId`, `calendarEventId`) senkronize edilmez.
- Tarihler UTC saklanır, kullanıcıya yerel saatte gösterilir.

## İlişkiler

```
Task 1 ─── 0..N Reminder
Priority (kodda sabit, 5 seviye) 1 ─── 0..1 PriorityLabelOverride (Faz 2)
Task.priorityLevel → Priority.level
Settings (anahtar-değer, bağımsız)
```

## Task

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
| `calendarEventId` | string | Opsiyonel, **cihaza özel**, senkronize edilmez |
| `createdAt` | UTC | |
| `updatedAt` | UTC | |
| `deletedAt` | UTC | Yumuşak silme |

## Reminder

Bir Task'ın 0..N Reminder'ı olabilir. MVP arayüzü görev başına tek hatırlatıcıya izin verir, model baştan çoklu yapıdadır.

| Alan | Tip | Kurallar |
|---|---|---|
| `id` | UUID | |
| `taskId` | UUID | Task'a bağlı |
| `type` | `absolute` \| `relative` | |
| `remindAt` | UTC | `absolute` ise zorunlu |
| `offsetMinutes` | int | `relative` ise zorunlu, `dueAt`'e göre (örn. 15 = 15 dk önce) |
| `notificationId` | string | İşletim sisteminin döndürdüğü ID, **cihaza özel**, senkronize edilmez |
| `createdAt` | UTC | |
| `updatedAt` | UTC | |
| `deletedAt` | UTC | Yumuşak silme |

**Ek kural (2026-10-26):** `relative` hatırlatıcı yalnızca `dueAt` dolu olan göreve kurulabilir. Görevin `dueAt` değeri silinirse göreli hatırlatıcı yumuşak silinir ve bildirimi iptal edilir, kullanıcı formda uyarılır (Faz 1 planı, 2026-10-27).

## Priority

Varsayılan 5 seviye kodda sabittir: `{ level, colorToken, i18nKey }`.

| Seviye | Varsayılan etiket (TR / EN) | Renk token'ı |
|---|---|---|
| 5 | Çok Yüksek / Very High | `priority5` (kırmızı) |
| 4 | Yüksek / High | `priority4` (turuncu) |
| 3 | Orta / Medium | `priority3` (amber) |
| 2 | Düşük / Low | `priority2` (mavi) |
| 1 | Çok Düşük / Very Low | `priority1` (yeşil) |

## PriorityLabelOverride (Faz 2)

Şema MVP'de oluşturulabilir, arayüzü yoktur.

| Alan | Tip | Kurallar |
|---|---|---|
| `level` | int | PK, 1-5 |
| `customLabel` | text | Kullanıcının özel etiketi, dil değişince çevrilmez |
| `updatedAt` | UTC | |

## Settings

Anahtar-değer tablosu.

| Anahtar | Değerler | Varsayılan |
|---|---|---|
| `language` | `tr`, `en` | Cihaz dili (desteklenmiyorsa `en`) |
| `theme` | `light`, `dark`, `system` | `system` |

## İleriye dönük notlar

- Faz 3'te tekrarlayan görevlerin her örneğinin tamamlanmasını takip etmek için ayrı bir yapı (örn. `TaskOccurrence`) gerekebilir. MVP'de yapılmaz.
- "İptal", "ertelendi" gibi durumlar istenirse `status` alanı eklenir (bkz. [PROJECT.md](PROJECT.md) Açık kararlar).
