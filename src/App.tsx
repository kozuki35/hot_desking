import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserManagement from '@/pages/User/UserManagement';
import UserProfile from '@/pages/User/UserProfile';
import { Dashboard } from '@/pages/Home/Home';
import Login from '@/pages/Login/Login';
import SignUp from '@/pages/SignUp/SignUp';
import DeskManagement from '@/pages/Desk/DeskManagement';
import Bookings from './pages/Booking/Bookings';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import UserBookingHistory from './pages/Booking/BookingsHistory';

const routes = (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<UserProfile />} />

      {/* Nav Menu Items */}
      <Route path="/" element={<ProtectedRoute element={<Dashboard />} requiredRoles={["admin", "user"]} />} />
      <Route path="/my-booking" element={<ProtectedRoute element={<UserBookingHistory />} requiredRoles={["user"]} />} />
      <Route path="/booking" element={<ProtectedRoute element={<Bookings />} requiredRoles={["admin"]} />} />
      <Route path="/user-management" element={<ProtectedRoute element={<UserManagement />} requiredRoles={["admin"]} />} />
      <Route path="/desk-management" element={<ProtectedRoute element={<DeskManagement />} requiredRoles={["admin"]} />} />
      {/* <Route path="/analytics" element={<ProtectedRoute element={<Dashboard />} requiredRole="admin" />} /> */}
    </Routes>
  </Router>
);

const App = () => {
  return <div>{routes}</div>;
};

export default App;
