import { useState } from "react";
import API from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    password: string;
    confirmPassword: string;
}

const Signup = () => {

    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        password: "",
        confirmPassword:""
    })
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword,setShowPassword]= useState<boolean>(false)
    const [showPasswordError,setShowPasswordError]= useState<string>("")

    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setShowPasswordError("Passwords do not match!");
            return; 
        }

        if (formData.password.length < 8) {
            setShowPasswordError("Password must be at least 8 characters long!");
            return;
        }

        try {
            const { confirmPassword, ...submitData } = formData;
            await API.post('/auth/register', submitData);
            navigate("/verify");
        } catch (err:any) {
            setError(err.response?.data?.error)
        }finally{
            setLoading(true)
        }
    };

    return (
        <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-[#e5e5e5]'>
            <div className='bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 w-full max-w-lg shadow-2xl'>
                <h2 className='text-3xl font-semibold mb-6 text-white text-center'>Create Account</h2>
                
                {error && (
                    <div className='bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm'>
                        {error}
                    </div>
                )}

                <form className='space-y-4' onSubmit={handleSubmit}>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                        required/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Email</label>
                        <input type="email" name="email" value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                        required/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Phone</label>
                        <input type="text" name="phone" value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                        required/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Date of Birth</label>
                        <input 
                            type="date" 
                            name="dob" 
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-[#e5e5e5]  focus:border-[#555555] transition-colors scheme-dark"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Password</label>
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
                        {showPasswordError && (
                            <div className='bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm'>
                                {showPasswordError}
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <label className='block text-sm font-medium text-[#888888] mb-1'>Confirm Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="confirmPassword" 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 pr-12 text-[#e5e5e5] focus:outline-none focus:border-[#555555] transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <button type='submit'
                        className='w-full bg-blue-900 text-white font-semibold rounded-lg p-3 hover:bg-blue-800 transition-colors mt-6'>
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

                <p className='text-center text-[#888888] text-sm mt-4'>
                    Already have an account? <Link to="/login" className='text-blue-400 hover:text-blue-300'>Login</Link>
                </p>

            </div>
        </div>
    )
}

export default Signup;