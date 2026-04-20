import ProductCard, { type Product } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({
  products,
  loading = false,
  columns = 3,
}: ProductGridProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-x-5 gap-y-10`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-2xl text-[var(--fg)] mb-2">
          No products found
        </p>
        <p className="text-sm text-[var(--muted)]">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-x-5 gap-y-10`}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < columns} // prioritise first row
        />
      ))}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-[var(--surface)]" />
      <div className="pt-3 space-y-2">
        <div className="h-3 bg-[var(--surface)] rounded w-3/4" />
        <div className="h-3 bg-[var(--surface)] rounded w-1/3" />
      </div>
    </div>
  );
}
