// src/pages/EditProduct.tsx
import { useState } from "react";
import shirt from "../assets/t.jpg";
import { TbFileUpload } from "react-icons/tb";
export default function EditProduct() {
  const [name, setName] = useState("Classic Cotton T-Shirt");
  const [type, setType] = useState("T-Shirt");
  const [price, setPrice] = useState("25.00");
  const [description, setDescription] = useState(
    "This classic cotton t-shirt is a wardrobe essential. Made from soft, breathable 100% cotton, it offers all-day comfort and a timeless style. Perfect for casual wear or layering under jackets and sweaters."
  );
  const [preview, setPreview] = useState(shirt); // صورة أولية

  // مجرد UI: نغير الصورة محلياً
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // عرض الصورة الجديدة
    }
  };

  return (
    <div className="min-h-screen bg-black12 p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-white mb-1">Edit Product</h1>
      <p className="text-gray50 mb-6">
        Modify product details and save your changes.
      </p>

      {/* Card */}
      <div className="bg-black15 rounded-xl shadow-sm   p-6 flex flex-col md:flex-row justify-between gap-6 items-stretch">
{/* Left: Image */}
<div className="flex flex-col items-center w-full md:w-[48%]">
  <div className="w-full h-72 min-h-64 bg-black12 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-brown70">
    <img src={preview} alt="Product" className="object-contain h-full" />
  </div>

  {/* Change Image Button */}
  <label
    htmlFor="product-image"
    className="cursor-pointer text-brown70 text-sm font-light mt-3 hover:underline flex gap-2 items-center"
  >
    <TbFileUpload size={16} /> Change Image
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
          Save Changes
        </button>
      </div>
    </div>
  );
}
