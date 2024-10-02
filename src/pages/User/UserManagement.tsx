import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axiosInstance';
import SearchBox from '@/components/user/SearchBox';
import { Spinner } from '@/components/ui/spinner';
import UserEditDialog from '@/components/user/UserEditDialog';
import UserAddDialog from '@/components/user/UserAddDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

const UserManagement = () => {
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User>();
  const editDialogTriggerRef = useRef<HTMLButtonElement>(null);
  const addDialogTriggerRef = useRef<HTMLButtonElement>(null);
  const [dataRefresh, setDataRefresh] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async (status: string) => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/users?status=${status}`);
        const usersData = response.data;

        setUsers(usersData);
        setIsLoading(false);
      } catch (error) {
        toast.error('Error fetching users');
        setIsLoading(false);
      }
    };

    fetchUsers(currentTab);
  }, [currentTab, dataRefresh]);

  const filteredUsers = () =>
    users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });

  const triggerDataRefresh = () => {
    setDataRefresh(!dataRefresh);
  };

  const triggerEditDialog = (user: User) => {
    setEditUser(user);
    editDialogTriggerRef.current?.click();
  };

  const triggerAddDialog = () => {
    addDialogTriggerRef.current?.click();
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
              <TabsTrigger value="inactive" onClick={() => setCurrentTab('inactive')} className="hidden sm:flex">
                Inactive
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <SearchBox placeholder="Filter by name" searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              <Button size="sm" className="h-7 gap-1" onClick={triggerAddDialog}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add User</span>
              </Button>
            </div>
          </div>
          <TabsContent value={currentTab}>
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage your users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <Spinner isLoading={isLoading} />
                <Table className={isLoading ? 'hidden' : ''}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers().map((user, index) => (
                      <TableRow key={user._id || index}>
                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.status}</Badge>
                        </TableCell>
                        <TableCell>{user.created_at}</TableCell>
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
                                <DropdownMenuItem onClick={() => triggerEditDialog(user)}>Edit</DropdownMenuItem>
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
                  Showing <strong>{isLoading ? '0' : users.length}</strong> users
                </div>
              </CardFooter>
            </Card>
            <UserEditDialog buttonRef={editDialogTriggerRef} user={editUser} triggerDataRefresh={triggerDataRefresh} />
            <UserAddDialog buttonRef={addDialogTriggerRef} triggerDataRefresh={triggerDataRefresh} />
          </TabsContent>
        </Tabs>
      </main>
    </BaseLayout>
  );
};

export default UserManagement;
