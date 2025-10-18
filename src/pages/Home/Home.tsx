import { useEffect, useState, type JSX } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUsers } from "../../redux/features/usersSlice";
import { fetchProducts } from "../../redux/features/productsSlice";
import MainLoader from "../../utils/waveLoader/WaveLoader";
import UsersList from "./UsersList";
import AdminsList from "./AdminsList";
import ProductsChart from "./ProductsChart";
import CategorySelector from "./CategorySelector";

export default function DashboardHome(): JSX.Element {
  const dispatch = useAppDispatch();

  const { items: users, status: userStatus, error: userError } = useAppSelector((state) => state.users);
  const { items: products, status: productStatus, error: productError } = useAppSelector((state) => state.products);

  const [selectedMain, setSelectedMain] = useState<string>("all");
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProducts());
  }, [dispatch]);

  const mainCategories = Array.from(new Set(products.map((p) => p.subCategory?.main?.name ?? "Unknown"))).filter(Boolean);

  const displayedAdmins = users.filter((u) => u.role?.toLowerCase().includes("admin"));

  const prevUser = () => setCurrentUserIndex((i) => (users.length ? (i <= 0 ? users.length - 1 : i - 1) : 0));
  const nextUser = () => setCurrentUserIndex((i) => (users.length ? (i >= users.length - 1 ? 0 : i + 1) : 0));

  const isLoading = userStatus === "loading" || productStatus === "loading";
  const error = userError || productError;

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[70vh]"><MainLoader /></div>
      ) : error ? (
        <div className="p-4 text-red-400">{error}</div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Dashboard Home</h2>
            <div className="flex items-center gap-3">
              <CategorySelector mainCategories={mainCategories} selectedMain={selectedMain} setSelectedMain={setSelectedMain} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProductsChart products={products} selectedMain={selectedMain} />
            <div className="bg-black15 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Admins</h3>
                <span className="text-sm text-gray-400">{displayedAdmins.length} found</span>
              </div>
              <AdminsList admins={displayedAdmins} />
            </div>
          </div>

          <UsersList
            users={users}
            currentUserIndex={currentUserIndex}
            setCurrentUserIndex={setCurrentUserIndex}
            prevUser={prevUser}
            nextUser={nextUser}
          />
        </>
      )}
    </div>
  );
}
