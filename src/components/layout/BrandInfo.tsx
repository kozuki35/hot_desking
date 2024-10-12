import { Link } from 'react-router-dom';
import { Package2 } from 'lucide-react';

export const BrandInfo = () => {
  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <Package2 className="h-6 w-6" />
        <span className="">Hot Desking</span>
      </Link>
    </div>
  );
};

export const BrandInfoSheetMode = () => {
  return (
    <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
      <Package2 className="h-6 w-6" />
      <span className="sr-only">Hot Desking</span>
    </Link>
  );
};
