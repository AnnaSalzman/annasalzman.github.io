# How to update your website

Hi Anna! This guide covers everything you need to add posts, drawings, photos and class resources yourself, right from github.com. No installing anything.

**Your website:** <https://annasalzman.github.io>
**Its files on GitHub:** <https://github.com/AnnaSalzman/annasalzman.github.io>
**See every fun component working:** <https://annasalzman.github.io/components/>

---

## Contents

1. [How it works, in one minute](#how-it-works-in-one-minute)
2. [Where everything lives](#where-everything-lives)
3. [Editing on github.com](#editing-on-githubcom)
4. [After you save](#after-you-save)
5. [Write a blog post](#write-a-blog-post)
6. [Add a drawing](#add-a-drawing)
7. [Add a photo](#add-a-photo)
8. [Class resources: pages, games and worksheets](#class-resources-pages-games-and-worksheets)
9. [Pictures: names, sizes and iPhone photos](#pictures-names-sizes-and-iphone-photos)
10. [Photos and privacy](#photos-and-privacy)
11. [Formatting cheat sheet](#formatting-cheat-sheet)
12. [The fun stuff: components](#the-fun-stuff-components)
13. [Drafts: save now, publish later](#drafts-save-now-publish-later)
14. [Changing the About page and the home page](#changing-the-about-page-and-the-home-page)
15. [If something goes wrong](#if-something-goes-wrong)

---

## How it works, in one minute

Your website is made from a folder of plain text files on GitHub. Each blog post, drawing, photo and resource page is one small text file. Pictures are uploaded next to them.

When you save a change on github.com, GitHub automatically rebuilds your website. **About two minutes later, the change is live.** If something in your change can't work (a picture name with a typo, say), GitHub sends you an email instead, and **the website stays exactly as it was**. Nothing breaks for your students.

So you can't really break anything. Worst case, you get an email and send it to Wouter.

---

## Where everything lives

All your content is inside the `src/content` folder. Each kind of thing has its own folder, and each of those has an `images` folder for its pictures.

| What | Text files go in | Pictures go in |
| --- | --- | --- |
| Blog posts | [`src/content/blog`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/blog) | [`src/content/blog/images`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/blog/images) |
| Drawings | [`src/content/drawings`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/drawings) | [`src/content/drawings/images`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/drawings/images) |
| Photos | [`src/content/photos`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/photos) | [`src/content/photos/images`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/photos/images) |
| Class resources | [`src/content/resources`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/resources) | [`src/content/resources/images`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/resources/images) |
| About page | [`src/content/pages/about.md`](https://github.com/AnnaSalzman/annasalzman.github.io/blob/main/src/content/pages/about.md) | [`src/content/pages/images`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/pages/images) |
| Worksheets and other downloads (PDF, Word, …) | | [`public/files`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/public/files) |

Tip: bookmark the folders you use most.

**Leave everything else alone.** The other folders hold the machinery that makes the site work. Looking is fine; if you want something changed there, ask Wouter.

### The name of a file is its web address

A post saved as `src/content/blog/field-trip-day.md` appears at `annasalzman.github.io/blog/field-trip-day/`. So:

- use **lowercase letters, numbers and dashes** only: `field-trip-day.md`, not `Field Trip Day!.md`
- always end text files in **`.md`**
- changing a file's name later changes its address (old links to it stop working)

### The sample content

The site starts with a few sample posts, drawings, photos and resource pages so you can see how everything looks. Their names start with `sample-` (and the welcome post, `welcome.md`). Change them or delete them whenever you like. When you delete a sample, delete its picture in the `images` folder too.

---

## Editing on github.com

You need to be signed in to GitHub.

### Change a file that already exists

1. Go to the file (for example, open the `blog` folder and click a post).
2. Click the **pencil icon** ✏️ ("Edit this file") near the top right of the file.
3. Make your changes. The **Preview** tab shows roughly how it will look. (Preview doesn't show the fun components like quizzes. That's normal.)
4. Click the green **Commit changes…** button. "Commit" is GitHub's word for "save".
5. A small window opens. Leave **Commit directly to the main branch** selected, and click **Commit changes** again.

### Make a new file

The quickest way is one of these links. Each opens a new file in the right folder **with a template already filled in**:

- [✏️ Start a new blog post](https://github.com/AnnaSalzman/annasalzman.github.io/new/main/src/content/blog?filename=my-new-post.md&value=---%0Atitle%3A%20My%20new%20post%0Adate%3A%202026-01-01%0Adescription%3A%20One%20sentence%20about%20this%20post.%0Atags%3A%20%5Bclassroom%5D%0A---%0A%0AWrite%20your%20post%20here.%0A)
- [🎨 Add a drawing](https://github.com/AnnaSalzman/annasalzman.github.io/new/main/src/content/drawings?filename=my-drawing.md&value=---%0Atitle%3A%20My%20drawing%0Adate%3A%202026-01-01%0Aimage%3A%20.%2Fimages%2Fmy-drawing.jpg%0Aalt%3A%20Describe%20what%20the%20drawing%20shows%0A---%0A%0AA%20few%20words%20about%20it%20%28or%20delete%20this%20line%29.%0A) (upload the picture first, see below)
- [📷 Add a photo](https://github.com/AnnaSalzman/annasalzman.github.io/new/main/src/content/photos?filename=my-photo.md&value=---%0Atitle%3A%20My%20photo%0Adate%3A%202026-01-01%0Aimage%3A%20.%2Fimages%2Fmy-photo.jpg%0Aalt%3A%20Describe%20what%20the%20photo%20shows%0A---%0A%0AA%20few%20words%20about%20it%20%28or%20delete%20this%20line%29.%0A) (upload the picture first)
- [🎒 Add a class resource page](https://github.com/AnnaSalzman/annasalzman.github.io/new/main/src/content/resources?filename=class-name.md&value=---%0Atitle%3A%20Class%20name%0Adescription%3A%20Games%2C%20links%20and%20worksheets%20for%20this%20class.%0Aemoji%3A%20%F0%9F%93%9A%0Acolor%3A%20blue%0Aorder%3A%201%0A---%0A%0A%23%23%20Games%0A%0A%3Cgame-link%20href%3D%22https%3A%2F%2Fexample.com%22%20emoji%3D%22%F0%9F%8E%AE%22%3E%2A%2AGame%20name%2A%2A%3A%20what%20it%20practices%3C%2Fgame-link%3E%0A%0A%23%23%20Worksheets%0A%0A-%20%5BWorksheet%20name%5D%28%2Ffiles%2Fworksheet-name.pdf%29%0A)

Then change the file name at the top (keep the `.md`), fill in your text, change the date, and click **Commit changes…**.

If a link opens an empty file instead of a template, no problem: copy the template from the section for that kind of thing below and paste it in.

Making a file by hand: open the folder, click **Add file** (top right) → **Create new file**, type the name, paste a template, and commit.

### Upload pictures and files

1. Open the right `images` folder (see the table above), or `public/files` for worksheets.
2. Click **Add file** → **Upload files**.
3. Drag your pictures onto the page (or click "choose your files").
4. Click **Commit changes**.

Upload the picture **before** you make the text file that uses it. (The other way round also works, but you'll get one "Run failed" email in between.)

### Delete a file

Open the file, click the **⋯** menu (three dots, top right of the file) → **Delete file**, then **Commit changes**.

### Optional: change several files at once

On any page of your files on GitHub, press the **.** (period) key. A bigger editor opens in your browser where you can drag in pictures, edit several files, and save them all together. To save there, click the branch icon on the left, type a short note, and click **Commit & Push**. Only use this if you like it; the normal way works fine.

---

## After you save

1. Go to your files on GitHub. Next to the latest change (just above the list of files) you'll see a small symbol:
   - 🟡 **yellow dot**: the website is being rebuilt. Wait a minute or two.
   - ✅ **green check**: done! Your change is live.
   - ❌ **red X**: something needs fixing. See [If something goes wrong](#if-something-goes-wrong).
2. Open your website. If you still see the old version, refresh the page. Browsers sometimes keep the old page for a bit; holding **Shift** while clicking refresh fixes that.

You can see all the rebuilds on the [Actions page](https://github.com/AnnaSalzman/annasalzman.github.io/actions).

---

## Write a blog post

Use the [✏️ new post link](#make-a-new-file), or make a file in `src/content/blog` named like `my-post-title.md`, and paste this:

```markdown
---
title: Our class garden
date: 2026-10-11
description: The tomatoes are finally here!
cover: ./images/garden-cover.jpg
coverAlt: Three red tomatoes on a desk
tags: [classroom, science]
---

Write your post here. Leave an empty line between paragraphs.

![Kids watering the plants](./images/garden-watering.jpg)
```

The part between the two `---` lines is the **top part**: settings for the post. Everything after it is the post itself.

| Setting | What it does | Needed? |
| --- | --- | --- |
| `title` | The post's title. | Yes |
| `date` | The date shown on the post, as year-month-day: `2026-10-11`. Posts are sorted by it. | Yes |
| `description` | One sentence shown in the list of posts and in link previews (when someone shares the link). | No, but nice |
| `cover` | A big picture at the top of the post and on its card. The file goes in `src/content/blog/images`. | No |
| `coverAlt` | A short description of the cover picture, for people who can't see it. | With a cover |
| `tags` | Topics, in square brackets with commas: `[science, field trip]`. Each tag gets its own page. | No |
| `draft` | `draft: true` hides the post. See [Drafts](#drafts-save-now-publish-later). | No |

Two rules for the top part:

- **If a title has a colon (:) or starts with a quote, put the whole title in quotes:** `title: "Day 1: total chaos"`.
- Everything after a `#` is ignored, so put titles with a `#` in quotes too: `title: "Unit #3"`.

Pictures inside the post: upload them to `src/content/blog/images`, then write `![what the picture shows](./images/file-name.jpg)` on its own line, with an empty line before and after. The words in the square brackets describe the picture for people who can't see it.

---

## Add a drawing

1. Upload the picture to [`src/content/drawings/images`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/drawings/images), for example `autumn-leaves.jpg`.
2. Use the [🎨 new drawing link](#make-a-new-file), or make a file in `src/content/drawings` named `autumn-leaves.md`:

```markdown
---
title: Autumn leaves
date: 2026-10-11
image: ./images/autumn-leaves.jpg
alt: Watercolor of orange and red maple leaves
---

Painted these on the porch on Sunday. (Optional. Delete this if there's nothing to say.)
```

`image` must match the picture's name exactly, capital letters included. `alt` describes the drawing for people who can't see it. If you skip it, the title is used.

Drawings are shown newest first, by `date`.

---

## Add a photo

Exactly like a drawing, but in the photos folders:

1. Upload the photo to [`src/content/photos/images`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/src/content/photos/images). Read [Photos and privacy](#photos-and-privacy) first.
2. Use the [📷 new photo link](#make-a-new-file), or make a file in `src/content/photos`:

```markdown
---
title: First snow
date: 2026-12-02
image: ./images/first-snow.jpg
alt: Snow on the school playground at sunrise
---
```

---

## Class resources: pages, games and worksheets

The [Resources page](https://annasalzman.github.io/resources/) shows a big colorful card for each **resource page**. Make one page per class (or per topic), and put that class's games, links and worksheets on it.

### Make a resource page

Use the [🎒 new resource page link](#make-a-new-file), or make a file in `src/content/resources`, like `grade-7-science.md`:

```markdown
---
title: 7th grade science
description: Games, links and worksheets for 7th grade science.
emoji: 🔬
color: blue
order: 1
---

## This week

<sticky-note>

**Test on Friday!** Practice with the flashcards below.

</sticky-note>

## Games

<game-link href="https://phet.colorado.edu/" emoji="🔬">**PhET**: science experiments you can play with</game-link>
<game-link href="https://www.khanacademy.org/" emoji="🦉">**Khan Academy**: videos and practice</game-link>

## Worksheets

- [Cells worksheet](/files/cells-worksheet.pdf)
- [Lab safety rules](/files/lab-safety.pdf)
```

| Setting | What it does |
| --- | --- |
| `title` | Shown on the card and at the top of the page. |
| `description` | One sentence under the title. Optional. |
| `emoji` | The big picture on the card. Copy one from <https://emojipedia.org>, or on a Mac press **Control + Command + Space**. Optional (📚 if you leave it out). |
| `color` | The card's color: `red`, `orange`, `yellow`, `green`, `blue` or `purple`. Optional. |
| `order` | Cards are sorted by this number, smallest first. Optional. |

The address students type is `annasalzman.github.io/resources/grade-7-science/` (the file name without `.md`).

### Add a worksheet (or any file to download)

1. Upload the file to [`public/files`](https://github.com/AnnaSalzman/annasalzman.github.io/tree/main/public/files). Name it with lowercase and dashes: `cells-worksheet.pdf`.
2. Link to it from any page: `[Cells worksheet](/files/cells-worksheet.pdf)`.

The file's own address is `annasalzman.github.io/files/cells-worksheet.pdf`, handy to share directly. PDFs work best because everyone can open them.

### Add a game or website for students

Use a [game link](#game-link-a-big-button-for-games-and-websites) for big, tappable buttons, or a normal link in a list: `- [Prodigy](https://www.prodigygame.com/)`.

---

## Pictures: names, sizes and iPhone photos

- **Names:** lowercase, numbers and dashes, ending in `.jpg` or `.png`: `garden-day-2.jpg`. Phone names like `IMG_4031.JPG` work, but you'll have to type them exactly (capital letters count), so renaming is easier.
- **Size:** photos straight from your phone are fine. The website automatically makes smaller copies so pages load fast. Keep files under 10 MB if you can.
- **Rename before uploading**, on your computer. GitHub can't rename pictures.

### iPhone photos (.HEIC)

iPhones save photos as `.HEIC`, which websites can't show. Before uploading, make it a JPG:

- **On a Mac:** open the photo in **Preview**, then **File → Export…**, choose **Format: JPEG**, and save.
- **On the iPhone:** **Settings → Camera → Formats → Most Compatible** makes new photos JPGs from now on.
- AirDropping or emailing a photo to yourself often turns it into a JPG too. Check that the name ends in `.jpg`.

---

## Photos and privacy

Please read this one.

- **Location.** Phones often save *where* a photo was taken inside the picture file. The website removes that from the pictures it shows, but **the original files you upload to GitHub are public**, and anyone can download them. Turn location off before uploading:
  - **iPhone:** in the Photos app, tap **Share** → **Options** at the top → switch **Location** off, then save or send that copy. Or switch it off for all photos: **Settings → Privacy & Security → Location Services → Camera → Never**.
  - **Android:** in the Camera settings, turn off **Location tags** (the name varies a bit by phone).
- **Students.** Only post photos where students can be recognized if your school's rules allow it and you have permission. When in doubt: hands, backs of heads, or projects instead of faces. The same goes for names on worksheets and whiteboards in the background.
- **Deleting doesn't fully erase.** GitHub keeps the history of every file, so a deleted picture can still be found by someone who knows how. If you upload something by mistake that must really disappear, tell Wouter right away; it can be removed completely.

---

## Formatting cheat sheet

| You type | You get |
| --- | --- |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `[link text](https://example.com)` | [link text](https://example.com) |
| `[About me](/about/)` | a link to a page on your own site |
| `## A heading` | a big heading (use `##` for sections and `###` for smaller ones; the title already uses `#`) |
| `- item` | a bullet list (one item per line) |
| `1. item` | a numbered list |
| `> a quote` | a quote, in a colored box |
| `![description](./images/name.jpg)` | a picture |
| `---` on its own line, with empty lines around it | a squiggly divider line |

- Leave **an empty line** between paragraphs. One line break alone doesn't start a new paragraph.
- Tables:

```markdown
| Day | Homework |
| --- | --- |
| Monday | Read chapter 3 |
| Wednesday | Worksheet page 12 |
```

---

## The fun stuff: components

Components are little interactive things you can put in any post, resource page, or the About page. They look like tags in angle brackets: `<sticky-note>`.

**See them all working at <https://annasalzman.github.io/components/>.** Copy the examples below and change the words.

Three rules make them work:

1. Put each component **on its own line(s)**, not in the middle of a sentence.
2. When a component has text inside it, leave an **empty line after the opening tag** and an **empty line before the closing tag**, as in the examples.
3. Inside `"quotes"`, don't use straight double quotes. Use 'single quotes' or “curly quotes” instead.

If a component's name is misspelled, it won't work: it shows up as plain text, or not at all. The [Actions page](https://github.com/AnnaSalzman/annasalzman.github.io/actions) then shows a note about it on that rebuild.

### Sticky note: reminders and asides

```markdown
<sticky-note>

**Reminder:** field trip forms are due Friday!

</sticky-note>
```

Colors: add `color="green"` (or `red`, `orange`, `yellow`, `blue`, `purple`). Yellow is the default.

```markdown
<sticky-note color="blue">

No homework this week. Enjoy the long weekend!

</sticky-note>
```

### Show the answer: a hidden answer that opens when clicked

```markdown
<details>
<summary>What is 7 × 8?</summary>

56!

</details>
```

The question goes between `<summary>` and `</summary>`; the answer goes after it.

### Quiz question: multiple choice with confetti

```markdown
<quiz-question>

Which planet is the biggest in our solar system?

- [ ] Mars
- [x] Jupiter
- [ ] Earth

Jupiter is so big that more than 1,300 Earths could fit inside it!

</quiz-question>
```

- The question comes first.
- Then the answers as a list. Put an **x** in the box of the right answer: `- [x]`. The wrong ones get a space: `- [ ]`.
- Anything after the list is shown once someone picks the right answer. Optional.

### Flip cards: flashcards

```markdown
<flip-card front="Photosynthesis" back="How plants make food from sunlight"></flip-card>
<flip-card front="Mitosis" back="How one cell splits into two"></flip-card>
<flip-card front="Habitat" back="The place where an animal or plant lives"></flip-card>
```

Put several on lines right under each other (no empty lines in between) to get a deck. Each card has its own color; to choose one, add `color="purple"`.

### Game link: a big button for games and websites

```markdown
<game-link href="https://www.desmos.com/calculator" emoji="📈">**Desmos**: the graphing calculator</game-link>
<game-link href="https://scratch.mit.edu/" emoji="🐱">**Scratch**: make your own games</game-link>
```

- `href` is the web address (copy it from your browser's address bar).
- `emoji` is optional (🎮 if you leave it out), and so is `color="green"`.
- Several game links on lines under each other line up in a grid.

### Photo grid: pictures side by side

```markdown
<photo-grid>

![Planting seeds](./images/garden-1.jpg)
![The first sprout](./images/garden-2.jpg "Day 6")
![Tomatoes!](./images/garden-3.jpg "Day 40")

</photo-grid>
```

Text in quotes after the file name (like `"Day 6"`) becomes a caption under that picture. Optional.

### Videos, slides, forms and maps

Anything that offers an **embed code** can go in a post. Paste the code on its own line, with an empty line before and after. It shrinks to fit phones automatically.

- **YouTube:** under the video, click **Share** → **Embed** → **Copy**.
- **Google Slides:** **File** → **Share** → **Publish to web** → **Embed** → **Publish** → copy the code.
- **Google Forms:** **Send** → the **< >** tab → **Copy**.

It looks something like this (yours will have a different address):

```html
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/VIDEO-ID" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
```

---

## Drafts: save now, publish later

Add `draft: true` to the top part of a post (or a drawing, photo or resource page):

```markdown
---
title: Half-finished post
date: 2026-10-11
draft: true
---
```

The file is saved on GitHub but **doesn't appear on the website**. When it's ready, change it to `draft: false` (or delete the line) and save.

---

## Changing the About page and the home page

- The **About page** is [`src/content/pages/about.md`](https://github.com/AnnaSalzman/annasalzman.github.io/blob/main/src/content/pages/about.md). Edit it like a post.
- The short intro on the **home page** is the `summary:` line at the top of that same file. Keep it to a sentence or two.
- The home page fills itself in: it shows the newest posts, drawings and photos, and your resource pages.

Want something else changed (colors, the menu, the layout)? Ask Wouter.

---

## If something goes wrong

### You got an email that says "Run failed"

It comes from GitHub (notifications@github.com), with a subject like:

> [AnnaSalzman/annasalzman.github.io] Run failed: Publish site - main

It means your last change couldn't be put on the website. **Your website is fine.** It still shows the version from before that change. Nobody sees anything broken.

What to do:

1. Click **View workflow run** in the email. At the top of that page, there's usually a box (marked *Content problem*) that says in plain words what's wrong and which file. For example:
   - *Can't find the picture "./images/Garden.jpg". There is a file called "garden.jpg" in that folder.* → fix the name in your text file so it matches exactly.
   - *The title has a colon in it.* → put the title in quotes.
   - *"…" is an iPhone HEIC photo.* → see [iPhone photos](#iphone-photos-heic).
2. Fix it and save again. When the new rebuild finishes with a green check, you're done.
3. **If the message doesn't make sense, or it still fails: message Wouter.** Forward the email, or send the link to the failed run. Don't worry about it; the site stays up in the meantime.

### Common slips

| What happened | Fix |
| --- | --- |
| The post doesn't show up at all | Check the file ends in `.md`, is in the right folder, and doesn't say `draft: true`. |
| The page still looks old | Wait two minutes, then refresh while holding **Shift**. |
| A picture shows as text like `![…](…)` | The picture's name has a space in it. Rename the file with dashes. |
| A component shows up as plain text or not at all | Check the empty lines around the text inside it, and the spelling of its name. |
| Words after a `#` in the title disappeared | Put the title in quotes. |
| A worksheet link goes nowhere | Check that the file is in `public/files` and the name matches exactly. |

### Undo a change

Every saved version is kept. Ask Wouter to bring back an older version of anything. Nothing you save is ever truly lost.
