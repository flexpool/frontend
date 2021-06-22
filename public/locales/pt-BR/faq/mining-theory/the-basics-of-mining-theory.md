---
title: O "Básico" da Teoria da Mineração
level: intermediário
---

#### Hashes/Hasheando

Na mineração, um Hash é o resultado da execução de um Bloco Padrão e de um Nonce potencial através de uma função de hasheamento criptográfico (também conhecido como "message digest" ou "hash digest"). Uma função de hasheamento criptográfico fornece um resultado completamente diferente para qualquer entrada dada, e isso pode variar enormemente mudando o Nonce.

Existem várias funções de hasheamento criptográfico diferentes usadas em criptomoedas, exemplos incluem:

| Nome da Função Hash                       | Criptomoedas que a usam                |
| ----------------------------------------- | -------------------------------------- |
| SHA256                                    | Bitcoin, Litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) e suas derivadas | Ethereum, Ethereum Classic, Expanse... |
| RandomX                                   | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo             | Grin                                   |
| Equihash                                  | ZCash                                  |

#### Dificuldade

A quantidade de tentativas que são necessárias para obter um determinado número de zeros no início do Hash é referida com a Dificuldade - é mais difícil obter mais zeros e, por conseguinte, para ter muitos zeros, é provável que o minerador tenha tentado muitos Nonces diferentes para conseguir realizar isso.

Não é possível identificar as entradas de uma função hash a partir da saída, Por conseguinte, a única forma de obter um Hash de uma determinada Dificuldade é por tentativa e erro.

Por exemplo:
| Mensagem                  | Hash SHA256 da mensagem                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Bem-vindo à Flexpool! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a                              |
| <code>Bem-vindo à Flexpool! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e                              |
| <code>Bem-vindo à Flexpool! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037                              |
| ...                       | ...                                                                                           |
| <code>Bem-vindo à Flexpool! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

Como você pode ver, levou mais de 12 milhões de tentativas para obter apenas 6 zeros, no entanto é fácil confirmar que alguém fez muitas tentativas apenas hasheando o bloco você mesmo! O Nonce que fornece um hash como esse, é a prova de que você provavelmente realizou uma quantidade significativa de trabalho. Daí a expressão "Prova de Trabalho" (Proof of Work em inglês) utilizada para a mineração de moedas. Note que não é necessário começar com 0. A única exigência é que o nonce não exceda o limite.

As moedas ajustam seus requisitos de Dificuldade para que os blocos sejam espaçados igualmente ao longo do tempo, o Bitcoin tenta obter um bloco a cada 10 minutos, o Ethereum a cada 12,5 segundos, outras moedas têm outros alvos. À medida que mais Hashrate é adicionado/removido à rede de uma moeda a Dificuldade necessária aumenta/diminui para compensar e manter o "tempo de bloco" próximo ao alvo para aquela moeda.

Hashes que não atendem a Dificuldade necessária para um Bloco ainda podem atingir um nível de Dificuldade menor definido pela pool e são enviadas para a pool para provar que você está tentando encontrar um Bloco, essas Shares são usadas para determinar quanto do próximo Bloco você irá receber quando alguém na pool encontrar um Bloco.

Com isso dito, obviamente você também pode encontrar um bom Nonce por acaso em menos tentativas do que o esperado por ter boa Sorte (ou muito mais tentativas se sua Sorte for ruim!)

#### Esforço/Sorte

A proporção de quantos Hashes foram encontrados contra quantos eram esperados para encontrar uma determinada Dificuldade se chama Esforço, um baixo Esforço de 50%, por exemplo, que significa que um bom Nonce foi encontrado em metade da quantidade de tentativas esperadas.

O inverso de Esforço é chamada de Sorte, uma Sorte de 200% significa que você encontrou uma boa Nonce em metade da quantidade de tentativas esperadas.
