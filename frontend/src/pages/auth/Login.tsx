import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

interface LoginFormData {
    email: string;
    password: string;
}

const Login = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: ""
    });
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", formData);
            const { token,role } = response.data;
            

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("role", role);

                if(role == "ADMIN"){

                    navigate("/admin/dashboard"); 
                }else{
                    navigate("/products");
                }
                
            } else {
                setError("Authentication succeeded but no authorization token was found.");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Invalid credentials or network server timeout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-[#e5e5e5]'>
            <div className='bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-lg shadow-2xl'>
                <h2 className='text-3xl font-semibold mb-2 text-white text-center'>Welcome Back</h2>
                <p className='text-center text-[#888888] text-sm mb-6'>Enter your credentials to access your account</p>
                
                {error && (
                    <div className='bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm'>
                        ⚠️ {error}
                    </div>
                )}

                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Email Address</label>
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
                        <div className="flex justify-between items-center mb-1">
                            <label className='block text-sm font-medium text-[#888888]'>Password</label>
                            <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 pr-12 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#888888] hover:text-[#e5e5e5] transition-colors"
                            >
                                {showPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>
                    </div>

                    <button 
                        type='submit' 
                        disabled={loading}
                        className='w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors mt-6 disabled:bg-blue-950 disabled:text-gray-500'
                    >
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                </form>

                <p className='text-center text-[#888888] text-sm mt-6'>
                    Don't have an account yet?{" "}
                    <Link to="/signup" className='text-blue-400 hover:text-blue-300 font-medium underline'>
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;