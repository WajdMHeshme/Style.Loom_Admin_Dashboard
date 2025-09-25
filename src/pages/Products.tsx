// src/pages/Products.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Api";

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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // <-- added for navigation

  useEffect(() => {
    // ← هنا لم يتغير استدعاء الـ API
    api
      .get("../product")
      .then((res) => {
        setProducts(res.data);
        setError(null);
      })
      .catch((err: any) => {
        console.error("Error fetching products:", err);

        const status = err.response?.status;
        const serverMessage =
          typeof err.response?.data === "string"
            ? (err.response?.data as string).replace(/<[^>]*>/g, "").slice(0, 200)
            : err.response?.data?.message;

        setError(
          status
            ? `Failed to load products (status ${status}). ${serverMessage ? "- " + serverMessage : ""}`
            : "Failed to fetch products. Please check your network or server."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="max-w-xl text-center">
          <p className="text-red-400 text-lg mb-2">{error}</p>
          <p className="text-sm text-gray-400">
            تحقق أن الـ backend يعمل على المنفذ الصحيح وأن الـ API متاح على{" "}
            <code className="bg-black10 px-2 py-1 rounded">http://localhost:3000/api/product</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Add button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Products</h1>

        {/* Add Product button (does NOT change API) */}
        <button
          onClick={() => navigate("/dashboard/add-product")}
          className="px-4 py-2 bg-brown70 text-white rounded-lg hover:bg-brown65 transition"
        >
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-400">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
              <p className="text-indigo-400 font-semibold mt-2">
                ${product.price}
              </p>
              <p className="text-xs text-gray-500">
                Category: {product.subCategory?.main?.name} → {product.subCategory?.name}
              </p>
              <p className="text-xs text-gray-500">In stock: {product.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
