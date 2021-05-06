---
title: Madencilik Teorisinin "Temelleri"
level: orta düzey
---

#### Hashler/Hashlemek

Madencilikte, bir Hash, bir Blok Şablonu ve olası bir Nonce'nin kriptografik bir hashing fonksiyonu ("mesaj özeti" veya "hash özeti" olarak da bilinir) aracılığıyla çalıştırılmasının sonucudur. Kriptografik bir hashing işlevi, herhangi bir girdi için tamamen farklı bir çıktı sağlar ve bu, Nonce'yi değiştirerek çılgınca değişebilir.

Kripto para birimlerinde kullanılan çeşitli farklı kriptografik hashing işlevleri vardır, örnekler şunları içerir:

| Hash Fonksiyon Adı                    | Onu kullanan kripto para birimleri     |
| ------------------------------------- | -------------------------------------- |
| SHA256                                | Bitcoin, Litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) ve türevleri | Ethereum, Ethereum Classic, Expanse... |
| RandomX                               | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo         | Grin                                   |
| Equihash                              | ZCash                                  |

#### Zorluk

Hash'in başlangıcında belirli sayıda sıfır elde etmek için gereken tahmin miktarı, Zorluk olarak adlandırılır - daha fazla sıfır elde etmek daha zordur ve bu nedenle çok fazla sıfıra sahip olmak, madencinin sahip olması muhtemeldir. bunu başarmak için birçok Nonces denemiş olmak.

Bir hash fonksiyonunun girdilerini çıktısından tanımlamak mümkün değildir, bu nedenle belirli bir Zorluğun Hash'ini elde etmenin tek yolu deneme yanılmadır.

Örneğin:
| Mesaj                     | SHA256 Mesajın özeti                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Flexpool'a hoş geldiniz! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Flexpool'a hoş geldiniz! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Flexpool'a hoş geldiniz! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Flexpool'a hoş geldiniz! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Gördüğünüz gibi, sadece 6 sıfır elde etmek için 12 milyondan fazla deneme yapıldı, ancak bloğu kendiniz hashleyerek birisinin birçok tahmin yaptığını doğrulamak kolaydır! Bunun gibi bir hash sağlayan Nonce, büyük olasılıkla önemli miktarda iş yaptığınızın kanıtıdır, dolayısıyla madeni paralar için "Proof of Work" ifadesi kullanılmaktadır. 0 ile başlamanın zorunlu olmadığını unutmayın. Tek şart, nonce'nin sınırın ötesinde olmamasıdır.

Madeni paralar, Zorluk gereksinimlerini bloklar zaman içinde eşit aralıklarla olacak şekilde ayarlar, Bitcoin her 10 dakikada bir blok almaya çalışır, Ethereum 12,5 saniyeyi hedefler, diğer kripto paraların başka hedefleri vardır. Bir madeni para ağına daha fazla Hashrate eklendiğinde / kaldırıldıkça, gerekli Zorluk telafi etmek ve "blok süresini" o madeni para için hedefe yakın tutmak için artar / azalır.

Bir Blok için gerekli Zorluğu karşılamayan Hashler, havuz tarafından belirlenen daha düşük bir Zorluk seviyesini karşılamaya devam edebilir ve bir Blok bulmaya çalıştığınızı kanıtlamak için havuza gönderilir, bu paylaşımlar havuzdaki biri bir Blok bulduğunda alacağınız sonraki blok ödülünün ne kadar olduğunu belirlemek için kullanılır.

Bununla birlikte, açıkçası, iyi Şanslar elde ederek beklenenden daha az tahminle (veya Şansınız kötüyse önemli ölçüde daha fazla tahminde bulunarak) iyi bir Nonce'a rastlayabilirsiniz!

#### Çaba / Şans

Kaç Hash'ın gerçekleştirildiği ve kaçının belirli bir Zorluğu karşılaması beklendiğinin oranına Çaba denir, örneğin% 50'lik düşük bir Çaba, beklenen tahminlerin yarısında iyi bir Nonce bulunduğu anlamına gelir.

Çaba'nın tersine Şans denir,% 200 Şans, beklenen tahminlerin yarısı kadar iyi bir Nonce bulduğunuz anlamına gelir.
