import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { BaseLayout } from '@/components/layout/BaseLayout';

const UserProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
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

  const handleUpdateProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axiosInstance.put(`/users/${user?.id}/profile`, { firstName, lastName, password });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Your profile has been successfully updated.');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('There was an error updating your profile. Please try again.');
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
            <div className="grid gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" value={email} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
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
