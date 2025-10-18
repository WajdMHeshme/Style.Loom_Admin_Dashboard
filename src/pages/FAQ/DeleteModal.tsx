// src/components/DeleteModal.tsx
import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";

interface Props {
    show: boolean;
    itemName: string;
    onCancel: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export default function DeleteModal({ show, itemName, onCancel, onConfirm, loading }: Props) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (show) setTimeout(() => setAnimate(true), 20);
        else setAnimate(false);
    }, [show]);

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300"
            aria-modal="true"
            role="dialog"
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-black12 rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center text-center transform transition-all duration-300 ${animate ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-6"
                    }`}
            >
                <div className="rounded-full p-4 mb-4 text-center bg-red-600">
                    <MdDeleteForever size={24} color="#ffffff" />
                </div>

                <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Confirm Delete</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    Are you sure you want to delete <span className="font-semibold">{itemName}</span>? This action cannot be undone.
                </p>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
