// src/pages/Products.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingWave from "../utils/waveLoader/WaveLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/features/productsSlice";

interface Product {
  id?: number | string;
  name?: string;
  productName?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  stock?: number;
  subCategory?: {
    id?: number;
    name?: string;
    main?: {
      id?: number;
      name?: string;
    } | null;
  } | null;
}

const categories = ["all", "woman", "man", "child"];

export default function Products() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState<string>("all");

  // pagination state
  const itemsPerPage = 4; // يعرض 4 كروت لكل صفحة (ثابت)
  const [currentPage, setCurrentPage] = useState<number>(1);

  const items = useAppSelector((s) => s.products.items) as Product[];
  const status = useAppSelector((s) => s.products.status);
  const error = useAppSelector((s) => s.products.error);

  // show toast if location.state contains a toast object (coming from CRUD pages)
  useEffect(() => {
    const anyState = (location.state as any) ?? {};
    if (anyState.toast && anyState.toast.message) {
      const { type = "success", message = "" } = anyState.toast;
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
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  // filtered list based on activeCategory (safe with optional chaining)
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((p) => {
      const mainName = p.subCategory?.main?.name;
      if (!mainName) return false;
      return mainName.toLowerCase() === activeCategory;
    });
  }, [items, activeCategory]);

  // pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  // adjust currentPage if out of range (e.g., after filter or delete)
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  // reset page to 1 when filter or items change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, totalItems]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingWave />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  // helper for rendering page numbers (simple full list)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6">
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

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg transition ${activeCategory === cat
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

      {totalItems === 0 ? (
        <p className="text-gray-400">No products found.</p>
      ) : (
        <>
          {/* responsive grid:
              - default (small): 1 column
              - md (>=768px): 2 columns
              - lg (>=1024px): 4 columns
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => {
              const displayName = product.name ?? product.productName ?? "Unnamed product";
              const displayDesc = product.description ?? "";
              const displayPrice = typeof product.price === "number" ? product.price : 0;
              const mainCategoryName = product.subCategory?.main?.name ?? "Unknown";
              const subCategoryName = product.subCategory?.name ?? "Unknown";

              return (
                <div
                  key={product.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/dashboard/product/${product.id}`)}
                >
                  <img
                    src={product.imageUrl ? `http://localhost:3000${product.imageUrl}` : "/placeholder.png"}
                    alt={displayName}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h2 className="text-lg font-bold">{displayName}</h2>
                  <p className="text-sm text-gray-400">{displayDesc}</p>
                  <p className="text-indigo-400 font-semibold mt-2">${displayPrice}</p>
                  <p className="text-xs text-gray-500">
                    Category: {mainCategoryName} → {subCategoryName}
                  </p>
                  <p className="text-xs text-gray-500">In stock: {product.stock ?? 0}</p>
                </div>
              );
            })}
          </div>

          {/* pagination controls */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              Showing <span className="text-white">{Math.min(startIndex + 1, totalItems)}</span>
              {" — "}
              <span className="text-white">{Math.min(endIndex, totalItems)}</span>
              {" of "}
              <span className="text-white">{totalItems}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border border-white/10 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"}`}
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1 rounded-md border border-white/10 ${currentPage === num ? "bg-brown70 text-white" : "bg-transparent text-gray-200 hover:bg-white/5"}`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border border-white/10 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"}`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
