import { Menu, Bell, Search } from 'lucide-react';
interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
}
export function Header({ onMenuToggle, title }: HeaderProps) {
  return (
    <header className="bg-[#1B263B] border-b border-[#415A77] h-16 flex items-center justify-between px-6">
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
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#778DA9]" />
          <input
            type="text"
            placeholder="Search courses..."
            className="bg-[#0D1B2A] border border-[#415A77] rounded-lg pl-10 pr-4 py-2 text-sm text-[#E0E1DD] placeholder-[#778DA9] focus:outline-none focus:border-[#778DA9] transition-colors w-64"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-[#415A77] transition-colors" title="Notifications">
          <Bell className="w-5 h-5 text-[#E0E1DD]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}