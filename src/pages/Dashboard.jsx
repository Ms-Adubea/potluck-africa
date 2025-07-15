import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';

const Dashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (!role && userRole) {
      navigate(`/dashboard/${userRole}`, { replace: true });
    } else if (role && userRole && role !== userRole) {
      navigate(`/dashboard/${userRole}`, { replace: true });
    }
  }, [role, userRole, navigate]);

  return (
    <DashboardLayout currentRole={userRole}>
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;