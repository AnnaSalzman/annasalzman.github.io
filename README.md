# annasalzman.github.io

The personal website of Anna Salzman, a middle school teacher: a blog, her drawings, her photos, and resources for her students (game links, worksheets, flashcards, little quizzes), with room for small interactive things inside posts.

**Live:** <https://annasalzman.github.io>

It's a static site built with [Astro](https://astro.build) and published by GitHub Actions to GitHub Pages. Content is plain Markdown that Anna edits on github.com.

## Documentation

| Document | For | What's in it |
| --- | --- | --- |
| [docs/EDITING.md](docs/EDITING.md) | Anna | Adding posts, drawings, photos and resources on github.com; pictures; every component with a copy-paste example; what to do when a build fails |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Developer | How the pieces fit, where to extend, how the deploy works |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Developer | Choices made during setup, with one-line reasons, to revisit |
| [CLAUDE.md](CLAUDE.md) | Claude Code (and developers) | Conventions, content schema, design rules, how to add a component, how to check the build |

The live component playground is at [/components/](https://annasalzman.github.io/components/) (not linked from the menu).

## Run it locally

Requires Node.js 22.12 or newer (`.nvmrc` says 22).

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:4321>. Drafts are visible in dev, with a badge.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Content checks, then the production build into `dist/` |
| `npm run preview` | Serves `dist/` as the live site would (drafts hidden) |
| `npm run check` | Content checks plus type checking (`astro check`) |
| `npm run check:content` | Only the content checks (`scripts/check-content.mjs`) |

## How it deploys

Every push to `main` runs [.github/workflows/publish.yml](.github/workflows/publish.yml): install, `npm run build`, then publish `dist/` to GitHub Pages. That includes every edit Anna saves on github.com. A change is usually live about two minutes after it's saved. Pull requests are built as a check but not published. You can also start a run by hand from the Actions tab.

If a build fails, nothing is published and the previous version stays online. GitHub emails the person who made the change ("Run failed: Publish site - main"). The content check prints plain-language explanations as annotations at the top of the failed run.

### One-time setup

Before the first deploy, **Anna has to do this once herself**. The repo is on her personal account, where collaborators can push but can't change settings:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions** (it starts as "Deploy from a branch", which serves the README).
2. Then push to `main` (or run the workflow from the Actions tab). Push only after the switch; otherwise GitHub's old branch-based Jekyll build publishes the repo as-is.

Anna's account owns the repo, so she gets the failure emails for her own edits. The developer works as a collaborator (write access).

## Before launch

- [ ] Replace or delete the sample content: `src/content/blog/welcome.md`, `src/content/blog/sample-quiz-post.md`, `src/content/drawings/sample-*`, `src/content/photos/sample-*`, `src/content/resources/francais-1.md` and `jeux.md`, the matching pictures in each `images/` folder, and `public/files/sample-worksheet.pdf`. Keep `src/content/pages/images/sample-grid-*.jpg`; the component playground uses them.
- [ ] Anna rewrites `src/content/pages/about.md` (its `summary` is the home page intro).
- [ ] Go through the [open questions](docs/DECISIONS.md#open-questions) in DECISIONS.md (license for Anna's content, the contact name in EDITING.md, and a few others).

## License

See [LICENSE](LICENSE) and the open question about content licensing in [docs/DECISIONS.md](docs/DECISIONS.md#open-questions). Fonts: Shantell Sans and Lexend, both under the SIL Open Font License.
