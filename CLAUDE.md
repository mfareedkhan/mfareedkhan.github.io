# CLAUDE.md — Project brief for Claude Code

You are helping **Muhammad Fareed** (GitHub username: `mfareedkhan`) deploy a personal
academic + industry portfolio website. The site content has **already been written** and
is provided in this folder — your job is to place it correctly, configure the template,
push it, and get it live. **Do not rewrite or re-invent the content, and do not change any
factual claim.**

## What the site is

- A research-forward portfolio serving two audiences at once: PhD professors and industry
  ML/DS recruiters.
- Built on the **al-folio** Jekyll template, hosted **free on GitHub Pages**.
- Target live URL: **https://mfareedkhan.github.io** (no custom domain).

## Deploy target & constraints (important)

- The repository MUST be named exactly **`mfareedkhan.github.io`** (matches the username;
  this is what makes it a free user site). Do **not** advise renaming the GitHub account.
- In `_config.yml`: set `url: https://mfareedkhan.github.io` and leave **`baseurl:` empty**.
  (A non-empty baseurl is the classic cause of a 404 on user sites.)
- al-folio deploys via its included GitHub Actions workflow, which builds and publishes to
  the **`gh-pages`** branch. GitHub Pages must be set to serve from the `gh-pages` branch
  (root). The Actions workflow needs read/write permission
  (Settings → Actions → General → Workflow permissions).
- Verify the live site loads and that every page renders and both PDFs download.

## Content already provided in this folder (place into the al-folio repo as-is)

```
_pages/about.md          → Home (about layout, permalink /)
_pages/research.md       → Research
_pages/publications.md   → Publications (grouped by status via jekyll-scholar --query)
_pages/projects.md       → Projects grid
_pages/cv.md             → CV/Résumé (renders _data/cv.yml + links both PDFs)
_pages/about_me.md       → About (permalink /about/)
_pages/contact.md        → Contact
_bibliography/papers.bib → 4 publications (drives Publications + Home selected papers)
_data/cv.yml             → full CV content
_news/*.md               → 7 news items
_projects/*.md           → 3 project cards
assets/pdf/muhammad_fareed_cv.pdf      → academic CV (download)
assets/pdf/muhammad_fareed_resume.pdf  → 1-page industry résumé (download)
```

The al-folio template already ships a placeholder `assets/img/prof_pic.jpg`; leave it —
the owner will replace it with a real photo later.

## Exact `_config.yml` values to set (edit in place; do NOT wholesale-replace the file)

```yaml
title: Muhammad Fareed
first_name: Muhammad
middle_name:
last_name: Fareed
email: mfareedkhan012@gmail.com
url: https://mfareedkhan.github.io
baseurl: # must be empty
github_username: mfareedkhan
linkedin_username: mfareedkhan012
scholar_userid: FVTRze8AAAAJ
orcid_id: # empty for now
enable_project_categories: true
scholar:
  last_name: [Fareed]
  first_name: [Muhammad, M, M.]
```

## ACCURACY GUARDRAILS — never violate these

- Dean's award = "Dean's Honor List (Certificate of Merit Achievement), Spring 2024".
  Do **NOT** attach "CGPA 4.0/4.0" to this award. The 4.0 belongs with Education / batch topper.
- Use "batch topper" / "first position". **Never** claim a gold medal (none was awarded).
- The LSTM systematic review is **"in preparation"**, never "under review" (not yet submitted).
- Pair "First Division" with its percentage (BS 67.45%, B.Ed. 70.97%).
- Publication statuses, exactly: 1 published (first author, Frontiers Q1) + 1 under review
  (first author, thesis, Scientific Reports) + 1 under review (co-author, CMC) + 1 in
  preparation (first author, LSTM review).
- **Do not invent, inflate, or assume any fact.** If something is missing, leave it and flag it.

## Known open items (flag, don't fabricate)

- Two news items have PROVISIONAL dates (see comments inside the files): the Frontiers
  paper's publication date and the CXRG-SVLM submission date. Leave as-is unless the owner
  provides real dates.
- Blog is intentionally empty for now. ORCID is a placeholder.

## Definition of done

1. Repo `mfareedkhan.github.io` contains all content files above + the edited `_config.yml`.
2. GitHub Actions build succeeds (green check).
3. GitHub Pages serves from `gh-pages`; https://mfareedkhan.github.io loads.
4. All 8 nav pages render; publications show grouped by status with the owner's name bold;
   both PDFs download from the CV page.
