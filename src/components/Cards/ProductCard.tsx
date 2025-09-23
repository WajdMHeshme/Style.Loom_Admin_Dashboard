import React from "react";

interface ProductCardProps {
    image: string;
    name: string;
    price: number;
    onEdit: () => void;
    onDelete: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, name, price, onEdit, onDelete }) => {
    return (
        <div className="bg-[var(--color-brown97)] dark:bg-[var(--color-black15)] p-4 rounded-2xl shadow-md flex flex-col">
            <img
                src={image}
                alt={name}
                className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-lg font-semibold text-[var(--color-black06)] dark:text-white mb-1">{name}</h3>
            <p className="text-[var(--color-brown60)] dark:text-gray70 mb-4">${price}</p>

            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="flex-1 py-2 rounded-lg bg-[var(--color-brown60)] text-white hover:bg-[var(--color-brown65)] transition"
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
