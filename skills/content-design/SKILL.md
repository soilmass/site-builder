---
name: content-design
description: "Design the actual content — real, needs-first, scannable — for each section before visual work. Use in the plan phase after IA."
---

# content-design

**Content before form.** Real content drives design; placeholder text produces layouts that shatter
on real words. Fires after `information-architecture`, before any visual/token work. Canon: GOV.UK
content design; Sara Wachter-Boettcher.

## Do

1. **Start from the user need, not the message the org wants to push.** Each section answers a real
   question the visitor has at that point in the page.
2. **Front-load.** Most important information first — in the page, in each section, in each sentence.
   Assume people scan, don't read.
3. **Chunk and structure.** Short blocks, meaningful subheads, lists where they aid scanning. One
   idea per block. Real headings (they carry the document outline and SEO).
4. **Right-size.** Cut everything that doesn't serve the job. Length is earned, never default.
5. **Evidence over adjectives.** Concrete specifics, numbers, proof — not marketing air.

## Quality bar (god-tier)
- A visitor scanning only headings and first lines still gets the whole story.
- Every section has a clear job; nothing is filler or "atmosphere."
- Reading level fits the audience (checked later by `content-reviewer`).

## Hands off to
`ux-writing` (the interface microcopy) and provides the copy the visual/token/build phases design
around. Write to `.site/content.md` with a one-line voice-&-tone note. Do not lorem-ipsum the build.
