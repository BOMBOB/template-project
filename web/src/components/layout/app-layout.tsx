'use client'
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { navigationItems, publicRoutes, authRoutes } from '@/lib/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Don't show navigation on auth pages
  if (publicRoutes.includes(pathname) || authRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  const NavigationContent = () => (
    <nav className="space-y-2">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
            pathname === item.href ? 'bg-gray-100' : ''
          }`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 p-4 border-r">
        <div className="space-y-6 w-full">
          <div className="flex items-center space-x-2">
            <Avatar />
            <div className="flex flex-col">
              <span className="font-medium">User Name</span>
              <span className="text-sm text-gray-500">user@example.com</span>
            </div>
          </div>
          <NavigationContent />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-white z-10 px-4">
        <div className="h-full flex items-center justify-between">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-6">
                  <Avatar />
                  <div className="flex flex-col">
                    <span className="font-medium">User Name</span>
                    <span className="text-sm text-gray-500">user@example.com</span>
                  </div>
                </div>
                <NavigationContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
        {children}
      </main>
    </div>
  );
}
