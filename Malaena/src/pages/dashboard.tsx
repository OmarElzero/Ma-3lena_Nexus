import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '../components/DashboardStats';

export function Dashboard() {
  const navigate = useNavigate();

  const handleNavigateToCategories = () => {
    navigate('/categories');
  };

  return <DashboardStats onNavigateToCategories={handleNavigateToCategories} />;
}