import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/axios";
import AdminLayout from "../AdminLayout";


interface OrderItemDetails {
    orderItemId: string;
    quantity: number;
    price: number;
    product?: {
        productId: string;
        productName: string;
    };
}

interface OrderDetails {
    orderId: string;
    totalPrice: number;
    orderStatus: string;
    createdAt: string;
    updatedAt: string;
    orderItem?: OrderItemDetails[];
    payment?:{
    
        paymentId: string;
        amount: number;
        transactionId: string;
        createdAt: string;
        status: string;
        active: string;
        }

    user?:{
        userId: string
        fullName: string;
    }
}

const PaymentDetails = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [order,setOrder]= useState<OrderDetails| null>(null)
    const {paymentId } = useParams<{ paymentId: string }>();
    
    
    const navigate = useNavigate();


    useEffect(() => {
        if (!localStorage.getItem("token") || localStorage.getItem("role") !== "ADMIN") {
            navigate("/login");
        }
    }, [navigate]);

    const fetchPayment = async () => {
        try {
            const response = await API.get(`/admin/payments/details/${paymentId}`);
            setOrder(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to Fetch Payment Data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (paymentId) fetchPayment();
    }, [paymentId]);


    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888]">
                    Retrieving Payment Details...
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

            {error && !order&& (
                <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm max-w-xl">
                    ⚠️ {error}
                </div>
            )}



            {order && (
                <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 shadow-xl max-w-4xl">
                    <div className="border-b border-[#1f1f1f] pb-4 mb-6">
                        <h3 className="text-lg font-medium text-white">Payment Details</h3>
                        <p className="text-sm text-[#888888] mt-0.5">Payment Details specifications: <span className="font-mono text-teal-500 text-xs select-all bg-[#0a0a0a] px-1.5 py-0.5 rounded ml-1">{order.payment?.paymentId}</span></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium">Order ID</p>
                            <p className="text-white font-medium text-base">{order.orderId}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium">Order Status</p>
                            <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                                order.orderStatus === "PENDING"
                                        ? "bg-yellow-950/40 border-yellow-800/40 text-yellow-400"
                                        : order.orderStatus === "PAID"
                                        ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                                        :order.orderStatus === "PUCHASED"
                                        ? "bg-blue-950/40 border-blue-800/40 text-blue-400"
                                        : "bg-red-950/40 border-red-800/40 text-red-400"
                                }`}>
                                    {order.orderStatus}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium"> Payment Transaction ID</p>
                            <p className="text-purple-400 font-medium text-base">{order.payment?.transactionId || "N/A"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium"> User Name</p>
                            <p className="text-teal-400 font-medium text-base"
                            onClick={()=> navigate(`/admin/users/details/${order.user?.userId}`)}
                            >{order.user?.fullName || "N/A"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medCore databaseium">Payment Created At</p>
                            <p className="text-zinc-300 font-medium text-base">{new Date(order.payment?.createdAt).toDateString()}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium">Payment Status </p>
                            <div className="pt-1">
                                            <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                                                order.payment?.status === "PENDING"
                                                        ? "bg-yellow-950/40 border-yellow-800/40 text-yellow-400"
                                                        : order.payment?.status === "PAID"
                                                        ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                                                        : "bg-red-950/40 border-red-800/40 text-red-400"
                                                }`}>
                                                    {order.payment?.status}
                                            </span>
                            </div>
                        </div>
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-[#141414] border-b border-[#1f1f1f] text-zinc-400 font-bold">
                                    <th className="p-3">Product Name</th>
                                    <th className="p-3">Unit Cost</th>
                                    <th className="p-3">Qty</th>
                                    <th className="p-3 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f1f1f]">
                                {order.orderItem && order.orderItem.length > 0 ? (
                                    order.orderItem.map((item) => (
                                        <tr key={item.orderItemId} className="text-zinc-300 hover:bg-[#1a1a1a]/10">
                                            <td className="p-3 font-medium text-blue-400">
                                                {item.product?.productName || "Catalog Reference Cleared"}
                                            </td>
                                            <td className="p-3 font-mono">$ {item.price?.toLocaleString()}</td>
                                            <td className="p-3 font-bold text-purple-400">{item.quantity}</td>
                                            <td className="p-3 text-right font-mono text-emerald-400">
                                            $ {(item.price * item.quantity).toLocaleString()}
                                            </td>
                                        </tr>
                                    
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-zinc-500 font-mono">
                                            No linked item metrics mapped to this invoice payload.
                                        </td>
                                    </tr>
                                )} 
                            </tbody>
                        </table>                       

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium ">Payment Activity</p>
                            <p className={`py-2 rounded-xl text-xs font-bold transition-all duration-200 focus:outline-none min-w-[150px] flex items-center justify-center shadow-lg uppercase tracking-wider border ${
                                    order.payment?.active
                                        ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40 shadow-emerald-950/10"
                                        : "bg-red-950/60 text-red-400 border-red-500/30 hover:bg-red-900/40 shadow-red-950/10"
                                } `}>
                                    {order.payment?.active? "● Active" : "● Inactive"}
                                </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-[#888888] uppercase tracking-wider font-medium">Order Created At</p>
                            <p className="text-zinc-300 font-medium text-base">{new Date(order.createdAt).toDateString()}</p>
                        </div>


                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default PaymentDetails;