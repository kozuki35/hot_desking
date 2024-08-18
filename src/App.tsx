import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserManagement from '@/pages/User/UserManagement';
import UserProfile from '@/pages/User/UserProfile';
import { Dashboard } from '@/pages/Home/Home';
import Login from '@/pages/Login/Login';
import SignUp from '@/pages/SignUp/SignUp';

const routes = (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<UserProfile />} />

      {/* Nav Menu Items */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/booking-history" element={<Dashboard />} />
      <Route path="/booking" element={<Dashboard />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/analytics" element={<Dashboard />} />
    </Routes>
  </Router>
);

const App = () => {
  return <div>{routes}</div>;
};

export default App;
