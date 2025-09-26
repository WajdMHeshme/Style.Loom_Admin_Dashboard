// src/pages/Products.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/Api";
import LoadingWave from "../utils/waveLoader/WaveLoader"; // ⬅️ استدعاء اللودر
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  subCategory: {
    id: number;
    name: string;
    main: {
      id: number;
      name: string;
      imageUrl: string | null;
    };
  };
}

const categories = ["all", "woman", "man", "child"];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // --- show toast if location.state contains a toast object (coming from CRUD pages) ---
  useEffect(() => {
    // location.state can be anything; cast safely
    const anyState = (location.state as any) ?? {};
    if (anyState.toast && anyState.toast.message) {
      const { type = "success", message = "" } = anyState.toast;
      // choose toast method by type
      switch (type) {
        case "error":
        case "danger":
          toast.error(message);
          break;
        case "info":
          toast.info(message);
          break;
        case "warn":
        case "warning":
          toast.warn(message);
          break;
        default:
          toast.success(message);
      }
      // remove the toast state so it doesn't show again on refresh / re-mount
      // replace keeps user on same URL without the state
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  useEffect(() => {
    const fetchProducts = async () => {
      const start = Date.now();
      try {
        const res = await api.get("/product");
        setProducts(res.data);
        setFilteredProducts(res.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please check your network or server.");
      } finally {
        const elapsed = Date.now() - start;
        const delay = elapsed < 3000 ? 3000 - elapsed : 0; // ⬅️ ضمان 3 ثوانٍ
        setTimeout(() => setLoading(false), delay);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (p) => p.subCategory?.main?.name.toLowerCase() === activeCategory
        )
      );
    }
  }, [activeCategory, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingWave /> {/* ⬅️ اللودر بمنتصف الصفحة */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Toast container (global for this page) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Header: Tabs + Add Product */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                activeCategory === cat
                  ? "bg-brown70 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate("/dashboard/add-product")}
          className="px-4 py-2 bg-brown70 text-white rounded-lg hover:bg-brown65 transition"
        >
          Add Product
        </button>
      </div>

      {/* Grid المنتجات */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-400">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:3000${product.imageUrl}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-sm text-gray-400">{product.description}</p>
              <p className="text-indigo-400 font-semibold mt-2">${product.price}</p>
              <p className="text-xs text-gray-500">
                Category: {product.subCategory?.main?.name} → {product.subCategory?.name}
              </p>
              <p className="text-xs text-gray-500">In stock: {product.stock}</p>
              <button
                onClick={() => navigate(`/dashboard/product/${product.id}`)}
                className="mt-3 w-full px-3 py-2 bg-brown70 text-white rounded-lg hover:bg-brown65 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
