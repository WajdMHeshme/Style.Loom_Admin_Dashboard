// Sidebar.tsx
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiChevronLeft, FiMenu } from "react-icons/fi";
import { TbShoppingCartStar } from "react-icons/tb";
import { LiaTshirtSolid } from "react-icons/lia";
import { MdOutlineQuestionAnswer, MdOutlinePeople } from "react-icons/md";
import { RiFileList3Line } from "react-icons/ri";
import CategoryDropdown from "./CategoryDropdown";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
    activeTab: string;
    setActiveTab: (val: string) => void;
    onLogoutClick: () => void;
}

export default function Sidebar({
    collapsed,
    setCollapsed,
    activeTab,
    setActiveTab,
    onLogoutClick,
}: SidebarProps) {
    const navigate = useNavigate();

    const navItems = [
        { name: "Products", icon: <LiaTshirtSolid size={20} />, path: "/dashboard/products" },
        { name: "Overview", icon: <TbShoppingCartStar size={20} />, path: "/dashboard/overview" },
        { name: "Orders", icon: <RiFileList3Line size={20} />, path: "/dashboard/orders" },
        { name: "FAQ", icon: <MdOutlineQuestionAnswer size={20} />, path: "/dashboard/faq" },
        { name: "Users", icon: <MdOutlinePeople size={20} />, path: "/dashboard/users" },
    ];

    return (
        <aside
            className={`${collapsed ? "w-20" : "w-64"
                } bg-[var(--color-black15)] text-white flex flex-col transition-all duration-300`}
        >
            {/* Header */}
  <div
    className={`flex items-center py-4 px-3 border-b border-white/10 
        ${collapsed ? "justify-center" : "justify-between"}`}
>
    {!collapsed && (
        <div className="flex items-center gap-3">
            <img src="/logoloom.png" alt="logo" className="w-6 h-6" />
            <Link className="text-lg font-semibold" to={"/dashboard"}>
                Dashboard
            </Link>
        </div>
    )}
    <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 rounded-md hover:bg-white/5 transition"
        aria-label="Toggle sidebar"
    >
        {collapsed ? <FiMenu size={18} /> : <FiChevronLeft size={18} />}
    </button>
</div>


            {/* Navigation */}
            <nav
                className={`flex-1 flex flex-col mt-4 px-2 space-y-2 ${collapsed ? "items-center" : "items-start"
                    }`}
            >
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setActiveTab(item.name.toLowerCase())}
                        className={`flex items-center gap-3 p-2 rounded-lg transition
              ${activeTab === item.name.toLowerCase() ? "bg-[var(--color-brown70)]" : "hover:bg-white/5"}
              ${collapsed ? "justify-center" : "justify-start w-full"}`}
                    >
                        {item.icon}
                        {!collapsed && <span>{item.name}</span>}
                    </Link>
                ))}

                <CategoryDropdown
                    collapsed={collapsed}
                    activeTab={activeTab}
                    onSelect={(value) => {
                        setActiveTab(value);
                        navigate(`/dashboard/categories/${value}`);
                    }}
                />
            </nav>

            {/* Logout Button */}
            <div className="px-3 pb-4">
                <button
                    onClick={onLogoutClick}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition
            hover:bg-red-600/10 ${collapsed ? "justify-center" : "justify-start"}`}
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
        </aside>
    );
}
