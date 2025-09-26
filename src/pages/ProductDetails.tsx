// src/pages/ProductDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/Api"; // ← استخدمنا api.ts

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  subCategory: {
    name: string;
    main: {
      name: string;
    };
  };
  reviews?: {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch product
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api
      .get(`/product/${id}`) // ← استخدام api.ts
      .then((res) => {
        setProduct(res.data);
        setError(null);
      })
      .catch((err: any) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please check your network or API.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Delete product
  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeleting(true);
      const res = await api.delete(`/dashboard/pro/${id}`); // ← DELETE عبر api.ts
      toast.success(res.data?.message || "Product deleted successfully");
      navigate("/dashboard/products");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  // Edit product — navigate to edit page
  const handleEdit = () => {
    if (!product) return;
    navigate(`/dashboard/edit-product/${product.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-400">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <p className="text-red-400 text-lg">{error || "Product not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black12 p-6 text-gray90">
      <h1 className="text-2xl font-semibold text-white mb-1">Product Details</h1>
      <p className="text-gray50 mb-6">View and manage product information.</p>

      <div className="bg-black15 rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="bg-black10 flex items-center justify-center  md:w-1/2">
          <img
            src={`http://localhost:3000${product.imageUrl}`}
            alt={product.name}
            className="w-full object-contain max-h-[500px]"
          />
        </div>

        {/* Product Info */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">{product.name}</h2>
            <p className="text-sm md:text-base lg:text-lg text-gray50 mb-3">{product.description}</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">${product.price}</p>

            <div className="space-y-6 text-xs md:text-sm lg:text-base text-gray70">
              <p>
                <span className="font-semibold text-gray90">Category: </span>
                {product.subCategory?.main?.name} → {product.subCategory?.name}
              </p>
              <p>
                <span className="font-semibold text-gray90">In Stock: </span>
                {product.stock}
              </p>
              {product.reviews && product.reviews.length > 0 && (
                <div>
                  <span className="font-semibold text-gray90">Reviews:</span>
                  <ul className="list-disc ml-5 mt-2 text-gray50">
                    {product.reviews.map((rev) => (
                      <li key={rev.id}>
                        {rev.comment} - {rev.rating}/5
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-brown70 text-white px-4 py-2 rounded-lg hover:bg-brown65 transition text-sm md:text-base cursor-pointer"
            >
              <MdModeEditOutline size={18} />
              Edit Product
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm md:text-base cursor-pointer"
            >
              <MdDeleteForever size={20} />
              {deleting ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
