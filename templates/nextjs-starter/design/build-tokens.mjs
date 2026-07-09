#!/usr/bin/env node
/**
 * Build design tokens (DTCG) → Tailwind v4 `@theme` block at app/theme.css.
 * Run automatically by `prebuild`/`predev`. Regenerate any time tokens.json changes.
 */
import StyleDictionary from "style-dictionary";

const sd = new StyleDictionary({
  source: ["design/tokens.json"],
  usesDtcg: true,
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "app/",
      files: [
        {
          destination: "theme.css",
          format: "css/variables",
          options: { selector: "@theme", outputReferences: true },
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log("✓ tokens → app/theme.css");
