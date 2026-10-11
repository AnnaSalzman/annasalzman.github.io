# Decisions

Choices made while setting the site up, mostly without asking, each with a one-line reason so they're easy to revisit. Newest at the bottom. When you make a call like this later, add it here.

## Open questions

These need someone other than the developer, or need checking once the repo is live.

| # | Question | Current state |
| --- | --- | --- |
| Q1 | **License for Anna's content.** The repo came with an Apache-2.0 `LICENSE`, which as written covers everything in the repo, including her drawings, photos and writing, and lets anyone reuse them. | Left untouched; the footer says "© Anna Salzman". Suggestion: keep a code license (MIT or Apache-2.0) for everything outside `src/content/` and `public/files/`, and state that the content is © Anna Salzman, all rights reserved (or CC BY-NC 4.0 if she wants to share). Anna's call. |
| Q2 | **Contact name in EDITING.md.** The guide says "message Wouter", taken from this machine's home folder and git config (WHaverals). | Check it's the name Anna uses for you. |
| Q3 | **Prefilled "new file" links** in EDITING.md use GitHub's `/new/main/<folder>?filename=…&value=…` URL parameters. | Untested while signed in. If `value` isn't honoured, the links still open an empty file in the right folder, and the guide says to paste the template. |
| Q4 | **About text and home intro** are neutral placeholders. They only say she teaches middle school; subject and grades were unknown. | Anna rewrites `src/content/pages/about.md`. |
| Q5 | **Sample class pages** link to real, free sites (PhET, Desmos, Khan Academy, TypingClub, Scratch, NASA Space Place) as plausible examples. | Replace with what she actually uses. |
| Q6 | **Pages setting.** Deploy needs Settings → Pages → Source: GitHub Actions, done once by an admin (Anna). | Not done yet; see README. |
| Q7 | **Failure emails go to whoever pushed.** For Anna's edits that's Anna, not you. | She's told to forward them. If you want to know directly, add a notification step to the workflow later. |

## Stack and structure

1. **Astro 7, static output.** Content collections give a checked schema; the image pipeline resizes phone photos and strips metadata; zero JS by default. Jekyll (GitHub's built-in) can't do typed content or image processing without plugins Pages doesn't allow.
2. **Deploy with our own GitHub Actions workflow, not Pages' built-in Jekyll.** Needed for Astro; the workflow is short and readable (`.github/workflows/publish.yml`), rather than wrapped in `withastro/action`.
3. **Sätteri (Astro 7's default Markdown processor) plus one hast plugin, not `@astrojs/markdown-remark` with rehype plugins.** It stays on Astro's default path and needs no extra unified packages. `rawHtml: true` gives the plugin real elements.
4. **`@astrojs/markdown-satteri` is a direct dependency**, pinned to the same version Astro uses. `astro.config.mjs` has to import `satteri()` to configure it. Bump it together with `astro`.
5. **Plain `.md` with HTML-style tags, not MDX.** In MDX, a `<` or `{` in ordinary prose, or an HTML comment, fails the build, and that would happen to Anna constantly. In `.md`, a misspelled tag just shows as text.
6. **Components = build-time transform + optional custom element, no UI framework.** HTML is finished at build time (works without JS, no hydration); interactivity is a few lines of vanilla JS per component.
7. **One folder per component** (`build.ts`, `client.ts`, `style.css`), with client code and styles auto-included by glob. Adding a component is one folder plus one registry line.
8. **Unknown/misspelled component tags warn, never fail**, with a "did you mean" suggestion.
9. **Interactive components chosen:** sticky note, show-the-answer (native `<details>`), quiz question, flip cards, game links, photo grid, plus responsive pasted embeds. A small set a teacher would actually use; each one costs docs and upkeep.
10. **Quiz syntax reuses GitHub task lists** (`- [x] right answer`), which Anna can type and which renders sensibly even in GitHub's preview.
11. **Flip cards take `front="…" back="…"` attributes**: one line per card, easy to copy. Text between the tags also works as the back, silently, to forgive that mistake.
12. **Embeds: paste the provider's `<iframe>` code** instead of a YouTube component. Works for YouTube, Slides, Forms and maps alike; the plugin makes it responsive from its own width/height.
13. **Schema is forgiving** (`draft: yes`, `tags: a, b`, numeric titles, unknown colors ignored). Hand-typed YAML fails easily; fail only on missing essentials.
14. **`alt` is optional for drawings and photos, falling back to the title.** Requiring it would fail Anna's builds; a title is a reasonable description of a drawing.
15. **One Markdown file per drawing or photo** (not "drop pictures in a folder"). It carries title, date and alt text, and is consistent with posts.
16. **Pictures live in an `images/` folder next to the Markdown that uses them**, referenced as `./images/x.jpg`. One rule for every section, and Astro can optimize them.
17. **Downloads live in `public/files/`**, outside the image pipeline, so worksheet URLs stay stable and shareable (`/files/name.pdf`).
18. **The file name is the URL; no date prefix stripping.** Predictable for Anna ("the name of the file is its address").
19. **Resources are one page per class**, written in Markdown with game links and download links, rather than one file per link. Faster for many links and reads like a class page.
20. **Separate detail pages for each drawing and photo**, not a lightbox. Shareable links, no JS, prev/next navigation.
21. **Tags get their own pages** (`/blog/tags/<tag>/`); tags differing only in case are merged.
22. **Drafts show in `npm run dev` with a badge** and are hidden from production and RSS. Anna can't preview drafts online; for her, a draft means "saved, not published".
23. **Hidden page at `/components/`** (the playground): public but `noindex` and not in the menu. It's Anna's live reference and the developer's visual test page.
24. **No pagination, search, sitemap or lightbox yet.** Not needed at this size; easy to add later.

## Content checks and failure handling

25. **`scripts/check-content.mjs` runs before every build** and only fails for problems that would break the Astro build anyway; everything else warns. Anna's site never stops updating over style issues.
26. **Messages are GitHub annotations in CI**, so the failure email's "View workflow run" page shows a plain-words explanation at the top.
27. **Case-sensitive file checks** (macOS hides case mismatches that break on the Linux runner).
28. **Checks added for the usual hand-editing slips:** unquoted colon in a title (fails), `#` truncating a value (warns), HEIC photos (fails if used), picture names with spaces (warns: Markdown shows them as text), GPS data in JPEGs (warns), unused pictures (warns), links to missing `/files/…` (warns).
29. **The checker is dependency-free** (its EXIF/GPS reader is ~30 lines) rather than using sharp or exif libraries.

## Images and privacy

30. **Markdown images get `layout: constrained`, 800px 1× / 1600px 2× via scalar props**; `<Image>` calls set an explicit `width` cap. A 4000px phone photo never ships at full size, and no oversized fallback is generated.
31. **Image breakpoints set to 400/800/1200/1600** (Astro's defaults go to 2560), enough for a 42rem column at 2×, and fewer files per picture.
32. **Verified that generated images carry no EXIF/GPS and originals aren't copied to `dist/`.** The originals in the public repo still do, so Anna's guide covers turning off location, and the checker warns.
33. **Photos-and-privacy section in EDITING.md** (location data, students' faces, school policy, git history keeps deleted files). It's a teacher's site.

## Design

34. **"Sketchbook" look:** dot-grid paper, ink outlines, offset sticker shadows, marker highlights, tape and polaroids, slight rotations. It's playful and fits her drawings, without reading as a kids' site.
35. **Chalkboard dark theme**, following the system setting, plus a toggle remembered in `localStorage`. On theme for a teacher, and dark mode is expected.
36. **Fonts: Shantell Sans (display) and Lexend (body), self-hosted via Fontsource.** Shantell looks hand-drawn like her drawings; Lexend was designed for reading ease, which suits students. No Google Fonts requests.
37. **Only the weight axis of Shantell Sans** (79 KB latin instead of 174 KB with the bounce/informality axes).
38. **Six named crayon colors** (red, orange, yellow, green, blue, purple) with aliases (pink→red, sky→blue, …), applied as `tint-*` classes. Anna picks colors by plain names.
39. **Each section has a color** (blog red, drawings purple, photos blue, resources green, about yellow), so pages in a section are tinted consistently.
40. **Cards and game links without an explicit color get one derived from their text**: varied but stable between builds.
41. **Galleries use a top-aligned grid, not CSS-columns masonry.** Columns produced a stray tape fragment in Chrome with rotated items, and read top-to-bottom instead of newest-first.
42. **Translucent highlighter in dark mode.** White chalk text over a bright pastel marker failed contrast.
43. **Menu label "Resources"** (not "For students" or "Classroom"): plain enough for students to find. The home page section is called "For my students".
44. **Game links open in the same tab**: standard link behaviour. Revisit if Anna prefers new tabs for games.
45. **Dates are formatted in UTC** so YAML dates never shift a day in US time zones.

## Repo housekeeping

46. **Replaced the Python `.gitignore`** (GitHub's template at repo creation) with a Node/Astro one.
47. **Node 22 via `.nvmrc`**; Astro 7 requires ≥ 22.12.
48. **Dev dependencies:** `@astrojs/check` + `typescript` 6 (`astro check` doesn't support TypeScript 7 yet) and `@types/node` (the build-time plugin uses `node:path`, `node:url`, `process`). `@types/hast` comes with Sätteri, which our plugin types already depend on.
49. **`@astrojs/rss` kept** for correct feed XML; no sitemap integration (not needed for a small personal site).
50. **No Dependabot.** Its PRs would notify Anna, who owns the repo. Update dependencies deliberately instead (`npm outdated`).
51. **`.claude/launch.json` committed** so Claude Code's browser pane can start the dev and preview servers.
52. **No CMS** (Decap, Pages CMS, …): the brief was github.com's own editor. If the editor turns out to be a struggle for Anna, Pages CMS on top of these same files would be the next step; the schema already maps to forms.
53. **Placeholder sample content** (`sample-*`, `welcome.md`) uses generated, clearly labelled "SAMPLE" images, so the site can be reviewed before Anna adds her own. Listed in README under "Before launch".

## Illustrated home page (prototype, from Anna's sketch)

54. **Anna teaches French at an English-speaking school**: the interface stays in English, with French as flavor (her labels, "Bonjour !").
55. **Her sketch becomes the navigation.** Each drawing is a door: portrait with camera → Photos, whiteboard → Pedagogy (the blog), museum → drawings (and later francophone images), cinema → films (not built yet), madeleine → the memory classroom (student resources). The mapping is a guess until Anna confirms.
56. **Built as a separate page, `/prototype/`** (noindex, not linked), so the live home page is untouched until it's adopted.
57. **Drawings are lifted straight from her vector PDF** (`scripts/scene/`) rather than scanned: strokes split by region, simplified (~6× smaller), inlined as SVG with `currentColor`, so the ink follows the theme (chalk in dark mode). About 34 KB gzipped for the whole scene.
58. **Desktop keeps her composition** (each drawing at its sketch coordinates); **phones get a vertical walk** with a dotted path between places.
59. **Each door has a small ritual** (flash plus her latest photos popping out of the camera, the marker writing A B C, a visitor climbing the stairs, a ticket from the box office, eating the madeleine). On touch screens they play when scrolled into view; with reduced motion they're off. Only the madeleine delays navigation (~1 s), and not for modified clicks.
60. **Her handwriting is the visible label; a typed name is the accessible name** (shown as a chip on hover on desktop, under each drawing on phones).
61. **Watercolor washes behind the drawings** (crayon tints, a wobbly SVG displacement filter), off-register like a risograph, instead of the earlier clip-art doodles and emoji.
62. **The menu is hidden on the scene page**; the drawings are the menu (`showNav={false}`).

