import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import HomePage from './pages/Home';

function App() {
    
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
   
  
 
  ]);
  return <RouterProvider router={router} />;

  return (
    <>
      
    </>
  )
}

export default App
