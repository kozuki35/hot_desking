import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateBefore } from 'react-day-picker';

interface Props {
  disableBefore?: boolean;
  onChange: (date: Date | undefined) => void;
}

export const DatePicker = (props: Props) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [disableBefore] = React.useState<boolean>(props.disableBefore || false);

  // will match days before today
  const beforeMatcher: DateBefore = { before: new Date() };

  const handleChange = (day: Date | undefined) => {
    setDate(day);
    props.onChange(day);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          disabled={disableBefore ? beforeMatcher : false}
          selected={date}
          required={true}
          onSelect={handleChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
