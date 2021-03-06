---
title: '«Основи» майнінг теорії'
level: проміжний
---

#### Хеш/Хешування

У майнінгу хеш є результатом запуску шаблону блоку та потенційного Nonce за допомогою функції криптографічного хешування (також відомої як «дайджест повідомлення» або «дайджест хешування»). Функція криптографічного хешування забезпечує зовсім інший вихід для будь-якого даного входу, і це може сильно відрізнятися, змінюючи Nonce.

У криптовалютах використовуються різні функції криптографічного хешування, наприклад:

| Назва хеш-функції                     | Криптовалюти, які його використовують  |
| ------------------------------------- | -------------------------------------- |
| SHA256                                | Bitcoin, Litecoin, Bitcoin Cash...     |
| Еташ (DaggerHashimoto) і його похідні | Ethereum, Ethereum Classic, Expanse... |
| RandomX                               | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo         | Grin                                   |
| Equihash                              | ZCash                                  |

#### Труднощі

Кількість припущень, необхідних для отримання заданої кількості нулів на початку хешування, називається складністю - отримати більше нулів важче, і, отже, мати багато нулів, швидше за все, майнер буде мати спробував багато Nonce для досягнення цього.

Неможливо ідентифікувати вхідні дані для хеш-функції з її виходу, тому єдиний спосіб отримати хеш певної складності - це методом проб і помилок.

Наприклад:
| Повідомлення              | SHA256 Хеш повідомлення                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Welcome to Flexpool! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Welcome to Flexpool! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Welcome to Flexpool! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Welcome to Flexpool! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Як бачите, щоб отримати лише 6 нулів, знадобилося понад 12 мільйонів спроб, однак легко підтвердити, що хтось зробив багато припущень, просто хешувавши блок самостійно! Nonce, який надає подібний хеш, є доказом того, що ви, ймовірно, виконали значний обсяг роботи, тому фраза «Доказ роботи» використовується для видобутку монет. Зауважте, що не обов’язково починати з 0. Єдина вимога полягає в тому, щоб одноразове число не перевищувало ліміту.

Монети коригують свої вимоги до складності таким чином, щоб блоки розподілялися рівномірно з часом, біткойн намагається отримати блок кожні 10 хвилин, Ethereum орієнтується на 12,5 секунди, інші монети мають інші цілі. У міру того, як більше хешрейту додається/вилучається в мережу монет, необхідна складність збільшується/зменшується, щоб компенсувати та підтримувати "час блокування" близько до цільового значення для цієї монети.

Хеші, які не відповідають складності, необхідному для блоку, все одно можуть відповідати нижчому рівню складності, встановленому пулом, і надсилаються в пул, щоб підтвердити, що ви намагаєтеся знайти блок. Ці частки використовуються для визначення кількості наступний блок ви отримаєте, коли хтось із пулу знайде блок.

З огляду на це, очевидно, ви також можете просто натрапити на хороший Nonce з меншою кількістю здогад, ніж очікувалося, якщо вам пощастить (або значно більше, якщо ваша удача погана!)

#### Зусилля/Удача

Співвідношення того, скільки хешів було виконано до того, скільки очікувалося відповідати заданій складності, називається зусиллям, наприклад, низьке зусилля в 50%, що означає, що хороший Nonce був знайдений у половині очікуваної кількості припущень.

Зворотне значення зусиль називається Удача, 200% удача означає, що ви знайшли хороший Nonce вдвічі меншої кількості здогадок.
