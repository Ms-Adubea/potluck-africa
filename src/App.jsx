import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import HomePage from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PotchefOnboarding from './components/onboarding/PotchefOnboarding';

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
   
  
 
  ]);
  return <RouterProvider router={router} />;

  return (
    <>
      
    </>
  )
}

export default App
