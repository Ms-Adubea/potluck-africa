import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PotchefOnboarding from './components/onboarding/PotchefOnboarding';
import Dashboard from './pages/Dashboard';  // 👉 Import the Dashboard

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/potchef-onboarding",
      element: <PotchefOnboarding />,
    },
    {
      path: "/dashboard",              // 👉 New Dashboard Route
      element: <Dashboard />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
