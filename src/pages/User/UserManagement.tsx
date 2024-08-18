import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { BaseLayout } from '@/components/layout/BaseLayout';

type User = {
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        const usersData = response.data;

        setUsers(usersData);
        setRoles(usersData.map((user: User) => user.role));
        setStatuses(usersData.map((user: User) => user.status));
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  const handleUpdate = async (index: number) => {
    const user = users[index];
    const updatedRole = roles[index];
    const updatedStatus = statuses[index];

    try {
      const response = await axiosInstance.put(`/users/${user._id}`, { role: updatedRole, status: updatedStatus });

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((u, i) => (i === index ? { ...u, role: updatedRole, status: updatedStatus } : u)),
        );
        toast.success('User updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
    }
  };

  const handleRoleChange = (index: number, value: string) => {
    setRoles((prevRoles) => {
      const newRoles = [...prevRoles];
      newRoles[index] = value;
      return newRoles;
    });
  };

  const handleStatusChange = (index: number, value: string) => {
    setStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      newStatuses[index] = value;
      return newStatuses;
    });
  };

  return (
    <BaseLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage your users here.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user._id || index}>
                    <TableCell>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select value={roles[index]} onValueChange={(value) => handleRoleChange(index, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={statuses[index]} onValueChange={(value) => handleStatusChange(index, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleUpdate(index)}>
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </BaseLayout>
  );
};

export default UserManagement;
