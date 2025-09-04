import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { coursesData } from '../../data/coursesData';
import { lessonsData } from '../../data/lessonsData';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path === '/categories') return 'categories';
    if (path.startsWith('/categories/')) return 'courses';
    if (path.startsWith('/lesson/')) return 'lesson';
    return 'dashboard';
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const pathParts = path.split('/');

    if (path === '/') return 'Dashboard';
    if (path === '/categories') return 'Browse Categories';
    
    if (path.startsWith('/categories/')) {
      const categoryId = pathParts[2];
      return coursesData[categoryId]?.name || 'Courses';
    }
    
    if (path.startsWith('/lesson/')) {
      const courseId = pathParts[2];
      return lessonsData[courseId]?.title || 'Lesson';
    }
    
    return 'Dashboard';
  };

  const currentView = getCurrentView();
  const isLessonView = currentView === 'lesson';

  if (isLessonView) {
    // Lesson viewer takes full screen without sidebar/header
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar}
        currentView={currentView}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <Header 
          onMenuToggle={toggleSidebar}
          title={getPageTitle()}
        />
        
        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}