'use client';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MobileLayout from '../components/MobileLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Sidebar />
        <div className="ml-64">
          <Topbar />
          <main className="pt-20 p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileLayout>
          {children}
        </MobileLayout>
      </div>
    </>
  );
}