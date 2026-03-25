/**
 * Admin Dashboard Layout
 */
'use client';

import { useAuth } from '@/lib/firebase/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaSignOutAlt, FaUserCog } from 'react-icons/fa';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [user, loading, router, pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin');
  };

  // Show loading only on client side
  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not on login page and no user, don't render anything (will redirect)
  if (!user && pathname !== '/admin') {
    return null;
  }

  // If on login page, render children directly (no header)
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  // Render dashboard with header
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUserCog className="text-emerald-500 text-2xl" />
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
