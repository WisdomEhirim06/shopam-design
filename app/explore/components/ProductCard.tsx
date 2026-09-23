'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/lib/api';

export default function ProductCard({
  product,
  index,
  onAddToCart,
}: {
  product: Product;
  index: number;
  onAddToCart: (productId: string) => void;
}) {
  const rating = parseFloat(product.average_rating) || 0;
  const reviewCount = parseInt(product.review_count || '0', 10) || 0;
  const price = parseFloat(product.price) || 0;
  const image = product.images?.[0]?.image_url;
  const shopName = product.owner_name || 'ShopAm Vendor';

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.03, 0.24), duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.25)]">
        <Link href={`/products/${product.id}`} className="flex h-full flex-col">
          {/* Image box — 5 × 6cm rounded portrait */}
          <div className="relative aspect-[5/6] w-full overflow-hidden bg-slate-50">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={product.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <ShoppingCart size={22} className="text-slate-300" />
              </div>
            )}

            {rating > 0 && (
              <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 shadow-sm backdrop-blur-sm">
                <Star size={9} className="fill-gold text-gold" />
                {rating.toFixed(1)}
              </span>
            )}

            {/* Quick add to cart */}
            <button
              type="button"
              aria-label={`Add ${product.title} to cart`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product.id);
              }}
              className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-ink shadow-md ring-1 ring-slate-900/5 backdrop-blur transition-all hover:bg-[#FA3728] hover:text-white active:scale-90 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ShoppingCart size={13} />
            </button>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col p-2 sm:p-2.5">
            <h3 className="line-clamp-2 text-[11px] font-bold leading-snug text-ink sm:text-xs">
              {product.title}
            </h3>

            <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[10px]">
              {shopName}
            </p>

            {product.description && (
              <p className="mt-1 line-clamp-1 text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
                {product.description}
              </p>
            )}

            <div className="mt-auto flex items-end justify-between gap-1.5 pt-2">
              <div className="flex min-w-0 items-center gap-0.5 text-[9px] font-medium text-slate-400 sm:text-[10px]">
                {rating > 0 ? (
                  <>
                    <Star size={10} className="shrink-0 fill-gold text-gold" />
                    <span className="truncate">
                      {rating.toFixed(1)}
                      {reviewCount > 0 && ` (${reviewCount})`}
                    </span>
                  </>
                ) : (
                  <span className="truncate">No reviews</span>
                )}
              </div>

              <p className="shrink-0 text-xs font-extrabold tracking-tight text-ink sm:text-sm">
                ₦{price.toLocaleString()}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </motion.article>
  );
}
