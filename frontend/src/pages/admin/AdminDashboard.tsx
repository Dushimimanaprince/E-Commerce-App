import  { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../../api/axios";

interface UserSummary {
    userId: string;
    fullName: string;
    email: string;
    active: boolean;
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {

                const response = await API.get("/admin/user/all");
                setUsers(response.data);
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

            <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#1f1f1f]">
                    <h3 className="text-lg font-medium text-white">System Directory Logs</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#1f1f1f] text-[#888888] text-xs font-semibold uppercase tracking-wider bg-[#1a1a1a]/40">
                                <th className="p-4">Full Name</th>
                                <th className="p-4">Email Account</th>
                                <th className="p-4">Authorization State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f1f1f]">
                            {users.slice(0, 5).map((user) => (
                                <tr key={user.userId} className="hover:bg-[#1a1a1a]/40 transition-colors text-sm">
                                    <td className="p-4 font-medium text-white">{user.fullName}</td>
                                    <td className="p-4 text-[#888888]">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.active 
                                                ? "bg-green-950 text-green-400" 
                                                : "bg-red-950 text-red-400"
                                        }`}>
                                            {user.active ? "● Active" : "● Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-6 text-center text-sm text-[#888888]">
                                        No registered profiles detected.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;