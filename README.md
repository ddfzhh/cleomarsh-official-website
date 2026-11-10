# Cleo Marsh Official Website

Static HTML / CSS / JavaScript site. No dependencies, no build step. Everything that gets published is in `dist/`.

Live: https://cleomarsh-official-website.vercel.app

## Preview locally

```bash
python3 preview.py
```

Then open http://127.0.0.1:8765/. Use an HTTP server, not `file://`, because the animations load frame manifests.

## Files

- `dist/index.html`: page structure, copy, contact form, SEO
- `dist/style.css`: base styles and responsive layout
- `dist/composition.css`: layout overrides (loaded last)
- `dist/app.js`: sections, navigation, process animation, form submission
- `dist/motion.js`: frame-sequence animations and tilt effect
- `dist/assets/`: images, fonts, logo, animation frames (`motion/*-keyed-v4/` are the ones in use)
- `checks/`: Node scripts that check the animations and page startup

## Deploy

Vercel project `cleomarsh-official-website`, Root Directory `dist`, Framework Preset `Other`.

```bash
vercel --prod
```

## Contact form

Submissions go through FormSubmit to business@cleomarsh.com.
