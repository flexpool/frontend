## DO NOT COMMIT TRANSLATION SUBMISSIONS HERE

Instead, you can help us translate Flexpool.io website to your language at [Crowdin](https://crowdin.com/project/flexpoolio-website).

## USING PLURALS

Some sentences might be in plural definition, e.g. `someKey, someKey_1, someKey_2`. Different plural indexes are used per language.

For example english uses

```
someKey: "You have {{count}} chicken // You have 1 chicken
someKey_plural: "You have {{count}} chickens // You have (0, 2-n) chickens
```

Czech language uses

```
someKey: "Máš {{count}} kuře // Máš 1 kuře
someKey_1: "Máš {{count}} chickens // Máš (2-4) kuřata
someKey_2: "Máš {{count}} chickens // Máš (0,5-n) kuřat
```

To check which indexes are used in your language, use this fiddle below:
https://jsfiddle.net/sm9wgLze

## Translating GET STARTED

You will encounter single word keys like `AMD, windows, hiveos, 0.75` and os on. Please do not translate these as they are not meant to be translated.

---

## Adding new languages

### Language selector in footer

To add a new language to language selector, update `src/i18n-select-lang.ts`

### Don't forget adding date localization

Localization must be imported from `date-fns` library, update `src/i18n-date-locales.ts`