# ADR-0005: Öncelik modeli, seviye ve etiket ayrımı

- **Tarih:** 2026-10-26
- **Durum:** Kabul edildi
- **Karar verenler:** Veysel Gürbüz (claude.ai planlama oturumu)

## Bağlam

Her görevin zorunlu bir önceliği vardır. Faz 2'de kullanıcı öncelik etiketlerini kişiselleştirebilecek, uygulama birden fazla dilde çalışacak. Önceliği isim olarak saklamak hem dil değişiminde hem kişiselleştirmede sorun yaratır.

## Karar

- Görevde öncelik **seviye** olarak (1-5) saklanır, isim olarak saklanmaz.
- Renk seviyeye bağlıdır. Etiket ayrı çözülür: kullanıcının özel etiketi varsa o, yoksa çeviri anahtarı.
- Kullanıcı en fazla 5 seviye kullanır. Seviye eklenemez veya silinemez, Faz 2'de yalnızca isimler değişir.

| Seviye | Varsayılan etiket (TR / EN) | Renk |
|---|---|---|
| 5 | Çok Yüksek / Very High | Kırmızı |
| 4 | Yüksek / High | Turuncu |
| 3 | Orta / Medium | Amber (saf sarı değil, okunabilirlik için) |
| 2 | Düşük / Low | Mavi |
| 1 | Çok Düşük / Very Low | Yeşil |

## Gerekçe

- Seviye dilden ve kişiselleştirmeden bağımsızdır, sıralama ve filtreleme sayısal değer üzerinden kolaydır.
- Etiket çözümü tek bir fonksiyonda toplandığı için Faz 2'de yalnızca bu fonksiyon genişler.

## Sonuçlar

- Kullanıcının özel etiketi (Faz 2) olduğu gibi saklanır, dil değişince çevrilmez.
- **Öncelik asla yalnızca renkle ifade edilmez**, metin etiketi de görünür (erişilebilirlik).
- Öncelik renklerinin açık ve koyu mod için ayrı tonları vardır (bkz. [ADR-0006](ADR-0006-stil-tema.md)).
