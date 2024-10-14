import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { Desk } from '@/pages/Desk/DeskManagement';
import { Booking } from '@/pages/Booking/Bookings';

interface Props {
  desk: Desk;
  bookingDate?: string;
}

const DeskSelectionCard = (props: Props) => {
  const [desk] = useState<Desk>(props.desk);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [shouldDisableMorningBooking, setShouldDisableMorningBooking] = useState<boolean>(false);
  const [shouldDisableAfternoonBooking, setShouldDisableAfternoonBooking] = useState<boolean>(false);
  const [newBookings, setNewBookings] = useState<Booking[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '');

  useEffect(() => {
    // disable the booked timeslot from others
    const shouldDisableBooking = (timeSlotType: string) =>
      props.desk.bookings?.some(
        (booking) =>
          booking.time_slot.value === timeSlotType && booking.status === 'active' && booking.user !== user.id,
      );

    // highlight the booked timeslot from logged in user
    const bookedSlots =
      props.desk.bookings?.map((booking) => {
        if (booking.user === user.id && booking.status === 'active') {
          return booking.time_slot.value;
        } else {
          return '';
        }
      }) || [];
    setSelectedTimeSlots(bookedSlots);
    setShouldDisableMorningBooking(shouldDisableBooking('morning') || false);
    setShouldDisableAfternoonBooking(shouldDisableBooking('afternoon') || false);
  }, [props.bookingDate, props.desk, user.id]);

  // timeslot background changes with booking status
  const onTimeSlotValuesChange = (values: string[]) => {
    // Calculate the canceled slots by comparing the old and new selected time slots
    const canceledSlotValues = selectedTimeSlots.filter((item) => !values.includes(item));
    // Calculate the new add slots by comparing the old and new selected time slots
    const addedSlotValues = values.filter((item) => !selectedTimeSlots.includes(item));

    setSelectedTimeSlots(values);

    if (canceledSlotValues.length > 0) {
      // Find the booking_id for each canceled slot and call cancelBooking
      canceledSlotValues.forEach((canceledSlot) => {
        let canceledBooking = props.desk.bookings?.find(
          (booking) => booking.time_slot.value === canceledSlot && booking.user === user.id,
        ) || newBookings?.find(
          (booking) => booking.time_slot.value === canceledSlot && booking.user === user.id,
        );

        if (canceledBooking) {
          cancelBooking(canceledBooking._id);
        }
      });
    }

    // Add new bookings for selected time slots
    if (addedSlotValues.length > 0) {
      addBooking(addedSlotValues);
    }
  };

  const addBooking = async (timeSlotValues: string[]) => {
    try {
      const response = await axiosInstance.post(`/bookings`, {
        deskId: desk._id,
        bookingDate: props.bookingDate,
        timeSlotValues: timeSlotValues,
      });

      if (response.status === 201) {
        setNewBookings([...newBookings, ...response.data.booking])
        toast.success(`Booking: ${desk.code} added successfully`);
      }
    } catch (error) {
      console.error(`Error adding Booking on Desk: ${desk.code}:`, error);
      toast.error(`Error adding Booking on Desk: ${desk.code}`);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await axiosInstance.delete(`/bookings/${bookingId}`);
      if (response.status === 200) {
        toast.success(`Booking: ${desk.code} cancelled successfully`);
      }
    } catch (error) {
      console.error(`Error cancelling Booking on Desk: ${desk.code}:`, error);
      toast.error(`Error cancelling Booking on Desk: ${desk.code}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between ">
          <p>{`${desk.code}`}</p>
          <Badge variant="secondary">{desk.location}</Badge>
        </CardTitle>
        <CardDescription>{desk.description}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <ToggleGroup
          type="multiple"
          variant="timeSlot"
          className="flex lg:flex-row sm:flex-col justify-start"
          onValueChange={onTimeSlotValuesChange}
          value={selectedTimeSlots}
        >
          <div>
            <ToggleGroupItem
              disabled={shouldDisableMorningBooking}
              className={shouldDisableMorningBooking ? 'bg-muted' : ''}
              value="morning"
              aria-label="Toggle bold"
            >
              8:00 - 12:00
            </ToggleGroupItem>
          </div>
          <div>
            <ToggleGroupItem
              disabled={shouldDisableAfternoonBooking}
              className={shouldDisableAfternoonBooking ? 'bg-muted' : ''}
              value="afternoon"
              aria-label="Toggle italic"
            >
              12:00 - 17:00
            </ToggleGroupItem>
          </div>
        </ToggleGroup>
      </CardFooter>
    </Card>
  );
};

export default DeskSelectionCard;
