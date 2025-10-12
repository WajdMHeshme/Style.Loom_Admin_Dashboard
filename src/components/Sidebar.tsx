// Sidebar.tsx
import { Link,  } from "react-router-dom";
import { FiLogOut, FiChevronLeft, FiMenu, FiClock } from "react-icons/fi";
import { LiaTshirtSolid } from "react-icons/lia";
import { MdOutlineQuestionAnswer, MdOutlinePeople, MdOutlineReviews } from "react-icons/md";
import { RiFileList3Line } from "react-icons/ri";
import { useEffect, useState } from "react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
  onLogoutClick: () => void;
}

function SessionTimer({ collapsed }: { collapsed: boolean }) {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formatted = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

  return (
    <div
      className={`p-3 border-t border-white/10 text-sm transition-all duration-200 ${
        collapsed ? "flex flex-col items-center gap-1" : ""
      }`}
      title={`Session time: ${formatted}`}
    >
      {/* style for slow spin (included here so it works without touching global css) */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>

      <div className="flex items-center gap-2">
        <FiClock
          aria-hidden
          className="spin-slow"
          size={collapsed ? 18 : 20}
        />
        {!collapsed && (
          <span>
            Session time: <strong>{formatted}</strong>
          </span>
        )}
      </div>

      {collapsed && (
        <span
          className="text-xs select-none"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatted}
        </span>
      )}

      {!collapsed && (
        <span
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {`Session time ${minutes} minutes ${remainingSeconds} seconds`}
        </span>
      )}
    </div>
  );
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  activeTab,
  setActiveTab,
  onLogoutClick,
}: SidebarProps) {

  const navItems = [
    { name: "Products", icon: <LiaTshirtSolid size={20} />, path: "/dashboard/products" },
    { name: "reviews", icon: <MdOutlineReviews  size={20} />, path: "/dashboard/overview" },
    { name: "Orders", icon: <RiFileList3Line size={20} />, path: "/dashboard/orders" },
    { name: "FAQ", icon: <MdOutlineQuestionAnswer size={20} />, path: "/dashboard/faq" },
    { name: "Users", icon: <MdOutlinePeople size={20} />, path: "/dashboard/users" },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-[var(--color-black15)] text-white flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div
        className={`flex items-center py-4 px-3 border-b border-white/10 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img src="/logoloom.png" alt="logo" className="w-6 h-6" />
            <Link className="text-lg font-semibold" to="/dashboard">
              Dashboard
            </Link>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-white/5 transition"
          aria-label={collapsed ? "Open sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiMenu size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`flex-1 flex flex-col mt-4 px-2 space-y-2 ${
          collapsed ? "items-center" : "items-start"
        }`}
      >
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setActiveTab(item.name.toLowerCase())}
            className={`flex items-center gap-3 p-2 rounded-lg transition w-full ${
              activeTab === item.name.toLowerCase() ? "bg-[var(--color-brown70)]" : "hover:bg-white/5"
            } ${collapsed ? "justify-center" : "justify-start"}`}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}

      </nav>

      {/* Session timer + Logout */}
      <div className="px-3">
        <SessionTimer collapsed={collapsed} />

        <div className="pt-3 pb-4">
          <button
            onClick={onLogoutClick}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition hover:bg-red-600/10 ${
              collapsed ? "justify-center" : "justify-start"
            }`}
            aria-label="Logout"
          >
            <div
              className="p-2 rounded-md"
              style={{
                background: "linear-gradient(135deg, var(--color-brown60), var(--color-brown65))",
              }}
            >
              <FiLogOut size={18} color="white" />
            </div>
            {!collapsed && <span className="ml-1">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

