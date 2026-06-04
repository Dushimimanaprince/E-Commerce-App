import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from 'lucide-react';

interface SidebarItem {
    name: string;
    path: string;
    icon: string;
}

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    
    const [isOpen, setIsOpen] = useState<boolean>(true);
    
    const menuItems: SidebarItem[] = [
        { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
        { name: "Products", path: "/admin/products", icon: "📦" },
        { name: "Users Management", path: "/admin/users", icon: "👥" },
        { name: "System History Logs", path: "/admin/history", icon: "📜" },
    ];
    const displayRole= localStorage.getItem("role") 

    if(!displayRole){
        window.location.href = "/login";
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] relative">
            

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-20 p-2 bg-[#141414] border border-[#1f1f1f] rounded-lg text-white hover:bg-[#1c1c1c] transition-colors focus:outline-none"
            >
                {isOpen ? "◀" : "☰"} 
            </button>

            <aside 
                className={`bg-[#141414] border-r border-[#1f1f1f] flex flex-col justify-between fixed h-full z-10 transition-all duration-300 ease-in-out ${
                    isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="p-6 border-b border-[#1f1f1f] pl-16">
                        <h1 className="text-xl font-bold text-white tracking-wider whitespace-nowrap">
                            🛡️ Admin Console
                        </h1>
                    </div>

                    <nav className="p-4 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                        isActive
                                            ? "bg-blue-900 text-white shadow-lg shadow-blue-950/50"
                                            : "text-[#888888] hover:text-[#e5e5e5] hover:bg-[#1c1c1c]"
                                    }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t px-1 border-[#1f1f1f] overflow-hidden">

                    <div className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex items-center justify-between whitespace-nowrap">
                        <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">Role</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/50 uppercase">
                            {displayRole}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all whitespace-nowrap focus:outline-none group"
                    >
                        
                        <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>


            <main 
                className={`p-8 min-h-screen transition-all duration-300 ease-in-out ${
                    isOpen ? "ml-64" : "ml-0 pt-20"
                }`}
            >
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;