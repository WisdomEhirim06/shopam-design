'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  MessageCircle,
  User
} from 'lucide-react';

const toTitleCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
};

// Mock vendor database
const MOCK_VENDOR = {
  id: 'v1',
  name: 'Abuja Electronics',
  category: 'Electronics',
  location: 'Abuja, FCT',
  phone: '+234 800 123 4567',
  email: 'hello@abujaelectronics.ng',
  bio: 'Premium tech distributor in the heart of Abuja. Providing high quality panels and accessories for homes and businesses.',
  avatar: '/images/stress-1.jpg',
  coverBg: 'bg-gradient-to-r from-gray-900 via-gray-800 to-[#FA3728]/20'
};

const MOCK_PRODUCTS = [
  { id: 1, name: 'Wire less and Bluetooth Mouse', description: 'Ergonomic dual-mode wireless mouse with long battery life.', price: 10000, image: '/images/products/mouse.jpg', category: 'Accessories' },
  { id: 2, name: 'REdmie LAtest BH100X', description: 'Latest smartphone model with 120Hz display and 108MP camera.', price: 350000, image: '/images/products/phone.png', category: 'Smartphones' },
  { id: 3, name: 'Android fast charger', description: '65W super fast charging brick with strong braided cable.', price: 5950, image: '/images/products/charger.jpg', category: 'Accessories' },
  { id: 4, name: 'Twin Cooperate Iphone and Redmie', description: 'Premium business phone bundle for corporate executives.', price: 511000, image: '/images/products/phones.jpg', category: 'Smartphones' },
  { id: 5, name: 'Airpod One', description: 'High fidelity audio with active noise cancellation.', price: 18000, image: '/images/products/airpod.jpg', category: 'Headsets' },
  { id: 6, name: 'Black Bluetooth Headsets', description: 'Over-ear headphones with deep bass and 40-hour battery life.', price: 25050, image: '/images/products/headset.jpg', category: 'Headsets' },
];

const SECONDARY_CATEGORIES = ['All', 'Smartphones', 'Accessories', 'Headsets', 'Wearables'];

export default function VendorShopPage({ params }: { params: Promise<{ vendorId: string }> }) {
  const { vendorId } = use(params);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const rawShopName = vendorId === 'v1' ? MOCK_VENDOR.name : vendorId.replace('-', ' ');
  const shopName = toTitleCase(rawShopName);

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 sm:h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="relative flex items-center justify-center">
                <img src="/images/black-logo.png" alt="ShopAm Logo" width={100} height={100} />
              </div>
            </Link>
            
            <div className="flex items-center gap-0 flex-shrink-0">
              <Link
                href="/cart"
                className="relative p-1.5 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              >
                <ShoppingCart size={20} className="text-gray-700" />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#FA3728] text-white text-[9px] flex items-center justify-center rounded-full font-bold border border-white">
                  3
                </span>
              </Link>
              <Link
                href={`/chats/${vendorId}`}
                className="relative p-1.5 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center mx-0.5"
              >
                <MessageCircle size={20} className="text-gray-700" />
              </Link>
              <button
                 className="relative ml-1 w-7 h-7 rounded-full bg-[#FA3728] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
              >
                 W
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="pt-14 sm:pt-16">
        
        {/* Cover Banner */}
        <div className={`w-full h-28 sm:h-40 md:h-48 ${MOCK_VENDOR.coverBg} relative object-cover`}>
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-8">
          
          {/* Avatar Area - Aligned Left */}
          <div className="flex flex-col items-start -mt-10 sm:-mt-12 mb-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-[6px] border-white bg-white shadow-md relative z-10">
                <div className="w-full h-full rounded-full border-[3px] border-[#FA3728] overflow-hidden bg-gray-100 flex items-center justify-center relative">
                   <img 
                     src={MOCK_VENDOR.avatar} 
                     alt={shopName} 
                     className="w-full h-full object-cover"
                     onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + shopName.replace(' ', '+') + '&background=FA3728&color=fff&size=128' }}
                   />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-[#FA3728] rounded-full p-0.5 z-20 border-[2px] border-white shadow-sm">
                 <CheckCircle2 className="text-white" size={16} />
              </div>
            </div>
          </div>

          {/* Simple Shop Bio Container - Aligned Left */}
          <div className="text-left max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{shopName}</h1>
            
            <p className="text-sm text-gray-700 mb-3 font-medium leading-relaxed max-w-xl">{MOCK_VENDOR.bio}</p>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-1">
                 <a href={`tel:${MOCK_VENDOR.phone.replace(/\\s/g, '')}`} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#FA3728] transition-colors font-semibold">
                    <Phone size={14} className="text-[#FA3728]" /> {MOCK_VENDOR.phone}
                 </a>
                 <a href={`mailto:${MOCK_VENDOR.email}`} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#FA3728] transition-colors font-semibold">
                    <Mail size={14} className="text-[#FA3728]" /> Email
                 </a>
                 <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                    <MapPin size={14} className="text-[#FA3728]" /> {toTitleCase(MOCK_VENDOR.location)}
                 </div>
            </div>
          </div>
        </div>

        {/* Tools & Filters Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-30">
           
           {/* Prominent Search Bar Moved Top */}
           <div className="relative w-full mb-4">
             <input 
               type="text" 
               placeholder={`Search ${shopName}...`} 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm outline-none focus:border-[#FA3728]/50 transition-colors shadow-sm" 
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           </div>

           <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide items-center mb-1">
             <button className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-gray-200 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 shadow-sm transition-colors text-xs sm:text-sm font-semibold">
               <Filter size={14} /> Filters
             </button>
             <button className="flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-xs sm:text-sm font-semibold shadow-sm hover:bg-gray-200 transition-colors">
               Sort by
             </button>

             {/* Separator */}
             <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0"></div>

             {SECONDARY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-full transition-all duration-200 ${
                    activeCategory === cat 
                    ? 'bg-[#FA3728]/10 text-[#FA3728] border border-[#FA3728]/20' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
             ))}
           </div>
        </div>

        {/* Product Grid Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 group flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] w-full bg-gray-50">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-300 p-3 sm:p-5"
                    onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3C/svg%3E' }}
                  />
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-grow bg-white border-t border-gray-50/50 relative">
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-800 mb-1 line-clamp-2 leading-snug pr-8">{toTitleCase(product.name)}</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  <div className="mt-auto pt-1">
                     <span className="font-extrabold text-sm sm:text-[15px] text-[#FA3728]">₦{product.price.toLocaleString()}</span>
                  </div>

                  <button 
                    className="absolute bottom-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FA3728] text-white flex items-center justify-center shadow-md hover:bg-[#E31B23] active:scale-95 transition-all duration-200"
                    onClick={(e) => { e.preventDefault(); console.log('Added to cart'); }}
                    aria-label="Add to cart"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search size={22} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">No products found</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Try adjusting your filters.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
