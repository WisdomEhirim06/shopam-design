'use client';

import Link from 'next/link';
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

export default function HomeFooter() {
  return (
    <footer className="border-t border-slate-200/90 bg-white pt-14 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid arranged like the attached reference */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6 lg:gap-8 pb-12 border-b border-slate-100">
          {/* Brand & Address / Contact Column (Takes 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-bricolage font-black tracking-tight text-3xl text-ink">
                Shop<span className="text-[#FA3728]">Am</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm text-slate-500 leading-relaxed">
              Nigeria&apos;s <strong className="font-semibold text-slate-700">trusted marketplace</strong> for quality products and services from verified vendors. Shopping without stress.
            </p>

            {/* Address & Contact Details */}
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="shrink-0 text-[#FA3728] mt-0.5" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-[#FA3728]" />
                <a href="mailto:support@shopam.net" className="hover:text-ink transition-colors">
                  support@shopam.net
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-[#FA3728]" />
                <span>+234 (0) 800 SHOPAM</span>
              </div>
            </div>
          </div>

          {/* Col 1: Start Selling */}
          <div>
            <h3 className="font-bold text-sm text-ink tracking-tight mb-3.5">
              Start Selling
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500">
              <li>
                <Link href="/auth/signup" className="hover:text-ink transition-colors font-medium">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-ink transition-colors font-medium">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-ink transition-colors font-medium">
                  Sell Products
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-ink transition-colors font-medium">
                  Vendor Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Information */}
          <div>
            <h3 className="font-bold text-sm text-ink tracking-tight mb-3.5">
              Information
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500">
              <li>
                <Link href="/explore" className="hover:text-ink transition-colors font-medium">
                  Explore Marketplace
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-ink transition-colors font-medium">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-ink transition-colors font-medium">
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-ink transition-colors font-medium">
                  Escrow & Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Social */}
          <div>
            <h3 className="font-bold text-sm text-ink tracking-tight mb-3.5">
              Social
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500">
              <li>
                <a
                  href="https://twitter.com/shopam_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-ink transition-colors font-medium"
                >
                  <Twitter size={15} className="shrink-0 text-slate-400" />
                  <span>X (Twitter)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/shopam_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-ink transition-colors font-medium"
                >
                  <Instagram size={15} className="shrink-0 text-slate-400" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/shopam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-ink transition-colors font-medium"
                >
                  <Facebook size={15} className="shrink-0 text-slate-400" />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/shopam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-ink transition-colors font-medium"
                >
                  <Linkedin size={15} className="shrink-0 text-slate-400" />
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h3 className="font-bold text-sm text-ink tracking-tight mb-3.5">
              Legal
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500">
              <li>
                <Link href="/support" className="hover:text-ink transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-ink transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-ink transition-colors font-medium">
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-ink transition-colors font-medium">
                  Dispute Resolution
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            Powered by <strong className="font-semibold text-slate-700">ShopAm Nigeria</strong>. Built for smart buyers and verified merchants.
          </p>
          <p>© 2026 ShopAm Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
