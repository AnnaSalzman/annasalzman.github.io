---
title: Components playground
description: Every component, working. Copy the examples from docs/EDITING.md.
hidden: true
---

<!--
  This page shows every component so you can see how they look and check that
  they still work after changes. It is not in the menu and search engines skip it.
  Developers: keep one example of each component here (see CLAUDE.md).
-->

## Sticky note

<sticky-note>

**Interro vendredi !** Quiz on Friday: review the colors.

</sticky-note>

<sticky-note color="green">

Sticky notes come in red, orange, yellow, green, blue and purple.

</sticky-note>

## Show the answer

<details>
<summary>Comment dit-on « thank you » ?</summary>

**Merci !** (And *merci beaucoup* for "thank you very much.")

</details>

## Quiz question

<quiz-question>

Quel jour vient après lundi ?

- [ ] dimanche
- [x] mardi
- [ ] jeudi

Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.

</quiz-question>

## Flip cards

<flip-card fr="le chat" en="the cat"></flip-card>
<flip-card fr="le chien" en="the dog" color="blue"></flip-card>
<flip-card fr="l'oiseau" en="the bird" color="purple"></flip-card>

## Game links

<game-link href="https://conjuguemos.com/" emoji="🔤">**Conjuguemos**: verb practice</game-link>
<game-link href="https://lyricstraining.com/" emoji="🎵" color="orange">**LyricsTraining**: learn with songs</game-link>

## Photo grid

<photo-grid>

![A white circle on blue](./images/sample-grid-1.jpg "Un cercle")
![A white square on purple](./images/sample-grid-2.jpg "Un carré")
![A white triangle on green](./images/sample-grid-3.jpg "Un triangle")

</photo-grid>

## A single picture

![A white circle on a blue background](./images/sample-grid-1.jpg)

## Embedded things

Anything that gives you an "embed code" (YouTube, Google Slides, Google Forms, maps, …) can be pasted in. It shrinks to fit phones and keeps its shape.

<iframe width="800" height="400" src="https://www.openstreetmap.org/export/embed.html?bbox=-6%2C41%2C10%2C51.5&amp;layer=mapnik" title="Map of France"></iframe>

## Plain Markdown

Text can be **bold**, *italic*, or a [link](/blog/). Links to files get an icon: [Sample worksheet](/files/sample-worksheet.pdf).

French punctuation stays together: Bonjour ! Ça va ? Il a dit : « Salut ! » Even at the very end of a line, the ! never ends up alone.

> Petit à petit, l'oiseau fait son nid.

1. un
2. deux
3. trois

- Bullet
- Lists

| Jour | Devoirs |
| --- | --- |
| Lundi | Lire le chapitre 3 |
| Mercredi | Fiche, page 12 |

---

That squiggle above is a divider (three dashes on their own line).
