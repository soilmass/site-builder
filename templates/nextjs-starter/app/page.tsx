// Server Component by default — no "use client". Tokens-only styling via Tailwind v4 theme.
export default function Home() {
  return (
    <main>
      <section className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24 md:py-32">
        <p className="text-sm font-medium tracking-wide text-brand-600 uppercase">
          site-builder starter
        </p>
        <h1 className="text-4xl font-semibold md:text-6xl">
          High-end websites, tested by construction.
        </h1>
        <p className="text-lg text-muted">
          This starter ships tokens, accessible primitives, and quality gates. Replace this hero via
          the <code className="rounded-md bg-border/40 px-1.5 py-0.5">/site-builder</code> workflow.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#get-started"
            className="rounded-md bg-brand-600 px-5 py-3 font-medium text-on-brand shadow-sm transition-colors hover:bg-brand-500"
          >
            Get started
          </a>
          <a
            href="https://nextjs.org"
            className="rounded-md border border-border px-5 py-3 font-medium transition-colors hover:bg-border/30"
          >
            Learn more
          </a>
        </div>
      </section>
    </main>
  );
}
