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
  Check,
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
  const [activeTab, setActiveTab] = useState<'info' | 'products' | 'posts'>('products');
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
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-[4px] border-white bg-white shadow-md relative z-10">
                <div className="w-full h-full rounded-full border-[2px] border-[#FA3728] overflow-hidden bg-gray-100 flex items-center justify-center relative">
                   <img 
                     src={MOCK_VENDOR.avatar} 
                     alt={shopName} 
                     className="w-full h-full object-cover"
                     onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + shopName.replace(' ', '+') + '&background=FA3728&color=fff&size=128' }}
                   />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-[#FA3728] rounded-full p-1 z-20 border-[2.5px] border-white shadow-sm flex items-center justify-center">
                 <Check className="text-white" strokeWidth={3} size={14} />
              </div>
            </div>
          </div>

          {/* Simple Shop Header Container - Aligned Left */}
          <div className="text-left max-w-2xl mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 leading-tight">{shopName}</h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-3">
              {MOCK_VENDOR.category} • {toTitleCase(MOCK_VENDOR.location)}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed font-medium line-clamp-2">
              {MOCK_VENDOR.bio}
            </p>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 border-b border-gray-100 w-full overflow-x-auto scrollbar-hide pt-2">
          <div className="flex gap-8 sm:gap-10 min-w-max">
            {['Products', 'Posts', 'Info'].map((tabLabel) => {
              const tabId = tabLabel.toLowerCase() as 'info' | 'products' | 'posts';
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`py-3.5 text-[15px] font-bold whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tabId ? 'border-[#FA3728] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'products' && (
          <>
            {/* Tools & Filters Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 
                 <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 items-center">
                   {SECONDARY_CATEGORIES.map((cat) => (
                     <button
                       key={cat}
                       onClick={() => setActiveCategory(cat)}
                       className={`flex-shrink-0 px-4 sm:px-5 py-1.5 text-xs sm:text-[13px] font-semibold rounded-full transition-colors ${
                         activeCategory === cat
                         ? 'bg-gray-900 text-white'
                         : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm'
                       }`}
                     >
                       {cat}
                     </button>
                   ))}
                 </div>
                 
                 <div className="flex items-center gap-2 w-full md:w-auto">
                   <div className="relative w-full md:w-64 flex-shrink-0">
                     <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                     <input
                       type="text"
                       placeholder="Search products..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none outline-none text-sm text-gray-900 rounded-full focus:ring-1 focus:ring-gray-300 transition-all font-medium placeholder:text-gray-400"
                     />
                   </div>
                 </div>
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
                <div className="relative aspect-[4/3] w-full bg-gray-50 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-300 p-3 sm:p-5"
                    onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpolyline points="21 15 16 10 5 21"/%3E%3C/svg%3E'; e.currentTarget.className = 'w-1/3 h-1/3 object-contain opacity-40'; }}
                  />
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-grow bg-white border-t border-gray-50/50">
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-800 mb-1 line-clamp-2 leading-snug">{product.name}</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  
                  {/* Footer Layout with Flexbox */}
                  <div className="mt-auto pt-2 flex justify-between items-center bg-white z-10 gap-2">
                     <span className="font-extrabold text-sm sm:text-[15px] text-[#FA3728] truncate pr-1">₦{product.price.toLocaleString()}</span>
                     <button 
                       className="w-8 h-8 rounded-full bg-[#FA3728] text-white flex items-center justify-center shadow-sm hover:bg-[#E31B23] active:scale-95 transition-all duration-200 flex-shrink-0"
                       onClick={(e) => { e.preventDefault(); console.log('Added to cart'); }}
                       aria-label="Add to cart"
                     >
                       <Plus size={16} strokeWidth={2.5} />
                     </button>
                  </div>
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
        </>
        )}

        {activeTab === 'posts' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-sm text-gray-500">{shopName} hasn't shared any updates.</p>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Contact Information</h3>
              <div className="space-y-5">
                <a href={`tel:${MOCK_VENDOR.phone.replace(/\s/g, '')}`} className="flex items-center gap-4 text-sm text-gray-800 hover:text-[#FA3728] transition-colors font-semibold">
                  <div className="w-12 h-12 rounded-full bg-[#FA3728]/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#FA3728]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Phone Number</p>
                    {MOCK_VENDOR.phone}
                  </div>
                </a>
                <a href={`mailto:${MOCK_VENDOR.email}`} className="flex items-center gap-4 text-sm text-gray-800 hover:text-[#FA3728] transition-colors font-semibold">
                  <div className="w-12 h-12 rounded-full bg-[#FA3728]/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-[#FA3728]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Email Address</p>
                    {MOCK_VENDOR.email}
                  </div>
                </a>
                <a href={`https://maps.google.com/?q=${MOCK_VENDOR.location}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-sm text-gray-800 hover:text-[#FA3728] transition-colors font-semibold">
                  <div className="w-12 h-12 rounded-full bg-[#FA3728]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-[#FA3728]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Location</p>
                    {toTitleCase(MOCK_VENDOR.location)}
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
        
      </div>

      {/* Floating Return to Chat Button */}
      <Link
        href={`/chats/${vendorId}`}
        className="fixed bottom-6 right-6 bg-[#FA3728] text-white px-5 py-3 sm:py-3.5 rounded-full flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl hover:bg-[#E31B23] hover:-translate-y-1 transition-all z-50 font-bold group"
        style={{ borderRadius: '9999px' }}
      >
        <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Message {shopName}</span>
        <span className="sm:hidden">Message</span>
      </Link>
    </div>
  );
}
