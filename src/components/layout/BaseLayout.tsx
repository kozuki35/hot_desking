import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandInfo } from '@/components/layout/BrandInfo';
import { NavMenuItems, NavMenuItemsSheetMode } from '@/components/layout/NavMenu';
import { AccountMenu } from './AccoutMenu';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

export const BaseLayout: FC<Props> = ({ children }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <BrandInfo />
          <NavMenuItems />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <NavMenuItemsSheetMode />
          <div className="ml-auto">
            <AccountMenu />
          </div>
        </header>
        {children}
        <ToastContainer theme="light" />
      </div>
    </div>
  );
};
