import { useEffect, useState } from "react";
import API from "../../../api/axios";
import AdminLayout from "../AdminLayout";
import { useNavigate } from "react-router-dom";

interface ProductField {
    productId: string;
    productName: string;
    description: string;
    imageUrl: string;
}

const ViewProducts = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProduct] = useState<ProductField[]>([]);
    
    const [searchQuery, setSearchQuery] = useState<string>("");
    
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("role") !== "ADMIN") {
            navigate("/login");
        }
    }, [navigate]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                
                if (searchQuery.trim() !== "") {
                    response = await API.get(`/products/search?name=${searchQuery}`);
                    const searchResult = response.data.content || response.data;
                    setProduct(Array.isArray(searchResult) ? searchResult : [searchResult]);
                } else {
                    response = await API.get(`/admin/products`);
                    setProduct(response.data.content || []);
                }
                setError(""); 
            } catch (err: any) {

                setProduct([]);
                setError(err.response?.data?.error || "No matching product keys detected.");
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-2">Inventory Catalog</h2>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((prod) => (

                    <div
                        key={prod.productId}
                        onClick={() => navigate(`/admin/product/details/${prod.productId}`)} 
                        className="bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden shadow-xl flex flex-col group hover:border-[#2a2a2a] transition-all duration-300 cursor-pointer"
                    >
                            <div className="w-full h-48 overflow-hidden bg-[#0a0a0a] border-b border-[#1f1f1f]">
                                <img
                                    src={prod.imageUrl || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"}
                                    alt={prod.productName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80";
                                    }}
                                />
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2 tracking-wide truncate">
                                        {prod.productName}
                                    </h3>
                                    <p className="text-sm text-[#888888] line-clamp-3 leading-relaxed">
                                        {prod.description || "No supplemental descriptions attached to this SKU registry instance."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {products.length === 0 && !loading && (
                <div className="text-center py-12 text-sm text-[#555555] bg-[#141414] rounded-xl border border-[#1f1f1f] mt-4">
                    📦 No products matched your query criteria.
                </div>
            )}
        </AdminLayout>
    );
};

export default ViewProducts;