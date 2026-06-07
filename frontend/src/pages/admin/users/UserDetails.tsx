import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/axios";
import AdminLayout from "../AdminLayout";

interface UserDetailsField {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    role: string;
    active: boolean;
    createdAt: string;
}

const UserDetails = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<UserDetailsField | null>(null);
    const { userId } = useParams<{ userId: string }>();
    
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [actionError, setActionError] = useState<string>("");
    
    const navigate = useNavigate();


    useEffect(() => {
        if (!localStorage.getItem("token") || localStorage.getItem("role") !== "ADMIN") {
            navigate("/login");
        }
    }, [navigate]);

    const fetchUser = async () => {
        try {
            const response = await API.get(`/admin/user/details/${userId}`);
            setUser(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to Fetch User Data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchUser();
    }, [userId]);

    const toggleUser = async () => {
        if (actionLoading) return;
        setActionError("");
        setActionLoading(true);

        try {
            const response = await API.put(`/admin/user/set/${userId}`);
            
            if (response.data && typeof response.data.active !== "undefined") {
                setUser(prev => prev ? { ...prev, active: response.data.active } : null);
            } else if (response.data && typeof response.data.isActive !== "undefined") {
                setUser(prev => prev ? { ...prev, active: response.data.isActive } : null);
            } else {
                await fetchUser();
            }
        } catch (err: any) {
            setActionError(err.response?.data?.error || "Failed to commit system profile state change.");
            setTimeout(() => {
                setActionError("");
            }, 5000);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888]">
                    Retrieving User Profiles and Permissions...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            
            <div className="mb-8">
                <button 
                    onClick={() => navigate("/admin/users")}
                    className="text-xs text-[#888888] hover:text-white transition-colors mb-2 block"
                >
                    ◀ Back to Directory Catalog
                </button>
                <h2 className="text-2xl font-semibold text-white tracking-wide">Account Administration Terminal</h2>
            </div>

            {error && !user && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm max-w-xl">
                    ⚠️ {error}
                </div>
            )}

            {actionError && (
                <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm max-w-xl">
                    ⚠️ Action Blocked: {actionError}
                </div>
            )}

            {user && (
                <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 shadow-xl max-w-4xl">
                    <div className="border-b border-[#1f1f1f] pb-4 mb-6">
                        <h3 className="text-lg font-medium text-white">System Profile Logs</h3>
                        <p className="text-sm text-[#888888] mt-0.5">Core database specifications for identifier token: <span className="font-mono text-zinc-500 text-xs select-all bg-[#0a0a0a] px-1.5 py-0.5 rounded ml-1">{user.userId}</span></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium">Full Legal Name</p>
                            <p className="text-white font-medium text-base">{user.fullName}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium">Email Address</p>
                            <p className="text-blue-300 font-medium text-base select-all">{user.email}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium">Phone Number Connection</p>
                            <p className="text-teal-400 font-medium text-base">{user.phone || "N/A"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium">Date of Birth Profile</p>
                            <p className="text-zinc-300 font-medium text-base">{user.dob || "Unregistered Entry"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium">System Hierarchy Role</p>
                            <div className="pt-1">
                                <span className={`text-xs px-3 py-1 rounded-full border font-semibold tracking-wide ${
                                    user.role === "ADMIN"
                                        ? "bg-purple-950/60 border-purple-800 text-purple-400"
                                        : "bg-zinc-800/60 border-zinc-700 text-zinc-400"
                                }`}>
                                    ⚙️ {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium mb-1.5">Account Authorization Access</p>
                            <button
                                type="button"
                                onClick={toggleUser}
                                disabled={actionLoading}
                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 focus:outline-none min-w-[150px] flex items-center justify-center shadow-lg uppercase tracking-wider border ${
                                    user.active
                                        ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40 shadow-emerald-950/10"
                                        : "bg-red-950/60 text-red-400 border-red-500/30 hover:bg-red-900/40 shadow-red-950/10"
                                } disabled:opacity-50`}
                            >
                                {actionLoading ? "Processing..." : user.active ? "● Live / Active" : "○ Frozen / Banned"}
                            </button>
                        </div>

                        <div className="space-y-1 md:col-span-2 border-t border-[#1f1f1f] pt-4 mt-2">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium">Security Registration Timestamp</p>
                            <p className="text-zinc-500 text-xs">
                                Account created on {new Date(user.createdAt).toLocaleDateString()} at {new Date(user.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default UserDetails;