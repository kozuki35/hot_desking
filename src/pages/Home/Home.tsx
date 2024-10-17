import { BaseLayout } from '@/components/layout/BaseLayout';
import { FC, useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { Desk } from '../Desk/DeskManagement';
import { Spinner } from '@/components/ui/spinner';
import { DatePicker } from '@/components/ui/date-picker';
import { formatDateToLocalYYYYMMDD } from '@/lib/utils';
import DeskSelectionCard from '@/components/desk/DeskSelectionCard';

export const MakeBooking: FC = () => {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch available desks based on desk status and selected date
  const fetchDesks = useCallback(async (deskStatus: string, queryDate: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/desks/booking?deskStatus=${deskStatus}&queryDate=${queryDate}`);
      const desksData = response.data;

      setDesks(desksData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching desks:', error);
      toast.error('Error fetching desks');
    }
  }, []);

  // Effect hook to fetch desks whenever the selected date changes
  useEffect(() => {
    fetchDesks('active', formatDateToLocalYYYYMMDD(selectedDate || new Date()));
  }, [selectedDate, fetchDesks]);

  return (
    <BaseLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-2 lg:p-6">
        <div className="flex lg:flex-row sm:flex-col justify-between ">
          <div className="items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Make a booking</h1>
            <span className="text-sm text-muted-foreground">Click the time slot to make/cancel a booking.</span>
          </div>
          <div className="flex items-center justify-center">
            <DatePicker onChange={setSelectedDate} disableBefore={true} />
          </div>
        </div>
        <div
          className="w-full h-full bg-gray-100 rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 m-2 gap-2">
            <Spinner isLoading={isLoading} />
            {desks.map((value: Desk, index: number) => (
              <DeskSelectionCard
                desk={value}
                bookingDate={formatDateToLocalYYYYMMDD(selectedDate || new Date())}
                key={index}
              />
            ))}
          </div>
        </div>
      </main>
    </BaseLayout>
  );
};
