import { useEffect, useState } from "react";
import API from "../../../api/axios";
import AdminLayout from "../AdminLayout";

interface CategoryField {
    categoryId: string;
    categoryName: string;
    description?: string;
    products?: any[]; 
}

const CategoryView = () => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<CategoryField[]>([]);

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const response = await API.get("/category");
                setCategories(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to fetch category metrics.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllCategories();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[50vh] text-[#888888]">
                    Loading Category Details...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-2">Category Overview</h2>
                <p className="text-sm text-[#888888]">Monitor inventory allocations per category block.</p>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
                    ⚠️ {error}
                </div>
            )}

            <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#1f1f1f]">
                    <h3 className="text-lg font-medium text-white">Active Product Categories</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#1f1f1f] text-[#888888] text-xs font-semibold uppercase tracking-wider bg-[#1a1a1a]/40">
                                <th className="p-4">Category Name</th>
                                <th className="p-4">Products Assigned</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f1f1f]">
                            {categories.map((cat) => (
                                <tr key={cat.categoryId} className="hover:bg-[#1a1a1a]/40 transition-colors text-sm">
                                    <td className="p-4 font-medium text-white">
                                        📁 {cat.categoryName}
                                    </td>
                                    <td className="p-4 text-[#888888]">

                                        <span className="px-2.5 py-1 rounded-md bg-blue-950/60 text-blue-400 font-semibold border border-blue-900/40">
                                            {cat.products ? cat.products.length : 0} Items
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="p-6 text-center text-sm text-[#888888]">
                                        No categories found in the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategoryView;