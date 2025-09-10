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
    if (path === '/profile') return 'profile';
    if (path === '/setting') return 'setting'; // ✅ match route
    return 'dashboard';
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/categories') return 'Browse Categories';
    if (path.startsWith('/categories/')) return coursesData[path.split('/')[2]]?.name || 'Courses';
    if (path.startsWith('/lesson/')) return lessonsData[path.split('/')[2]]?.title || 'Lesson';
    if (path === '/profile') return 'Profile';
    if (path === '/setting') return 'Setting'; // ✅ added
    return 'Dashboard';
  };


  const currentView = getCurrentView();
  const isLessonView = currentView === 'lesson';

  if (isLessonView) {
    // Lesson viewer takes full screen without sidebar/header
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen  bg-[#0D1B2A] flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        currentView={currentView}
      />
      <div className="flex-1 lg:ml-0">
        <Header
          onMenuToggle={toggleSidebar}
          title={getPageTitle()}
        />
        <main className="p-6 ">
          {children}
        </main>
      </div>
    </div>
  );
}