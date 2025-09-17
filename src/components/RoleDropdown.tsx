// RoleDropdown.tsx
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { FaUser } from "react-icons/fa6";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function RoleDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const roles = [
    { label: "User", value: "user", icon: <FaUser /> },
    { label: "Admin", value: "admin", icon: <GrUserAdmin /> },
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

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const currentRole = roles.find(r => r.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-2 border border-gray80 rounded-lg bg-brown99 text-black20 focus:outline-none focus:ring-2 focus:ring-brown65 transition"
      >
        <div className="flex items-center gap-2">
          {currentRole?.icon} {currentRole?.label || "Select Role"}
        </div>
        <FiChevronDown />
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-black15 rounded-lg shadow-lg z-10">
          {roles.map((r) => (
            <div
              key={r.value}
              onClick={() => handleSelect(r.value)}
              className={`p-2 flex cursor-pointer rounded-lg hover:bg-white/20 ${
                value === r.value ? "bg-brown70" : ""
              }`}
            >
              <span className="inline mr-2">{r.icon}</span> {r.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
