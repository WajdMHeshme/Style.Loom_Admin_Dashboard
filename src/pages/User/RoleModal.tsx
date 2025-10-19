import { useEffect, useState } from "react";
import RoleDropdown from "../../components/RoleDropdown";
import { GrUserAdmin } from "react-icons/gr";

interface User {
    id: number | string;
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
    createdAt?: string;
    [k: string]: any;
}

interface Props {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onSave: (role: string) => Promise<void> | void;
    saving?: boolean;
    updateStatus?: "idle" | "loading" | "succeeded" | "failed";
}

export default function RoleModal({ isOpen, user, onClose, onSave, saving, updateStatus }: Props) {
    const [animate, setAnimate] = useState(false);
    const [role, setRole] = useState<string>("user");

    useEffect(() => {
        if (isOpen) {
            setRole(user?.role ?? "user");
            // small delay for entrance animation
            const t = setTimeout(() => setAnimate(true), 10);
            return () => clearTimeout(t);
        } else {
            // reset animation state when closed
            setAnimate(false);
        }
    }, [isOpen, user]);

    if (!isOpen || !user) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-200 ${animate ? "opacity-100" : "opacity-0"}`}
            aria-modal="true"
            role="dialog"
            onClick={() => {
                setAnimate(false);
                setTimeout(onClose, 180);
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-black15 text-white p-6 rounded-lg w-80 shadow-lg transform transition-all duration-200 ${animate ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    }`}
            >
                <div className="flex justify-center mb-4 text-4xl">
                    {/* icon left to RoleDropdown in original code, keep minimal */}
                    <GrUserAdmin className="text-brown70" />
                </div>

                <h2 className="text-lg font-bold mb-4">Change Role for {user.first_name}</h2>

                <RoleDropdown value={role} onChange={setRole} />

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={() => {
                            setAnimate(false);
                            setTimeout(onClose, 180);
                        }}
                        className="px-4 py-2 text-white"
                        type="button"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            await onSave(role);
                        }}
                        disabled={saving || updateStatus === "loading"}
                        className="px-4 py-2 bg-brown70 rounded hover:bg-brown65 disabled:opacity-50"
                        type="button"
                    >
                        {saving || updateStatus === "loading" ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
