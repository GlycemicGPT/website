# 🤝 Contributing to GlycemicGPT Website

Thanks for your interest in contributing to the GlycemicGPT website! Whether you're fixing a typo, improving a component, or building a whole new section -- we appreciate you. 💙

This guide covers everything you need to know to get started.

---

## 📑 Table of Contents

- [Ways to Contribute](#-ways-to-contribute)
- [Finding Something to Work On](#-finding-something-to-work-on)
- [Development Setup](#-development-setup)
- [Branching & Workflow](#-branching--workflow)
- [Commit Messages](#-commit-messages)
- [Before You Submit](#-before-you-submit)
- [Pull Request Process](#-pull-request-process)
- [Code Style](#-code-style)
- [AI Attribution Policy](#-ai-assisted-development--attribution-policy)
- [Project Structure](#-project-structure)
- [License](#-license)
- [Questions?](#-questions)

---

## 💡 Ways to Contribute

There are many ways to help, not all of them involve writing code:

- 🐛 **Report bugs** -- Broken layout, wrong content, accessibility issues
- ✨ **Suggest improvements** -- Better copy, new sections, design ideas
- 📝 **Improve documentation** -- Typos, unclear instructions, missing guides
- 🎨 **Design** -- Better animations, mobile responsiveness, dark/light mode polish
- ♿ **Accessibility reviews** -- Test with screen readers, keyboard navigation
- 🌍 **Translations** -- Help make the site available in more languages (future)
- 🔍 **Review PRs** -- Fresh eyes catch things automated checks can't

Before opening an issue, please search [existing issues](https://github.com/GlycemicGPT/website/issues?q=is%3Aissue) to avoid duplicates.

---

## 🔍 Finding Something to Work On

Not sure where to start? Browse [open issues](https://github.com/GlycemicGPT/website/issues) and look for these labels:

- 🏷️ **`good first issue`** -- Small, well-scoped tasks ideal for new contributors
- 🏷️ **`help wanted`** -- We'd love community help on these
- 🏷️ **`bug`** -- Known bugs waiting for a fix

> **Tip:** Not every label will have open issues at all times. If none are tagged yet, browse the full [issue list](https://github.com/GlycemicGPT/website/issues) for inspiration.

If you'd like to work on something, comment on the issue to let others know. For larger changes, please open an issue first to discuss the approach before investing time in a PR.

---

## 🛠️ Development Setup

### Prerequisites

| Tool | Version |
|------|---------|
| 📦 Node.js | 22+ (LTS) |
| 📦 npm | 10+ |

### 🚀 Quick Start

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/website.git
cd website

# 2. Add upstream remote
git remote add upstream https://github.com/GlycemicGPT/website.git

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
```

The site runs at `http://localhost:3000`.

### 📦 Build

```bash
# Production build (static export)
npm run build

# Preview the production build locally
npx serve out
```

The static output is generated in `./out/` -- this is what gets deployed to GitHub Pages.

### Tech Stack

| Technology | Purpose |
|-----------|---------|
| ⚛️ Next.js 16 | React framework with static export |
| 🎨 Tailwind CSS v4 | Utility-first styling |
| 🧩 shadcn/ui | Component library |
| 🎬 Framer Motion | Animations and transitions |
| 📊 Recharts | Interactive charts |
| 🌙 next-themes | Dark/light mode |
| 🔤 Lucide React | Icon library |

---

## 🌿 Branching & Workflow

We use a simple **feature-branch** workflow. There is no `develop` branch.

```
feature branch --> PR --> squash merge --> main --> auto-deploy
                          |                          |
                      CI checks              GitHub Pages
                      CodeRabbit              Cloudflare CDN
                      Lighthouse
```

### Rules

- **`main`** is the only long-lived branch. **All PRs target `main`.**
- Feature branches are created from `main` and squash-merged back.
- Never push directly to `main` -- branch protection requires PRs.

### Creating a Feature Branch

```bash
git checkout main && git pull upstream main
git checkout -b feat/my-feature
# ... make changes ...
git push -u origin feat/my-feature
# Open PR targeting main on GitHub
```

### Branch Naming

Use a descriptive prefix:

| Prefix | Usage |
|--------|-------|
| `feat/` | New features or sections |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code restructuring |
| `ci/` | CI/CD changes |
| `perf/` | Performance improvements |

---

## 📝 Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). This drives our automated CHANGELOG generation.

| Prefix | Usage | CHANGELOG |
|--------|-------|-----------|
| `feat:` | New features | ✅ Visible |
| `fix:` | Bug fixes | ✅ Visible |
| `perf:` | Performance improvements | ✅ Visible |
| `docs:` | Documentation only | ✅ Visible |
| `refactor:` | Code restructuring | ✅ Visible |
| `ci:` | CI/CD changes | ✅ Visible |
| `chore:` | Maintenance, deps | Hidden |
| `test:` | Adding/updating tests | Hidden |

**Examples:**
```
feat: add dark mode toggle to header
fix: correct chart tooltip positioning on mobile
docs: update contributing guide with Lighthouse info
perf: lazy load chart section below the fold
chore(deps): update dependency next to v16.3
```

---

## ✅ Before You Submit

**Run these checks locally before pushing.** CI will catch failures, but it's faster to catch them yourself.

### Pre-Push Checklist

```bash
# Lint
npx eslint src/

# Type check
npx tsc --noEmit

# Build (catches export errors)
npm run build
```

### Pre-Review with CodeRabbit CLI (Optional but Recommended)

This project uses [CodeRabbit](https://www.coderabbit.ai) for automated AI code review on every PR. You can catch the same issues locally **before** pushing:

```bash
# One-time setup (free for open source)
curl -fsSL https://cli.coderabbit.ai/install.sh | sh
coderabbit auth login

# Review your changes against main
coderabbit review --plain --type committed --base main
```

> **Rate limits:** Free accounts get 2 CLI reviews per hour. Public repos get free reviews forever.

### Final Checks

- [ ] All lint and type check passes
- [ ] Build succeeds (`npm run build`)
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] Commit messages follow [Conventional Commits](#-commit-messages) format
- [ ] Your branch is up to date with `main`

---

## 🔀 Pull Request Process

### Creating Your PR

1. Push your feature branch to your fork
2. Open a PR **targeting `main`**
3. Write a clear title using conventional commit format
4. Describe what changed and why in the PR body
5. Include screenshots for visual changes

### What Happens Next

1. **CI runs automatically** -- all required checks must pass (see below)
2. **CodeRabbit review** -- AI-powered code review runs automatically, posting findings and suggestions
3. **Lighthouse audit** -- scores for performance, accessibility, best practices, and SEO are posted as a PR comment
4. **Code owner review** -- a maintainer reviews your PR
5. **Merge** -- once approved and CI passes, a maintainer squash-merges your PR

### Required CI Checks

Every PR must pass these checks before it can be merged:

| Check | What It Validates |
|-------|-------------------|
| 🔍 Lint | ESLint on all source files |
| 🔷 Type Check | TypeScript strict mode (`tsc --noEmit`) |
| 🏗️ Build | Next.js static export succeeds |
| 🔦 Lighthouse | Accessibility, Best Practices, SEO >= 90 |
| 🏷️ Auto-Labeler | Categorizes PR by scope and type |
| 🤖 Attribution Check | No prohibited AI tool attribution |

### 🔦 Lighthouse Gates

The Lighthouse audit runs on every PR and posts results as a comment:

| Category | Threshold | Action |
|----------|-----------|--------|
| ♿ Accessibility | >= 90 | **Blocks PR** if below |
| ✅ Best Practices | >= 90 | **Blocks PR** if below |
| 🔍 SEO | >= 90 | **Blocks PR** if below |
| ⚡ Performance | >= 60 | **Warning only** (doesn't block) |

Performance is a soft gate because scores vary by CI environment. The other three are hard requirements.

---

## 🎨 Code Style

### 🟦 TypeScript

- **Strict mode** enabled -- no `any` types without justification
- **ESLint** enforced in CI
- **Functional components** with named exports
- **Server Components** by default; `"use client"` only when needed (interactivity, hooks, browser APIs)

### 🎨 Tailwind CSS

- Use **utility classes** directly -- avoid custom CSS unless necessary
- Use the `cn()` helper from `@/lib/utils` for conditional classes
- Follow shadcn/ui conventions for component styling
- **Dark mode:** all components must work in both themes (we use `class` strategy via next-themes)

### 🎬 Animations

- Use **Framer Motion** for all animations
- **Always** respect `prefers-reduced-motion`:
  ```tsx
  const prefersReducedMotion = useReducedMotion();
  // Use prefersReducedMotion to skip or simplify animations
  ```
- Use `whileInView` with `viewport: { once: true }` for scroll-triggered animations
- Keep animations subtle -- this is a medical platform, not a portfolio site

### ♿ Accessibility

- **Semantic HTML** -- use `nav`, `main`, `section`, `footer`, `h1`-`h6` properly
- **Keyboard navigable** -- all interactive elements must be reachable via Tab
- **WCAG 2.1 AA** compliance target
- Test with screen readers when possible
- Images need meaningful `alt` text (or `aria-hidden` if decorative)

---

## 🤖 AI-Assisted Development & Attribution Policy

Using AI tools (Claude, Copilot, ChatGPT, Cursor, etc.) to help write code is completely fine. **You are responsible for the code you submit**, regardless of who (or what) helped write it.

### What We Expect

- **Understand your code.** If you can't explain what a function does and why, don't submit it.
- **Match existing patterns.** Make sure AI-generated code follows _our_ code style and conventions.
- **Test it.** AI-generated code is especially prone to subtle bugs. Run the checks.
- **Review it yourself.** Treat AI output like a first draft that needs a careful eye.

### No AI Attribution in Code

This is non-negotiable. Our repo must be **clean of AI attribution lines**:

- **No** `Co-Authored-By: Claude`, `Generated by ChatGPT`, or similar in commits
- **No** `// Generated by AI` or `// Copilot suggestion` comments in code
- **No** AI tool branding or promotional links in PR descriptions

### Attribution Check Severity Levels

The CI check scans three layers (commit trailers, code comments, PR descriptions) and classifies findings:

| Severity | Trigger | Action |
|----------|---------|--------|
| 🔴 **CRITICAL** | Non-whitelisted bot as commit co-author | PR **automatically closed** |
| 🟠 **HIGH** | AI tool name in commit trailers or PR description | PR **blocked** |
| 🟡 **MEDIUM** | AI attribution comments in code | PR **blocked** |

When a PR is clean, the check posts a positive confirmation. ✅

### Bot Whitelist

These bots will **not** trigger findings:

`github-actions[bot]`, `dependabot[bot]`, `coderabbitai[bot]`, `glycemicgpt-ci[bot]`, `glycemicgpt-security[bot]`, `glycemicgpt-release[bot]`, `glycemicgpt-merge[bot]`, `glycemicgpt-renovate[bot]`, `gitguardian[bot]`, `homebot-0[bot]`

---

## 📁 Project Structure

```
website/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Root layout (theme, metadata)
│   │   ├── page.tsx        # Landing page (all sections)
│   │   └── globals.css     # Global styles + Tailwind
│   ├── components/
│   │   ├── sections/       # Page sections (hero, features, chart, etc.)
│   │   ├── ui/             # shadcn/ui components
│   │   ├── header.tsx      # Sticky header with nav
│   │   ├── footer.tsx      # Footer with disclaimer
│   │   └── ...
│   └── lib/
│       ├── utils.ts        # cn() helper
│       └── sample-data.ts  # Demo glucose/insulin data
├── public/
│   └── CNAME              # Custom domain config
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   ├── CODEOWNERS          # Code ownership
│   └── *.json              # Auto-labeler, changelog config
├── .lighthouserc.json      # Lighthouse CI thresholds
├── next.config.ts          # Static export config
└── CONTRIBUTING.md         # You are here!
```

---

## 📜 License

GlycemicGPT Website is licensed under the [GNU Affero General Public License v3.0](LICENSE). By contributing, you agree that your contributions will be licensed under the same license.

---

## 💬 Questions?

- 💡 **Ideas & suggestions** -- Open a [Discussion](https://github.com/GlycemicGPT/website/discussions) or [Issue](https://github.com/GlycemicGPT/website/issues)
- 🐛 **Bug reports** -- Open an [Issue](https://github.com/GlycemicGPT/website/issues/new)
- 🙌 **General questions** -- Start a [Discussion](https://github.com/GlycemicGPT/website/discussions)

We try to respond to PRs and issues within a few days. If your PR sits without feedback for more than a week, feel free to leave a comment pinging the maintainers.

---

*Because no one should manage diabetes alone.* 💙
