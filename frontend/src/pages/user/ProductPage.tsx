import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";

interface ProductDetails {
    productId: string;
    productName: string;
    description: string;
    price: number;
    imageUrl: string;
    category?: {
        categoryName: string;
    };
}

interface FormData {
    quantity: string;
}

const ProductPage = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [productLoading, setProductLoading] = useState<boolean>(false);
    const [success, setShowSuccess] = useState<string>("");
    const [productError, setProductError] = useState<string>("");
    const [formData, setFormData] = useState<FormData>({
        quantity: "1"
    });
    const [product, setProduct] = useState<ProductDetails | null>(null);
    const { productId } = useParams();

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchProduct = async () => {
        try {
            const response = await API.get(`/products/details/${productId}`);
            setProduct(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to Load Product Details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchProduct();
    }, [productId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddToCart = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowSuccess("");
        setProductError("");
        setProductLoading(true);

        try {
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await API.post(`/cart/add/${productId}`, formData);
            setShowSuccess(response.data?.message || "Item added to cart successfully!");
        } catch (err: any) {
            setProductError(err.response?.data?.error || "Failed to add item to cart");
            setTimeout(() => {
                setProductError("");
            }, 5000);
        } finally {
            setProductLoading(false);
        }
    };

    const handleAddToOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowSuccess("");
        setProductError("");
        setProductLoading(true);

        try {
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await API.post(`/order/create/${productId}`, formData);
            setShowSuccess(response.data?.message || "Order processed successfully!");
        } catch (err: any) {
            setProductError(err.response?.data?.error || "Failed to process checkout order");
            setTimeout(() => {
                setProductError("");
            }, 5000);
        } finally {
            setProductLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <UserNavbar />
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888]">
                    Syncing product configuration parameters...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <UserNavbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/")}
                        className="text-xs text-[#888888] hover:text-white transition-colors mb-2 block"
                    >
                        ◀ Back to Marketplace
                    </button>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm max-w-xl">
                        ⚠️ {error}
                    </div>
                )}

                {productError && (
                    <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm max-w-xl">
                        ⚠️ Action Error: {productError}
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6 text-sm max-w-xl">
                        ✅ Success: {success}
                    </div>
                )}

                {product && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        <div className="md:col-span-5 bg-[#141414] border border-[#1f1f1f] rounded-2xl overflow-hidden p-4 shadow-xl">
                            <div className="w-full h-80 bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#1f1f1f]">
                                <img
                                    src={product.imageUrl}
                                    alt={product.productName}
                                    className="w-full h-full object-cover"
                                
                                />
                            </div>
                        </div>

                        <div className="md:col-span-7 space-y-6">
                            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 shadow-xl space-y-4">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/50 border border-blue-900/40 px-2.5 py-0.5 rounded-md">
                                        {product.category?.categoryName || "General Catalog Item"}
                                    </span>
                                    <h1 className="text-3xl font-bold text-white mt-2 tracking-wide">{product.productName}</h1>
                                    <p className="text-2xl font-bold text-emerald-400 mt-2">
                                        {product.price.toLocaleString()} RWF
                                    </p>
                                    <p className="text-sm text-[#888888] leading-relaxed border-t border-[#1f1f1f] pt-4 mt-4">
                                        {product.description || "No descriptions mapped to this catalog item identifier."}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6 shadow-xl">
                                <div className="max-w-xs space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-[#888888]">Purchase Volume Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#555555]"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <form onSubmit={handleAddToCart} className="flex-1">
                                            <button
                                                type="submit"
                                                disabled={productLoading}
                                                className="w-full py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-semibold text-sm hover:bg-zinc-700 transition-all disabled:opacity-50"
                                            >
                                                🛒 Add To Cart
                                            </button>
                                        </form>

                                        <form onSubmit={handleAddToOrder} className="flex-1">
                                            <button
                                                type="submit"
                                                disabled={productLoading}
                                                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all disabled:opacity-50"
                                            >
                                                ⚡ Buy Direct
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductPage;