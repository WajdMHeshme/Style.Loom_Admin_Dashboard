// src/pages/ProductDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TiArrowLeftThick } from "react-icons/ti";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchProductById,
  deleteProduct,
  clearCurrentProduct,
} from "../redux/features/productsSlice";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const product = useAppSelector((s) => s.products.currentProduct);
  const currentStatus = useAppSelector((s) => s.products.status);
  const currentError = useAppSelector((s) => s.products.error);
  const deleteStatus = useAppSelector((s) => s.products.deleteStatus);

  // try to read token from common places (you can adapt the keys to your app)
  const tokenFromStore = useAppSelector((s: any) => s.auth?.token ?? null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setTimeout(() => setAnimate(true), 20);
  };

  const closeDeleteModal = () => {
    setAnimate(false);
    setTimeout(() => setShowDeleteModal(false), 220);
  };

  // helper to read cookie
  function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  }

  // unified token getter: prefers redux, falls back to localStorage keys and cookies
  function getAuthToken() {
    if (tokenFromStore) return tokenFromStore;
    const localKeys = ["token", "authToken", "accessToken", "jwt"];
    for (const k of localKeys) {
      const v = localStorage.getItem(k);
      if (v) return v;
    }
    return getCookie("token") || getCookie("authToken") || null;
  }

  // Confirm delete: calls DELETE endpoint directly (token-aware), updates UI and store
  const confirmDelete = async () => {
    if (!id) return;

    const token = getAuthToken();
    try {
      // optimistically show toast & close modal only after success? here we wait for server response
      // show a pending toast (optional)
      const toastId = toast.loading("Deleting product...");

      const res = await fetch(`http://localhost:3000/api/dashboard/pro/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // body: JSON.stringify({}) // usually not required for DELETE
      });

      if (!res.ok) {
        // try to parse json error
        let errMsg = `Server responded with ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error) errMsg = data.error;
          else if (data?.message) errMsg = data.message;
        } catch (e) {
          const text = await res.text();
          if (text) errMsg = text;
        }
        toast.update(toastId, {
          render: errMsg,
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
        console.error("Delete failed:", errMsg);
        return;
      }

      // success
      // if you also use redux slice to keep products list in sync, dispatch an action
      // try dispatching the existing thunk (if you want) — here we'll clear current product
      dispatch(clearCurrentProduct());

      toast.update(toastId, {
        render: "Product deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      closeDeleteModal();
      navigate("/dashboard/products");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err?.message ?? "Failed to delete product");
    }
  };

  const handleEdit = () => {
    if (!product) return;
    navigate(`/dashboard/edit-product/${product.id}`);
  };

  if (currentStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-400">Loading product...</p>
      </div>
    );
  }

  if (currentStatus === "failed" || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <p className="text-red-400 text-lg">
          {currentError || "Product not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black12 p-6 text-gray90 ">
      {/* زر العودة إلى صفحة المنتجات */}
      <button
        onClick={() => navigate("/dashboard/products")}
        className="group absolute top-6 right-6 flex items-center gap-1 bg-brown70 text-white px-4 py-2 rounded-lg transition duration-200 text-sm md:text-base cursor-pointer hover:bg-brown65"
      >
        {/* السهم */}
        <TiArrowLeftThick
          size={25}
          className="transform transition-transform duration-300 group-hover:-translate-x-1"
        />
        Back
      </button>

      <h1 className="text-2xl font-semibold text-white mb-1">
        Product Details
      </h1>
      <p className="text-gray50 mb-6">View and manage product information.</p>

      <div className="bg-black15 rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="bg-black10 flex items-center justify-center  md:w-1/2">
          <img
            src={
              product.imageUrl
                ? `http://localhost:3000${product.imageUrl}`
                : "/placeholder.png"
            }
            alt={product.name ?? product.productName}
            className="w-full object-contain max-h-[500px]"
          />
        </div>

        {/* Product Info */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">
              {product.name ?? product.productName}
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray50 mb-3">
              {product.description}
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">
              ${product.price}
            </p>

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
                    {product.reviews.map((rev: any) => (
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
              onClick={openDeleteModal}
              disabled={deleteStatus === "loading"}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm md:text-base cursor-pointer"
            >
              <MdDeleteForever size={20} />
              {deleteStatus === "loading" ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300"
          aria-modal="true"
          role="dialog"
          onClick={closeDeleteModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-black12 rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center text-center transform transition-all duration-300 ${
              animate
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 -translate-y-6"
            }`}
          >
            <div className="rounded-full p-4 mb-4 text-center bg-red-600">
              <MdDeleteForever size={24} color="#ffffff" />
            </div>

            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {product.name ?? product.productName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                disabled={deleteStatus === "loading"}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700 transition"
                disabled={deleteStatus === "loading"}
              >
                {deleteStatus === "loading" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
