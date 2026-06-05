import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import API from "../../../api/axios";


interface ProductDetailsData {
    productId: string;
    productName: string;
    description: string;
    price: number;
    quantity: number;
    active: boolean;
    imageUrl: string;
    category?: {
        categoryName: string;
    };
}

const ProductDetails = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductDetailsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    // --- NEW EDIT MODE STATE TRACKERS ---
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editForm, setEditForm] = useState({
        productName: "",
        description: "",
        price: "",
        quantity: "",
        imageUrl: ""
    });

    useEffect(() => {
        if (localStorage.getItem("role") !== "ADMIN") {
            navigate("/login");
        }
    }, [navigate]);

    const fetchProductDetails = async () => {
        try {
            const response = await API.get(`/products/details/${productId}`);
            setProduct(response.data);
            // Pre-seed form state with existing entity fields
            setEditForm({
                productName: response.data.productName,
                description: response.data.description || "",
                price: response.data.price.toString(),
                quantity: response.data.quantity.toString(),
                imageUrl: response.data.imageUrl || ""
            });
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to load product details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchProductDetails();
    }, [productId]);

    // Visiblity active/inactive toggle engine
    const handleStatusToggle = async () => {
        if (!product || actionLoading) return;
        setActionLoading(true);
        setError("");
        try {
            const response = await API.put(`/admin/product/${productId}/toggle-active`);
            setProduct({
                ...product,
                active: response.data.active !== undefined ? response.data.active : response.data.isActive
            });
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to alter configuration status.");
        } finally {
            setActionLoading(false);
        }
    };

    // --- NEW: HANDLES FORM CHANGES SUBMISSION ---
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setError("");

        try {
            // Hits your exact update endpoint: /admin/update/products/{productId}
            await API.put(`/admin/update/products/${productId}`, {
                productName: editForm.productName,
                description: editForm.description,
                price: editForm.price,
                quantity: editForm.quantity,
                imageUrl: editForm.imageUrl
            });

            setIsEditing(false);
            await fetchProductDetails(); // Re-sync local values from server db arrays
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to update product settings.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888]">
                    Syncing product configuration parameters...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <button 
                        onClick={() => navigate("/admin/products")}
                        className="text-xs text-[#888888] hover:text-white transition-colors mb-2 block"
                    >
                        ◀ Back to Stock Catalog
                    </button>
                    <h2 className="text-2xl font-semibold text-white tracking-wide">
                        {isEditing ? "Modify Product Specifications" : "Product Inventory Profile"}
                    </h2>
                </div>

                {/* EDIT/CANCEL CONSOLE ACTIONS KEY TOGGLE */}
                {product && (
                    <button
                        onClick={() => {
                            setError("");
                            setIsEditing(!isEditing);
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#1f1f1f] bg-[#141414] text-gray-300 hover:text-white transition-all self-start sm:self-center"
                    >
                        {isEditing ? "✕ Cancel Changes" : "✏️ Edit Product details"}
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {product && (
                <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT PANEL: IMAGE BLOCK FRAMEWORK */}
                    <div className="lg:col-span-5 bg-[#141414] border border-[#1f1f1f] rounded-2xl overflow-hidden p-4 shadow-xl space-y-4">
                        <div className="w-full h-80 bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#1f1f1f]">
                            <img 
                                src={isEditing ? editForm.imageUrl : product.imageUrl} 
                                alt={product.productName} 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {isEditing && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-[#888888]">Asset Image Destination URL</label>
                                <input
                                    type="text"
                                    value={editForm.imageUrl}
                                    onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#555555]"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* RIGHT PANEL: CORE VALUE METRICS DATA FIELDS */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Primary Descriptive Data Blocks */}
                        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 shadow-xl space-y-4">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/50 border border-blue-900/40 px-2.5 py-0.5 rounded-md">
                                    {product.category?.categoryName || "Unassigned Category Registry"}
                                </span>
                                
                                {isEditing ? (
                                    <div className="mt-4 space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-[#888888]">Product System SKU Name</label>
                                            <input
                                                type="text"
                                                value={editForm.productName}
                                                onChange={(e) => setEditForm({...editForm, productName: e.target.value})}
                                                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#555555]"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-[#888888]">Comprehensive Description Log</label>
                                            <textarea
                                                rows={4}
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#555555] resize-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-white mt-2 tracking-wide">{product.productName}</h1>
                                        <p className="text-sm text-[#888888] leading-relaxed border-t border-[#1f1f1f] pt-4">
                                            {product.description || "No descriptions mapped to this catalog item identifier."}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Numeric Financial Configurations Blocks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            {/* Valuation Config */}
                            <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-5 shadow-md space-y-1.5">
                                <span className="text-xs text-[#888888] font-medium uppercase tracking-wide block">Financial Valuation</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                                        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-2 text-sm text-emerald-400 font-semibold focus:outline-none focus:border-[#555555]"
                                        required
                                    />
                                ) : (
                                    <p className="text-3xl font-bold text-emerald-400">{product.price.toLocaleString()} <span className="text-sm font-normal text-[#888888]">RWF</span></p>
                                )}
                            </div>

                            {/* Quantity Config */}
                            <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-5 shadow-md space-y-1.5">
                                <span className="text-xs text-[#888888] font-medium uppercase tracking-wide block">In-Stock Volume Counters</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editForm.quantity}
                                        onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                                        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-2 text-sm text-white font-semibold focus:outline-none focus:border-[#555555]"
                                        required
                                    />
                                ) : (
                                    <p className="text-3xl font-bold text-white">{product.quantity} <span className="text-sm font-normal text-[#888888]">Units</span></p>
                                )}
                            </div>
                        </div>

                        {/* SUBMIT ACTIONS EXECUTION DRAWER BLOCK */}
                        {isEditing ? (
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all shadow-lg disabled:opacity-50"
                            >
                                {actionLoading ? "Saving Updates..." : "💾 Commit Configuration Overrides"}
                            </button>
                        ) : (
                            /* THE ORIGINAL LIVE VISIBILITY TOGGLE SWITCH */
                            <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 shadow-xl flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-medium text-white mb-1">Catalog Visibility Status</h3>
                                    <p className="text-xs text-[#888888]">Control visibility configuration status indicators manually.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleStatusToggle}
                                    disabled={actionLoading}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none min-w-[140px] flex items-center justify-center shadow-lg ${
                                        product.active
                                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/40"
                                            : "bg-red-950 text-red-400 border border-red-500/30 hover:bg-red-900/40"
                                    } disabled:opacity-50`}
                                >
                                    {actionLoading ? "Processing..." : product.active ? "● Live / Active" : "○ Hidden / Locked"}
                                </button>
                            </div>
                        )}

                    </div>
                </form>
            )}
        </AdminLayout>
    );
};

export default ProductDetails;