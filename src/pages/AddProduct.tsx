// src/pages/AddProduct.tsx
import { useState } from "react";
import { TbFileUpload } from "react-icons/tb";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  // مجرد UI: عرض صورة مؤقتة بعد رفعها
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-black12 p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-white mb-1">Add Product</h1>
      <p className="text-gray50 mb-6">
        Fill in product details and add a new item.
      </p>

      {/* Card */}
      <div className="bg-black15 rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6 items-stretch">
        {/* Left: Image Upload */}
        <div className="flex flex-col items-center w-full md:w-[48%]">
          <label
            htmlFor="product-image"
            className="w-full h-72 min-h-64 bg-black12 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-brown70 cursor-pointer hover:bg-black10 transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="object-contain h-full"
              />
            ) : (
              <div className="flex flex-col items-center text-brown70">
                <TbFileUpload size={28} />
                <span className="text-sm mt-2">Upload Product Image</span>
              </div>
            )}
          </label>
          <input
            id="product-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Right: Form */}
        <div className="flex-1 space-y-4 w-full md:w-[48%]">
          <div>
            <label className="block text-sm font-medium text-gray90">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90 placeholder-gray50 focus:outline-none focus:ring-2 focus:ring-brown70 focus:border-brown70"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray90">
              Product Type
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g. T-Shirt"
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90 placeholder-gray50 focus:outline-none focus:ring-2 focus:ring-brown70 focus:border-brown70"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray90">
              Price
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 25.00"
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90 placeholder-gray50 focus:outline-none focus:ring-2 focus:ring-brown70 focus:border-brown70"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray90">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90 placeholder-gray50 focus:outline-none focus:ring-2 focus:ring-brown70 focus:border-brown70"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button className="px-4 py-2 rounded-lg border border-gray-300 text-white text-sm cursor-pointer">
          Cancel
        </button>
        <button className="px-4 py-2 rounded-lg  bg-brown70 text-white hover:bg-brown65 transition cursor-pointer">
          Add Product
        </button>
      </div>
    </div>
  );
}
