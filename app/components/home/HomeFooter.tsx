import Link from 'next/link';

export default function HomeFooter() {
  return (
    <footer className="border-t border-slate-200 bg-canvas">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <img src="/images/black-logo.png" alt="ShopAm" className="h-7 w-auto" />

        <nav className="flex items-center gap-6 text-sm text-slate-500">
          <Link href="/explore" className="transition-colors hover:text-ink">Explore</Link>
          <Link href="/vendors" className="transition-colors hover:text-ink">Vendors</Link>
          <Link href="/auth/signup" className="transition-colors hover:text-ink">Become a Vendor</Link>
        </nav>

        <p className="text-xs text-slate-400">© 2026 ShopAm. All rights reserved.</p>
      </div>
    </footer>
  );
}
