// src/app/(admin)/admin/products/new/page.tsx
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Add product" };

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--fg)]">Add product</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Fill in the details below to create a new product.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
