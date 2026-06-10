import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// 1. Update interfaces to handle optional nested sub-menus
interface SubMenuItem {
    name: string;
    path: string;
}

interface SidebarItem {
    name: string;
    path?: string; 
    icon: string;
    subItems?: SubMenuItem[]; 
}

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const navigate= useNavigate()
    
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
        Products: true 
    });

    useEffect (()=>{

        if(!localStorage.getItem("token")){
            navigate("/login")
            return
        }else if(localStorage.getItem("role") != "ADMIN"){
            navigate("/login")
            return
        }

    } , [navigate])

    const menuItems: SidebarItem[] = [
        { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
        { 
            name: "Products", 
            icon: "📦", 
            subItems: [
                { name: "Add Product", path: "/admin/product/add" },
                { name: "View Products", path: "/admin/product/view" }
            ]
        },
        { 
            name: "Categories", 
            icon: "🧰", 
            subItems: [
                { name: "Add Category", path: "/admin/category/add" },
                { name: "View Categories", path: "/admin/category/view" }
            ]
        },
        { name: "Users Management", path: "/admin/users/view", icon: "👥" },  
        { name: "Payments", path: "/admin/payment", icon: "💳" },  
        { name: "System History Logs", path: "/admin/history", icon: "📜" },
    ];

    const toggleMenu = (menuName: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const displayRole = (localStorage.getItem("role"))

    if(displayRole != "ADMIN"){
        navigate("/login")
        return
    }

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
                            🛡️ Admin Panel
                        </h1>
                    </div>

                    <nav className="p-4 space-y-1">
                        {menuItems.map((item) => {
                            const hasSubItems = !!item.subItems;
                            const isExpanded = !!expandedMenus[item.name];
                            const isActiveParent = item.path ? location.pathname === item.path : false;

                            if (!hasSubItems) {

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path!}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                            isActiveParent
                                                ? "bg-blue-900 text-white shadow-lg shadow-blue-950/50"
                                                : "text-[#888888] hover:text-[#e5e5e5] hover:bg-[#1c1c1c]"
                                        }`}
                                    >
                                        <span className="text-base">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                );
                            }

                            return (
                                <div key={item.name} className="space-y-1">
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-[#888888] hover:text-[#e5e5e5] hover:bg-[#1c1c1c] transition-all focus:outline-none whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-base">{item.icon}</span>
                                            {item.name}
                                        </div>
                                        <span className={`text-xs transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
                                            ▶
                                        </span>
                                    </button>

                                    <div 
                                        className={`pl-9 space-y-1 overflow-hidden transition-all duration-300 max-h-0 ${
                                            isExpanded ? "max-h-40 opacity-100 mt-1" : "opacity-0"
                                        }`}
                                        style={{ maxHeight: isExpanded ? "200px" : "0px" }}
                                    >
                                        {item.subItems!.map((sub) => {
                                            const isActiveSub = location.pathname === sub.path;
                                            return (
                                                <Link
                                                    key={sub.path}
                                                    to={sub.path}
                                                    className={`block px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                                                        isActiveSub
                                                            ? "text-white bg-[#1f1f1f] border-l-2 border-blue-500"
                                                            : "text-[#666666] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                                                    }`}
                                                >
                                                    {sub.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                </div>


                <div className="p-4 border-t border-[#1f1f1f] overflow-hidden space-y-3">
                    <div className="px-4 py-2 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex items-center justify-between whitespace-nowrap">
                        <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">Role</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/50 uppercase">
                            🛡️ {displayRole}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all whitespace-nowrap focus:outline-none"
                    >
                        <span>🔒</span> Sign Out
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