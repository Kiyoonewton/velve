"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compare_price: number | null;
    stock: number;
    images: string[];
    colours: string[];
    tags: string[];
    is_published: boolean;
    is_featured: boolean;
    weight_grams: number | null;
    meta_title: string | null;
    meta_desc: string | null;
  };
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    compare_price: product?.compare_price?.toString() ?? "",
    stock: product?.stock?.toString() ?? "0",
    colours: product?.colours?.join(", ") ?? "",
    tags: product?.tags?.join(", ") ?? "",
    images: product?.images?.join("\n") ?? "",
    is_published: product?.is_published ?? false,
    is_featured: product?.is_featured ?? false,
    weight_grams: product?.weight_grams?.toString() ?? "",
    meta_title: product?.meta_title ?? "",
    meta_desc: product?.meta_desc ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleNameChange(value: string) {
    setForm((f) => ({
      ...f,
      name: value,
      slug: isEdit ? f.slug : slugify(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: parseFloat(form.price) || 0,
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      stock: parseInt(form.stock) || 0,
      colours: form.colours
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      is_published: form.is_published,
      is_featured: form.is_featured,
      weight_grams: form.weight_grams ? parseInt(form.weight_grams) : null,
      meta_title: form.meta_title || null,
      meta_desc: form.meta_desc || null,
    };

    const supabase = createClient();
    const { error: sbError } = isEdit
      ? await supabase.from("products").update(payload).eq("id", product!.id)
      : await supabase.from("products").insert(payload);

    if (sbError) {
      setError(sbError.message);
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  const inputClass = `
    w-full h-10 px-3 text-sm
    bg-[var(--bg)] border border-[var(--border)]
    text-[var(--fg)] placeholder:text-[var(--muted)]
    focus:outline-none focus:border-[var(--gold)]
    transition-colors duration-200
  `;
  const labelClass =
    "block text-[11px] tracking-[0.08em] uppercase text-[var(--muted)] mb-1.5";
  const fieldClass = "mb-5";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* Core details */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 mb-5">
        <h2 className="text-[12px] tracking-[0.1em] uppercase text-[var(--muted)] mb-4">
          Product details
        </h2>

        <div className={fieldClass}>
          <label className={labelClass}>Name *</label>
          <input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            placeholder="Crystal Beaded Clutch"
            required
          />
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Slug *</label>
          <input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            className={inputClass}
            placeholder="crystal-beaded-clutch"
            required
          />
          <p className="text-[11px] text-[var(--muted)] mt-1">
            URL: /products/{form.slug || "…"}
          </p>
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            className={`${inputClass} h-auto py-2.5 resize-none`}
            placeholder="Describe the product — materials, craftsmanship, dimensions…"
          />
        </div>
      </div>

      {/* Pricing & inventory */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 mb-5">
        <h2 className="text-[12px] tracking-[0.1em] uppercase text-[var(--muted)] mb-4">
          Pricing & inventory
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>Price (USD) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className={inputClass}
              placeholder="89.00"
              required
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Compare price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.compare_price}
              onChange={(e) => set("compare_price", e.target.value)}
              className={inputClass}
              placeholder="Original / crossed-out price"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>Stock quantity *</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Weight (grams)</label>
            <input
              type="number"
              min="0"
              value={form.weight_grams}
              onChange={(e) => set("weight_grams", e.target.value)}
              className={inputClass}
              placeholder="For shipping calculations"
            />
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 mb-5">
        <h2 className="text-[12px] tracking-[0.1em] uppercase text-[var(--muted)] mb-4">
          Variants & tags
        </h2>

        <div className={fieldClass}>
          <label className={labelClass}>Colours</label>
          <input
            value={form.colours}
            onChange={(e) => set("colours", e.target.value)}
            className={inputClass}
            placeholder="Gold, Silver, Black"
          />
          <p className="text-[11px] text-[var(--muted)] mt-1">
            Comma-separated
          </p>
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Tags</label>
          <input
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            className={inputClass}
            placeholder="clutch, crystal, evening, beaded"
          />
          <p className="text-[11px] text-[var(--muted)] mt-1">
            Comma-separated — used for search
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 mb-5">
        <h2 className="text-[12px] tracking-[0.1em] uppercase text-[var(--muted)] mb-4">
          Images
        </h2>
        <div className={fieldClass}>
          <label className={labelClass}>Image URLs</label>
          <textarea
            value={form.images}
            onChange={(e) => set("images", e.target.value)}
            rows={4}
            className={`${inputClass} h-auto py-2.5 resize-none font-mono text-[12px]`}
            placeholder={
              "https://res.cloudinary.com/…/product-1.jpg\nhttps://res.cloudinary.com/…/product-1-alt.jpg"
            }
          />
          <p className="text-[11px] text-[var(--muted)] mt-1">
            One Cloudinary URL per line. First image = hero, second = hover.
          </p>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 mb-5">
        <h2 className="text-[12px] tracking-[0.1em] uppercase text-[var(--muted)] mb-4">
          SEO
        </h2>
        <div className={fieldClass}>
          <label className={labelClass}>Meta title</label>
          <input
            value={form.meta_title}
            onChange={(e) => set("meta_title", e.target.value)}
            className={inputClass}
            placeholder={`${form.name || "Product name"} | Velve`}
          />
        </div>
        <div className={fieldClass}>
          <label className={labelClass}>Meta description</label>
          <textarea
            value={form.meta_desc}
            onChange={(e) => set("meta_desc", e.target.value)}
            rows={2}
            className={`${inputClass} h-auto py-2.5 resize-none`}
            placeholder="160-character summary for search engines…"
          />
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 mb-6">
        <h2 className="text-[12px] tracking-[0.1em] uppercase text-[var(--muted)] mb-4">
          Visibility
        </h2>
        <div className="flex flex-col gap-3">
          {[
            {
              key: "is_published",
              label: "Published",
              sub: "Visible to customers on the shop",
            },
            {
              key: "is_featured",
              label: "Featured",
              sub: "Shown in the featured section on the home page",
            },
          ].map(({ key, label, sub }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => set(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[var(--border)] peer-checked:bg-[var(--gold)] rounded-full transition-colors duration-200" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
              </div>
              <div>
                <p className="text-[13px] text-[var(--fg)]">{label}</p>
                <p className="text-[11px] text-[var(--muted)]">{sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-[var(--color-text-danger)] mb-4 p-3 bg-[var(--color-background-danger)] rounded-md">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="
            px-6 py-2.5 text-[12px] tracking-[0.08em] uppercase font-medium
            bg-[var(--fg)] text-[var(--bg)]
            hover:opacity-85 disabled:opacity-50
            transition-opacity duration-200
          "
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-[12px] tracking-[0.08em] uppercase text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
