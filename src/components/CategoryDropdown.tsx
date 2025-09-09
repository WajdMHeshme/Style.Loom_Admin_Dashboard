// CategoryDropdown.tsx
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { TbListDetails } from "react-icons/tb";

interface Props {
  collapsed: boolean;
  activeTab: string;
  onSelect: (value: string) => void;
}

export default function CategoryDropdown({ collapsed, activeTab, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const categories = [
    { label: "Man", value: "man" },
    { label: "Woman", value: "woman" },
    { label: "Child", value: "child" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${collapsed ? "w-auto" : "w-full"}`}>
      {/* الزر الأساسي */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center space-x-2 p-2 rounded-lg transition cursor-pointer w-full
          ${collapsed ? "justify-center" : "justify-start"}
          ${activeTab && activeTab === selected ? "bg-brown70" : "hover:bg-white/10"}
        `}
      >
        <TbListDetails size={24} />
        {!collapsed && (
          <span>
            {selected ? selected.charAt(0).toUpperCase() + selected.slice(1) : "Category"}
          </span>
        )}
        {!collapsed && <FiChevronDown className="ml-auto" />}
      </button>

      {/* القائمة */}
      {open && (
        <div
          className={`absolute mt-1  rounded-lg shadow-lg z-10 bg-black15 space-y-2 ${
            collapsed ? "left-16 w-32" : "bg-white/10"
          }`}
        >
          {categories.map((cat) => (
            <div
              key={cat.value}
              onClick={() => handleSelect(cat.value)}
              className={`flex items-center p-2 w-full  cursor-pointer rounded-lg
                ${activeTab === cat.value ? "bg-brown70" : "hover:bg-white/20"}
              `}
            >
              <TbListDetails size={24} />
              <span>{cat.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
