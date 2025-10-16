// DashboardLayout.tsx
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImExit } from "react-icons/im";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const openModal = () => {
    setShowLogoutModal(true);
    setTimeout(() => setAnimate(true), 50);
  };

  const closeModal = () => {
    setAnimate(false);
    setTimeout(() => setShowLogoutModal(false), 300);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogoutClick={openModal}
        />

        {/* Main Content */}
        <main
          className={`flex-1 bg-[var(--color-black12)] text-white transition-all duration-300
            ${collapsed ? "md:ml-20" : "md:ml-64"}
          `}
        >
          <Outlet />
        </main>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300">
          <div
            className={`bg-black12 rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center text-center transform transition-all duration-300 ${
              animate ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-6"
            }`}
          >
            <div className="rounded-full p-4 mb-4 text-center">
              <ImExit size={30} color="#c2b4a3" />
            </div>

            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to sign out of your account? You will be redirected to the login page.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={closeModal}
                className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-lg bg-brown70 text-white hover:bg-brown65 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
