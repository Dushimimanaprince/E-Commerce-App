import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { UserNavbar } from "../user/UserNavbar";

interface OrderItemDetails {
    orderItemId: string;
    quantity: number;
    price: number;
    product?: {
        productId: string;
        productName: string;
    };
}

interface PaymentDetails {
    paymentId: string;
    amount: number;
    transactionId: string;
    createdAt: string;
    status: string;
    order?: {
        orderId: string;
        totalPrice: number;
        orderStatus: string;
        createdAt: string;
        updatedAt: string;
        orderItem?: OrderItemDetails[];
    };
}

const Payment = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [payment, setPayment] = useState<PaymentDetails[]>([]);
    const [showOrder, setShowOrder] = useState<boolean>(false);
    const [details, setShowDetails] = useState<PaymentDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string>("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchPayments = async () => {
        try {
            const response = await API.get(`/payments`);
            const cleanArray = Array.isArray(response.data)
                ? response.data
                : (response.data?.content || []);
            setPayment(cleanArray);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to load payments history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchPayments();
    }, []);

    const handleOpenPaymentDetails = async (orderId: string) => {
        if (!orderId) {
            setError("No linked order reference found for this payment record.");
            return;
        }
        
        setDetailsLoading(true);
        setShowOrder(true);
        try {

            const response = await API.get(`/orders/${orderId}`);
            
            setShowDetails({
                paymentId: "",
                amount: response.data.totalPrice || 0,
                transactionId: "",
                createdAt: "",
                status: response.data.orderStatus || "",
                order: response.data 
            });
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to load order relation matrices");
        } finally {
            setDetailsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <UserNavbar />
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888]">
                    Syncing Payment History...
                </div>
            </div>
        );
    }

    if (payment.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <UserNavbar />
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888] text-base font-medium">
                    💳 Your History is Empty ! Purchase Item First. 
                </div>
            </div>
        );
    }  
    
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <UserNavbar />
            
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-1">Payment History</h2>
                        <p className="text-sm text-[#888888]">Track All Payment History Status.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm max-w-xl">
                        ⚠️ {error}
                    </div>
                )}

                <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-[#1f1f1f]">
                        <h3 className="text-lg font-medium text-white">Active Purchases & Invoices</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#1f1f1f] text-[#888888] text-xs font-semibold uppercase tracking-wider bg-[#1a1a1a]/40">
                                    <th className="px-6 py-4">Payment ID</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created At</th>
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f1f1f]">
                                {Array.isArray(payment) && payment.length > 0 ? (
                                    payment.map((p) => (
                                        <tr key={p.paymentId} className="hover:bg-[#1a1a1a]/20 transition-colors text-sm">
                                            <td className="px-6 py-4 text-blue-400 font-mono text-xs max-w-xs truncate">{p.paymentId}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-mono font-bold">
                                                {p.amount ? `${p.amount.toLocaleString()} RWF` : "0 RWF"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                                                    p.status === "PENDING"
                                                        ? "bg-yellow-950/40 border-yellow-800/40 text-yellow-400"
                                                        : p.status === "PAID"
                                                        ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                                                        : "bg-red-950/40 border-red-800/40 text-red-400"
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400 text-xs font-medium">
                                                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-blue-400 font-mono text-xs max-w-xs truncate">{p.transactionId}</td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenPaymentDetails(p.order?.orderId || "")}
                                                    className="text-xs px-3 py-1.5 rounded-lg border bg-blue-900/20 border-blue-800/50 text-blue-400 hover:bg-blue-900/40 transition-all"
                                                >
                                                    View Details
                                                </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-zinc-500 text-xs font-mono">
                                            No verified records parsed. Struct array state hydration mismatch detected.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showOrder && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-6 border-b border-[#1f1f1f] pb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Invoice Blueprint Overview</h2>
                                    <p className="text-xs text-[#888888] font-mono mt-1">Order Reference ID: {details?.order?.orderId || "N/A"}</p>
                                </div>
                                <button 
                                    onClick={() => setShowOrder(false)}
                                    className="text-[#888888] hover:text-white text-xl focus:outline-none"
                                >
                                    ✕
                                </button>
                            </div>

                            {detailsLoading ? (
                                <div className="text-center py-6 text-zinc-500 text-sm">Loading structural nested relations...</div>
                            ) : details?.order ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-[#1f1f1f]">
                                        <div>
                                            <p className="text-[10px] text-[#888888] uppercase tracking-wider font-bold">Transaction Status</p>
                                            <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded mt-1 border ${
                                                details.order.orderStatus === "PENDING"
                                                    ? "bg-yellow-950/40 border-yellow-800/40 text-yellow-400"
                                                    : "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                                            }`}>
                                                {details.order.orderStatus}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#888888] uppercase tracking-wider font-bold">Aggregated Gross Value</p>
                                            <p className="text-emerald-400 font-mono font-bold text-sm mt-1">
                                                {details.order.totalPrice?.toLocaleString()} RWF
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-[#888888] uppercase tracking-wider">Itemized Breakdowns</p>
                                        <div className="border border-[#1f1f1f] rounded-xl overflow-hidden bg-[#0a0a0a]">
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
                                                    {details.order.orderItem && details.order.orderItem.length > 0 ? (
                                                        details.order.orderItem.map((item) => (
                                                            <tr key={item.orderItemId} className="text-zinc-300 hover:bg-[#1a1a1a]/10">
                                                                <td className="p-3 font-medium text-white">
                                                                    {item.product?.productName || "Catalog Reference Cleared"}
                                                                </td>
                                                                <td className="p-3 font-mono">{item.price?.toLocaleString()} RWF</td>
                                                                <td className="p-3 font-bold text-purple-400">{item.quantity}</td>
                                                                <td className="p-3 text-right font-mono text-emerald-400">
                                                                    {(item.price * item.quantity).toLocaleString()} RWF
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
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-zinc-500 text-sm py-4 text-center">
                                    ⚠️ No structured order payload mapped to this payment reference index.
                                </div>
                            )}
                        </div>
                    </div>
                )}            </main>
        </div>
    );
};

export default Payment;