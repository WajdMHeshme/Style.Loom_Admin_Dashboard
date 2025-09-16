import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiLogOut, FiX } from "react-icons/fi";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogoutClick={() => setShowLogoutModal(true)}
        />

        {/* Main Content */}
        <main className="flex-1 bg-[var(--color-black12)] text-white">
          <Outlet />
        </main>
      </div>

      {/* Toasts */}
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div
              className="rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-200"
              style={{
                background: "linear-gradient(180deg, var(--color-brown95), var(--color-brown99))",
                border: "1px solid var(--color-brown70)",
              }}
            >
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex-shrink-0 rounded-full p-3"
                    style={{
                      background: "linear-gradient(135deg, var(--color-brown60), var(--color-brown65))",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                    }}
                  >
                    <FiLogOut size={20} color="#fff" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: "var(--color-black06)" }}>
                      Confirm Logout
                    </h3>
                    <p className="text-sm mt-1" style={{ color: "var(--color-brown80)" }}>
                      Are you sure you want to sign out of your account?
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="p-2 rounded-md hover:bg-black/5 transition"
                  aria-label="Close"
                >
                  <FiX size={18} style={{ color: "var(--color-black06)" }} />
                </button>
              </div>

              <div className="px-6 pb-6">
                <p className="text-sm mb-4" style={{ color: "var(--color-brown70)" }}>
                  You will be redirected to the login page. Any unsaved changes may be lost.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-2 rounded-xl font-medium border transition"
                    style={{
                      background: "transparent",
                      borderColor: "var(--color-brown80)",
                      color: "var(--color-brown60)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2 rounded-xl font-medium transition"
                    style={{
                      background: "linear-gradient(90deg, var(--color-brown60), var(--color-brown65))",
                      color: "white",
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
