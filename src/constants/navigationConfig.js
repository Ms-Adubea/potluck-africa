import React, { useState } from 'react';
import { Bell, User, Settings, LogOut, Home, ChefHat, ShoppingCart, Heart, Search, CheckCircle, BarChart3, Users, Package, Plus, Camera, Clock, DollarSign, MapPin, X } from 'lucide-react';


// Navigation configuration
const navigationConfig = {
  potchef: {
    title: 'Chef Dashboard',
    avatar: '👨‍🍳',
    navigation: [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
      { id: 'addmeal', label: 'Add Meal', icon: 'Plus' },
      { id: 'meals', label: 'My Meals', icon: 'ChefHat' },
      { id: 'orders', label: 'Orders', icon: 'ShoppingCart' },
    ]
  },
  potlucky: {
    title: 'Food Lover Dashboard',
    avatar: '🍽️',
    navigation: [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
      { id: 'browse', label: 'Browse', icon: 'Search' },
      { id: 'orders', label: 'Orders', icon: 'ShoppingCart' },
      { id: 'favorites', label: 'Favorites', icon: 'Heart' }
    ]
  },
  franchisee: {
    title: 'Franchisee Dashboard',
    avatar: '🏢',
    navigation: [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
      { id: 'approvals', label: 'Approvals', icon: 'CheckCircle' },
      { id: 'summary', label: 'Summary', icon: 'BarChart3' },
      { id: 'chefs', label: 'Chefs', icon: 'Users' }
    ]
  },
  admin: {
    title: 'Admin Dashboard',
    avatar: '⚙️',
    navigation: [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
      { id: 'users', label: 'Users', icon: 'Users' },
      { id: 'places', label: 'Places', icon: 'BarChart3' },
      { id: 'content', label: 'Content', icon: 'Package' }
    ]
  }
};

export default navigationConfig;