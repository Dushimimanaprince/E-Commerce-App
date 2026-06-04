import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import VerifyAccount from "./pages/auth/VerifyAccount";



function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Navigate to="/signup"/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyAccount />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    
    </BrowserRouter>
  )



}

export default App;