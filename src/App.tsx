// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Auth/Login/Login";
import DashboardLayout from "./layout/DashboardLayout";

import Products from "./pages/Products";
import Overview from "./pages/Overview";
import Man from "./pages/Categories/Man";
import Woman from "./pages/Categories/Woman";
import Child from "./pages/Categories/Child";
import ProductDetails from "./pages/ProductDetails";
// import FAQ from "./pages/FAQ"; // <-- استبدل هذا إذا كان موجود

// new FAQ pages
import FAQList from "./pages/FAQ";
import FAQCreate from "./pages/FAQCreate";

import Users from "./pages/Users";
import Orders from "./pages/Orders";
import DashboardHome from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import FAQEdit from "./pages/FAQEdit";
import Analytics from "./pages/Analytics";

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
            <Route path="categories">
              <Route path="man" element={<Man />} />
              <Route path="woman" element={<Woman />} />
              <Route path="child" element={<Child />} />
            </Route>

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

