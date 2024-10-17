import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BaseLayout } from '@/components/layout/BaseLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import DeskEditDialog from '@/components/desk/DeskEditDialog';
import DeskAddDialog from '@/components/desk/DeskAddDialog';
import { Spinner } from '@/components/ui/spinner';
import SearchBox from '@/components/user/SearchBox';
import { Booking } from '../Booking/Bookings';

export type Desk = {
  _id: string;
  code: string;
  name: string;
  description: string;
  location: string;
  status: string;
  created_at: string;
  bookings?: Booking[];
};

const DeskManagement = () => {
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [desks, setDesks] = useState<Desk[]>([]);
  const [editDesk, setEditDesk] = useState<Desk>();
  const editDialogTriggerRef = useRef<HTMLButtonElement>(null);
  const addDialogTriggerRef = useRef<HTMLButtonElement>(null);
  const [dataRefresh, setDataRefresh] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch desks based on status and refresh trigger
  useEffect(() => {
    const fetchDesks = async (status: string) => {
      try {
        setIsLoading(true);
        // Fetch desks from API
        const response = await axiosInstance.get(`/desks?status=${status}`);
        const desksData = response.data;

        setDesks(desksData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching desks:', error);
        toast.error('Error fetching desks');
      }
    };
    // Fetch desks whenever currentTab or dataRefresh changes
    fetchDesks(currentTab);
  }, [currentTab, dataRefresh]);

  // Filter desks based on search query
  const filteredDesks = () =>
    desks.filter((desk) => {
      return desk.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Trigger data refresh
  const triggerDataRefresh = () => {
    setDataRefresh(!dataRefresh);
  };

  // Trigger edit dialog for a selected desk
  const triggerEditDialog = (desk: Desk) => {
    setEditDesk(desk);
    editDialogTriggerRef.current ? editDialogTriggerRef.current.click() : '';
  };

  // Trigger add dialog for adding a new desk
  const triggerAddDialog = () => {
    addDialogTriggerRef.current ? addDialogTriggerRef.current.click() : '';
  };

  return (
    <BaseLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            {/* Tab filter for different desk statuses */}
            <TabsList>
              <TabsTrigger value="all" onClick={() => setCurrentTab('all')}>
                All
              </TabsTrigger>
              <TabsTrigger value="active" onClick={() => setCurrentTab('active')}>
                Active
              </TabsTrigger>
              <TabsTrigger value="draft" onClick={() => setCurrentTab('draft')}>
                Draft
              </TabsTrigger>
              <TabsTrigger value="archived" onClick={() => setCurrentTab('archived')} className="hidden sm:flex">
                Archived
              </TabsTrigger>
            </TabsList>

            {/* Search box and Add Desk button */}
            <div className="ml-auto flex items-center gap-2">
              <SearchBox placeholder="Filter by name" searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              <Button size="sm" className="h-7 gap-1" onClick={() => triggerAddDialog()}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Desk</span>
              </Button>
            </div>
          </div>

          {/* Desk list based on the selected tab */}
          <TabsContent value={currentTab}>
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Desks</CardTitle>
                <CardDescription>Manage your desk.</CardDescription>
              </CardHeader>
              <CardContent>
                <Spinner isLoading={isLoading} />
                <Table className={isLoading ? 'hidden' : ''}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden md:table-cell">Created at</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDesks().map((desk, index) => (
                      <TableRow key={desk._id || index}>                       
                        <TableCell className="font-medium">{desk.code}</TableCell>
                        <TableCell>{desk.name}</TableCell>
                        <TableCell>{desk.location}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{desk.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{desk.description}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(desk.created_at).toLocaleDateString()}
                        </TableCell>
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
                              <DropdownMenuItem onClick={() => triggerEditDialog(desk)}>Edit</DropdownMenuItem>
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
                  Showing <strong>{isLoading ? '0' : desks.length}</strong> desks
                </div>
              </CardFooter>
            </Card>

            {/* Desk edit and add dialogs */}
            <DeskEditDialog buttonRef={editDialogTriggerRef} desk={editDesk} triggerDataRefresh={triggerDataRefresh} />
            <DeskAddDialog buttonRef={addDialogTriggerRef} triggerDataRefresh={triggerDataRefresh} />
          </TabsContent>
        </Tabs>
      </main>
    </BaseLayout>
  );
};

export default DeskManagement;
