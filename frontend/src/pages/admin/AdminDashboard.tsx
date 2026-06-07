import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AdminLayout from "./AdminLayout";



interface UserSummary {
    userId: string;
    fullName: string;
    email: string;
    active: boolean;
}

interface UserDetails {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    role: string;
    active: boolean;
    createdAt: string;
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [details, setDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate()

    useEffect (()=>{

        if(!localStorage.getItem("token")){
            navigate("/login")
            return
        }else if(localStorage.getItem("role") != "ADMIN"){
            navigate("/login")
            return
        }

    } , [navigate])





    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersData, detailsData] = await Promise.all([
                    API.get("/admin/user/all"),
                    API.get("/user/me")
                ])
                setUsers(usersData.data);
                setDetails(detailsData.data)
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to sync system statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.active).length;
    const deactivatedUsers = totalUsers - activeUsers;

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888]">
                    Loading control metrics...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-2">Metrics Overview</h2>
                <p className="text-sm text-[#888888]">System diagnostics and account activations monitor.</p>
            </div>

            {error && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm">
                    ⚠️ {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-[#888888]">Total Accounts</span>
                        <span className="bg-blue-950 text-blue-400 text-xs px-2 py-1 rounded-md">System</span>
                    </div>
                    <p className="text-4xl font-bold text-white">{totalUsers}</p>
                </div>

                <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-[#888888]">Active Sessions</span>
                        <span className="bg-green-950 text-green-400 text-xs px-2 py-1 rounded-md">Live</span>
                    </div>
                    <p className="text-4xl font-bold text-green-400">{activeUsers}</p>
                </div>

                <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-[#888888]">Deactivated Accounts</span>
                        <span className="bg-red-950 text-red-400 text-xs px-2 py-1 rounded-md">Locked</span>
                    </div>
                    <p className="text-4xl font-bold text-red-400">{deactivatedUsers}</p>
                </div>
            </div>

            {details && (
                <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 shadow-xl">
                    <div className="border-b border-[#1f1f1f] pb-4 mb-6">
                        <h3 className="text-lg font-medium text-white">Admin Profile</h3>
                        <p className="text-sm text-[#888888]">Logged in account details</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider">Full Name</p>
                            <p className="text-white font-medium">{details.fullName}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider">Email</p>
                            <p className="text-white font-medium">{details.email}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider">Phone</p>
                            <p className="text-white font-medium">{details.phone}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider">Date of Birth</p>
                            <p className="text-white font-medium">{details.dob}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider">Role</p>
                            <span className="bg-blue-950 text-blue-400 text-xs px-2 py-1 rounded-md">
                                {details.role}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider">Account Status</p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                details.active
                                    ? "bg-green-950 text-green-400"
                                    : "bg-red-950 text-red-400"
                            }`}>
                                {details.active ? "● Active" : "● Inactive"}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider">Member Since</p>
                            <p className="text-white font-medium">
                                {new Date(details.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;  