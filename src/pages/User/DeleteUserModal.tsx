import { useEffect, useState } from "react";
import { FaUserLargeSlash } from "react-icons/fa6";

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
    onConfirm: (id: number | string) => void;
    deleting?: boolean; // true while deletion in progress
    deleteStatus?: string | null; // optional status string (e.g. "loading")
}

export default function DeleteUserModal({ isOpen, user, onClose, onConfirm, deleting, deleteStatus }: Props) {
    const [animateModal, setAnimateModal] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAnimateModal(false);
            // small delay to trigger entrance animation just like the inline code
            const t = setTimeout(() => setAnimateModal(true), 10);
            return () => clearTimeout(t);
        } else {
            setAnimateModal(false);
        }
    }, [isOpen]);

    if (!isOpen || !user) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-200 ${animateModal ? "opacity-100" : "opacity-0"
                }`}
        >
            <div
                className={`bg-black15 text-white p-6 rounded-lg w-80 shadow-lg transform transition-all duration-200 ${animateModal ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    }`}
            >
                <div className="flex justify-center mb-4 text-4xl">
                    <FaUserLargeSlash className="text-red-500" />
                </div>

                <h2 className="text-lg font-bold mb-4 text-red-500">Confirm Delete</h2>
                <p className="mb-4">Are you sure you want to delete {user.first_name}?</p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            setAnimateModal(false);
                            setTimeout(onClose, 200);
                        }}
                        className="px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(user.id)}
                        className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                        disabled={deleting || deleteStatus === "loading"}
                    >
                        {deleting || deleteStatus === "loading" ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
