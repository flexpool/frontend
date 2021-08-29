---
title: Eu devo usar SSL?
coin: eth
---

**Sim**, use SSL quando possível.

Somos fortemente contra o uso de conexão não criptografada (TCP) enquanto mineramos na nossa pool. Esta conexão é vulnerável a ataques MITM (Man-In-The-Middle), o que significa que, se alguém com intenções maliciosas estiver entre o seu worker e a sua pool, cerca de % do seu hashrate pode ser roubada.

#### NÃO USE CONEXÃO NÃO CRIPTOGRAFADA

Tenha em mente que antes da mensagem do seu worker chegar à pool, passa por uma dúzia de roteadores (você pode usar o comando `traceroute` para ver todos eles).

Usar SSL é recomendado pela Flexpool. Este tipo de conexão garante que o seu worker converse com os servidores reais da pool.
