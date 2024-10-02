import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import { Spinner } from '@/components/ui/spinner';
import SearchBox from '@/components/user/SearchBox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ListFilter } from 'lucide-react';
import BookingEditDialog from '@/components/booking/BookingEditDialog';

export type Booking = {
  _id: string;
  user: { firstName: string; lastName: string };
  desk: { code: string; name: string; location: string };
  booking_date: string;
  time_slot: { value: string; start_time: string; end_time: string };
  status: string;
  created_at: string;
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const editDialogTriggerRef = useRef<HTMLButtonElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]); // Filter for booking statuses

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/bookings');
        setBookings(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Error fetching bookings');
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const userName = `${booking.user.firstName} ${booking.user.lastName}`.toLowerCase();
    const statusMatch = statusFilter.length > 0 ? statusFilter.includes(booking.status.toLowerCase()) : true;
    return userName.includes(searchQuery.toLowerCase()) && statusMatch;
  });

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prevStatus) =>
      prevStatus.includes(status)
        ? prevStatus.filter((s) => s !== status)
        : [...prevStatus, status]
    );
  };

  // Trigger edit dialog function
  const triggerEditDialog = (booking: Booking) => {
    setEditBooking(booking);
    if (editDialogTriggerRef.current) {
      editDialogTriggerRef.current.click();
    }
  };

  const triggerDataRefresh = async () => {
    try {
      const response = await axiosInstance.get('/bookings');
      setBookings(response.data); // Update the state with the latest bookings
    } catch (error) {
      console.error('Error fetching updated bookings:', error);
      toast.error('Failed to refresh data');
    }
  };

  return (
    <BaseLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">          
          <div className="ml-auto flex items-center gap-2">
            <SearchBox searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('active')}
                    onCheckedChange={() => toggleStatusFilter('active')}
                  >
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('achived')}
                    onCheckedChange={() => toggleStatusFilter('achived')}
                  >
                    Achived
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('cancelled')}
                    onCheckedChange={() => toggleStatusFilter('cancelled')}
                  >
                    Cancelled
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
            <CardDescription>View and manage all desk bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Spinner isLoading={isLoading} />
            {/* <div className="flex items-center mb-4">
              <SearchBox placeholder="Search by user" searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1 ml-4">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('confirmed')}
                    onCheckedChange={() => toggleStatusFilter('confirmed')}
                  >
                    Confirmed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('pending')}
                    onCheckedChange={() => toggleStatusFilter('pending')}
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('canceled')}
                    onCheckedChange={() => toggleStatusFilter('canceled')}
                  >
                    Canceled
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}
            <Table className={isLoading ? 'hidden' : ''}>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Desk</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
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
              Showing <strong>{isLoading ? '0' : filteredBookings.length}</strong> bookings
            </div>
          </CardFooter>
        </Card>
        <BookingEditDialog
          buttonRef={editDialogTriggerRef}
          booking={editBooking || undefined}
          triggerDataRefresh={triggerDataRefresh}
        />
      </main>
    </BaseLayout>
  );
};

export default Bookings;
