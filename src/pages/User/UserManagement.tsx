import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { ListFilter, PlusCircle } from 'lucide-react';

import UserTable from '@/components/user/UserTable';
import AddUserForm from '@/components/user/AddUserForm';
import TabsMenu from '@/components/user/TabsMenu';
import SearchBox from '@/components/user/SearchBox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        const usersData = response.data;

        setUsers(usersData);
        setRoles(usersData.map((user: User) => user.role));
        setStatuses(usersData.map((user: User) => user.status));
      } catch (error) {
        toast.error('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (index: number, value: string) => {
    const updatedRoles = [...roles];
    updatedRoles[index] = value;
    setRoles(updatedRoles);
  };

  const handleStatusChange = (index: number, value: string) => {
    const updatedStatuses = [...statuses];
    updatedStatuses[index] = value;
    setStatuses(updatedStatuses);
  };

  const handleUpdate = async (index: number) => {
    try {
      const user = users[index];
      await axiosInstance.put(`/users/${user._id}`, { role: roles[index], status: statuses[index] });
      toast.success('User updated successfully.');
    } catch (error) {
      toast.error('Failed to update user.');
    }
  };

  const handleAddUser = async () => {
    try {
      await axiosInstance.post('/users/signup', {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        password: newPassword,
      });
      toast.success('User created successfully.');
      setShowAddUserForm(false);
      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to create user.');
    }
  };

  const filteredUsers = users.filter((user) => {
    if (activeTab === 'active') return user.status === 'active';
    if (activeTab === 'archived') return user.status === 'inactive';
    const fullName = `${user.firstName?.toLowerCase() || ''} ${user.lastName?.toLowerCase() || ''}`;
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <BaseLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
          <div className="flex gap-2">
            <TabsMenu activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <SearchBox
              searchQuery={searchQuery}
              showSearchBox={showSearchBox}
              onSearchChange={setSearchQuery}
              onToggleSearch={() => setShowSearchBox(!showSearchBox)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-7 gap-1" onClick={() => setShowAddUserForm(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              Add User
            </Button>
          </div>
        </div>

        {showAddUserForm ? (
          <AddUserForm
            newFirstName={newFirstName}
            newLastName={newLastName}
            newEmail={newEmail}
            newPassword={newPassword}
            onFirstNameChange={setNewFirstName}
            onLastNameChange={setNewLastName}
            onEmailChange={setNewEmail}
            onPasswordChange={setNewPassword}
            onAddUser={handleAddUser}
            onCancel={() => setShowAddUserForm(false)}
          />
        ) : (
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <UserTable
                users={filteredUsers}
                roles={roles}
                statuses={statuses}
                onRoleChange={handleRoleChange}
                onStatusChange={handleStatusChange}
                onUpdate={handleUpdate}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </BaseLayout>
  );
};

export default UserManagement;
