import Link from "next/link";

export function AuthShell({ title, description, children, sideTitle, sideCopy, mode }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sage via-white to-mint px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl overflow-hidden rounded-[36px] bg-white shadow-glow lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-pine via-forest to-emerald p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-hero-grid opacity-80" />
          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-lg font-bold">
                M
              </div>
              <div>
                <p className="font-display text-xl font-semibold">MediBook</p>
                <p className="text-sm text-emerald-50/75">Premium healthcare experience</p>
              </div>
            </Link>
          </div>
          <div className="relative max-w-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-100/70">
              Secure access
            </p>
            <h2 className="mt-5 font-display text-5xl font-bold leading-tight">
              {sideTitle}
            </h2>
            <p className="mt-6 text-lg leading-8 text-emerald-50/85">{sideCopy}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                "Fast appointment scheduling",
                "Live doctor availability",
                "Reliable notifications",
                "Elegant role dashboards"
              ].map((feature) => (
                <div
                  key={feature}
                  className="rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 text-sm"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald">
                {mode}
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold text-pine">{title}</h1>
              <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
