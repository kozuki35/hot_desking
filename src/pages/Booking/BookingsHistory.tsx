import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import { Spinner } from '@/components/ui/spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import BookingEditDialog from '@/components/booking/BookingEditDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type Booking = {
  _id: string;
  user: { _id: string; firstName: string; lastName: string };
  desk: { _id: string; code: string; name: string; location: string };
  booking_date: string;
  time_slot: { value: string; start_time: string; end_time: string };
  status: string;
  created_at: string;
};

const UserBookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const editDialogTriggerRef = useRef<HTMLButtonElement>(null);

  const fetchUserBookings = async (status: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/my-bookings?status=${status}`);

      // Sort bookings by booking_date in ascending order
      const sortedBookings = response.data.sort(
        (a: Booking, b: Booking) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime(),
      );

      setBookings(sortedBookings);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      toast.error('Error fetching user bookings');
    }
  };

  useEffect(() => {
    fetchUserBookings(currentTab);
  }, [currentTab]);

  // Trigger edit dialog function
  const triggerEditDialog = (booking: Booking) => {
    setEditBooking(booking);
    if (editDialogTriggerRef.current) {
      editDialogTriggerRef.current.click();
    }
  };

  const triggerDataRefresh = async () => {
    fetchUserBookings(currentTab);
  };

  return (
    <BaseLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setCurrentTab('all')}>
                All
              </TabsTrigger>
              <TabsTrigger value="active" onClick={() => setCurrentTab('active')}>
                Active
              </TabsTrigger>
              <TabsTrigger value="archived" onClick={() => setCurrentTab('archived')} className="hidden sm:flex">
                Archived
              </TabsTrigger>
              <TabsTrigger value="cancelled" onClick={() => setCurrentTab('cancelled')} className="hidden sm:flex">
                Cancelled
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={currentTab}>
            <Card>
              <CardHeader>
                <CardTitle>My Booking</CardTitle>
                <CardDescription>View and manage your desk bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                <Spinner isLoading={isLoading} />
                <Table className={isLoading ? 'hidden' : ''}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Desk</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell>
                          {booking.user.firstName} {booking.user.lastName}
                        </TableCell>
                        <TableCell>{booking.desk.name}</TableCell>
                        <TableCell>{booking.desk.location}</TableCell>
                        <TableCell>{new Date(booking.booking_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge>{booking.time_slot.value}</Badge> ({booking.time_slot.start_time} -{' '}
                          {booking.time_slot.end_time})
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{booking.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(booking.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => triggerEditDialog(booking)}>Edit</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>{isLoading ? '0' : bookings.length}</strong> bookings
                </div>
              </CardFooter>
            </Card>
            <BookingEditDialog
              isMyBooking={true}
              buttonRef={editDialogTriggerRef}
              booking={editBooking || undefined}
              triggerDataRefresh={triggerDataRefresh}
            />
          </TabsContent>
        </Tabs>
      </main>
    </BaseLayout>
  );
};

export default UserBookingHistory;
