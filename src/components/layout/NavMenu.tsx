import { Link, useLocation } from 'react-router-dom';
import { Blocks, Clock, Home, Menu, NotebookPen, Users } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BrandInfoSheetMode } from '@/components/layout/BrandInfo';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { isAdmin, isUser } from '@/lib/utils';

const getLinks = (pathname: string, linkStyle: string, linkSelectedStyle: string, iconStyle: string) => {
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
        <span>Dashboard</span>
      </Link>

      {isUser() && (
        <Link to="/my-booking" className={getLinkStyle(pathname, '/my-booking')}>
          <Clock className={iconStyle} />
          <span>My Booking</span>
        </Link>
      )}

      {isAdmin() && (
        <>
          <Link to="/booking" className={getLinkStyle(pathname, '/booking')}>
            <NotebookPen className={iconStyle} />
            <span>Booking</span>
          </Link>
          <Link to="/user-management" className={getLinkStyle(pathname, '/user-management')}>
            <Users className={iconStyle} />
            <span>Users</span>
          </Link>
          <Link to="/desk-management" className={getLinkStyle(pathname, '/desk-management')}>
            <Blocks className={iconStyle} />
            <span>Desks</span>
          </Link>
          {/* <Link to="/analytics" className={getLinkStyle(pathname, '/analytics')}>
            <LineChart className={iconStyle} />
            Analytics
          </Link> */}
        </>
      )}
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
  const [iconStyle] = useState('h-4 w-4');

  return (
    <div className="flex-1">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {getLinks(location.pathname, linkStyle, linkSelectedStyle, iconStyle)}
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
          {getLinks(location.pathname, linkStyle, linkSelectedStyle, iconStyle)}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
