import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Velve — handcrafted jewellery and accessories rooted in West African craft tradition.",
};

const VALUES = [
  {
    title: "Handcrafted",
    body: "Every piece is made by hand. No machines, no shortcuts — just skilled hands, quality materials, and time.",
  },
  {
    title: "Intentional",
    body: "We make things slowly and on purpose. Each design is considered, refined, and made to last beyond seasons.",
  },
  {
    title: "Rooted",
    body: "Our craft draws from West African beadwork traditions — colours, patterns, and techniques passed through generations.",
  },
  {
    title: "Personal",
    body: "We take custom orders. If you have a vision, we want to hear it. Your piece, your story.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Design",
    body: "Each piece begins as a sketch. Colours, materials, and structure are chosen with the wearer in mind.",
  },
  {
    step: "02",
    title: "Source",
    body: "We source crystals, seed beads, and bases from trusted suppliers — quality we can stand behind.",
  },
  {
    step: "03",
    title: "Craft",
    body: "Beads are threaded, placed, and secured by hand. A single clutch can take 8–12 hours to complete.",
  },
  {
    step: "04",
    title: "Finish",
    body: "Every piece is checked, cleaned, and packaged with care before it reaches you.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end pb-16 px-5 sm:px-8 overflow-hidden bg-surface">
        <div className="absolute inset-0">
          <Image
            src="/images/multi-bule-purse.jpeg"
            alt="Velve atelier"
            fill
            className="object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/20 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto w-full">
          <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-4">
            Our story
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-fg leading-tight max-w-lg">
            Crafted with intention.
            <br />
            <em>Worn with pride.</em>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-4">
            Who we are
          </p>
          <h2 className="font-serif text-3xl text-fg mb-6">
            Born from craft,
            <br />
            built on love
          </h2>
          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>
              Velve began with a simple idea — that accessories should feel as
              special as the occasions they mark. That the bag on your shoulder
              or the earrings you wear to a celebration should carry a story,
              not just a label.
            </p>
            <p>
              We create handcrafted beaded bags, crystal-embellished purses, and
              artisan jewellery rooted in West African beadwork tradition. Every
              stitch and every bead is placed with care, by hands that take
              pride in the work.
            </p>
            <p>
              We believe in slow making. In things that last. In accessories
              that grow more meaningful the longer you wear them.
            </p>
          </div>
        </div>
        <div className="relative aspect-4/5 bg-surface overflow-hidden">
          <Image
            src="/images/multicolor-ring.jpeg"
            alt="Handcrafting a Velve piece"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface border-y border-border py-20 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-12 text-center">
            What we stand for
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map(({ title, body }) => (
              <div key={title} className="border-t border-border pt-6">
                <h3 className="font-serif text-xl text-fg mb-3">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-12">
          How we make it
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS.map(({ step, title, body }) => (
            <div key={step}>
              <p className="font-serif text-4xl text-border mb-4">{step}</p>
              <h3 className="font-serif text-xl text-fg mb-3">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface py-20 px-5 text-center">
        <h2 className="font-serif text-3xl text-fg mb-4">
          Ready to find your piece?
        </h2>
        <p className="text-sm text-muted mb-8 max-w-sm mx-auto">
          Browse the collection or reach out for a custom order.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/shop"
            className="px-7 py-3 text-[11px] tracking-widest uppercase bg-fg text-bg hover:opacity-85 transition-opacity"
          >
            Shop collection
          </Link>
          <Link
            href="/contact"
            className="px-7 py-3 text-[11px] tracking-widest uppercase border border-border text-fg hover:border-gold transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </main>
  );
}
