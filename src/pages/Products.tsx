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

const categories = ["all", "woman", "man", "child"];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/product")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setError(null);
      })
      .catch((err: any) => {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please check your network or server.");
      })
      .finally(() => setLoading(false));
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
        <p className="text-lg">Loading products...</p>
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
      {/* Header: Tabs + Add Product */}
      <div className="flex justify-between items-center mb-6">
        {/* Tabs على اليسار */}
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

        {/* زر Add Product على اليمين تمام مثل السابق */}
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
