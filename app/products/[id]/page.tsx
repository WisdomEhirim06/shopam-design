'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowRight,
  ChevronRight,
  Minus,
  Plus,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { productsService, cartService } from '@/lib/api';
import type { ProductService } from '@/lib/api/types';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<ProductService | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsService.getProduct(id)
      .then((data) => {
        setProduct(data);
        return productsService.getProducts({ vendor: data.owner, page_size: 4 });
      })
      .then((res) => {
        setRelatedProducts(res.results.filter((p) => p.id !== id));
      })
      .catch(() => setError('Failed to load product. Please try again.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      await cartService.addToCart({ product_id: product.id, quantity });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch {
      // silently fail — cart errors surface elsewhere
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={40} className="animate-spin text-[#FA3728]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error || 'Product not found.'}</p>
          <Link href="/explore" className="text-[#FA3728] font-semibold hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const mainImageUrl = product.images[selectedImage]?.image_url ?? null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-gray-700 hover:text-[#FA3728] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart
                  size={22}
                  className={`${isSaved ? 'fill-[#FA3728] text-[#FA3728]' : 'text-gray-700'} transition-colors`}
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 size={22} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {mainImageUrl ? (
                <img
                  src={mainImageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[#FA3728] ring-2 ring-[#FA3728]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Vendor Info */}
            <div className="flex items-start justify-between">
              <Link
                href={`/vendors/${product.owner_name ? product.owner_name[0].toUpperCase() : 'Vendor'}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
  {product.owner_name ? product.owner_name[0].toUpperCase() : 'V'}
</span>
                </div>
                <div>
                  <span className="text-white font-bold text-lg">
  {product.owner_name ? product.owner_name.toUpperCase() : 'V'}
</span>
                </div>
              </Link>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ₦{price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={16} />
                <span>Shipping calculated at checkout</span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center justify-between w-[120px] bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex flex-shrink-0 items-center justify-center text-gray-600 hover:bg-white rounded-full transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold text-gray-900 text-lg w-8 text-center bg-transparent">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex flex-shrink-0 items-center justify-center text-gray-600 hover:bg-white rounded-full transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <><Loader2 size={20} className="animate-spin" /> Adding…</>
                ) : addedToCart ? (
                  'Added to cart!'
                ) : (
                  'Add to cart'
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#FA3728]" />
                <span>Verified Vendor</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-[#FA3728]" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-12 w-full lg:max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
              <div
                className={`text-gray-700 leading-relaxed text-lg whitespace-pre-line ${
                  showFullDescription ? '' : 'line-clamp-6'
                }`}
              >
                {product.description}
              </div>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-6 text-[#FA3728] hover:text-[#E31B23] font-semibold flex items-center gap-1 text-lg"
              >
                {showFullDescription ? 'View less' : 'View more'}
                <ChevronRight
                  size={20}
                  className={`transition-transform ${showFullDescription ? 'rotate-90' : ''}`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                More from {product.owner_name ? product.owner_name.toUpperCase() : 'Vendor'}
              </h2>
              <Link
                href={`/vendors/${product.owner_name ? product.owner_name[0].toUpperCase() : 'Vendor'}`}
                className="flex items-center gap-2 text-[#FA3728] hover:text-[#E31B23] font-medium"
              >
                See all
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <Link href={`/products/${related.id}`}>
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                      {related.images[0]?.image_url && (
                        <img
                          src={related.images[0].image_url}
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#FA3728] transition-colors">
                        {related.title}
                      </h3>
                      <span className="text-lg font-bold text-[#FA3728]">
                        ₦{parseFloat(related.price).toLocaleString()}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
