'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  ArrowRight,
  ChevronRight,
  Check,
  Minus,
  Plus,
  ArrowLeft,
} from 'lucide-react';

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('1 Bottle');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const product = {
    name: 'African Print Ankara Dress',
    vendor: {
      name: "Sarah's Fashion",
      avatar: '/api/placeholder/80/80',
      rating: 4.7,
      reviews: 71700,
      badge: 'Extra savings',
    },
    price: 28000,
    originalPrice: 35000,
    rating: 4.8,
    totalRatings: 7600,
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
    ],
    variants: ['1 Bottle', '2 Bottles', '3 Bottles'],
    description: `
      FINALLY HERE!

      A unique blend of premium African print fabric designed to give you:

      • More comfortable, better-looking style
      • Fewer fitting issues and perfect sizing
      • Stronger, more durable fabric
      • Less wear and tear
      • Better color retention & vibrancy
      • Support for local artisans
    `,
    shipping: 'Shipping calculated at checkout',
    features: [
      '100% Premium Cotton',
      'Handcrafted by local artisans',
      'Machine washable',
      'Available in multiple sizes',
    ],
  };

  const relatedProducts = [
    {
      id: '1',
      name: 'Ankara Skirt Set',
      price: 25000,
      originalPrice: 30000,
      discount: 20,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 1700,
    },
    {
      id: '2',
      name: 'African Print Blouse',
      price: 18000,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 529,
    },
    {
      id: '3',
      name: 'Ankara Jumpsuit',
      price: 32000,
      originalPrice: 40000,
      discount: 33,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 6400,
    },
  ];

  const reviews = [
    {
      id: '1',
      author: 'Chiamaka O.',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Beautiful dress! The fabric quality is excellent and the fit is perfect. Highly recommend!',
      verified: true,
    },
    {
      id: '2',
      author: 'Funmi A.',
      rating: 4,
      date: '1 month ago',
      comment: 'Love the design and colors. Only wish it came with a matching headwrap.',
      verified: true,
    },
  ];

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
                  className={`${
                    isSaved ? 'fill-[#FA3728] text-[#FA3728]' : 'text-gray-700'
                  } transition-colors`}
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
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-[#FA3728] ring-2 ring-[#FA3728]/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Vendor Info */}
            <div className="flex items-start justify-between">
              <Link
                href={`/vendors/${product.vendor.name}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {product.vendor.name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#FA3728] transition-colors">
                    {product.vendor.name}
                  </h3>
                <div className="flex items-center gap-1 text-sm mt-0.5">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-gray-900">
                    {product.vendor.rating}
                  </span>
                  <span className="text-gray-500">
                    ({product.vendor.reviews.toLocaleString()})
                  </span>
                </div>
              </div>
            </Link>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="ml-1 text-sm font-semibold text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <Link
                  href="#reviews"
                  className="text-sm text-gray-500 hover:text-[#FA3728] transition-colors"
                >
                  {product.totalRatings.toLocaleString()} reviews
                </Link>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={16} />
                <span>{product.shipping}</span>
              </div>
              <Link href="#" className="text-sm text-[#FA3728] hover:underline font-medium">
                Add address
              </Link>
            </div>

            {/* Variant Selection */}
            {product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Choose Your Supply 1 Bottle
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-6 py-3 rounded-full font-semibold transition-all ${
                        selectedVariant === variant
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="flex-1 py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                Add to cart
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="px-6 py-4 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full font-semibold transition-colors border border-gray-200"
              >
                <Heart
                  size={20}
                  className={isSaved ? 'fill-[#FA3728] text-[#FA3728]' : ''}
                />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
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
        <div className="mt-12 w-full lg:max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
            <div
              className={`text-gray-700 leading-relaxed text-lg ${
                showFullDescription ? '' : 'line-clamp-6'
              }`}
            >
              <p className="font-semibold mb-4">FINALLY HERE!</p>
              <p className="mb-4">
                A unique blend of premium African print fabric designed to give you:
              </p>
              <ul className="space-y-3 list-disc list-inside px-2">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-6 text-[#FA3728] hover:text-[#E31B23] font-semibold flex items-center gap-1 text-lg"
            >
              {showFullDescription ? 'View less' : 'View more'}
              <ChevronRight
                size={20}
                className={`transition-transform ${
                  showFullDescription ? 'rotate-90' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              More from {product.vendor.name}
            </h2>
            <Link
              href={`/vendors/${product.vendor.name}`}
              className="flex items-center gap-2 text-[#FA3728] hover:text-[#E31B23] font-medium"
            >
              See all
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <Link href={`/products/${relatedProduct.id}`}>
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                    {relatedProduct.discount && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-[#FA3728] text-white text-xs font-bold rounded-full">
                        {relatedProduct.discount}% off
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#FA3728] transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-gray-900">
                        {relatedProduct.rating}
                      </span>
                      <span className="text-xs text-gray-600">
                        ({relatedProduct.reviews.toLocaleString()})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#FA3728]">
                        ₦{relatedProduct.price.toLocaleString()}
                      </span>
                      {relatedProduct.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ₦{relatedProduct.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}