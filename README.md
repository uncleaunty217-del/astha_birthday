# Happy Birthday, Astha! 🩷

A small, static birthday website for Astha ("Mii Ash") — soft blue, white, cream and silver, with a hero, a heartfelt note, a polaroid scrapbook with a lightbox, a final wish, and a floating "Play our song" button.

Plain HTML, CSS and JavaScript. No build step, no frameworks, no dependencies (only optional Google Fonts, with system-font fallbacks).

```
astha-birthday/
├── index.html
├── styles.css
├── script.js
├── README.md
└── local-assets/
    ├── cover.jpg       (hero photo)
    ├── memory-1.jpg    (scrapbook)
    ├── memory-2.jpg
    ├── memory-3.jpg
    └── memory-4.jpg
```

## Run it

**Quickest:** double-click `index.html`. Everything works (photos, animations, confetti, lightbox).

> The song: YouTube refuses to embed players on pages opened as `file://`, so on a double-clicked file the music panel will show an "Open on YouTube" link instead. To play the song inside the page, serve it over http(s) — locally or on GitHub Pages:

```bash
cd astha-birthday
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new repository (e.g. `astha-birthday`) and push the **contents** of this folder to the `main` branch, so `index.html` sits at the repo root.
   ```bash
   cd astha-birthday
   git init && git add . && git commit -m "Birthday site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/astha-birthday.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, choose `main` and `/ (root)`, then Save.
3. After a minute the site is live at `https://<your-username>.github.io/astha-birthday/`.

All paths are relative, so it works both from a project subpath like the above and from a custom domain. Consider making the repo private-name/URL obscure — the page has `noindex` set so search engines skip it.

## Customising

- **Note text** — `index.html`, inside `#note-body` (four `<p>` tags). The wording is untouched; only the paragraph breaks were chosen.
- **Photos** — replace `local-assets/memory-1.jpg … memory-4.jpg` and `cover.jpg` (keep the names, or edit the `src`/`alt` in `index.html`). Portrait 3:4 photos look best. Update the `alt` text if you swap a photo.
- **Song** — change `VIDEO_ID` at the top of `script.js` and the "Open on YouTube" link in `index.html`.
- **Colours** — the `:root` variables at the top of `styles.css`.
- **Link preview** — in `index.html`, set `og:image` to the full `https://…/local-assets/cover.jpg` URL after deploying.

## Accessibility & motion

- Keyboard friendly: skip link, visible focus, lightbox traps focus, closes with `Esc`, `←`/`→` to switch photos, focus returns to the photo you opened.
- The lightbox and music button have proper labels / `aria-pressed` states.
- `prefers-reduced-motion` turns off confetti, sparkles, drifting clouds and reveal animations.
- On small screens fewer sparkles are drawn and clouds are simplified.
- Music never autoplays — it starts only when the visitor presses play.
