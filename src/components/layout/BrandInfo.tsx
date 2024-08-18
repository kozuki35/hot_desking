import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Bell, Package2 } from 'lucide-react';

export const BrandInfo = () => {
  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <Package2 className="h-6 w-6" />
        <span className="">Hot Desking</span>
      </Link>
      <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
    </div>
  );
};

export const BrandInfoSheetMode = () => {
  return (
    <Link to="#" className="flex items-center gap-2 text-lg font-semibold">
      <Package2 className="h-6 w-6" />
      <span className="sr-only">Hot Desking</span>
    </Link>
  );
};
