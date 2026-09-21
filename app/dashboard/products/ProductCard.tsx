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

  // Sub-images: prefer local previews (freshly created), fall back to API images[1+]
  const subImages: string[] =
    product.subImagePreviews && product.subImagePreviews.length > 0
      ? product.subImagePreviews
      : (product.images?.slice(1).map((i) => i.image_url) ?? []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-red-100 hover:shadow-md transition-all relative overflow-hidden">
      {/* Status + menu */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
        <span className="text-[10px] md:text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
          Active
        </span>
      </div>
      <button className="absolute bottom-3 right-3 z-10 text-gray-400 hover:text-gray-900 transition-colors">
        <MoreVertical size={20} />
      </button>

      <div className="flex gap-0">
        {/* Image area */}
        <div className="w-24 md:w-32 flex-shrink-0 bg-gray-50 flex items-center justify-center self-stretch rounded-l-2xl overflow-hidden">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-gray-300 p-4">
              <ImageIcon size={28} />
              <span className="text-[9px] text-gray-300 font-medium">No image</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 p-4 pr-10">
          {/* Category */}
          {categoryLabel && (
            <span className="text-[10px] font-semibold text-[#FA3728] bg-red-50 px-2 py-0.5 rounded-full mb-1.5 inline-block">
              {categoryLabel}
            </span>
          )}

          <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight mb-0.5 truncate pr-8">
            {product.title}
          </h3>

          {hasDescription && (
            <p className="text-xs text-gray-400 line-clamp-1 mb-1.5">
              {product.description}
            </p>
          )}

          <p className="font-bold text-gray-900 text-sm md:text-base mb-2">
            {formatPrice(product.price)}
            {product.tax_inclusive && (
              <span className="text-[10px] font-normal text-gray-400 ml-1">incl. tax</span>
            )}
          </p>

          <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-500 font-medium flex-wrap">
            {hasStock && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {product.localStock} in stock
              </span>
            )}
            {parseFloat(product.average_rating) > 0 && (
              <span>★ {parseFloat(product.average_rating).toFixed(1)}</span>
            )}
            {parseInt(product.review_count) > 0 && (
              <span>{product.review_count} reviews</span>
            )}
            <span className="text-gray-400 capitalize">{product.item_type}</span>
          </div>

          {/* Sub-image thumbnails */}
          {subImages.length > 0 && (
            <div className="flex gap-1.5 mt-2.5">
              {subImages.slice(0, 4).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`img ${i + 1}`}
                  className="w-8 h-8 rounded-md object-cover border border-gray-100"
                />
              ))}
              {subImages.length > 4 && (
                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold">
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
