import React, { useState } from "react";
import API from "../../../api/axios";
import AdminLayout from "../AdminLayout";
import { useNavigate } from "react-router-dom";


interface FormData {
    name: string;
    description: string;
}




const AddCategory = () => {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    
    const [formData, setFormData] = useState<FormData>({
        name: "",
        description: ""
    });
    const navigate= useNavigate()

    const role= localStorage.getItem("role")
    if(role != "ADMIN"){
        navigate("/login")
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        setLoading(true);

        try {

            const response = await API.post("/admin/add/category", formData);
            setSuccess(response.data?.message || "Product Created successfully!");
            

            setFormData({
                name: "",
                description: ""
            });
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to finalize creating category entry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-center p-4">
                <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-xl shadow-2xl">
                    <h2 className="text-2xl font-semibold mb-2 text-white text-center">Add New Category</h2>
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


                    <form className="space-y-4" onSubmit={handleSubmit}>
                        
                        <div>
                            <label className="block text-sm font-medium text-[#888888] mb-1">Category Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                placeholder="e.g. Wireless Mechanical Keyboard"
                                required
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-[#888888] mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors resize-none"
                                placeholder="Provide comprehensive details regarding this Category entry..."
                            />
                        </div>

                        <button 
                            type='submit' 
                            disabled={loading}
                            className='w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors mt-4 disabled:bg-blue-950 disabled:text-gray-500'
                        >
                            {loading ? "Processing..." : "Create Category Instance"}
                        </button>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddCategory;