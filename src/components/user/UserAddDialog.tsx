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
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface Props {
  buttonRef: React.RefObject<HTMLButtonElement>;
  triggerDataRefresh: () => void;
}

const UserAddDialog = (props: Props) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setErrorMessage('');
  }, [isOpen]);

  // Password validation: at least 8 characters, including both letters and numbers
  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  // Email validation: general pattern for valid email addresses
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Name validation: only allows letters, spaces, and hyphens
  const isValidName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s\-]+$/;
    return nameRegex.test(name);
  };

  const handleAddUser = async () => {
    setErrorMessage(''); // Reset error message

    // Validate first and last names
    if (!isValidName(firstName) || !isValidName(lastName)) {
      setErrorMessage('Names can only contain letters, spaces, and hyphens.');
      return;
    }

    // Validate email
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Validate password
    if (!isValidPassword(password)) {
      setErrorMessage('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }

    // Proceed with API call if validations pass
    try {
      const response = await axiosInstance.post(`/users/signup`, {
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 201) {
        toast.success(`User: ${response.data.user.email} added successfully`);
        props.buttonRef.current?.click(); // Close dialog
        props.triggerDataRefresh(); // Refresh data
      }
    } catch (error) {
      console.error(`Error adding user: ${email}:`, error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error || `Error adding user: ${email}`);
      } else {
        toast.error(`Error adding user: ${email}`);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button ref={props.buttonRef} variant="outline" className="invisible">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Fill in user details and click save to add a new user.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {errorMessage && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {errorMessage}
            </div>
          )}
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
            <Input id="email" value={email} className="col-span-3" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              className="col-span-3"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddUser}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddDialog;
