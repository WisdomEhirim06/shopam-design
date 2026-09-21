import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <img src="/images/shopam-logo.png" alt="ShopAm Logo" width={100} height={100} />
            </div>
            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 max-w-sm">
              Your trusted marketplace for quality products and services from verified vendors across Nigeria.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <div className="space-y-2 sm:space-y-2 text-sm sm:text-base">
              <Link href="/explore" className="block text-gray-400 hover:text-white transition-colors">
                Explore
              </Link>
              <Link href="/vendors" className="block text-gray-400 hover:text-white transition-colors">
                Vendors
              </Link>
              <Link href="/auth/signup" className="block text-gray-400 hover:text-white transition-colors">
                Become a Vendor
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <div className="space-y-2 sm:space-y-2 text-sm sm:text-base">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Contact Us
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
          <p>&copy; 2026 ShopAm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
