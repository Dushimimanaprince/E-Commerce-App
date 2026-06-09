import React, { useEffect, useState } from "react";
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

interface OrderDetails {
    orderId: string;
    totalPrice: number;
    orderStatus: string;
    createdAt: string;
    updatedAt: string;
    orderItem?: OrderItemDetails[];
}

interface PaymentData {
    microfinanceUsername: string;
}

const OrderPage = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState<string>("");
    const [order, setOrder] = useState<OrderDetails[]>([]);
    const [details, setDetails] = useState<OrderDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
    const [showPayment, setShowPayment] = useState<boolean>(false);
    const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
    const [showOrder, setShowOrder] = useState<boolean>(false);
    const [paymentError, setPaymentError] = useState<string>("");
    const [paymentSuccess, setPaymentSuccess] = useState<string>("");
    const [formData, setFormData] = useState<PaymentData>({
        microfinanceUsername: ""
    });
    const [selectOrderId, setSelectedOrderId] = useState<string>("");
    
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchOrder = async () => {
        try {
            const response = await API.get(`/orders`);
            setOrder(response.data.content || response.data || []);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchOrder();
    }, []);

    useEffect(() => {
        if (!selectOrderId) return;
        
        const fetchDetails = async () => {
            setDetailsLoading(true);
            try {
                const response = await API.get(`/orders/${selectOrderId}`);
                setDetails(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to load order item details");
            } finally {
                setDetailsLoading(false);
            }
        };

        fetchDetails();
    }, [selectOrderId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPaymentError("");
        setPaymentSuccess("");
        setPaymentLoading(true);

        try {
            const response = await API.post(`/payments/initiate/${selectOrderId}`, formData);
            setPaymentSuccess(response.data?.message || "Payment request sent successfully!");
            fetchOrder();
            setTimeout(() => {
                setShowPayment(false);
                setPaymentSuccess("");
            }, 5000);
        } catch (err: any) {
            setPaymentError(err.response?.data?.error);
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleDelete = async (orderId: string) => {
        try {
            const response = await API.delete(`/orders/cancel/${orderId}`);
            setSuccess(response.data?.message || "Order canceled successfully!");
            fetchOrder();
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (err: any) {
            setError(err.response?.data?.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <UserNavbar />
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888]">
                    Syncing Order Items...
                </div>
            </div>
        );
    }

    if (order.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <UserNavbar />
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888] text-base font-medium">
                    📦 Your Marketplace Order List is Empty
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
                        <h2 className="text-2xl font-semibold text-white mb-1">Order Console</h2>
                        <p className="text-sm text-[#888888]">Track, audit, and finalize payment parameters for outstanding invoices.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm max-w-xl">
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6 text-sm max-w-xl">
                        ✅ Success: {success}
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
                                    <th className="px-6 py-4">Products Name</th>
                                    <th className="px-6 py-4">Total Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date Mapped</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f1f1f]">
                                {order.map((o) => (
                                    <tr key={o.orderId} className="hover:bg-[#1a1a1a]/20 transition-colors text-sm">
                                        <td className="px-6 py-4 text-blue-400 font-medium max-w-xs truncate" title={o.orderItem?.map(item => item.product?.productName).join(", ")}>
                                            {o.orderItem && o.orderItem.length > 0 
                                                ? o.orderItem.map(item => item.product?.productName).join(", ")
                                                : "No Products Mapped"
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-emerald-400 font-mono font-bold">
                                            {o.totalPrice ? `${o.totalPrice.toLocaleString()} RWF` : "0 RWF"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                                                o.orderStatus === "PENDING"
                                                    ? "bg-yellow-950/40 border-yellow-800/40 text-yellow-400"
                                                    : o.orderStatus === "PAID"
                                                    ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                                                    : "bg-red-950/40 border-red-800/40 text-red-400"
                                            }`}>
                                                {o.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 text-xs font-medium">
                                            {o.updatedAt ? new Date(o.updatedAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrderId(o.orderId);
                                                        setShowOrder(true);
                                                    }}
                                                    className="text-xs px-3 py-1.5 rounded-lg border bg-blue-900/20 border-blue-800/50 text-blue-400 hover:bg-blue-900/40 transition-all"
                                                >
                                                    View Details
                                                </button>
                                                {o.orderStatus === "PENDING" && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrderId(o.orderId);
                                                                setFormData({ microfinanceUsername: "" });
                                                                setShowPayment(true);
                                                            }}
                                                            className="text-xs px-3 py-1.5 rounded-lg border bg-yellow-900/20 border-yellow-800/50 text-yellow-400 hover:bg-yellow-900/40 transition-all"
                                                        >
                                                            Purchase Order
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(o.orderId)}
                                                            className="text-xs px-3 py-1.5 rounded-lg border bg-red-900/20 border-red-700/50 text-red-400 hover:bg-red-900/40 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
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
                                    <p className="text-xs text-[#888888] font-mono mt-1">ID: {details?.orderId}</p>
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
                            ) : details ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-[#1f1f1f]">
                                        <div>
                                            <p className="text-[10px] text-[#888888] uppercase tracking-wider font-bold">Transaction Status</p>
                                            <p className="text-yellow-400 font-bold text-sm mt-0.5">{details.orderStatus}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#888888] uppercase tracking-wider font-bold">Aggregated Gross Value</p>
                                            <p className="text-emerald-400 font-mono font-bold text-sm mt-0.5">
                                                {details.totalPrice?.toLocaleString()} RWF
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
                                                    {details.orderItem?.map((item) => (
                                                        <tr key={item.orderItemId} className="text-zinc-300">
                                                            <td className="p-3 font-medium text-white">{item.product?.productName || "Catalog Reference Cleared"}</td>
                                                            <td className="p-3 font-mono">{item.price.toLocaleString()} RWF</td>
                                                            <td className="p-3 font-bold text-purple-400">{item.quantity}</td>
                                                            <td className="p-3 text-right font-mono text-emerald-400">
                                                                {(item.price * item.quantity).toLocaleString()} RWF
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-zinc-500 text-sm">No structured entity response mapped to this lookup index.</div>
                            )}
                        </div>
                    </div>
                )}

                {showPayment && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-md shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Payment Portal</h2>
                                <button 
                                    onClick={() => setShowPayment(false)}
                                    className="text-[#888888] hover:text-white text-xl focus:outline-none"
                                >
                                    ✕
                                </button>
                            </div>

                            {paymentError && (
                                <div className="bg-red-900/30 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm">
                                    ⚠️ {paymentError}
                                </div>
                            )}

                            {paymentSuccess && (
                                <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-4 text-sm">
                                    ✅ {paymentSuccess}
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handlePayment}>
                                <div>
                                    <label className="block text-xs font-medium text-[#888888] mb-1.5 uppercase tracking-wider">Add Micro-Finance Username</label>
                                    <input 
                                        type="text" 
                                        name="microfinanceUsername" 
                                        value={formData.microfinanceUsername}
                                        onChange={handleChange}
                                        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-[#e5e5e5] focus:outline-none focus:border-gray-600 transition-colors"
                                        required 
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={paymentLoading}
                                    className="w-full bg-blue-600 text-white font-semibold rounded-xl p-3 hover:bg-blue-500 transition-colors mt-2 disabled:opacity-45"
                                >
                                    {paymentLoading ? "Buying..." : "Buy"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderPage;