import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PotchefOnboarding from './components/onboarding/PotchefOnboarding';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layouts/DashboardLayout';
import PotchefDashboard from './components/roles/PotchefDashboard';
import PotluckyDashboard from './components/roles/PotluckyDashboard';
import FranchiseeDashboard from './components/roles/FranchiseeDashboard';
import AdminDashboard from './components/roles/AdminDashboard';
import AddMeal from './pages/potchef/AddMeal';
import MyMeals from './pages/potchef/MyMeals';
import Browse from './pages/potlucky/Browse';
import ChefOrders from './pages/potchef/ChefOrders';
import OrderHistory from './pages/potlucky/OrderHistory';

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
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        // Potchef routes
        {
          path: "potchef",
          children: [
            { index: true, element: <PotchefDashboard /> },
            { path: "addmeal", element: <AddMeal /> },
            { path: "meals", element: <MyMeals /> },
            { path: "orders", element: <ChefOrders /> },
          ]
        },
        // Potlucky routes
        {
          path: "potlucky",
          children: [
            { index: true, element: <PotluckyDashboard /> },
            { path: "browse", element: <Browse /> },
            { path: "orders", element: <OrderHistory /> },
            { path: "favorites", element: <div>Favorites Component</div> },
          ]
        },
        // Franchisee routes
        {
          path: "franchisee",
          children: [
            { index: true, element: <FranchiseeDashboard /> },
            { path: "approvals", element: <div>Approvals Component</div> },
            { path: "summary", element: <div>Summary Component</div> },
            { path: "chefs", element: <div>Chefs Component</div> },
          ]
        },
        // Admin routes
        {
          path: "admin",
          children: [
            { index: true, element: <AdminDashboard /> },
            { path: "users", element: <div>Users Component</div> },
            { path: "analytics", element: <div>Analytics Component</div> },
            { path: "content", element: <div>Content Component</div> },
          ]
        },
      ]
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;