# OTTER Website

Source for the OTTER (Open Toolkit for Training in Education Research) website — a graduate-student methods learning collective at The Ohio State University.

Static HTML / CSS / vanilla JS. No build step. Designed so any team member — developer or not — can edit content through GitHub's web editor.

## File structure

```
.
├── index.html                  All page content
├── assets/
│   ├── css/style.css           All styling
│   ├── js/script.js            Interactivity (smooth scroll, tabs, .ics download)
│   ├── images/
│   │   ├── otter-logo.png      Header logo (replace with the otter PNG)
│   │   ├── favicon-16.png      16x16 favicon
│   │   ├── favicon-32.png      32x32 favicon
│   │   └── apple-touch-icon.png  180x180
│   └── docs/                   PPT files, named like 2026-09-method.pdf
├── make_favicons.py            One-off helper: generate favicon sizes from logo
└── README.md
```

## Common edits

### Add a new upcoming talk

1. Open `index.html` in GitHub's web editor (pencil icon).
2. Find `<!-- UPCOMING TALKS -->`.
3. Copy one of the existing `<article class="talk-card">` blocks.
4. Change the `data-title`, `data-date`, `data-time`, `data-duration`, `data-location` attributes and the visible text (month, topic, leader, location).
5. Commit. The site updates within a minute.

### Archive a past talk

1. Save the talk's slides as PDF.
2. Upload to `assets/docs/` named like `2026-09-method-name.pdf`.
3. In `index.html`, find the `<!-- PAST TALKS -->` section.
4. Uncomment the `<ul class="past-list">` template and add a `<li>` for the talk:
   ```html
   <li>
     <span class="past-date">Sep 2026</span>
     <span class="past-topic">Method name</span>
     <span class="past-leader">Leader name</span>
     <a href="assets/docs/2026-09-method-name.pdf" class="past-link">Slides ↓</a>
   </li>
   ```
5. Move the talk's card out of `<!-- UPCOMING TALKS -->`.
6. Optionally add a Methods Library entry — uncomment the `.method-entry` template in the Methods section and fill it in.

### Update team members

Find `<!-- TEAM -->` in `index.html`. Each member is a `<article class="team-card">` block with avatar initials, name, role, and OSU link.

### Change the RSVP form

Open `assets/js/script.js`. Edit the constant at the top:

```js
const RSVP_FORM_URL = "https://forms.gle/REPLACE_WITH_FORM_URL";
```

This drives every RSVP / "Subscribe to announcements" button on the page.

### Change the GitHub repo link in the footer

Same file, edit:

```js
const REPO_URL = "https://github.com/REPLACE_WITH_ORG/REPLACE_WITH_REPO";
```

## Setting up the Google Form (one-time, by Jialing)

1. Go to forms.google.com → create a new form titled "RSVP for an OTTER Talk".
2. Add fields:
   - Name (short answer, required)
   - Email (short answer, required)
   - Affiliation (multiple choice: OSU EED / OSU other / External, required)
   - Which talk? (dropdown — list each upcoming month)
   - In person or via Zoom? (multiple choice)
   - Anything else? (paragraph, optional)
3. Settings → Responses → enable Google Sheets destination.
4. Send → copy the short URL (`forms.gle/XXX`).
5. Paste it into `RSVP_FORM_URL` in `assets/js/script.js`.
6. Share the response Sheet with all OTTER team members.

## Logo & favicons

The header logo is `assets/images/otter-logo.png`.

To regenerate the favicon sizes after replacing the logo, run:

```bash
python3 make_favicons.py
```

This requires Pillow (`pip install Pillow`). It writes:

- `assets/images/favicon-16.png`
- `assets/images/favicon-32.png`
- `assets/images/apple-touch-icon.png` (180×180)

## Deployment (GitHub Pages)

1. Create a new GitHub organization (recommended: `otter-osu`) or use a personal account.
2. Create a public repo named `otter-osu.github.io` (for an org user-site) or `otter` (for a project page).
3. Push these files to the `main` branch.
4. Repo Settings → Pages → Source: "Deploy from a branch" → `main` / `/` (root).
5. Wait ~1 minute. The site is live at:
   - Org user-site: `https://otter-osu.github.io/`
   - Project page:  `https://<org>.github.io/<repo>/`

Optional: add a custom domain (e.g. `otter-osu.org`) under Settings → Pages.
