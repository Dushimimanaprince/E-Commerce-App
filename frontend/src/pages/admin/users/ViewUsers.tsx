import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import API from "../../../api/axios";
import { useNavigate } from "react-router-dom";


interface UserDetails{
    
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    active: boolean;
}

const ViewUsers=()=>{

    const [users,setUsers]= useState<UserDetails[]>([])
    const [loading,setLoading]= useState<boolean>(true)
    const [error,setError]=useState<string>("")
    const [searchQuery, setSearchQuery]= useState<string>("")
    
    const navigate= useNavigate()

    useEffect (()=>{

        if(!localStorage.getItem("token")){
            navigate("/login")
            return
        }else if(localStorage.getItem("role") != "ADMIN"){
            navigate("/login")
            return
        }

    } , [navigate])

    useEffect(()=> {

        const fetchData = async () =>{
            try{

                let response;

                if(searchQuery.trim() !==""){

                    response= await API.get(`admin/user/search?userName=${searchQuery}`)
                    const searchResult= response.data
                    setUsers(searchResult)
                }else{

                    response= await API.get(`admin/user/all`)
                    setUsers(response.data || [])
                }
            }catch(err:any){
                setUsers([])
                setError(err.response?.data?.error || "Failed To Fetch Users")
                setTimeout(() => {
                    setError("");
                }, 5000);
            }finally{
                setLoading(false)
            }
        }

        const delayBouncer= setTimeout(()=>{
            fetchData();
        },300);

        return () => clearTimeout(delayBouncer)

    }, [searchQuery])

    return(

        <AdminLayout>

            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-2">Users Catalog</h2>
                    <p className="text-sm text-[#888888]">Live directory tracking active system product listings.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#555555]">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search product instances..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#e5e5e5] placeholder-[#555555] focus:outline-none focus:border-[#555555] focus:bg-[#1a1a1a] transition-all"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#555555] hover:text-white"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
                    ⚠️ {error}
                </div>
            )}

                        {loading ? (
                <div className="flex items-center justify-center min-h-[30vh] text-[#888888]">
                    Syncing catalog matrix...
                </div>
            ) : (

                <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-[#1f1f1f]">
                        <h3 className="text-lg font-medium text-white">Active Product Categories</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#1f1f1f] text-[#888888] text-xs font-semibold uppercase tracking-wider bg-[#1a1a1a]/40">
                                    <th className="p-4">User ID</th>
                                    <th className="p-4">Full Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f1f1f]">
                                {users.map((user) => (
                                    <tr key={user.userId} className="hover:bg-[#1a1a1a]/40 transition-colors text-sm"
                                    onClick={()=> navigate(`/admin/users/details/${user.userId}`)}>
                                    <td className="px-6 py-4 text-white font-medium">{user.userId}</td>
                                    <td className="px-6 py-4 text-blue-300">{user.fullName}</td>
                                    <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                                    <td className="px-6 py-4 text-teal-400">{user.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full border ${
                                            user.role=="ADMIN"
                                                ? "bg-purple-900/30 border-purple-700 text-purple-400"
                                                : "bg-zinc-800 border-zinc-700 text-zinc-400"
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className=" py-4">
                                        <span className={`text-xs px-3 py-1 rounded-full border ${
                                            user.active
                                                ? "bg-green-900/30 border-green-700 text-green-400"
                                                : "bg-red-900/30 border-red-700 text-red-400"
                                        }`}>
                                            {user.active? "● Active" : "● Inactive"}
                                        </span>
                                    </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {users.length === 0 && !loading && (
                    <div className="text-center py-12 text-sm text-[#555555] bg-[#141414] rounded-xl border border-[#1f1f1f] mt-4">
                        👥 No Users matched your query criteria.
                    </div>
            )}

        </AdminLayout>

    )
}

export default ViewUsers;