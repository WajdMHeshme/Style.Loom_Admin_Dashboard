// DashboardLayout.tsx
import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiChevronLeft, FiMenu } from "react-icons/fi";
import { TbShoppingCartStar } from "react-icons/tb";
import { LiaTshirtSolid } from "react-icons/lia";
import { MdOutlineQuestionAnswer, MdOutlinePeople } from "react-icons/md"; // أيقونات مؤقتة
import CategoryDropdown from "../components/CategoryDropdown";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-black15 text-white flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-2 border-b border-white/20">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <img
                src="/logoloom.png"
                alt="logo"
                className="w-[20px] h-[20px] cursor-pointer"
              />
              <Link className="text-xl font-bold" to={"/dashboard"}>
                Dashboard
              </Link>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg hover:bg-white/10 transition cursor-pointer ${
              collapsed ? "mx-auto" : ""
            }`}
          >
            {collapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 flex flex-col mt-4 px-2 space-y-2 ${
            collapsed ? "items-center" : "items-start"
          }`}
        >
          {/* Products */}
          <Link
            to="/dashboard/products"
            onClick={() => setActiveTab("products")}
            className={`flex items-center space-x-2 p-2 rounded-lg transition
              ${activeTab === "products" ? "bg-brown70" : "hover:bg-white/10"}
              ${collapsed ? "justify-center w-auto" : "justify-start w-full"}`}
          >
            <LiaTshirtSolid size={24} />
            {!collapsed && <span>Products</span>}
          </Link>

          {/* Overview */}
          <Link
            to="/dashboard/overview"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center space-x-2 p-2 rounded-lg transition
              ${activeTab === "overview" ? "bg-brown70" : "hover:bg-white/10"}
              ${collapsed ? "justify-center w-auto" : "justify-start w-full"}`}
          >
            <TbShoppingCartStar size={24} />
            {!collapsed && <span>Overview</span>}
          </Link>

          {/* FAQ */}
          <Link
            to="/dashboard/faq"
            onClick={() => setActiveTab("faq")}
            className={`flex items-center space-x-2 p-2 rounded-lg transition
              ${activeTab === "faq" ? "bg-brown70" : "hover:bg-white/10"}
              ${collapsed ? "justify-center w-auto" : "justify-start w-full"}`}
          >
            <MdOutlineQuestionAnswer size={24} />
            {!collapsed && <span>FAQ</span>}
          </Link>

          {/* Users */}
          <Link
            to="/dashboard/users"
            onClick={() => setActiveTab("users")}
            className={`flex items-center space-x-2 p-2 rounded-lg transition
              ${activeTab === "users" ? "bg-brown70" : "hover:bg-white/10"}
              ${collapsed ? "justify-center w-auto" : "justify-start w-full"}`}
          >
            <MdOutlinePeople size={24} />
            {!collapsed && <span>Users</span>}
          </Link>

          {/* Category Dropdown */}
          <CategoryDropdown
            collapsed={collapsed}
            activeTab={activeTab}
            onSelect={(value) => {
              setActiveTab(value); // تحديث الزر النشط
              navigate(`/dashboard/categories/${value}`);
            }}
          />
        </nav>

        {/* Logout Button */}
        <div className="px-2 mb-4 flex justify-center items-center">
          <button
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-red-500/20 transition cursor-pointer ${
              collapsed ? "justify-center w-auto" : "justify-start w-full"
            }`}
          >
            <FiLogOut size={24} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1  bg-black12 text-white ">
        <Outlet />
      </main>
    </div>
  );
}
