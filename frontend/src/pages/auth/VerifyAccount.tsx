import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

interface FormData {
    email: string;
    code: string;
}

const VerifyAccount = () => {
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        code: ""
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    };

    const handleVerify = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true); 

        try {
            await API.post("/auth/verify", formData);
            setSuccessMessage("Account successfully verified! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false); 
        }
    };

    const handleReVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        
        if (!formData.email) {
            setError("Please fill in your email address first before requesting a new code.");
            return;
        }

        setLoading(true);

        try {
            const response = await API.post("/auth/re-verify", { email: formData.email });
            setSuccessMessage(response.data.message);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to resend code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-[#e5e5e5]'>
            <div className='bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-lg shadow-2xl'>
                <h2 className='text-3xl font-semibold mb-6 text-white text-center'>Verify Account</h2>
                
                {error && (
                    <div className='bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm'>
                        ⚠️ {error}
                    </div>
                )}

                {successMessage && (
                    <div className='bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4 text-sm'>
                        ✅ {successMessage}
                    </div>
                )}

                <form className='space-y-4' onSubmit={handleVerify}>
                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Code</label>
                        <input 
                            type="text" 
                            name="code" 
                            value={formData.code}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                            required
                        />
                    </div>

                    <button 
                        type='submit' 
                        disabled={loading}
                        className='w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors mt-6 disabled:bg-blue-950 disabled:text-gray-500'
                    >
                        {loading ? "Processing..." : "Verify"}
                    </button>
                </form>

                <p className='text-center text-[#888888] text-sm mt-4'>
                    Code Expired?{" "} 
                    <button 
                        type="button"
                        onClick={handleReVerify}
                        disabled={loading}
                        className='text-blue-400 hover:text-blue-300 font-medium underline focus:outline-none disabled:text-gray-600'
                    >
                        Request New Code
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyAccount;