import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

interface UserDetails {
    userId: string;
    fullName: string;
}

export const UserNavbar = () => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
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

    return (
        <nav className="bg-[#141414] border-b border-[#1f1f1f] px-6 py-4 flex items-center justify-between">
            <div className="font-bold tracking-wide text-sm uppercase cursor-pointer" onClick={() => navigate("/")}>
                Marketplace
            </div>
            <div>
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-300">Hi, {user.fullName}</span>
                        <button onClick={handleLogout} className="text-xs bg-red-950/40 text-red-400 px-3 py-1.5 rounded-lg border border-red-900/30">
                            Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={() => navigate("/login")} className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold">
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};