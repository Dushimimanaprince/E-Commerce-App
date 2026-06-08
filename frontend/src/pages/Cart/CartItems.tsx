import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { UserNavbar } from "../user/UserNavbar";

interface ProductDetails {
    cartItemId: string;
    product?: {
        productId: string;
        productName: string;
        price: number;
    };
    quantity: number;
    createdAt: string;
}

interface EditForm {
    quantity: number;
}

const Cart = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [cart, setCart] = useState<ProductDetails[]>([]);
    const [success, setSuccess] = useState<string>("");
    const [orderLoading, setOrderLoading] = useState<boolean>(false);
    const [editSuccess, setEditSuccess] = useState<string>("");
    const [editError, setEditError] = useState<string>("");
    const [editloading, setEditLoading] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [formData, setFormData] = useState<EditForm>({
        quantity: 1
    });
    const [selectCartId, setSelectedCartId] = useState<string>("");
    
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchCart = async () => {
        try {
            const response = await API.get(`/cart`);
            const dataResults = response.data.content || response.data || [];
            setCart(dataResults);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to Load Cart Items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchCart();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: parseInt(e.target.value) || 0
        });
    };

    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEditError("");
        setEditLoading(true);
        setEditSuccess("");

        try {
            const response = await API.put(`/cart/update/${selectCartId}`, formData);
            setEditSuccess(response.data?.message || "Quantity updated!");
            setTimeout(() => {
                setShowEdit(false);
                setEditSuccess("");
            }, 1500);
            fetchCart();
        } catch (err: any) {
            setEditError(err.response?.data?.error || "Failed to update quantity");
            setTimeout(() => {
                setEditError("");
            }, 5000);
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteCart = async (cartItemId: string) => {
        try {
            const response = await API.delete(`/cart/delete/${cartItemId}`);
            setSuccess(response.data?.message || "Item removed from cart!");
            fetchCart();
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to delete item");
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    const handleSingleOrder = async (cartItemId: string) => {
        try {
            const response = await API.post(`/orders/create/cart/${cartItemId}`);
            setSuccess(response.data?.message || "Order processed successfully!");
            fetchCart();
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to complete checkout order");
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    const handleCheckoutAllItems = async () => {
        setOrderLoading(true);
        setError("");
        setSuccess("");
        try {
            const response = await API.post("/orders/create/from-cart");
            const finalAmount = response.data?.totalPrice ? ` Total: ${response.data.totalPrice.toLocaleString()} RWF` : "";
            setSuccess(`${response.data?.message || "All items ordered successfully!"}${finalAmount}`);
            fetchCart();
            setTimeout(() => {
                setSuccess("");
            }, 7000);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to checkout cart items");
            setTimeout(() => {
                setError("");
            }, 6000);
        } finally {
            setOrderLoading(false);
        }
    };

    const cartTotalAmount = cart.reduce((total, item) => {
        const itemPrice = item.product?.price || 0;
        return total + (itemPrice * item.quantity);
    }, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <UserNavbar />
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888]">
                    Syncing Cart Items...
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <UserNavbar />
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888] text-base font-medium">
                    🛒 Your Marketplace Cart is Empty
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
                        <h2 className="text-2xl font-semibold text-white mb-1">Cart Catalog</h2>
                        <p className="text-sm text-[#888888]">Review and finalize your items ready for dispatch.</p>
                    </div>
                    
                    <div className="bg-[#141414] border border-[#1f1f1f] px-5 py-4 rounded-xl flex items-center gap-6 self-start sm:self-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Estimated Total</span>
                            <span className="text-lg font-black text-emerald-400 font-mono">
                                {cartTotalAmount.toLocaleString()} RWF
                            </span>
                        </div>
                        <button
                            onClick={handleCheckoutAllItems}
                            disabled={orderLoading}
                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg transition-all shadow-lg shadow-blue-600/10 whitespace-nowrap"
                        >
                            {orderLoading ? "Processing..." : "⚡ Order All Items"}
                        </button>
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
                        <h3 className="text-lg font-medium text-white">Active Cart Items</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#1f1f1f] text-[#888888] text-xs font-semibold uppercase tracking-wider bg-[#1a1a1a]/40">
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Total Price</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f1f1f]">
                                {cart.map((c) => (
                                    <tr key={c.cartItemId} className="hover:bg-[#1a1a1a]/20 transition-colors text-sm">
                                        <td 
                                            className="px-6 py-4 text-blue-400 font-medium cursor-pointer hover:underline"
                                            onClick={() => navigate(`/products/details/${c.product?.productId}`)}
                                        >
                                            {c.product?.productName || "Unknown Catalog Product"}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 font-mono">
                                            {c.product?.price ? `${c.product.price.toLocaleString()} RWF` : "0 RWF"}
                                        </td>
                                        <td className="px-6 py-4 text-purple-400 font-semibold">{c.quantity}</td>
                                        <td className="px-6 py-4 text-emerald-400 font-mono font-medium">
                                            {c.product?.price ? `${(c.product.price * c.quantity).toLocaleString()} RWF` : "0 RWF"}
                                        </td>
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCartId(c.cartItemId);
                                                        setFormData({ quantity: c.quantity });
                                                        setShowEdit(true);
                                                    }}
                                                    className="text-xs px-3 py-1.5 rounded-lg border bg-blue-900/20 border-blue-800/50 text-blue-400 hover:bg-blue-900/40 transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleSingleOrder(c.cartItemId)}
                                                    className="text-xs px-3 py-1.5 rounded-lg border bg-emerald-900/20 border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/40 transition-all"
                                                >
                                                    Order
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCart(c.cartItemId)}
                                                    className="text-xs px-3 py-1.5 rounded-lg border bg-red-900/20 border-red-800/50 text-red-400 hover:bg-red-900/40 transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showEdit && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-md shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Update Quantity</h2>
                                <button 
                                    onClick={() => setShowEdit(false)}
                                    className="text-[#888888] hover:text-white text-xl focus:outline-none"
                                >
                                    ✕
                                </button>
                            </div>

                            {editError && (
                                <div className="bg-red-900/30 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm">
                                    ⚠️ {editError}
                                </div>
                            )}

                            {editSuccess && (
                                <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-4 text-sm">
                                    ✅ {editSuccess}
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleUpdateSubmit}>
                                <div>
                                    <label className="block text-xs font-medium text-[#888888] mb-1.5 uppercase tracking-wider">Amount</label>
                                    <input 
                                        type="number" 
                                        name="quantity" 
                                        min="1" 
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3 text-[#e5e5e5] focus:outline-none focus:border-gray-600 transition-colors"
                                        required 
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={editloading}
                                    className="w-full bg-blue-600 text-white font-semibold rounded-xl p-3 hover:bg-blue-500 transition-colors mt-2 disabled:opacity-45"
                                >
                                    {editloading ? "Updating..." : "Update Item Quantity"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;