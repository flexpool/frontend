---
title: Devo usar SSL?
---

**Sim**, use SSL sempre que possível.

Somos fortemente contra o uso de uma conexão não criptografada (TCP) durante a mineração na nossa pool. Esta conexão é vulnerável a ataques MITM (Man-In-The-Middle), o que significa que se alguém com más intenções se encontrar entre o teu worker e a pool, alguma % da tua hashrate pode ser roubada.

#### NÃO USE CONEXÃO NÃO ENCRIPTADO

Tenha em mente que antes da mensagem do teu worker chegar à pool, passa por uma dúzia de roteadores (podes usar o comando `traceroute` para os veres todos).

Usar SSL é recomendado pela Flexpool. Este tipo de conexão garante que o teu worker contacte com os servidores reais da pool.
