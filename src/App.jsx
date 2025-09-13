// 📁 src/App.jsx - Modified to redirect potlucky index to browse
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PotchefOnboarding from "./components/onboarding/PotchefOnboarding";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layouts/DashboardLayout";
import PotchefDashboard from "./components/roles/PotchefDashboard";
import PotluckyDashboard from "./components/roles/PotluckyDashboard";
import FranchiseeDashboard from "./components/roles/FranchiseeDashboard";
import AdminDashboard from "./components/roles/AdminDashboard";
import AddMeal from "./pages/potchef/AddMeal";
import MyMeals from "./pages/potchef/MyMeals";
// import MealDetailView from './pages/potchef/MealDetailView';
import EditMeal from "./pages/potchef/EditMeal";
import Browse from "./pages/potlucky/Browse";
import ChefOrders from "./pages/potchef/ChefOrders";
import OrderHistory from "./pages/potlucky/OrderHistory";
import PendingUsers from "./pages/admin/PendingUsers";
import PendingUserDetail from "./pages/admin/PendingUserDetail";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import MealDetailView from "./pages/potchef/MealDeatailView";
import PotluckyFavorites from "./pages/potlucky/PotluckyFavorites";
import PotluckyMealView from "./pages/potlucky/PotluckyMealView";
import ProfilePage from "./components/common/ProfilePage";
import SettingsPage from "./components/common/SettingsPage";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { CartProvider } from "./contexts/CartContext";
import OrderCheckout from "./pages/potlucky/OrderCheckout";
import { useEffect } from "react";
import {
  registerServiceWorker,
  requestNotificationPermission,
} from "./utils/pwaUtils";
import AddFranchisee from "./pages/admin/AddFranchisee";
import AddUsers from "./pages/admin/AddUsers";
import FranchiseeManagement from "./pages/admin/FranchiseeManagement";
import EditFranchiseeModal from "./pages/admin/EditFranchisee";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationsPage from "./components/common/NotificationPage";
import NotificationTestPanel from "./components/common/NotificationTestPanel";
import NotificationManager from "./pages/admin/NotificationManager";
import Eateries from "./pages/potlucky/Eateries";

function App() {
  useEffect(() => {
    registerServiceWorker();
    requestNotificationPermission();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/cart",
      element: <OrderCheckout />,
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
      path: "/not",
      element: <NotificationTestPanel />,
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
              ),
            },
            {
              path: "addmeal",
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <AddMeal />
                </ProtectedRoute>
              ),
            },
            {
              path: "meals",
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <MyMeals />
                </ProtectedRoute>
              ),
            },
            {
              path: "meals/:id",
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <MealDetailView />
                </ProtectedRoute>
              ),
            },
            {
              path: "meals/:id/edit",
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <EditMeal />
                </ProtectedRoute>
              ),
            },
            {
              path: "orders",
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <ChefOrders />
                </ProtectedRoute>
              ),
            },
            {
              path: "profile",
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <ProfilePage />
                </ProtectedRoute>
              ),
            },
            {
              path: "settings",
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <SettingsPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "notifications",
              element: (
                <ProtectedRoute requiredRole="potchef">
                  <NotificationsPage />
                </ProtectedRoute>
              ),
            },
          ],
        },
        // Potlucky routes - Modified to redirect index to browse
        {
          path: "potlucky",
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <Navigate to="/dashboard/potlucky/browse" replace />
                </ProtectedRoute>
              ),
            },
            {
              path: "browse",
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <FavoritesProvider>
                    <CartProvider>
                      <Browse />
                    </CartProvider>
                  </FavoritesProvider>
                </ProtectedRoute>
              ),
            },
            {
              path: "browse/:mealId",
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <PotluckyMealView />
                </ProtectedRoute>
              ),
            },
            {
              path: "eateries",
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <Eateries />
                </ProtectedRoute>
              ),
            },
            {
              path: "orders",
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <OrderHistory />
                </ProtectedRoute>
              ),
            },
            {
              path: "favorites",
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <FavoritesProvider>
                    <PotluckyFavorites />
                  </FavoritesProvider>
                </ProtectedRoute>
              ),
            },
            {
              path: "profile",
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <ProfilePage />
                </ProtectedRoute>
              ),
            },
            {
              path: "settings",
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <SettingsPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "notifications",
              element: (
                <ProtectedRoute requiredRole="potlucky">
                  <NotificationsPage />
                </ProtectedRoute>
              ),
            },
          ],
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
              ),
            },
            {
              path: "approvals",
              element: (
                <ProtectedRoute requiredRole="franchisee">
                  <div>Approvals Component</div>
                </ProtectedRoute>
              ),
            },
            {
              path: "summary",
              element: (
                <ProtectedRoute requiredRole="franchisee">
                  <div>Summary Component</div>
                </ProtectedRoute>
              ),
            },
            {
              path: "chefs",
              element: (
                <ProtectedRoute requiredRole="franchisee">
                  <div>Chefs Component</div>
                </ProtectedRoute>
              ),
            },
            {
              path: "profile",
              element: (
                <ProtectedRoute requiredRole="franchisee">
                  <ProfilePage />
                </ProtectedRoute>
              ),
            },
            {
              path: "settings",
              element: (
                <ProtectedRoute requiredRole="franchisee">
                  <SettingsPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "notifications",
              element: (
                <ProtectedRoute requiredRole="franchisee">
                  <NotificationsPage />
                </ProtectedRoute>
              ),
            },
          ],
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
              ),
            },
            {
              path: "pending-users",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <PendingUsers />
                </ProtectedRoute>
              ),
            },
            {
              path: "pending-users/:id",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <PendingUserDetail />
                </ProtectedRoute>
              ),
            },
            {
              path: "users",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <AdminUserManagement />
                </ProtectedRoute>
              ),
            },
            {
              path: "add-franchisee",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <AddFranchisee />
                </ProtectedRoute>
              ),
            },
            {
              path: "add-user",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <AddUsers />
                </ProtectedRoute>
              ),
            },
            {
              path: "franchisees",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <FranchiseeManagement />
                </ProtectedRoute>
              ),
            },
            {
              path: "franchisees/:id/edit",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <EditFranchiseeModal />
                </ProtectedRoute>
              ),
            },
            {
              path: "content",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <div>Content Component</div>
                </ProtectedRoute>
              ),
            },
            {
              path: "profile",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <ProfilePage />
                </ProtectedRoute>
              ),
            },
            {
              path: "settings",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <SettingsPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "notifications",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <NotificationsPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "notifications-manager",
              element: (
                <ProtectedRoute requiredRole="admin">
                  <NotificationManager />
                </ProtectedRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return (
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  );
}

export default App;