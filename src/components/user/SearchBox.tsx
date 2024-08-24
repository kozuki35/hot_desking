import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type SearchBoxProps = {
  searchQuery: string;
  showSearchBox: boolean;
  onSearchChange: (query: string) => void;
  onToggleSearch: () => void;
};

const SearchBox = ({ searchQuery, showSearchBox, onSearchChange, onToggleSearch }: SearchBoxProps) => {
  return (
    <>
      {showSearchBox ? (
        <Input
          type="search"
          placeholder="Search by Name"
          className="w-full rounded-lg bg-background pl-8 md:w-[150px] lg:w-[200px]"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      ) : (
        <Button variant="ghost" onClick={onToggleSearch}>
          <Search className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};

export default SearchBox;
