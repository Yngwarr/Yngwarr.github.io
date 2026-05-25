---
title: The missing guide to pluralization in CSV in Godot
date: 2026-05-25
category: godot
---

During the development of [Tens!][tens] (out now on Poki, check it out), we decided that it would be cool to localize our game to languages we expect to be popular. We knew that Godot has a built-in [i18n API][i18n-docs] (i18n is short for internationalization) and it was a perfect opportunity to learn how to use it.

[tens]: https://poki.com/en/g/tens
[i18n-docs]: https://docs.godotengine.org/en/stable/tutorials/i18n/internationalizing_games.html

Godot supports 2 formats of localization files: [gettext][gettext] (also known as PO files) and [CSV][csv] (also known as an easy way to store spreadsheets in text). We wanted the simplest solution, so we went with the latter. It was sufficient until we stumbled upon one tiny phrase that needed pluralization.

Until Godot 4.6, there was no way to pluralize phrases if you use CSV. Now there is one, but [documentation][plur-docs] for this feature is a bit lacking, and it misses the most important piece that will save you a lot of figuring out.

[gettext]: https://docs.godotengine.org/en/stable/tutorials/i18n/localization_using_gettext.html
[csv]: https://docs.godotengine.org/en/stable/tutorials/i18n/localization_using_spreadsheets.html
[plur-docs]: https://docs.godotengine.org/en/stable/tutorials/i18n/localization_using_spreadsheets.html#specifying-plural-forms

Docs mention a `?plural` column that can be used for simple pluralization, like in English you only have either `1 die` or `many dice`. They also mention some elusive `?pluralrule` that looks like a piece of code and it's not really obvious how it's constructed and what it affects. Actually, it's a feature of aforementioned _gettext_ that was already used by Godot in PO file processor and now it's available for CSV users too. If you want to understand how it works, read [this page][gettext-plur].

[gettext-plur]: https://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html

If you don't want to figure out how `?pluralrule` works and what is the correct rule for your language, great news: you don't have to. Godot has built-in pluralization rules for many languages and will use them automatically if you format your CSV right. A pluralized phrase is formatted like this:


| keys  | ?plural | en        | ru       |
| ----- | ------- | --------- | -------- |
| SCORE | -       | %d point  | %d очко  |
|       |         | %d points | %d очка  |
|       |         |           | %d очков |


Or in CSV:

```csv
keys,?plural,en,ru
SCORE,,%d points, %d очко
,,%d points,%d очка
,,,%d очков
```

Note that:
- You **must** have a `?plural` column.
- For a pluralized entry, `?plural` column **must** contain something (anything, as far as I know, the value won't be used).
- The order of translations must abide Godot's plurification rules.

Rules themselves are described in Godot's code [here][plur-code]. Below is an explanation in English, use search to find your language.

[plur-code]: https://github.com/godotengine/godot/blob/fa09dd17a68a5741cb2361f1d07af271c7a40c4f/core/string/locales.h#L1824

## List of Built-in Pluralization Rules

- Languages with the same rules as English (everything that's not 1 is plural) or French (everything more than 1 is plural):
	1. Singular form.
	2. Plural form.
- Icelandic, Macedonian (`is mk`):
	1. Singular when the last digit is 1 but the number is not 11.
	2. Plural for all other numbers.
- Central Atlas Tamazight (`tzm`):
	1. Singular for 0, 1, and all numbers from 11 to 99.
	2. Plural for 2–10 and for 100 and above.
- Amharic, Assamese, Bengali, Dogri, Persian, Gujarati, Hindi, Kannada, Nigerian Pidgin, Zulu (`am as bn doi fa gu hi kn pcm zu`):
	1. Singular for 0 and 1.
	2. Plural for 2 and above.
- Cebuano, Filipino, Tagalog (`ceb fil tl`):
	1. Singular for 1, 2, and 3, and for any number that does not end in 4, 6, or 9.
	2. Plural for numbers ending in 4, 6, or 9.
- Prussian (`prg`):
	1. First form for numbers ending in 0 and for numbers 11–19.
	2. Second form for numbers ending in 1, except 11.
	3. Third form for all remaining numbers.
- Latvian (`lv`):
	1. First form for numbers ending in 1, except 11.
	2. Second form for all non-zero numbers (including 11).
	3. Third form for 0.
- Lithuanian (`lt`):
	1. First form for numbers ending in 1, except 11.
	2. Second form for numbers ending in 2–9, excluding the teens (12–19).
	3. Third form for 0, for the teens (10–19), and for numbers ending in 0.
- Belarusian, Croatian, Russian, Serbian, Ukrainian (`be hr ru sr uk`):
	1. First form for numbers ending in 1, except 11.
	2. Second form for numbers ending in 2–4, except the teens (12–14).
	3. Third form for everything else.
- Bosnian, Serbo-Croatian (`bs sh`):
	1. First form for numbers ending in 1, except 11.
	2. Second form for numbers ending in 2–4, except 12–14.
	3. Third form for everything else.
- Langi (`lag`):
	1. First form for 0.
	2. Second form for 1.
	3. Third form for 2 and above.
- Anii, Colognian (`blo ksh`):
	1. First form for 0.
	2. Second form for 1.
	3. Third form for 2 and above.
- Tachelhit (`shi`):
	1. First form for 0 and 1.
	2. Second form for 2–10.
	3. Third form for 11 and above.
- Polish (`pl`):
	1. First form for 1.
	2. Second form for numbers ending in 2–4, except the teens (12–14).
	3. Third form for everything else.
- Moldavian (`mo`):
	1. First form for 1.
	2. Second form for 0 and for numbers whose last two digits are 01–19 (except when the number itself is exactly 1).
	3. Third form for numbers whose last two digits are 00 or 20–99.
- Inuktitut, Hebrew, Nama, Northern Sami, Sami, Southern Sami, Lule Sami, Inari Sami, Santali, Skolt Sami (`iu iw naq sat se sma smi smj smn sms`):
	1. First form for 1.
	2. Second form for 2.
	3. Third form for everything else.
- Czech, Slovak (`cs sk`):
	1. First form for 1.
	2. Second form for 2–4.
	3. Third form for 0 and 5 and above.
- Romanian (`ro`):
	1. First form for 1.
	2. Second form for 0 and for numbers whose last two digits are 01–19.
	3. Third form for numbers whose last two digits are 00 or 20–99.
- Irish (`ga`):
	1. First form for 1.
	2. Second form for 2.
	3. Third form for everything else.
- Slovenian (`sl`):
	1. First form for numbers ending in 01.
	2. Second form for numbers ending in 02.
	3. Third form for numbers ending in 03 or 04.
	4. Fourth form for everything else.
- Lower Sorbian, Upper Sorbian (`dsb hsb`):
	1. First form for numbers ending in 01.
	2. Second form for numbers ending in 02.
	3. Third form for numbers ending in 03 or 04.
	4. Fourth form for everything else.
- Manx (`gv`):
	1. First form for numbers ending in 1.
	2. Second form for numbers ending in 2.
	3. Third form for numbers ending in 00, 20, 40, 60, or 80.
	4. Fourth form for everything else.
- Scottish Gaelic (`gd`):
	1. First form for 1 and 11.
	2. Second form for 2 and 12.
	3. Third form for 3–10 and 13–19.
	4. Fourth form for everything else (0 and 20+).
- Breton (`br`):
	1. First form for numbers ending in 1, except 11, 71, and 91.
	2. Second form for numbers ending in 2, except 12, 72, and 92.
	3. Third form for numbers ending in 3, 4, or 9, except those in the ranges 13–19, 73–79, and 93–99.
	4. Fourth form for non-zero multiples of 1,000,000.
	5. Fifth form for everything else.
- Maltese (`mt`):
	1. First form for 1.
	2. Second form for 2.
	3. Third form for 0 and for numbers ending in 03–10.
	4. Fourth form for numbers ending in 11–19.
	5. Fifth form for everything else.
- Cornish (`kw`):
	1. First form for 0.
	2. Second form for 1.
	3. Third form for numbers ending in 02, 22, 42, 62, or 82, and for certain round numbers.
	4. Fourth form for numbers ending in 03, 23, 43, 63, or 83.
	5. Fifth form for numbers ending in 01, 21, 41, 61, or 81 (except 1 itself).
	6. Sixth form for everything else.
- Arabic, Najdi Arabic (`ar ars`):
	1. First form for 0.
	2. Second form for 1.
	3. Third form for 2.
	4. Fourth form for numbers ending in 03–10.
	5. Fifth form for numbers ending in 11–99.
	6. Sixth form for numbers ending in 00, 01, or 02 (i.e., 100, 101, 102, 200, etc.).
- Welsh (`cy`):
	1. First form for 0.
	2. Second form for 1.
	3. Third form for 2.
	4. Fourth form for 3.
	5. Fifth form for 6.
	6. Sixth form for everything else.
