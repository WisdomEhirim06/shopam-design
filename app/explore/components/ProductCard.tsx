'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/lib/api';

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(value) ? 'fill-gold text-gold' : 'text-slate-300'}
        />
      ))}
    </span>
  );
}

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
      <Link href={`/products/${product.id}`} className="flex h-full flex-col">
        {/* Image box — 5.5 × 5.5cm rounded square */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/5">
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

          {/* Quick add to cart */}
          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product.id);
            }}
            className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink shadow-md ring-1 ring-slate-900/5 backdrop-blur transition-all hover:bg-[#FA3728] hover:text-white active:scale-90 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            <ShoppingCart size={15} />
          </button>
        </div>

        {/* Details — shop name, title, rating, price (shop.app stack) */}
        <div className="mt-2.5 flex flex-1 flex-col">
          <p className="truncate text-[11px] text-slate-500">{shopName}</p>

          <h3 className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-ink">
            {product.title}
          </h3>

          {product.description && (
            <p className="mt-1 line-clamp-1 text-[11px] leading-relaxed text-slate-500">
              {product.description}
            </p>
          )}

          <div className="mt-auto pt-1.5">
            <div className="flex items-center gap-1.5">
              <Stars value={rating} />
              <span className="text-[11px] text-slate-400">
                {rating > 0 ? `(${reviewCount})` : 'No reviews'}
              </span>
            </div>

            <p className="mt-1 text-sm font-bold tracking-tight text-ink">
              ₦{price.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
