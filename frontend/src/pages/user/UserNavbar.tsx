import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

interface UserDetails {
    userId: string;
    fullName: string;
}

export const UserNavbar = () => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;
            try {
                const response = await API.get("/user/me");
                setUser(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to Fetch User Details");
            }
        };
        fetchUser();
    }, [token]);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/login");
    };

    const navigationLinks = [
        { name: "Home", path: "/", icon: "🏠" },
        ...(user ? [
            { name: "Cart", path: "/user/cart", icon: "🛒" },
            { name: "Orders", path: "/user/orders", icon: "📦" },
            { name: "Payment", path: "/payment", icon: "💳" }
        ] : [])
    ];

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <nav className="bg-[#141414] border-b border-[#1f1f1f] px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto">
                <div 
                    className="font-black tracking-wider text-xl uppercase cursor-pointer text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent self-start sm:self-auto" 
                    onClick={() => navigate("/")}
                >
                    Marketplace
                </div>
                
                <div className="flex items-center justify-start gap-6 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
                    {navigationLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`flex items-center gap-2 text-base font-bold tracking-wide transition-all duration-200 uppercase whitespace-nowrap px-1 py-1 border-b-2 ${
                                    isActive 
                                        ? "text-blue-500 border-blue-500" 
                                        : "text-gray-400 border-transparent hover:text-white"
                                }`}
                            >
                                <span className="text-lg">{link.icon}</span>
                                <span>{link.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="w-full md:w-auto flex justify-end items-center border-t border-[#1f1f1f] md:border-none pt-4 md:pt-0">
                {user ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <div className="flex items-center gap-4 bg-[#0a0a0a] border border-[#1f1f1f] pl-3 pr-4 py-2 rounded-full shadow-inner w-full sm:w-auto">
                            <div className="w-9 h-9 rounded-full bg-blue-600 border border-blue-400/30 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
                                {getInitials(user.fullName)}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-white truncate leading-tight">
                                    {user.fullName}
                                </span>
                                <span className="text-[10px] font-mono text-gray-500 truncate mt-0.5">
                                    @{user.fullName.toLowerCase().replace(/\s+/g, "")}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout} 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/20 border border-red-900/30 px-4 py-2.5 rounded-full hover:bg-red-950/50 hover:text-red-300 transition-all duration-200 shadow-md focus:outline-none"
                        >
                            <span className="text-sm">🛑</span>
                            <span>Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate("/login")} 
                        className="w-full sm:w-auto text-sm bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-blue-600/10 uppercase"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};