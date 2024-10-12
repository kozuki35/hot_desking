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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { User } from '../../pages/User/UserManagement'; // Make sure the User type is imported

interface Props {
  buttonRef: React.RefObject<HTMLButtonElement>;
  user?: User; // Ensure user data is passed as a prop
  triggerDataRefresh: () => void;
}

const UserEditDialog = (props: Props) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  // Populate the form with current user data when dialog is opened
  useEffect(() => {
    if (props.user) {
      setFirstName(props.user.firstName || '');
      setLastName(props.user.lastName || '');
      setEmail(props.user.email || '');
      setStatus(props.user.status || '');
      setRole(props.user.role || '');
    }
  }, [props.user, isOpen]); // Runs when the dialog is opened and user data changes

  const handleUpdate = async () => {
    try {
      const response = await axiosInstance.put(`/users/${props.user?._id}`, {
        firstName: firstName,
        lastName: lastName,
        status: status,
        role: role,
      });

      if (response.status === 200) {
        toast.success(`User: ${props.user?.email} updated successfully`);
        props.buttonRef.current ? props.buttonRef.current.click() : '';
        props.triggerDataRefresh();
      }
    } catch (error) {
      console.error(`Error updating User: ${props.user?.email}:`, error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error || `Error updating User: ${props.user?.email}`);
      } else {
        toast.error(`Error updating User: ${props.user?.email}`);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button ref={props.buttonRef} variant="outline" className="invisible">
          Edit User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User: {props.user?.email}</DialogTitle>
          <DialogDescription>Make changes to the user's details here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              className="col-span-3"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              className="col-span-3"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={email} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="col-span-3">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select value={role} onValueChange={(value) => setRole(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="col-span-3">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
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

export default UserEditDialog;
