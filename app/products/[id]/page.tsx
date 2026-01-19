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
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-gray-900">
                      {product.vendor.rating}
                    </span>
                    <span className="text-gray-600">
                      ({product.vendor.reviews.toLocaleString()})
                    </span>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-5 py-2 rounded-full font-semibold transition-all ${
                  isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-[#FA3728] text-white hover:bg-[#E31B23]'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < Math.floor(product.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Link
                  href="#reviews"
                  className="text-sm text-[#FA3728] hover:underline font-medium"
                >
                  {product.totalRatings.toLocaleString()} ratings
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
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4 w-fit bg-gray-100 rounded-full px-4 py-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold text-lg min-w-[30px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Purchase Type */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="purchaseType"
                  defaultChecked
                  className="w-5 h-5 text-[#FA3728]"
                />
                <span className="font-semibold text-gray-900">One time purchase</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-bold transition-all">
                Buy now
              </button>
              <button className="flex-1 py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl">
                Add to cart
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="flex items-center gap-2 text-gray-700 hover:text-[#FA3728] font-medium transition-colors"
              >
                <Heart
                  size={20}
                  className={isSaved ? 'fill-[#FA3728] text-[#FA3728]' : ''}
                />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-[#FA3728] font-medium transition-colors">
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield size={20} className="text-[#FA3728]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Verified Vendor</p>
                  <p className="text-xs text-gray-600">Trusted seller</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Truck size={20} className="text-[#FA3728]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-600">2-5 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
          <div className="bg-gray-50 rounded-2xl p-6">
            <div
              className={`text-gray-700 leading-relaxed ${
                showFullDescription ? '' : 'line-clamp-6'
              }`}
            >
              <p className="font-semibold mb-4">FINALLY HERE!</p>
              <p className="mb-4">
                A unique blend of premium African print fabric designed to give you:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-4 text-[#FA3728] hover:text-[#E31B23] font-semibold flex items-center gap-1"
            >
              {showFullDescription ? 'View less' : 'View more'}
              <ChevronRight
                size={18}
                className={`transition-transform ${
                  showFullDescription ? 'rotate-90' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            <Link
              href="#"
              className="flex items-center gap-2 text-[#FA3728] hover:text-[#E31B23] font-medium"
            >
              See all
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{review.author}</h4>
                      {review.verified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < review.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
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