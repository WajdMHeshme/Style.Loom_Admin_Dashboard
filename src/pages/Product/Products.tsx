import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingWave from "../../utils/waveLoader/WaveLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchProducts } from "../../redux/features/productsSlice";
import Pagination from "../../components/Pagination";

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

const categories = ["all", "woman", "man", "kids"];

export default function Products() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const items = useAppSelector((s) => s.products.items) as Product[];
  const status = useAppSelector((s) => s.products.status);
  const error = useAppSelector((s) => s.products.error);

  // Toast from navigation state
  useEffect(() => {
    const anyState = (location.state as any) ?? {};
    if (anyState.toast?.message) {
      const { type = "success", message = "" } = anyState.toast;
      switch (type) {
        case "error":
        case "danger":
          toast.error(message); break;
        case "info": toast.info(message); break;
        case "warn":
        case "warning": toast.warn(message); break;
        default: toast.success(message);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((p) => p.subCategory?.main?.name?.toLowerCase() === activeCategory);
  }, [items, activeCategory]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, totalItems]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  if (status === "loading") return <div className="flex justify-center items-center min-h-screen"><LoadingWave /></div>;
  if (status === "failed") return <div className="flex justify-center items-center min-h-screen px-4"><p className="text-red-400 text-lg">{error}</p></div>;

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

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

      {totalItems === 0 ? <p className="text-gray-400">No products found.</p> :
        <>
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
                  <p className="text-xs text-gray-500">Category: {mainCategoryName} → {subCategoryName}</p>
                  <p className="text-xs text-gray-500">In stock: {product.stock ?? 0}</p>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        </>
      }
    </div>
  );
}
