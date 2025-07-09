import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import HomePage from './pages/Home';
import Signup from './pages/Signup';

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
      element: <Signup />,
    },
   
  
 
  ]);
  return <RouterProvider router={router} />;

  return (
    <>
      
    </>
  )
}

export default App
