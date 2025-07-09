// 📁 src/constants/navigationConfig.js
export const navigationConfig = {
  potchef: {
    title: 'Chef Dashboard',
    avatar: '👨‍🍳',
    navigation: [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
      { id: 'meals', label: 'My Meals', icon: 'ChefHat' },
      { id: 'orders', label: 'Orders', icon: 'ShoppingCart' },
      { id: 'profile', label: 'Profile', icon: 'User' },
      { id: 'settings', label: 'Settings', icon: 'Settings' }
    ]
  },
  potlucky: {
    title: 'Food Lover Dashboard',
    avatar: '🍽️',
    navigation: [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
      { id: 'browse', label: 'Browse Meals', icon: 'Search' },
      { id: 'orders', label: 'My Orders', icon: 'ShoppingCart' },
      { id: 'favorites', label: 'Favorites', icon: 'Heart' },
      { id: 'profile', label: 'Profile', icon: 'User' },
      { id: 'settings', label: 'Settings', icon: 'Settings' }
    ]
  },
  franchisee: {
    title: 'Franchisee Dashboard',
    avatar: '🏢',
    navigation: [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
      { id: 'approvals', label: 'Meal Approvals', icon: 'CheckCircle' },
      { id: 'summary', label: 'Daily Summary', icon: 'BarChart3' },
      { id: 'chefs', label: 'Manage Chefs', icon: 'Users' },
      { id: 'settings', label: 'Settings', icon: 'Settings' }
    ]
  },
  admin: {
    title: 'Admin Dashboard',
    avatar: '⚙️',
    navigation: [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
      { id: 'users', label: 'User Management', icon: 'Users' },
      { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
      { id: 'content', label: 'Content Management', icon: 'Package' },
      { id: 'settings', label: 'Settings', icon: 'Settings' }
    ]
  }
};