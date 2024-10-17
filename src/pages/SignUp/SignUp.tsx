import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { FC, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp: FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

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

  const handleSignUp = async () => {
    // Reset error message
    setErrorMessage('');

    // Validate names
    if (!isValidName(firstName) || !isValidName(lastName)) {
      setErrorMessage('Names can only contain letters, spaces, and hyphens.');
      return;
    }

    // Email validation
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (!isValidPassword(password)) {
      setErrorMessage('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }

    // Call Signup API
    try {
      const response = await axiosInstance.post('/users/signup', {
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        setErrorMessage('');
        setSuccessMessage('Account created successfully! Redirecting to home page...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        // Check if the error is related to duplicate email
        if (error.response && error.response.status === 400) {
          setErrorMessage('Email address already exists. Please use a different email.');
        } else {
          setErrorMessage('An error occurred during signup. Please try again.');
        }
      } else {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Card className="mt-20 mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {errorMessage && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
            {successMessage}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" placeholder="Max" required onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" placeholder="Robinson" required onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="w-full" onClick={handleSignUp}>
          Create an account
        </Button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUp;
