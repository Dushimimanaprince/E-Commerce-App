import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";
import AdminLayout from "../AdminLayout";



interface PaymentDetails {
    paymentId: string;
    amount: number;
    transactionId: string;
    createdAt: string;
    status: string;
    active: string
    order?: {
        orderId: string;
    };
}


const ViewPayments=()=>{

    const [payment,setPayment]= useState<PaymentDetails[]>([])
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

                    response= await API.get(`/admin/payments/status?status=${searchQuery}`)
                    const searchResult= response.data
                    setPayment(searchResult)
                }else{

                    response= await API.get(`/admin/payments`)
                    setPayment(response.data || [])
                }
            }catch(err:any){
                setPayment([])
                setError(err.response?.data?.error || "Failed To Fetch Payment")
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
                    <h2 className="text-2xl font-semibold text-white mb-2">Payment Catalog</h2>
                    <p className="text-sm text-[#888888]">Live directory tracking active system Payment Listing.</p>
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
                        <h3 className="text-lg font-medium text-white">All Payments Done</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#1f1f1f] text-[#888888] text-xs font-semibold uppercase tracking-wider bg-[#1a1a1a]/40">
                                    <th className="p-4">Payment ID</th>
                                    <th className="p-6">Amount</th>
                                    <th className="p-4">Transaction ID</th>
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Created At</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f1f1f]">
                                {payment.map((pay) => (
                                    <tr key={pay.paymentId} className="hover:bg-[#1a1a1a]/40 transition-colors text-sm"
                                    onClick={()=> navigate(`/admin/payment/${pay.paymentId}`)}>
                                    <td className="px-6 py-4 text-white font-medium">{pay.paymentId}</td>
                                    <td className="px-6 py-4 text-green-300">$ {pay.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-blue-300">{pay.transactionId}</td>
                                    <td className="px-6 py-4 text-zinc-400">{pay.order?.orderId}</td>
                                    <td className="px-6 py-4 text-teal-400">{new Date(pay.createdAt).toDateString()}</td>
                                    <td className="px-6 py-4">
                                                <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                                                    pay.status === "PENDING"
                                                        ? "bg-yellow-950/40 border-yellow-800/40 text-yellow-400"
                                                        : pay.status === "PAID"
                                                        ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                                                        : "bg-red-950/40 border-red-800/40 text-red-400"
                                                }`}>
                                                    {pay.status}
                                                </span>
                                    </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {payment.length === 0 && !loading && (
                    <div className="text-center py-12 text-sm text-[#555555] bg-[#141414] rounded-xl border border-[#1f1f1f] mt-4">
                        No Payment yet
                    </div>
            )}

        </AdminLayout>

    )
}

export default ViewPayments;