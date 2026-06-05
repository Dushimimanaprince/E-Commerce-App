import React, { useEffect, useState } from "react";
import API from "../../../api/axios";
import AdminLayout from "../AdminLayout";

// Blueprint for form tracking
interface FormData {
    productName: string;
    price: number;
    quantity: number;
    category: string;
    imageUrl: string;
    description: string;
}

// Blueprint for mapping incoming backend categories safely
interface CategoryItem {
    categoryId: string;
    categoryName: string;
}

const AddProduct = () => {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [categoryError, setCategoryError] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    
    const [formData, setFormData] = useState<FormData>({
        productName: "",
        price: 0,
        quantity: 0,
        category: "",
        imageUrl: "",
        description: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get("/category");
                setCategories(response.data);
            } catch (err: any) {
                setCategoryError("Failed to Fetch available Categories.");
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        setLoading(true);

        try {
            const response = await API.post("/admin/create/products", formData);
            setSuccess(response.data?.message || "Product Created successfully!");
            setFormData({
                productName: "",
                price: 0,
                quantity: 0,
                category: "",
                imageUrl: "",
                description: ""
            });
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to finalize creating product entry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-center p-4">
                <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-xl shadow-2xl">
                    <h2 className="text-2xl font-semibold mb-2 text-white text-center">Add New Product</h2>
                    <p className="text-sm text-[#888888] text-center mb-6">Dispatch a clean SKU entry straight into the inventories</p>
                    
                    {error && (
                        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4 text-sm">
                            ✅ {success}
                        </div>
                    )}

                    {categoryError && (
                        <div className="bg-amber-900/40 border border-amber-600 text-amber-200 px-4 py-2 rounded-lg mb-4 text-xs">
                            ⚠️ {categoryError}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        
                        <div>
                            <label className="block text-sm font-medium text-[#888888] mb-1">Product Name</label>
                            <input 
                                type="text" 
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                placeholder="e.g. Wireless Mechanical Keyboard"
                                required
                            />
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#888888] mb-1">Quantity</label>
                                <input 
                                    type="number" 
                                    name="quantity" 
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                    required
                                />
                            </div>
                        
                            <div>
                                <label className="block text-sm font-medium text-[#888888] mb-1">Price</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0.01"
                                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#888888] mb-1">Category</label>
                            <select 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors scheme-dark"
                                required
                            >
                                <option value="" className="bg-[#141414]">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId} className="bg-[#141414]">
                                        {cat.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#888888] mb-1">Image URL</label>
                            <input 
                                type="url" 
                                name="imageUrl" 
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                placeholder="https://example.com/image.jpg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#888888] mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors resize-none"
                                placeholder="Provide comprehensive details regarding this item entry..."
                            />
                        </div>

                        <button 
                            type='submit' 
                            disabled={loading}
                            className='w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors mt-4 disabled:bg-blue-950 disabled:text-gray-500'
                        >
                            {loading ? "Processing..." : "Create Item Instance"}
                        </button>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddProduct;