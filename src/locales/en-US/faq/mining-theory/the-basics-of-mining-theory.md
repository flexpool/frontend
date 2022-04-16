---
title: The "Basics" of the Mining Theory
level: intermediate
---

#### Hashes/Hashing

In mining, a Hash is the result of running a Block Template and a prospective Nonce through a cryptographic hashing function (also known as a "message digest" or "hash digest"). A cryptographic hashing function provides a completely different output for any given input and this can vary wildly by changing the Nonce.

There are various different cryptographic hashing functions used in cryptocurrencies, examples include:

| Hash Function Name                           | Cryptocurrencies that use it           |
| -------------------------------------------- | -------------------------------------- |
| SHA256                                       | Bitcoin, Litecoin, Bitcoin Cash...     |
| Ethash (DaggerHashimoto) and its derivatives | Ethereum, Ethereum Classic, Expanse... |
| RandomX                                      | Monero                                 |
| CuckooCycle/Cuckaroo/Cuckatoo                | Grin                                   |
| Equihash                                     | ZCash                                  |

#### Difficulty

The amount of guesses which are needed to get a given number of zeroes at the start of the Hash is referred to as the Difficulty - it is harder to get more zeroes and therefore to have a lot of zeroes it is likely that the miner would have to have tried a lot of Nonces to achieve this.

It is not possible to identify the inputs to a hash function from its output, therefore the only way to get a Hash of a particular Difficulty is by trial and error.

For Example:
| Message | SHA256 Hash of the message |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <code>Welcome to Flexpool! (nonce=0)</code> | 58ecf42082e136722a706bd2b8d028b90c94f6e4ddfa60720fd470ff11cd875a |
| <code>Welcome to Flexpool! (nonce=1)</code> | 9a605788b6d2f16b6f5c418a394965197d7e88a912afb275fde8735fa308971e |
| <code>Welcome to Flexpool! (nonce=2)</code> | 37916e8263c7266b8ecfc878ab87d585a546c87a5d32d18658d066122bcc9037 |
| ... | ... |
| <code>Welcome to Flexpool! (nonce=16105490)</code> | <span className="red">000000</span>4298495e8f9096c674f1197be8c6fb25f2012228374b7307cc66ae6200 |

As you can see it took over 12 million tries to get only 6 zeroes, however it is easy to confirm that someone has made a lot of guesses by just hashing the block yourself! The Nonce which provides a hash like this is proof that you have likely carried out a significant amount of work, hence the phrase "Proof of Work" being used for mining coins. Note that it is not neccessarily to start with 0. The only requirement is that the nonce is not beyond the limit.

Coins adjust their Difficulty requirement such that blocks are spaced evenly over time, Bitcoin tries to get a block every 10 minutes, Ethereum targets 12.5 seconds, other coins have other targets. As more Hashrate is added/removed to a coins network its required Difficulty increases/decreases to compensate and keep the "block time" close to the target for that coin.

Hashes which don't meet the Difficulty required for a Block may still meet a lower Difficulty level set by the pool and are sent to the pool to prove that you are trying to find a Block, these Shares are used to determine how much of the next Block you will recieve when someone on the pool finds a Block.

With that said, obviously you can also just stumble upon a good Nonce in less guesses than expected by having good Luck (or significantly more guesses if your Luck is bad!)

#### Effort/Luck

The ratio of how many Hashes were carried out vs how many were expected to meet a given Difficulty is called Effort, a low Effort of 50% for example meaning a good Nonce was found in half the amount of guesses expected.

The inverse of Effort is referred to as Luck, a Luck of 200% means you found a good Nonce in half the amount of guesses expected.
