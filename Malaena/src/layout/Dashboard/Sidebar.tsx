import { User, Settings, LogOut, BookOpen, Home, BarChart3, Grid3X3 } from 'lucide-react';
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: string;
  onNavigate: (view: 'dashboard' | 'categories') => void;
}

export function Sidebar({ isOpen, onToggle, currentView, onNavigate }: SidebarProps) {
  const menuItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: 'Dashboard', 
      view: 'dashboard' as const,
      active: currentView === 'dashboard' 
    },
    { 
      icon: <Grid3X3 className="w-5 h-5" />, 
      label: 'Browse Categories', 
      view: 'categories' as const,
      active: currentView === 'categories' || currentView === 'courses' 
    },
    { 
      icon: <BarChart3 className="w-5 h-5" />, 
      label: 'Progress', 
      view: null,
      active: false 
    },
    { 
      icon: <Settings className="w-5 h-5" />, 
      label: 'Settings', 
      view: null,
      active: false 
    },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      <div className={`
        fixed top-0 left-0 h-full bg-[#1B263B] border-r border-[#415A77] z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#415A77]">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#E0E1DD]">EduVerse</h1>
                <p className="text-xs text-[#778DA9]">3D Learning</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => item.view && onNavigate(item.view)}
                    className={`
                    w-full flex items-center px-4 py-3 rounded-lg transition-colors text-left
                    ${item.active 
                      ? 'bg-[#415A77] text-[#E0E1DD]' 
                      : 'text-[#778DA9] hover:bg-[#415A77] hover:text-[#E0E1DD]'
                    }
                  `}>
                    {item.icon}
                    <span className="ml-3 font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-[#415A77]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#415A77] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#E0E1DD]" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[#E0E1DD]">Ahmed Hassan</p>
                <p className="text-xs text-[#778DA9]">Student</p>
              </div>
            </div>
            <button className="w-full flex items-center px-4 py-2 rounded-lg text-[#778DA9] hover:bg-[#415A77] hover:text-[#E0E1DD] transition-colors">
              <LogOut className="w-4 h-4 mr-3" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}