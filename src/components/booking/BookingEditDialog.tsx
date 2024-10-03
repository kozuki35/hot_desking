import { format, parseISO } from 'date-fns'; // Add `parseISO` to handle date parsing
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Booking } from '../../pages/Booking/Bookings';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';

interface Props {
  buttonRef: React.RefObject<HTMLButtonElement>;
  booking?: Booking;
  triggerDataRefresh: () => void;
}

const BookingEditDialog = (props: Props) => {
  const [bookingDate, setBookingDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('morning');
  const [status, setStatus] = useState<string>('active');
  const [isOpen, setIsOpen] = useState(false);

  // When editing, make sure the booking date is formatted correctly in "yyyy-MM-dd"
  useEffect(() => {
    if (props.booking) {
      const formattedDate = format(parseISO(props.booking.booking_date), 'yyyy-MM-dd'); // Parse and format the date
      setBookingDate(formattedDate);
      setTimeSlot(props.booking.time_slot.value || 'morning');
      setStatus(props.booking.status || 'active');
    }
  }, [props.booking, isOpen]);

  const handleUpdate = async () => {
    try {
      const formattedDate = format(new Date(bookingDate), 'yyyy-MM-dd'); // Convert the date to the required format
      const response = await axiosInstance.put(`/bookings/${props.booking?._id}`, {
        booking_date: formattedDate,
        time_slot: {
          value: timeSlot,
        },
        status: status,
      });

      if (response.status === 200) {
        toast.success('Booking updated successfully');
        props.triggerDataRefresh(); // Refresh the booking data
        setIsOpen(false); // Close the dialog after success
      } else {
        throw new Error('Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error || 'Error updating booking');
      } else {
        toast.error('Error updating booking');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button ref={props.buttonRef} variant="outline" className="invisible">
          Edit Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription>Make changes to your booking here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bookingDate" className="text-right">
              Booking Date
            </Label>
            <Input
              id="bookingDate"
              type="date"
              value={bookingDate} // Correctly formatted booking date
              className="col-span-3"
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeSlot" className="text-right">
              Time Slot
            </Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent className="col-span-3">
                <SelectItem value="morning">Morning (08:00 - 12:00)</SelectItem>
                <SelectItem value="afternoon">Afternoon (13:00 - 17:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="col-span-3">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdate}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingEditDialog;