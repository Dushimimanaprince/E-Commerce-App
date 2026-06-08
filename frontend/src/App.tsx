import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import VerifyAccount from "./pages/auth/VerifyAccount";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/products/AddProduct";
import AddCategory from "./pages/admin/products/AddCategory";
import CategoryView from "./pages/admin/products/ViewCategory";
import ViewProducts from "./pages/admin/products/ViewProduct";

import ViewUsers from "./pages/admin/users/ViewUsers";
import UserDetails from "./pages/admin/users/UserDetails";
import HomePage from "./pages/user/Home";
import ProductDetails from "./pages/admin/products/ProductDetails";
import ProductPage from "./pages/user/ProductPage";
import Cart from "./pages/Cart/CartItems";



function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Navigate to="/products"/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyAccount />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/product/add" element={<AddProduct />} />
        <Route path="/admin/product/view" element={<ViewProducts />} />
        <Route path="/admin/product/details/:productId" element={<ProductDetails />} />
        <Route path="/admin/category/add" element={<AddCategory />} />
        <Route path="/admin/category/view" element={<CategoryView />} />
        <Route path="/admin/users/view" element={<ViewUsers />} />
        <Route path="/admin/users/details/:userId" element={<UserDetails />} />

        <Route path="/products" element={<HomePage />} />
        <Route path="/products/details/:productId" element={<ProductPage />} />
        <Route path="/user/cart" element={<Cart />} />



      </Routes>
    
    </BrowserRouter>
  )



}

export default App;