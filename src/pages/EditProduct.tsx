// src/pages/EditProduct.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TbFileUpload } from "react-icons/tb";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/Api"; // ← استخدمنا api.ts

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch product data
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api
      .get(`/product/${id}`) // ← استخدام api.ts
      .then((res) => {
        const p = res.data;
        setName(p.productName || p.name || "");
        setType(p.type || "");
        setPrice(String(p.price || ""));
        setDescription(p.description || "");
        if (p.imageUrl) setPreview(`http://localhost:3000${p.imageUrl}`);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch product data.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // Handle save changes
  const handleSave = async () => {
    if (!name.trim() || !price.trim() || !description.trim()) {
      toast.error("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("productName", name.trim());
    formData.append("type", type.trim());
    formData.append("price", price.trim());
    formData.append("description", description.trim());
    if (file) formData.append("image", file);

    try {
      setLoading(true);
      const res = await api.patch(`/dashboard/pro/${id}`, formData); // ← PATCH عبر api.ts
      toast.success(res.data?.message || "Product updated successfully");
      navigate("/dashboard/products");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black12 p-6">
      <h1 className="text-2xl font-semibold text-white mb-1">Edit Product</h1>
      <p className="text-gray50 mb-6">Modify product details and save your changes.</p>

      <div className="bg-black15 rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6 items-stretch">
        {/* Left: Image */}
        <div className="flex flex-col items-center w-full md:w-[48%]">
          <div className="w-full h-72 min-h-64 bg-black12 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-brown70">
            {preview && <img src={preview} alt="Product" className="object-contain h-full" />}
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
            <label className="block text-sm font-medium text-gray90">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90 placeholder-gray50 focus:outline-none focus:ring-2 focus:ring-brown70 focus:border-brown70"
            />
          </div>

          

          <div>
            <label className="block text-sm font-medium text-gray90">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90 placeholder-gray50 focus:outline-none focus:ring-2 focus:ring-brown70 focus:border-brown70"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray90">Description</label>
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
        <button
          onClick={() => navigate("/dashboard/products")}
          className="px-4 py-2 rounded-lg border border-gray-300 text-white text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-brown70 text-white hover:bg-brown65 transition cursor-pointer"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
