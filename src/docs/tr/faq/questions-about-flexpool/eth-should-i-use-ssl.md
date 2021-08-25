---
title: SSL bağlantısı kullanmalı mıyım?
coin: eth
---

**Evet**, mümkünse SSL bağlantı şeklini tercih edin.

Havuzlarımızda madencilik yapılırken tipik şifrelenmemiş (TCP) bağlantılara şiddetle karşıyız. Bu bağlantı, MITM (Ortadaki Adam) saldırılarına karşı savunmasızdır; bu, eğer birisi çalışanın ve havuzun arasında kötü niyetle durursa, hashrate'inizin bir kısmının çalınabileceği anlamına gelir.

#### ŞİFRELENMEMİŞ BAĞLANTI KULLANMAYINIZ

İşçinizin havuz ile mesajlaşması ulaşana kadar bir çok router(yönlendirici) üzerinden geçişi sağlanmaktadır. (Dilerseniz `traceroute` komutunu kullanarak bunları görebilirsiniz).

SSL bağlantısı kullanımı Flexpool tarafından özellikle tavsiye edilmektedir. Bu bağlantı türü, çalışanınızın gerçek havuz sunucularıyla konuşmasını sağlar.
