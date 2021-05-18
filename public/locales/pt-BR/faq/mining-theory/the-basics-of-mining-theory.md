---
title: The "Basics" of the Mining Theory
level: intermediate
---

#### Hashes/Hashing

Na mineração, um Hash é o resultado da execução de um modelo de bloco e de um potencial Nonce através de uma função de hashing criptográfico (também conhecido como "message digest" ou "hash digest"). Uma função de hashing criptográfico fornece um resultado completamente diferente para qualquer entrada dada, e isso pode variar enormemente mudando o Nonce.

Existem várias funções de hashing criptográfico diferentes usadas em criptomoedas, os exemplos incluem:

| Nome da função Hash                       | Criptomoedas que a usam                |
| ----------------------------------------- | -------------------------------------- |
| SHA256                                    | Bitcoin, Litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) e suas derivadas | Ethereum, Ethereum Classic, Expanse... |
| RandomX                                   | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo             | Grin                                   |
| Equihash                                  | ZCash                                  |

#### Dificuldade

A quantidade de pessoas que são necessárias para obter um determinado número de zeros no início do Hash é referida com a dificuldade - é mais difícil obter mais zeros e, por conseguinte, ter muitos zeros, é provável que o minerador fizesse muitos esforços para o conseguir.

Não é possível identificar os inputs para uma função hash de seu output, Por conseguinte, a única forma de obter um Hash de uma determinada Dificuldade é por tentativa e erro.

Por exemplo:
| Messagem                  | Hash SHA256 da mensagem                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Bem-vindo à Flexpool! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Bem-vindo à Flexpool! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Bem-vindo à Flexpool! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Bem-vindo à Flexpool! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Como você pode ver, levou mais de 12 milhões de tentativas para obter apenas 6 zeros, no entanto é fácil confirmar que alguém fez muitas tentativas apenas quebrando o bloco você mesmo! O Nonce que fornece um hash como esse, é a prova de que você provavelmente realizou uma quantidade significativa de trabalho. Daí a expressão "Prova de Trabalho" utilizada para a mineração de moedas. Note que não é necessariamente começar com 0. A única exigência é que o nonce não exceda o limite.

As moedas ajustam seus requisitos de Dificuldade para que os blocos sejam espaçados igualmente ao longo do tempo, o Bitcoin tenta obter um bloco a cada 10 minutos, o Ethereum a cada 12,5 segundos, outras moedas têm outros alvos. À medida que mais Hashrate é adicionado/removido a uma rede de moedas, a dificuldade necessária aumenta/diminui para compensar e manter o "tempo de bloco" próximo ao alvo para essa moeda.

Hashes que não atendem à dificuldade necessária para um bloco ainda podem atingir um nível de dificuldade menor definido pela pool e são enviadas para a pool para provar que você está tentando encontrar um bloco, esses Compartilhamento são usados para determinar quanto do próximo bloco você irá receber quando alguém na pool encontrar um bloco.

Com isso, obviamente você também pode encontrar por acaso um bom Nonce em menos tentativas do que o esperado por ter boa sorte (ou muito mais tentativas se sua sorte estiver ruim!)

#### Esforço/Sorte

A proporção de quantos Hashes foram realizadas e quantos esperavam encontrar uma determinada dificuldade se chama Esforço, um baixo esforço de 50%, por exemplo, que significa que um bom Nonce foi encontrado em metade da quantidade de pessoas esperadas.

O inverso de Esforço é chamada de Sorte, uma Sorte de 200% significa que você encontrou uma boa Nonce em metade da quantidade de pessoas esperadas.
