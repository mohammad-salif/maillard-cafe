# Maillard, cafe website

Static site: `index.html`, `style.css`, `script.js` and `images/`. No build step.

## Open locally
Open `index.html` in a browser, or use the Live Server extension in VS Code.
GSAP, Lenis and Google Fonts load from the internet, so you need a connection.

## Put it online with GitHub Pages
1. Push this folder to a GitHub repository (public on the free plan).
2. Repository Settings, Pages, Source: branch `main`, folder `/ (root)`.
3. After a minute the site is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Things to edit
- WhatsApp number: `WA` in `script.js` (country code first, no plus sign).
- Menu, testimonials and gallery: arrays near the top of `script.js`.
- Address and hours: the "Find the bar" section in `index.html`.
- Colours: the variables at the top of `style.css`.
- Photos: replace files in `images/` and keep the same names.
