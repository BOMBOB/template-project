export type NavigationItem = {
  title: string;
  href: string;
  icon?: string;
};

export const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Messages',
    href: '/messages',
  },
  {
    title: 'Contacts',
    href: '/contacts',
  },
  {
    title: 'Profile',
    href: '/profile',
  },
  {
    title: 'Settings',
    href: '/settings',
  },
];

export const publicRoutes = ['/login', '/signup'];
export const authRoutes = ['/auth/callback'];
export const defaultRedirect = '/dashboard';
