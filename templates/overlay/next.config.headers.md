# Security headers overlay

Merge this `headers()` into the generated `next.config` (`.ts` or `.mjs`) so the `security-gate`
passes. Tighten the CSP per site once the asset origins are known.

```ts
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        // Add a Content-Security-Policy once script/style/img/font origins are known.
      ],
    },
  ];
}
```
