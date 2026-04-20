import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/shop/ProductGrid";
import NewsletterForm from "@/components/shop/Newsletterform";

async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, compare_price, images, colours, is_featured",
    )
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8);
  return data ?? [];
}

const MARQUEE_ITEMS = [
  "Handcrafted in West Africa",
  "Crystal-Embellished Purses",
  "Beaded Artisan Bags",
  "New Collection 2026",
  "Made with Intention",
  "Worn with Pride",
  "Free Shipping on Orders Over $150",
  "Handcrafted in West Africa",
  "Crystal-Embellished Purses",
  "Beaded Artisan Bags",
  "New Collection 2026",
  "Made with Intention",
  "Worn with Pride",
  "Free Shipping on Orders Over $150",
];

const CATEGORIES = [
  {
    label: "Beaded Bags",
    slug: "beaded-bags",
    description: "Woven stories",
    image: "/images/pink-fluffy.jpeg",
  },
  {
    label: "Crystal Purses",
    slug: "crystal-purses",
    description: "Radiant elegance",
    image: "/images/red-diamond.jpeg",
  },
  {
    label: "Jewellery",
    slug: "jewellery",
    description: "Timeless adornment",
    image: "/images/multicolor-ring.jpeg",
  },
  {
    label: "Accessories",
    slug: "accessories",
    description: "Finishing touches",
    image: "/images/orange-rounnded.jpeg",
  },
];

const TESTIMONIALS = [
  {
    name: "Adaeze O.",
    location: "Lagos",
    quote:
      "The crystal clutch arrived perfectly packaged. I wore it to a wedding and received compliments all night. Absolutely stunning work.",
  },
  {
    name: "Fatima B.",
    location: "London",
    quote:
      "Quality is exceptional — you can feel the care that went into every bead. This is not mass-produced; it is art you can wear.",
  },
  {
    name: "Chisom E.",
    location: "Atlanta",
    quote:
      "My Ankara tote is the most unique bag I own. Everyone asks where I got it. Velve is truly a hidden gem.",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Curated Materials",
    body: "We source the finest crystals, beads, and textiles from artisan markets across West Africa and beyond.",
  },
  {
    number: "02",
    title: "Handcrafted",
    body: "Each piece is shaped, stitched, and assembled entirely by hand — no shortcuts, no compromise.",
  },
  {
    number: "03",
    title: "Quality Assured",
    body: "Every item passes a meticulous inspection before it leaves the studio, ensuring perfection in every detail.",
  },
  {
    number: "04",
    title: "Delivered to You",
    body: "Wrapped in tissue, sealed with care, and shipped to your door in our signature packaging.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <main className="overflow-x-hidden">

      {/* ─── Hero ─── */}
      <section
        className="relative min-h-[92svh] flex flex-col justify-end pb-20 px-6 sm:px-10 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a1410 0%, #2a1f14 30%, #3d2b18 60%, #1a1410 100%)",
        }}
      >
        {/* Hero background image — right side */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/white-dotted-ball.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right opacity-50"
          />
          {/* Fade left so text stays readable, fade bottom */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #1a1410 40%, rgba(26,20,16,0.5) 65%, transparent 100%), linear-gradient(to top, #1a1410 10%, transparent 40%)" }} />
        </div>

        {/* Decorative orb — top right */}
        <div
          className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #b8966a 0%, #8B6F47 40%, transparent 70%)",
          }}
        />
        {/* Decorative orb — bottom left */}
        <div
          className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #c9a96e 0%, transparent 70%)",
          }}
        />

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Vertical rule + label */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3">
          <div className="w-px h-16 bg-gold opacity-40" />
          <p
            className="text-[9px] tracking-[0.35em] uppercase text-gold opacity-50"
            style={{ writingMode: "vertical-rl" }}
          >
            Collection 2026
          </p>
          <div className="w-px h-16 bg-gold opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-7 animate-fade-up">
              <div className="w-8 h-px bg-gold" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium">
                New collection — 2026
              </p>
            </div>

            {/* Headline */}
            <h1 className="font-serif leading-[0.95] text-white mb-8 animate-fade-up-delay-1"
              style={{ fontSize: "clamp(3.2rem, 8.5vw, 7rem)" }}
            >
              Jewellery that
              <br />
              <em className="gold-shimmer not-italic">tells your story</em>
            </h1>

            {/* Body */}
            <p className="text-[13px] leading-[1.9] max-w-md mb-10 animate-fade-up-delay-2"
              style={{ color: "rgba(240,235,226,0.6)" }}
            >
              Handcrafted beaded bags, crystal-embellished purses, and artisan
              accessories — each piece made with intention, rooted in West African
              craft tradition.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-12 animate-fade-up-delay-3">
              <Link
                href="/shop"
                className="hero-cta-primary px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300"
              >
                Shop the collection
              </Link>
              <Link
                href="/about"
                className="px-8 py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 hover:border-gold hover:text-gold"
                style={{
                  borderColor: "rgba(240,235,226,0.25)",
                  color: "rgba(240,235,226,0.75)",
                }}
              >
                Our story
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 animate-fade-up-delay-3">
              <div className="flex -space-x-2">
                {["#8B6F47", "#6B4A2A", "#C4973E", "#4A3828"].map(
                  (bg, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
                      style={{
                        background: bg,
                        borderColor: "#1a1410",
                      }}
                    />
                  )
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-[12px] tracking-wide"
                  style={{ color: "rgba(240,235,226,0.6)" }}
                >
                  <span className="text-white font-medium">2,400+</span> happy
                  customers
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="var(--gold)">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div
            className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
            style={{ borderColor: "rgba(240,235,226,0.2)" }}
          >
            <div
              className="w-0.5 h-2 rounded-full animate-bounce"
              style={{ background: "var(--gold)" }}
            />
          </div>
        </div>
      </section>

      {/* ─── Marquee strip ─── */}
      <div className="border-y border-border bg-surface py-3.5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-5 px-5"
            >
              <span className="text-[10px] tracking-[0.22em] uppercase text-muted">
                {item}
              </span>
              <span
                className="w-1 h-1 rounded-full shrink-0"
                style={{ background: "var(--gold)" }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ─── Categories ─── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-gold" />
              <p className="text-[10px] tracking-[0.25em] uppercase text-gold">
                Browse by category
              </p>
            </div>
            <h2 className="font-serif text-fg"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Shop categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors duration-200 group"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map(({ label, slug, description, image }) => (
            <Link
              key={slug}
              href={`/shop?category=${slug}`}
              className="group relative overflow-hidden bg-surface"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Product image */}
              <Image
                src={image}
                alt={label}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Bottom fade overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {description}
                </p>
                <h3 className="font-serif text-white leading-tight" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}>
                  {label}
                </h3>
                <div className="flex items-center gap-2 mt-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="w-5 h-px bg-white/70" />
                  <span className="text-[9px] tracking-[0.2em] uppercase text-white/70">Explore</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Lookbook gallery ─── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-gold" />
              <p className="text-[10px] tracking-[0.25em] uppercase text-gold">
                The collection
              </p>
            </div>
            <h2 className="font-serif text-fg"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Handcrafted pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors duration-200 group"
          >
            Shop all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Row 1: one wide + two square */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Wide hero tile */}
          <div className="relative col-span-2 overflow-hidden group bg-surface" style={{ aspectRatio: "16/9" }}>
            <Image src="/images/black-diamond.jpeg" alt="Black crystal orb bag" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <p className="font-serif text-white text-xl leading-tight">Crystal Orb — Noir</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 mt-1">Black · Crystal · Gold handles</p>
            </div>
          </div>
          {/* Ivory pearl */}
          <div className="relative overflow-hidden group bg-surface" style={{ aspectRatio: "1/1" }}>
            <Image src="/images/white-dotted-ball.jpeg" alt="Ivory pearl clutch" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <p className="font-serif text-white leading-tight">Pearl Clutch</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 mt-0.5">Ivory · Gold frame</p>
            </div>
          </div>
          {/* Red crystal orb */}
          <div className="relative overflow-hidden group bg-surface" style={{ aspectRatio: "1/1" }}>
            <Image src="/images/red-diamond.jpeg" alt="Red crystal orb bag" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <p className="font-serif text-white leading-tight">Crystal Orb</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 mt-0.5">Red · Crystal</p>
            </div>
          </div>
        </div>

        {/* Row 2: five equal tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {[
            { src: "/images/orange-rounnded.jpeg",        alt: "Orange beaded clutch",          name: "Beaded Clutch",  sub: "Orange · Silver frame" },
            { src: "/images/pink-fluffy.jpeg",            alt: "Hot pink beaded bag",           name: "Beaded Tote",    sub: "Hot Pink" },
            { src: "/images/multi-diamesion-multi-color.jpeg", alt: "Multicolour crystal orb", name: "Crystal Orb",    sub: "Confetti · Gold handles" },
            { src: "/images/multi-bule-purse.jpeg",       alt: "Blue ombré beaded clutch",      name: "Ombré Clutch",   sub: "Blue · Gold frame" },
            { src: "/images/multicolor-ring.jpeg",        alt: "Multicolour heart bag",         name: "Heart Bag",      sub: "Multicolour · Crystal" },
          ].map(({ src, alt, name, sub }) => (
            <div key={src} className="relative overflow-hidden group bg-surface" style={{ aspectRatio: "3/4" }}>
              <Image src={src} alt={alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="font-serif text-white leading-tight">{name}</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 3: black structured — full width accent */}
        <div className="mt-3 sm:mt-4 relative overflow-hidden group bg-surface" style={{ aspectRatio: "21/9" }}>
          <Image src="/images/black-plant-like.jpeg" alt="Black beaded structured bag" fill sizes="100vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <p className="font-serif text-white text-2xl leading-tight">Structured Bag</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 mt-1">Black · Beaded · Handcrafted</p>
          </div>
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 text-[11px] tracking-[0.1em] uppercase border border-border text-fg hover:border-gold hover:text-gold transition-all duration-200"
          >
            Shop all pieces
          </Link>
        </div>
      </section>

      {/* ─── Featured products ─── */}
      {featured.length > 0 && (
        <section className="border-y border-border"
          style={{ background: "var(--cream, #f5f0e8)" }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-px bg-gold" />
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold">
                    Handpicked for you
                  </p>
                </div>
                <h2 className="font-serif text-fg"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  Featured pieces
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors duration-200 group"
              >
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <ProductGrid products={featured} columns={4} />

            <div className="mt-12 text-center sm:hidden">
              <Link
                href="/shop"
                className="inline-block px-8 py-3 text-[11px] tracking-[0.1em] uppercase border border-border text-fg hover:border-gold hover:text-gold transition-all duration-200"
              >
                View all pieces
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Brand story ─── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Visual side */}
          <div className="relative order-2 md:order-1">
            {/* Main visual block */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <Image
                src="/images/multi-bule-purse.jpeg"
                alt="Velve handcrafted piece"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
              {/* Subtle dark overlay at bottom */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              {/* Brand text overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-serif text-4xl text-white/60 leading-tight select-none">
                  Crafted<br />with love
                </p>
              </div>
            </div>

            {/* Offset border decoration */}
            <div
              className="absolute -bottom-3 -right-3 w-full h-full -z-10 border"
              style={{ borderColor: "rgba(184,150,106,0.3)" }}
            />

            {/* Floating stat card */}
            <div
              className="absolute -bottom-5 left-5 px-6 py-4 shadow-xl"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              <p className="font-serif text-3xl text-fg leading-none">12+</p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted mt-1">
                Years of craft
              </p>
            </div>
          </div>

          {/* Text side */}
          <div className="order-1 md:order-2 md:pl-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-gold" />
              <p className="text-[10px] tracking-[0.25em] uppercase text-gold">
                About Velve
              </p>
            </div>
            <h2 className="font-serif text-fg leading-[1.1] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Crafted with intention.
              <br />
              <em>Worn with pride.</em>
            </h2>
            <p className="text-[13px] text-muted leading-[1.9] mb-4">
              Every Velve piece is made by hand — from the careful selection of
              crystals and beads to the final stitch. We believe accessories
              should be as individual as the person wearing them.
            </p>
            <p className="text-[13px] text-muted leading-[1.9] mb-10">
              Rooted in West African craft tradition and inspired by modern
              luxury, our pieces carry stories across generations.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-10 pb-10 border-b border-border">
              {[
                { value: "100%", label: "Handmade" },
                { value: "2,400+", label: "Customers" },
                { value: "40+", label: "Countries" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-serif text-3xl text-fg mb-1">{value}</p>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-muted">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.12em] uppercase text-fg group"
            >
              <span className="border-b border-gold pb-0.5 group-hover:text-gold transition-colors duration-200">
                Read our story
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-gold" />
              <p className="text-[10px] tracking-[0.25em] uppercase text-gold">
                How we work
              </p>
              <div className="w-6 h-px bg-gold" />
            </div>
            <h2 className="font-serif text-fg"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              The Velve process
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-border sm:divide-x divide-y sm:divide-y-0">
            {PROCESS_STEPS.map(({ number, title, body }) => (
              <div key={number} className="px-8 py-8 group first:pl-0 last:pr-0">
                <p
                  className="process-number font-serif leading-none mb-6 transition-colors duration-500"
                  style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}
                >
                  {number}
                </p>
                <h3 className="text-[12px] tracking-[0.1em] uppercase font-semibold text-fg mb-3">
                  {title}
                </h3>
                <p className="text-[12px] text-muted leading-[1.85]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-6 h-px bg-gold" />
            <p className="text-[10px] tracking-[0.25em] uppercase text-gold">
              Testimonials
            </p>
            <div className="w-6 h-px bg-gold" />
          </div>
          <h2 className="font-serif text-fg"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            What our customers say
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="group bg-surface border border-border p-8 hover:border-gold transition-colors duration-300 relative"
            >
              {/* Large decorative quote */}
              <div
                className="font-serif absolute top-4 right-6 text-7xl leading-none select-none pointer-events-none"
                style={{ color: "rgba(184,150,106,0.12)" }}
              >
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="var(--gold)">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <blockquote className="font-serif text-[16px] text-fg leading-[1.75] mb-6 relative z-10">
                {t.quote}
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-5 border-t border-border">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-medium shrink-0"
                  style={{ background: "var(--gold)" }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-[12px] font-medium tracking-wide text-fg">
                    {t.name}
                  </p>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-muted">
                    {t.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ─── Full-width editorial CTA ─── */}
      <section
        className="relative py-32 px-6 sm:px-10 overflow-hidden flex items-center justify-center text-center"
      >
        {/* Background image */}
        <Image
          src="/images/multi-diamesion-multi-color.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,20,16,0.82) 0%, rgba(42,28,16,0.75) 50%, rgba(26,20,16,0.82) 100%)" }} />

        {/* Decorative rings */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.15]"
          style={{ border: "1px solid var(--gold)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.08]"
          style={{ border: "1px solid var(--gold)" }}
        />

        <div className="relative max-w-2xl">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-5">
            Limited edition
          </p>
          <h2
            className="font-serif text-white leading-[1.05] mb-8"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)" }}
          >
            The signature crystal
            <br />
            clutch is back
          </h2>
          <Link
            href="/shop?category=crystal-purses"
            className="inline-block px-10 py-4 text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:opacity-85"
            style={{ background: "var(--gold)", color: "#fff" }}
          >
            Shop now
          </Link>
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section className="bg-surface border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-gold" />
            <p className="text-[10px] tracking-[0.25em] uppercase text-gold">
              Join the community
            </p>
            <div className="w-6 h-px bg-gold" />
          </div>
          <h2 className="font-serif text-fg mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
          >
            First to know,
            <br />
            <em>first to wear</em>
          </h2>
          <p className="text-[13px] text-muted leading-[1.85] mb-10 max-w-md mx-auto">
            New drops, exclusive offers, and behind-the-scenes craft stories —
            delivered to your inbox.
          </p>
          <NewsletterForm />
          <p className="text-[11px] text-muted mt-4 tracking-wide">
            No spam. Unsubscribe any time.
          </p>
        </div>
      </section>

    </main>
  );
}
