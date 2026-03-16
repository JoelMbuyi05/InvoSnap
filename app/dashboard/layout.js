// app/dashboard/layout.js - MOBILE RESPONSIVE VERSION
'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  LogOut,
  Zap,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const { user, userData, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">InvoSnap</span>
        </Link>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 top-[57px]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`lg:hidden fixed top-[57px] left-0 bottom-0 w-64 bg-white border-r z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${
                      active ? 'bg-blue-50 text-blue-600 font-medium' : ''
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Info + Logout */}
          <div className="p-4 border-t">
            <div className="mb-3 text-sm">
              <p className="font-medium truncate">{userData?.businessName}</p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex lg:flex-col lg:bg-white lg:border-r">
        <div className="p-6">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">InvoSnap</span>
            </div>
          </Link>
          
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${
                      active ? 'bg-blue-50 text-blue-600 font-medium' : ''
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm min-w-0 flex-1 mr-2">
              <p className="font-medium truncate">{userData?.businessName}</p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}