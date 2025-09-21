import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Auth/Login/Login";
import DashboardLayout from "./layout/DashboardLayout";

import Products from "./pages/Products";
import Overview from "./pages/Overview";
import Man from "./pages/Categories/Man";
import Woman from "./pages/Categories/Woman";
import Child from "./pages/Categories/Child";
import ProductDetails from "./pages/ProductDetails";
import FAQ from "./pages/FAQ";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import DashboardHome from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<Products />} />
            <Route path="add-product" element={<AddProduct />} /> {/* 👈 Route جديد */}
            <Route path="overview" element={<Overview />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="categories">
              <Route path="man" element={<Man />}>
                <Route path="productdetails" element={<ProductDetails />} />
              </Route>
              <Route path="woman" element={<Woman />} />
              <Route path="child" element={<Child />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
