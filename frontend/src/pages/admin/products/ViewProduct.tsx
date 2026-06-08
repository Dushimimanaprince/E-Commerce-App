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


    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

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
                    setTotalPages(0);
                } else {
                    response = await API.get(`/products?page=${currentPage}&size=10`);
                    setProduct(response.data.content || []);
                    setTotalPages(response.data.totalPages || 0); 
                }
                setError(""); 
            } catch (err: any) {
                setProduct([]);
                setError(err.response?.data?.error || "Failed to load product listings.");
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, currentPage]); 
    return (
        <AdminLayout>

            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-2">Inventory Catalog</h2>
                    <p className="text-sm text-[#888888]">Live directory tracking active system product listings.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#555555]">🔍</span>
                    <input
                        type="text"
                        placeholder="Search product instances..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#e5e5e5] placeholder-[#555555] focus:outline-none focus:border-[#555555]"
                    />
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
                            <img src={prod.imageUrl} alt={prod.productName} className="w-full h-48 object-cover" />
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-white truncate">{prod.productName}</h3>
                                <p className="text-sm text-[#888888] line-clamp-2 mt-1">{prod.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && searchQuery.trim() === "" && (
                <div className="mt-12 flex items-center justify-between border-t border-[#1f1f1f] pt-6">
                    <p className="text-xs text-[#555555]">
                        Showing page <span className="text-zinc-300 font-medium">{currentPage + 1}</span> of <span className="text-zinc-300 font-medium">{totalPages}</span>
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                            disabled={currentPage === 0}
                            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#141414] border border-[#1f1f1f] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a1a1a] transition-all"
                        >
                            ◀ Previous
                        </button>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#141414] border border-[#1f1f1f] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a1a1a] transition-all"
                        >
                            Next ▶
                        </button>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

export default ViewProducts;