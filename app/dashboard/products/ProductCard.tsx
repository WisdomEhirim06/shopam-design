import { MoreVertical, ImageIcon } from 'lucide-react';
import type { UIProduct } from './product-form';

export default function ProductCard({
  product,
  formatPrice,
}: {
  product: UIProduct;
  formatPrice: (p: string) => string;
}) {
  const primaryImage = product.mainImagePreview || product.images?.[0]?.image_url;
  const hasImage = !!primaryImage;
  const hasStock = product.localStock !== undefined;
  const categoryLabel = product.taxonomy_path || '';
  const hasDescription = !!product.description;

  const subImages: string[] =
    product.subImagePreviews && product.subImagePreviews.length > 0
      ? product.subImagePreviews
      : (product.images?.slice(1).map((i) => i.image_url) ?? []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-slate-300 hover:shadow-md">
      <div className="absolute right-3 top-3 z-10">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 md:text-xs">
          Listed
        </span>
      </div>
      <button className="absolute bottom-3 right-3 z-10 text-slate-400 transition-colors hover:text-ink">
        <MoreVertical size={20} />
      </button>

      <div className="flex">
        <div className="flex w-24 flex-shrink-0 items-center justify-center self-stretch overflow-hidden rounded-l-2xl bg-slate-50 md:w-32">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={primaryImage} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 p-4 text-slate-300">
              <ImageIcon size={28} />
              <span className="text-[9px] font-medium text-slate-300">No image</span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 p-4 pr-10">
          {categoryLabel && (
            <span className="mb-1.5 inline-block rounded-full bg-[#FA3728]/10 px-2 py-0.5 text-[10px] font-semibold text-[#FA3728]">
              {categoryLabel}
            </span>
          )}

          <h3 className="mb-0.5 truncate pr-8 text-sm font-semibold leading-tight text-ink md:text-base">
            {product.title}
          </h3>

          {hasDescription && <p className="mb-1.5 line-clamp-1 text-xs text-slate-400">{product.description}</p>}

          <p className="mb-2 text-sm font-bold text-ink md:text-base">
            {formatPrice(product.price)}
            {product.tax_inclusive && <span className="ml-1 text-[10px] font-normal text-slate-400">incl. tax</span>}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium text-slate-500 md:text-xs">
            {hasStock && (
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink" />
                {product.localStock} in stock
              </span>
            )}
            {parseFloat(product.average_rating) > 0 && <span>★ {parseFloat(product.average_rating).toFixed(1)}</span>}
            {parseInt(product.review_count) > 0 && <span>{product.review_count} reviews</span>}
            <span className="capitalize text-slate-400">{product.item_type}</span>
          </div>

          {subImages.length > 0 && (
            <div className="mt-2.5 flex gap-1.5">
              {subImages.slice(0, 4).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`img ${i + 1}`} className="h-8 w-8 rounded-md border border-slate-100 object-cover" />
              ))}
              {subImages.length > 4 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                  +{subImages.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
