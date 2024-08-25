import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type SearchBoxProps = {
  placeholder?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

const SearchBox = ({ searchQuery, onSearchChange, placeholder }: SearchBoxProps) => {
  const [showSearchBox, setShowSearchBox] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current ? inputRef.current.focus() : '';
  }, [showSearchBox]);

  const onToggleSearch = () => {
    setShowSearchBox(!showSearchBox);
  };

  return (
    <>
      {showSearchBox ? (
        <Input
          type="search"
          ref={inputRef}
          placeholder={placeholder || 'Search by Name'}
          className="w-full rounded-lg bg-background pl-8 md:w-[150px] lg:w-[200px]"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onBlur={() => {
            if (!(searchQuery.length > 0)) onToggleSearch();
          }}
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
