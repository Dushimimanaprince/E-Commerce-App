import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import VerifyAccount from "./pages/auth/VerifyAccount";
import AdminDashboard from "./pages/admin/AdminDashboard";



function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Navigate to="/signup"/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyAccount />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    
    </BrowserRouter>
  )



}

export default App;