'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Edit3,
  MapPin,
  Phone,
  Mail,
  Search,
  Check,
  X,
  ChevronRight,
  Loader2,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService, productsService } from '@/lib/api';
import type { ProductService } from '@/lib/api/types';
import { CATEGORY_LABEL, settingsItems } from './profile-data';
import ProfileProductCard from './ProfileProductCard';

type ProfileTab = 'business' | 'products' | 'settings';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('products');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editingName, setEditingName] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Real data state
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [tempName, setTempName] = useState('');
  const [vendorData, setVendorData] = useState<{
    email: string;
    phone: string;
    bio: string;
    category: string;
    location: string;
  }>({ email: '', phone: '', bio: '', category: '', location: '' });
  const [products, setProducts] = useState<ProductService[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [profile, productData] = await Promise.all([
          authService.getFullProfile(),
          productsService.getMyProducts(),
        ]);

        const { user, vendor_profile } = profile;
        setBusinessName(vendor_profile?.business_name || `${user.first_name || user.username}'s Store`);
        setVendorData({
          email: user.email,
          phone: user.phone ? `+234 ${user.phone}` : '',
          bio: vendor_profile?.bio || '',
          category: vendor_profile?.business_category
            ? CATEGORY_LABEL[vendor_profile.business_category] || vendor_profile.business_category
            : '',
          location: vendor_profile?.business_address || '',
        });
        setProducts(Array.isArray(productData) ? productData : (productData as any).results ?? []);
      } catch {
        // keep empty states — display will show placeholders
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleEditName = () => {
    setTempName(businessName);
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const handleSaveName = () => {
    if (tempName.trim()) setBusinessName(tempName.trim());
    setEditingName(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } finally {
      // authService.logout() already clears localStorage even if the API fails.
      // Always redirect to sign-in regardless.
      router.replace('/auth/signin');
    }
  };

  // Derive unique categories from real products for the filter bar
  const productCategories = ['All', ...Array.from(new Set(products.map(p => p.taxonomy_path).filter((c): c is string => !!c)))];

  const filteredProducts = products.filter(product => {
    const matchCategory = activeCategory === 'All' || product.taxonomy_path === activeCategory;
    const matchSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-[#FA3728]" />
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8 min-h-screen bg-gray-50 flex flex-col pt-16">
      
      {/* Cover Banner */}
      <div className="w-full h-28 sm:h-40 md:h-48 bg-gradient-to-r from-gray-900 via-gray-800 to-[#FA3728]/20 relative object-cover">
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
         <button className="absolute bottom-3 right-3 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full p-2 transition-all shadow-sm">
           <Camera size={16} />
         </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex-grow mb-8">
        
        {/* Avatar Area - Left Aligned */}
        <div className="flex flex-col items-start -mt-10 sm:-mt-12 mb-6">
          <div className="relative group">
            {/* White ring wrapper */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-[4px] border-white bg-white shadow-md relative z-10">
              <div className="w-full h-full rounded-full border-[2px] border-[#FA3728] overflow-hidden bg-gray-100 flex items-center justify-center relative">
                 <span className="text-4xl font-bold text-gray-400">
                   {businessName.charAt(0).toUpperCase()}
                 </span>
                 <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                   <Camera className="text-white mb-0.5" size={20} />
                   <span className="text-white text-[9px] font-bold uppercase tracking-widest">Change</span>
                 </div>
              </div>
            </div>
            {/* Verified Badge */}
            <div className="absolute bottom-2 right-2 bg-[#FA3728] rounded-full p-1 z-20 border-[2.5px] border-white shadow-sm flex items-center justify-center">
               <Check className="text-white" strokeWidth={3} size={14} />
            </div>
          </div>
        </div>

        {/* Shop Info Sequence - Left Aligned */}
        <div className="text-left max-w-2xl mb-6">
          <div className="flex items-center gap-2 mb-2">
            {editingName ? (
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-[#FA3728]/30">
                <input
                  ref={nameInputRef}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="text-2xl sm:text-3xl font-bold text-gray-900 outline-none bg-transparent w-full"
                />
                <button onClick={handleSaveName} className="p-1.5 bg-[#FA3728] text-white rounded-md hover:bg-[#E31B23]">
                  <Check size={16} strokeWidth={3} />
                </button>
                <button onClick={() => setEditingName(false)} className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{businessName}</h1>
                <button onClick={handleEditName} className="p-1.5 text-gray-400 hover:text-[#FA3728] transition-colors rounded-full">
                  <Edit3 size={16} />
                </button>
              </div>
            )}
          </div>

          {vendorData.bio && (
            <p className="text-sm text-gray-700 mb-3 font-medium leading-relaxed max-w-xl">{vendorData.bio}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-1">
             {vendorData.phone && (
               <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                 <Phone size={14} className="text-[#FA3728]" /> {vendorData.phone}
               </div>
             )}
             {vendorData.email && (
               <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                 <Mail size={14} className="text-[#FA3728]" /> {vendorData.email}
               </div>
             )}
             {vendorData.location && (
               <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                 <MapPin size={14} className="text-[#FA3728]" /> {vendorData.location}
               </div>
             )}
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-col gap-2 relative z-40 py-2 sm:py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
           <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-0.5 justify-start">
             {[
               { id: 'business', label: 'Business Info' },
               { id: 'products', label: 'Products' },
               { id: 'settings', label: 'Settings' }
             ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ProfileTab)}
                  className={`px-5 sm:px-6 py-2.5 text-sm font-bold whitespace-nowrap border-b-[2.5px] transition-all duration-200 ${
                    activeTab === tab.id 
                    ? 'border-[#FA3728] text-[#FA3728]' 
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
             ))}
           </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4 sm:mt-6 relative mb-12">
          <AnimatePresence mode="wait">
            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                
                {/* Search & Categories line */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-5">
                   <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-1 items-center flex-grow">
                     {productCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`flex-shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-full transition-all duration-200 ${
                            activeCategory === cat 
                            ? 'bg-[#FA3728]/10 text-[#FA3728] border border-[#FA3728]/20' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {cat}
                        </button>
                     ))}
                   </div>
                   
                   <div className="relative w-full sm:w-64 flex-shrink-0">
                     <input 
                       type="text" 
                       placeholder="Search your products..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-full bg-white border border-gray-200 text-sm outline-none focus:border-[#FA3728]/50 transition-colors shadow-sm" 
                     />
                     <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                   </div>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <p className="font-medium">No products yet</p>
                    <p className="text-sm mt-1">Add your first product from the Products page.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                  {filteredProducts.map((product) => (
                    <ProfileProductCard key={product.id} product={product} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search size={22} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">No products found</h3>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'business' && (
              <motion.div
                key="business"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-xl"
              >
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Business Details</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Store Name</p>
                      <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">{businessName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Category</p>
                      <p className="text-sm font-semibold text-[#FA3728] bg-[#FA3728]/5 px-3 py-2.5 rounded-lg border border-[#FA3728]/10">{vendorData.category || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Location</p>
                      <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">{vendorData.location || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Contact Email</p>
                      <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">{vendorData.email || '—'}</p>
                    </div>
                    {vendorData.bio && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Bio</p>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">{vendorData.bio}</p>
                      </div>
                    )}
                    <div className="pt-2">
                      <button className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                        <Edit3 size={16} /> Edit Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-xl"
              >
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">Settings</h2>
                  <div className="space-y-1.5">
                    {settingsItems.map((item) => (
                      <button
                        key={item.label}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border-none"
                      >
                        <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-red-50 hover:bg-[#FA3728] text-[#FA3728] hover:text-white rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border border-[#FA3728]/20 hover:border-[#FA3728]"
                    >
                      {isLoggingOut ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Signing out…
                        </>
                      ) : (
                        <>
                          <LogOut size={16} strokeWidth={2.5} />
                          Sign Out
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}