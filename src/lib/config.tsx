import { usePathname } from 'next/navigation';

import { Bell, Briefcase, Home, Plus, Settings, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { CreateSubzeddit } from '../components/createSubzeddit';

export const NavItems = () => {
  const pathname = usePathname();


  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  const { data: session, status } = useSession()

  return [
    {
      name: 'Home',
      href: '/',
      icon: <Home size={20} />,
    active: pathname === '/',
      position: 'top',
    },
    {
      name: 'user',
      href: `/user/${session?.user.id}`,
      icon: <User size={20} />,
      active: isNavItemActive(pathname, '/profile'),
      position: 'top',
    },
    {
      name: 'Create Community',
      href: '/create',
      icon: <Plus size={20} />,
      active: isNavItemActive(pathname, '/notifications'),
      position: 'top',
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: <Briefcase size={20} />,
      active: isNavItemActive(pathname, '/projects'),
      position: 'top',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings size={20} />,
      active: isNavItemActive(pathname, '/settings'),
      position: 'bottom',
    },
    // <CreateSubzeddit/>
  ];
};