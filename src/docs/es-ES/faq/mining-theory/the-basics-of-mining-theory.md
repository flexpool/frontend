---
title: '"Fundamentos" de la Teoría de la Minería'
level: intermedio
---

#### Hashes/Hashing

En la minería, un Hash es el resultado de ejecutar una Plantilla de Bloque y un Nonce tentativo a través de una función criptográfica de hash (conocido también como "resumen del mensaje", o "resumen del hash"). Una función criptográfica de hash arroja un resultado completamente distinto para cualquier entrada dada y este resultado puede variar mucho al cambiar el Nonce.

En las criptomonedas se utilizan varias funciones criptográficas distintas, como por ejemplo:

| Nombre de función Hash                   | Criptomonedas que la utilizan          |
| ---------------------------------------- | -------------------------------------- |
| SHA256                                   | Bitcoin, litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) y sus derivados | Ethereum, Ethereum Classic, Expanse... |
| RandomX                                  | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo            | Grin                                   |
| Equihash                                 | ZCash                                  |

#### Dificultad

La Dificultad se refiere a la cantidad de adivinaciones que son necesarias para obtener un número determinado de ceros al inicio del Hash - es más difícil obtener más ceros y por lo tanto para tener una gran cantidad de ceros es probable que el minero haya tenido que intentar con múltiples Nonces para lograrlo.

No es posible identificar las entradas de una función de hash a partir de su resultado, por lo cual la única manera de obtener el Hash de una dificultad en particular es por prueba y error.

Por ejemplo:
| Mensaje                   | Hash SHA256 del mensaje                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Bienvenido a Flexpool! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Bienvenido a Flexpool! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Bienvenido a Flexpool! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Bienvenido a Flexpool! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Como se puede ver, fueron necesarios 12 millones de intentos para conseguir seis ceros. Sin embargo, ¡es fácil confirmar que alguien ha hecho una gran cantidad de intentos si tú mismo intentas obtener el Hash de un bloque! El Nonce que da un Hash como este es prueba de que probablemente realizaste una cantidad significativa de trabajo, por eso la frase "Prueba de Trabajo" es usada para el minado de monedas. Ten en cuenta que necesariamente para empezar con 0. El único requisito es que el Nonce no se pase del límite.

Las monedas ajustan su requisito de Dificultad de tal manera que los bloques estén espaciados uniformemente con el tiempo. Bitcoin procura tener un bloque cada 10 minutos, Ethereum apunta a 12.5 segundos, y otras monedas tienen otros objetivos. A medida que el Hashrate en la red de una moneda incrementa/disminuye, el requisito de Dificultad incrementa/disminuye para compensar y mantener el "tiempo de bloque" cercano al objetivo de esa moneda.

Los Hashes que no alcanzan la Dificultad requerida por un Bloque podrían de cualquier manera alcanzar un nivel de Dificultad más bajo establecido por la pool, y ser enviados a este para demostrar que estás intentando encontrar un Bloque. Estos Shares enviados se usan para determinar qué tanto recibirás del siguiente Bloque cuando alguien del pool encuentre un Bloque.

Dicho esto, obviamente también puedes tropezar con un Nonce bueno en menos adivinaciones de las esperadas si tienes buena suerte (ó bastantes más adivinaciones si tu suerte es mala!)

#### Esfuerzo/Suerte

La proporción de cuántos Hashes se llevaron a cabo vs cuántos se esperaban para alcanzar una determinada Dificultad se llama Esfuerzo. Un Esfuerzo bajo del 50% por ejemplo, significa que un Nonce bueno se encontró con la mitad de adivinaciones esperadas.

El reverso de Esfuerzo se conoce como Suerte. Una suerte de 200% significa que has encontrado un Nonce bueno en la mitad de adivinaciones esperadas.
