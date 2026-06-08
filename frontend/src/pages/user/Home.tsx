import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";

interface ProductDetails {
    productId: string;
    productName: string;
    imageUrl: string;
    descrption: string;
}

interface CategoryDetails {
    categoryId: string;
    categoryName: string;
}

const HomePage = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [product, setProduct] = useState<ProductDetails[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [category, setCategory] = useState<CategoryDetails[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await API.get("/category");
                setCategory(response.data.content || response.data || []);
            } catch (err: any) {
                setError("Failed to load layout categories");
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            let response;
            try {
                if (searchQuery.trim() !== "") {
                    response = await API.get(`/products/search?name=${searchQuery}`);
                    setProduct(response.data);
                    setTotalPages(0);
                } else if (selectedCategoryId !== "") {
                    response = await API.get(`/category/products/${selectedCategoryId}`);
                    const dataResults = response.data.content || response.data || [];
                    setProduct(dataResults);
                    setTotalPages(response.data.totalPages || 0);
                } else {
                    response = await API.get(`/products?page=${currentPage}&size=12`);
                    setProduct(response.data.content || response.data || []);
                    setTotalPages(response.data.totalPages || 0);
                }
                setError("");
            } catch (err: any) {
                setProduct([]);
                setError(err.response?.data?.error || "Failed To Load Products");
            } finally {
                setLoading(false);
            }
        };

        const delayBouncer = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(delayBouncer);
    }, [searchQuery, currentPage, selectedCategoryId]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <UserNavbar />
            
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-2xl">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setSelectedCategoryId("");
                            setCurrentPage(0);
                        }}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-500"
                    />

                    <select
                        value={selectedCategoryId}
                        onChange={(e) => {
                            setSelectedCategoryId(e.target.value);
                            setSearchQuery("");
                            setCurrentPage(0);
                        }}
                        className="w-full sm:w-64 bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-500 text-gray-300"
                    >
                        <option value="">All Categories</option>
                        {category.map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {loading ? (
                    <div>Loading custom inventory...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {product.map((p) => (
                                <div key={p.productId} 
                                onClick={() => navigate(`/products/details/${p.productId}`)}
                                className="bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden">
                                    <img src={p.imageUrl} alt={p.productName} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm">{p.productName}</h3>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.descrption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && searchQuery.trim() === "" && (
                            <div className="mt-12 flex items-center justify-between border-t border-[#1f1f1f] pt-6">
                                <p className="text-xs text-gray-500">
                                    Page {currentPage + 1} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                                        disabled={currentPage === 0}
                                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#141414] border border-[#1f1f1f] disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        ◀ Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                        disabled={currentPage >= totalPages - 1}
                                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#141414] border border-[#1f1f1f] disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        Next ▶
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default HomePage;