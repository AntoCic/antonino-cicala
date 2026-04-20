import { createBrowserRouter } from 'react-router-dom';
import Home from './views/Home/Home';
import HomeAuth from './views/HomeAuth/HomeAuth';
import CompleteProfile from './views/CompleteProfile/CompleteProfile';
import Profile from './views/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AppLayout from './components/AppLayout/AppLayout';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/complete-profile', element: <CompleteProfile /> },
      {
        element: <AppLayout />,
        children: [
          { path: '/home', element: <HomeAuth /> },
          { path: '/profile', element: <Profile /> },
        ],
      },
    ],
  },
]);
