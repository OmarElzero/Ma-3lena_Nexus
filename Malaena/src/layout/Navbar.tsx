import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

interface NavItem {
    name: string;
    path: string;
}

const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Sign Up", path: "/signup" },
];

const Nav: React.FC = () => {
    const location = useLocation();
    const [active, setActive] = useState(location.pathname);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-[#0D1B2A] mb-12 text-white   z-100 px-6 md:px-20 flex justify-between items-center shadow-md backdrop-blur-sm relative">

            <div className="flex items-center">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-[20%] md:w-[20%] transition-transform duration-300 hover:scale-105"
                />
            </div>


            <div className="hidden md:flex items-center space-x-4">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setActive(item.path)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-500 border border-white/20 ${
                            active === item.path
                                ? "text-cyan-300 bg-gray-700/30"
                                : "text-gray-300 hover:text-cyan-300 hover:bg-gray-700/30"
                        }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>


            <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="relative p-3 rounded-full bg-gradient-to-br from-gray-800/40 to-gray-900/60 shadow-lg hover:shadow-cyan-800/20 transition-all duration-500 group/github hidden md:flex"
            >
                <Github
                    size={24}
                    className="transition-all duration-500 group-hover/github:scale-110 group-hover/github:text-cyan-300"
                />

                <span className="absolute inset-0 rounded-full bg-cyan-400/20 scale-0 group-hover/github:scale-100 transition-transform duration-500"></span>

                <span className="absolute inset-0 rounded-full bg-cyan-400/10 group-hover/github:bg-cyan-400/20 blur-md transition-all duration-500"></span>
            </a>


            <button
                className="md:hidden  cursor-pointer text-white focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>


            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#0D1B2A] shadow-md flex flex-col items-center md:hidden z-50">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => {
                                setActive(item.path);
                                setMenuOpen(false);
                            }}
                            className={`w-full text-center px-5 py-3 border-b border-gray-700 transition-all duration-300 ${
                                active === item.path
                                    ? "text-cyan-300 bg-gray-700/30"
                                    : "text-gray-300 hover:text-cyan-300 hover:bg-gray-700/30"
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                    {/* GitHub Icon for mobile */}
                    <a
                        href="https://github.com/your-repo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 w-full flex justify-center bg-[#1B263B] hover:bg-[#243B55] transition-colors"
                    >
                        <Github size={24} className="text-cyan-300" />
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Nav;
