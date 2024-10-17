import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { AxiosError } from 'axios';

const UserProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the currently logged-in user from local storage
        const user = JSON.parse(localStorage.getItem('user') || '');
        const response = await axiosInstance.get(`/users/${user.id}/profile`);
        const { firstName, lastName, email } = response.data.user;
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

   // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      // Get the logged-in user from local storage
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Make a put request to update the profile
      const response = await axiosInstance.put(`/my-profile/${user?.id}`, {
        firstName,
        lastName,
        currentPassword,
        newPassword, 
      });

      // Update local storage with the new user profile data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Your profile has been successfully updated.');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error instanceof AxiosError) {
        // Handle errors from backend
        if (error.response?.status === 400) {
          toast.error(error.response?.data.message || 'There was an error updating your profile. Please try again.');
        }
      } else {
        toast.error('There was an error updating your profile. Please try again.');
      }
    }
  };

  return (
    <BaseLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 p-1 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="grid gap-4 p-1 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" value={email} readOnly />
              </div>
            </div>
              
            <div className="grid gap-4 p-1 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (optional)"
                />
              </div>
            </div>
           
          </CardContent>
          <CardFooter className="text-right">
            <Button onClick={handleUpdateProfile}>Update Profile</Button>
          </CardFooter>
        </Card>
      </main>
    </BaseLayout>
  );
};

export default UserProfile;
