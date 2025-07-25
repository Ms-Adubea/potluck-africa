// 📁 src/App.jsx
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
// import MealDetailView from './pages/potchef/MealDetailView';
import EditMeal from './pages/potchef/EditMeal';
import Browse from './pages/potlucky/Browse';
import ChefOrders from './pages/potchef/ChefOrders';
import OrderHistory from './pages/potlucky/OrderHistory';
import PendingUsers from './pages/admin/PendingUsers';
import PendingUserDetail from './pages/admin/PendingUserDetail';
import ProtectedRoute from './components/ProtectedRoutes';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import MealDetailView from './pages/potchef/MealDeatailView';
import PotluckyFavorites from './pages/potlucky/PotluckyFavorites';
import AddUsers from './pages/admin/AddUsers';
import PotluckyMealView from './pages/potlucky/PotluckyMealView';


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
      path: "/favorites",
      element: <PotluckyFavorites />,
    },

    {
      path: "/potchef-onboarding",
      element: (
        <ProtectedRoute requiredRole="potchef">
          <PotchefOnboarding />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        // Potchef routes
        {
          path: "potchef",
          children: [
            { 
              index: true, 
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <PotchefDashboard />
                </ProtectedRoute>
              )
            },
            { 
              path: "addmeal", 
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <AddMeal />
                </ProtectedRoute>
              )
            },
            { 
              path: "meals", 
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <MyMeals />
                </ProtectedRoute>
              )
            },
            { 
              path: "meals/:id", 
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <MealDetailView />
                </ProtectedRoute>
              )
            },
            { 
              path: "meals/:id/edit", 
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <EditMeal />
                </ProtectedRoute>
              )
            },
            { 
              path: "orders", 
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <ChefOrders />
                </ProtectedRoute>
              )
            },
          ]
        },
        // Potlucky routes
        {
          path: "potlucky",
          children: [
            { 
              index: true, 
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <PotluckyDashboard />
                </ProtectedRoute>
              )
            },
            { 
              path: "browse", 
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <Browse />
                </ProtectedRoute>
              )
            },
            { 
              path: "browse/:mealId", 
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <PotluckyMealView />
                </ProtectedRoute>
              )
            },
            { 
              path: "orders", 
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <OrderHistory />
                </ProtectedRoute>
              )
            },
            { 
              path: "favorites", 
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <div>Favorites Component</div>
                </ProtectedRoute>
              )
            },
          ]
        },
        // Franchisee routes
        {
          path: "franchisee",
          children: [
            { 
              index: true, 
              element: (
                <ProtectedRoute requiredRole="franchisee">
                  <FranchiseeDashboard />
                </ProtectedRoute>
              )
            },
            { 
              path: "approvals", 
              element: (
                <ProtectedRoute requiredRole="franchisee">
                  <div>Approvals Component</div>
                </ProtectedRoute>
              )
            },
            { 
              path: "summary", 
              element: (
                <ProtectedRoute requiredRole="franchisee">
                  <div>Summary Component</div>
                </ProtectedRoute>
              )
            },
            { 
              path: "chefs", 
              element: (
                <ProtectedRoute requiredRole="franchisee">
                  <div>Chefs Component</div>
                </ProtectedRoute>
              )
            },
          ]
        },
        // Admin routes
        {
          path: "admin",
          children: [
            { 
              index: true, 
              element: (
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              )
            },
            { 
              path: "pending-users", 
              element: (
                <ProtectedRoute requiredRole="admin">
                  <PendingUsers />
                </ProtectedRoute>
              )
            },
            { 
              path: "pending-users/:id", 
              element: (
                <ProtectedRoute requiredRole="admin">
                  <PendingUserDetail />
                </ProtectedRoute>
              )
            },
            { 
              path: "users", 
              element: (
                <ProtectedRoute requiredRole="admin">
                  <AdminUserManagement />
                </ProtectedRoute>
              )
            },
            { 
              path: "add-user", 
              element: (
                <ProtectedRoute requiredRole="admin">
                  <AddUsers />
                </ProtectedRoute>
              )
            },
            { 
              path: "analytics", 
              element: (
                <ProtectedRoute requiredRole="admin">
                  <div>Analytics Component</div>
                </ProtectedRoute>
              )
            },
            { 
              path: "content", 
              element: (
                <ProtectedRoute requiredRole="admin">
                  <div>Content Component</div>
                </ProtectedRoute>
              )
            },
          ]
        },
      ]
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;