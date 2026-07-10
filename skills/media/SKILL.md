---
name: media
description: "Reserve every image as a sized, generation-ready placeholder slot (zero CLS), and track slots in a manifest for later image generation. Use whenever a design calls for images, plus favicon/OG assets."
---

# media

Claude is not a strong image generator, so the builder **never blocks on images** — it reserves each
image as a **correctly-sized placeholder** now and records it as a slot to be generated later. Because
the space is reserved by aspect ratio, swapping in the real image causes **zero layout shift**.

## Rules

1. **Every image is an `ImageSlot`, never a bare `<img>`.** The `ImageSlot` component (shipped in the
   template overlay) reserves space via a fixed `aspect-ratio` and renders a labeled placeholder until
   a real image exists at the same dimensions. Swap = point it at the generated file; nothing moves.
2. **Always declare intrinsic size.** A ratio (e.g. `16/9`, `1/1`, `4/5`) or explicit width/height —
   so the browser reserves space before load (prevents CLS; see `design-tokens`/perf gate).
3. **Record every slot in `.site/media.json`** so images can be generated in a later pass:
   ```json
   {
     "slots": [
       { "id": "hero", "page": "/", "section": "hero", "purpose": "establish the subject",
         "aspectRatio": "16/9", "width": 1280, "height": 720,
         "alt": "meaningful alt text", "art": "warm editorial photo of fresh-roasted beans",
         "status": "placeholder", "src": null }
     ],
     "assets": {
       "favicon": { "status": "placeholder" },
       "ogImage": { "aspectRatio": "1200/630", "width": 1200, "height": 630, "status": "placeholder" }
     }
   }
   ```
4. **Alt text is written now** (meaning, not description of a placeholder). Decorative images get
   `alt=""` + `aria-hidden`.
5. **LCP image gets `priority`; everything below the fold lazy-loads** (default). Use `next/image`
   (AVIF/WebP, responsive `sizes`) for real images.
6. **Favicon and OG/Twitter share image are slots too** — generated later; ship a neutral default so
   the SEO/social preview isn't broken meanwhile (Next `opengraph-image` / `icon` file conventions).

## Quality bar (god-tier)
- No image ever shifts the layout when it loads or when a placeholder is replaced.
- A later "generate images" pass can fulfill every slot from `.site/media.json` with no code changes
  beyond setting `src` — because size, position, and alt are already fixed.

## Feeds
`component-craft` (uses `ImageSlot`) and the perf gate (CLS). The manifest drives later generation.
