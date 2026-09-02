# Dimple Choudhary — Premium Portfolio

A real HTML/CSS/JavaScript rebuild of the supplied Canva portfolio references.

## Structure

- `index.html` — semantic page structure and copy
- `styles.css` — responsive visual system, animation, layout
- `script.js` — smooth navigation, active nav, scroll reveals, metrics, testimonial carousel
- `assets/backgrounds/` — supplied cover and internal backgrounds
- `assets/thumbnails/` — six supplied final thumbnail assets
- `assets/references/` — supplied Canva reference images for verification

## Run locally

Because this is a static site, no build step is required.

From this folder, run any static server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes

- Hero uses only the supplied cover background.
- All internal sections use the supplied internal background.
- Testimonials remain intentionally raw; their copy is not polished.
- Email and phone are functional `mailto:` / `tel:` links.
- Reduced-motion preferences are respected.
- The six portfolio thumbnails are used as supplied and are not regenerated or redrawn.
