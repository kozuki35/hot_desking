import { Link, useLocation } from 'react-router-dom';
import { Clock, Home, LineChart, Menu, Package, Users } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BrandInfoSheetMode } from '@/components/layout/BrandInfo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const getLinks = (
  pathname: string,
  linkStyle: string,
  linkSelectedStyle: string,
  badgeStyle: string,
  iconStyle: string,
) => {
  const isActiveLink = (currentPathname: string, targetPath: string) => {
    return currentPathname === targetPath ? true : false;
  };

  const getLinkStyle = (currentPathname: string, targetPath: string) => {
    return isActiveLink(currentPathname, targetPath) ? linkSelectedStyle : linkStyle;
  };

  return (
    <>
      <Link to="/" className={getLinkStyle(pathname, '/')}>
        <Home className={iconStyle} />
        Dashboard
      </Link>
      <Link to="/booking-history" className={getLinkStyle(pathname, '/booking-history')}>
        <Clock className={iconStyle} />
        Booking History
        <Badge className={badgeStyle}>6</Badge>
      </Link>
      <Link to="/booking" className={getLinkStyle(pathname, '/booking')}>
        <Package className={iconStyle} />
        Booking
      </Link>
      <Link to="/user-management" className={getLinkStyle(pathname, '/user-management')}>
        <Users className={iconStyle} />
        Users
      </Link>
      <Link to="/analytics" className={getLinkStyle(pathname, '/analytics')}>
        <LineChart className={iconStyle} />
        Analytics
      </Link>
    </>
  );
};

export const NavMenuItems = () => {
  const location = useLocation();

  const [linkStyle] = useState(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
  );
  const [linkSelectedStyle] = useState(
    'flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary',
  );
  const [badgeStyle] = useState('ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full');
  const [iconStyle] = useState('h-4 w-4');

  return (
    <div className="flex-1">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {getLinks(location.pathname, linkStyle, linkSelectedStyle, badgeStyle, iconStyle)}
      </nav>
    </div>
  );
};

export const NavMenuItemsSheetMode = () => {
  const location = useLocation();

  const [linkStyle] = useState(
    'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
  );
  const [linkSelectedStyle] = useState(
    'mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground',
  );
  const [badgeStyle] = useState('ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full');
  const [iconStyle] = useState('h-5 w-5');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className={iconStyle} />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <BrandInfoSheetMode />
          {getLinks(location.pathname, linkStyle, linkSelectedStyle, badgeStyle, iconStyle)}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
