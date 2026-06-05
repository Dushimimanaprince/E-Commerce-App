import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import VerifyAccount from "./pages/auth/VerifyAccount";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/products/AddProduct";
import AddCategory from "./pages/admin/products/AddCategory";
import CategoryView from "./pages/admin/products/ViewCategory";
import ViewProducts from "./pages/admin/products/ViewProduct";
import ProductDetails from "./pages/admin/products/ProductDetails";



function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Navigate to="/signup"/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyAccount />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/product/add" element={<AddProduct />} />
        <Route path="/admin/product/view" element={<ViewProducts />} />
        <Route path="/admin/product/details/:productId" element={<ProductDetails />} />
        <Route path="/admin/category/add" element={<AddCategory />} />
        <Route path="/admin/category/view" element={<CategoryView />} />

      </Routes>
    
    </BrowserRouter>
  )



}

export default App;