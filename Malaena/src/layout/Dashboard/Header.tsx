import { Menu, Search, User, LogOut, Home } from 'lucide-react';
import { useState } from "react";

interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
}

export function Header({ onMenuToggle, title }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#1B263B] border-b border-[#415A77] h-16 flex items-center justify-between px-6 relative">
      <div className="flex items-center">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-[#415A77] transition-colors mr-4"
          title="Toggle menu"
        >
          <Menu className="w-5 h-5 text-[#E0E1DD]" />
        </button>
        <h2 className="text-xl font-semibold text-[#E0E1DD]">{title}</h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#778DA9]" />
          <input
            type="text"
            placeholder="Search courses..."
            className="bg-[#0D1B2A] border border-[#415A77] rounded-lg pl-10 pr-4 py-2 text-sm text-[#E0E1DD] placeholder-[#778DA9] focus:outline-none focus:border-[#778DA9] transition-colors w-64"
          />
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full bg-[#415A77] hover:bg-[#778DA9] transition-colors flex items-center justify-center"
            title="User menu"
          >
            <User className="w-5 h-5 text-[#E0E1DD]" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1B263B] border border-[#415A77] rounded-lg shadow-lg overflow-hidden z-50">
              <button className="flex items-center w-full px-4 py-2 text-sm text-[#E0E1DD] hover:bg-[#415A77] transition-colors">
                <User className="w-4 h-4 mr-2" /> Profile
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-[#E0E1DD] hover:bg-[#415A77] transition-colors">
                <Home className="w-4 h-4 mr-2" /> Dashboard
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
