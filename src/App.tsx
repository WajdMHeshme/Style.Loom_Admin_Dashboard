// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Auth/Login/Login";
import DashboardLayout from "./layout/DashboardLayout";

import Products from "./pages/Product/Products";
import Overview from "./pages/Overview/Overview";

import ProductDetails from "./pages/Product/ProductDetails";
// import FAQ from "./pages/FAQ"; // <-- استبدل هذا إذا كان موجود

// new FAQ pages
import FAQList from "./pages/FAQ/FAQ";
import FAQCreate from "./pages/FAQ/FAQCreate";

import Users from "./pages/User/Users";
import Orders from "./pages/Order/Orders";
import DashboardHome from "./pages/Home/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/Product/AddProduct";
import EditProduct from "./pages/Product/EditProduct";
import FAQEdit from "./pages/FAQ/FAQEdit";
import Analytics from "./pages/Analytics/Analytics";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />

            {/* Products */}
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="edit-product/:id" element={<EditProduct />} />

            {/* Categories */}


            {/* Other Pages */}
            <Route path="overview" element={<Overview />} />

            {/* FAQ routes */}
            <Route path="faq" element={<FAQList />} />           {/* /dashboard/faq */}
            <Route path="add-faq" element={<FAQCreate />} />    {/* /dashboard/add-faq */}
            <Route path="edit-faq/:id" element={<FAQEdit />} />

            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="analytics" element={<Analytics />} />
          
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

