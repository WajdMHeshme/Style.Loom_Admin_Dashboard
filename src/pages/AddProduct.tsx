// src/pages/AddProduct.tsx
import { useEffect, useState } from "react";
import { TbFileUpload } from "react-icons/tb";
import api from "../api/Api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Category {
  id: number;
  name: string;
  subCategories?: { id: number; name: string }[];
}

interface SubCategory {
  id: number;
  name: string;
  main?: { id: number; name: string };
}

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [subCategoryId, setSubCategoryId] = useState(""); // from select
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  // جلب التصنيفات من API
  useEffect(() => {
    api
      .get("/sub") // ← هذا endpoint للحصول على كل التصنيفات + sub
      .then((res) => {
        const categories: Category[] = res.data;
        // دمج جميع subCategories في مصفوفة واحدة
        const allSubs: SubCategory[] = [];
        categories.forEach((cat) => {
          if (cat.subCategories?.length) {
            cat.subCategories.forEach((sub) => {
              allSubs.push({ id: sub.id, name: sub.name, main: { id: cat.id, name: cat.name } });
            });
          }
        });
        setSubCategories(allSubs);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
        setSubCategories([]);
      })
      .finally(() => setLoadingSubs(false));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !description || !file || !subCategoryId) {
      toast.error("Please fill all fields and select a category + image.");
      return;
    }

    const subIdNum = Number(subCategoryId);
    if (!Number.isFinite(subIdNum) || Number.isNaN(subIdNum) || subIdNum <= 0) {
      toast.error("SubCategory ID must be a valid positive number.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", String(Number(price)));
      formData.append("stock", stock ? String(Number(stock)) : "1");
      formData.append("subCategoryId", String(subIdNum));
      formData.append("image", file);

      const res = await api.post("/pro", formData);
      toast.success(res.data?.message || "Product created!");

      // إعادة تعيين الحقول
      setName("");
      setPrice("");
      setDescription("");
      setStock("");
      setSubCategoryId("");
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      console.error("Error creating product:", err);
      const serverMsg = err.response?.data?.message ?? JSON.stringify(err.response?.data) ?? err.message;
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black12 p-6">
      <h1 className="text-2xl font-semibold text-white mb-1">Add Product</h1>
      <p className="text-gray50 mb-6">Fill in product details and add a new item.</p>

      <div className="bg-black15 rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6 items-stretch">
        {/* Left: Image Upload */}
        <div className="flex flex-col items-center w-full md:w-[48%]">
          <label
            htmlFor="product-image"
            className="w-full h-72 min-h-64 bg-black12 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-brown70 cursor-pointer hover:bg-black10 transition"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="object-contain h-full" />
            ) : (
              <div className="flex flex-col items-center text-brown70">
                <TbFileUpload size={28} />
                <span className="text-sm mt-2">Upload Product Image</span>
              </div>
            )}
          </label>
          <input id="product-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        {/* Right: Form */}
        <div className="flex-1 space-y-4 w-full md:w-[48%]">
          <div>
            <label className="block text-sm font-medium text-gray90">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray90">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 25.00"
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray90">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 10"
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray90">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray90">Category (Sub)</label>
            <select
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              disabled={loadingSubs || subCategories.length === 0}
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
            >
              <option value="">{loadingSubs ? "Loading categories..." : "Select category"}</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.main?.name ? `${sub.main.name} → ${sub.name}` : sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setName("");
            setPrice("");
            setDescription("");
            setStock("");
            setPreview(null);
            setFile(null);
            setSubCategoryId("");
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 text-white text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-brown70 text-white hover:bg-brown65 transition cursor-pointer"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>
    </div>
  );
}


