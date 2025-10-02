// src/pages/AddProduct.tsx
import React, { useEffect, useState } from "react";
import { TbFileUpload } from "react-icons/tb";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import api from "../api/Api"; // لجلب التصنيفات
import { useAppDispatch } from "../redux/hooks";
import { addProduct, fetchProducts } from "../redux/features/productsSlice";

type SubCategory = {
  id: number;
  name: string;
  imageUrl?: string | null;
  createdAt?: string;
};

type MainCategory = {
  id: number;
  name: string;
  imageUrl?: string | null;
  subCategories?: SubCategory[];
  subCategory?: SubCategory[];
  sub_categories?: SubCategory[];
};

export default function AddProduct() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // form state
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [mainCategoryId, setMainCategoryId] = useState<string>("");
  const [subId, setSubId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // categories
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // fetch main categories on mount
  useEffect(() => {
    setLoadingCats(true);
    api
      .get("/categories/main")
      .then((res) => {
        setMainCategories(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        toast.error(
          err?.response?.status === 401
            ? "Unauthorized — please login."
            : "Failed to load categories."
        );
        setMainCategories([]);
      })
      .finally(() => setLoadingCats(false));
  }, []);

  // update subCategories when mainCategoryId changes
  useEffect(() => {
    if (!mainCategoryId) {
      setSubCategories([]);
      setSubId("");
      return;
    }
    const main = mainCategories.find(
      (m) => String((m as any).id) === String(mainCategoryId)
    );
    const subs =
      (main as any)?.subCategories ??
      (main as any)?.subCategory ??
      (main as any)?.sub_categories ??
      [];
    setSubCategories(subs);
    setSubId("");
  }, [mainCategoryId, mainCategories]);

  // image handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // submit handler — uses Redux thunk addProduct(FormData) then re-fetch products
  const handleSubmit = async () => {
    // validation (including mainCategory)
    if (
      !productName.trim() ||
      !price.trim() ||
      !description.trim() ||
      !file ||
      !subId ||
      !mainCategoryId
    ) {
      toast.error(
        "Please fill all fields, select main & sub category and upload an image."
      );
      return;
    }

    const priceNum = Number(price);
    const stockNum = stock ? Number(stock) : 1;
    const subIdNum = Number(subId);
    const mainIdNum = Number(mainCategoryId);

    if (!Number.isFinite(priceNum) || priceNum <= 0)
      return toast.error("Price must be positive.");
    if (!Number.isFinite(stockNum) || stockNum < 0)
      return toast.error("Stock must be 0 or positive.");
    if (!Number.isFinite(subIdNum) || subIdNum <= 0)
      return toast.error("Select a valid sub category.");
    if (!Number.isFinite(mainIdNum) || mainIdNum <= 0)
      return toast.error("Select a valid main category.");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("productName", productName.trim());
    formData.append("description", description.trim());
    formData.append("price", String(priceNum));
    formData.append("stock", String(stockNum));

    // add main & sub ids — keep multiple names for backend compatibility
    formData.append("mainCategoryId", String(mainIdNum));
    formData.append("mainId", String(mainIdNum));
    formData.append("subCategoryId", String(subIdNum));
    formData.append("subId", String(subIdNum));

    // DEBUG: print FormData contents (Console / Network will show actual values)
    for (const pair of formData.entries()) {
      console.log("FormData:", pair[0], pair[1]);
    }

    try {
      setLoading(true);

      // 1) dispatch addProduct thunk
      const result = await dispatch(addProduct(formData)).unwrap();

      // 2) re-fetch full products list to ensure store is up-to-date
      await dispatch(fetchProducts());

      const message = (result as any)?.message ?? "Product created successfully";

      // 3) navigate to products and pass toast message via location.state
      navigate("/dashboard/products", {
        state: { toast: { type: "success", message } },
      });
    } catch (err: any) {
      console.error("Error creating product:", err);
      const errMsg =
        typeof err === "string" ? err : err?.message ?? "Failed to add product";
      toast.error(errMsg);
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
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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
            <label className="block text-sm font-medium text-gray90">Main Category</label>
            <select
              value={mainCategoryId}
              onChange={(e) => setMainCategoryId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
            >
              <option value="">{loadingCats ? "Loading categories..." : "Select main category"}</option>
              {mainCategories.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray90">Sub Category</label>
            <select
              value={subId}
              onChange={(e) => setSubId(e.target.value)}
              disabled={!mainCategoryId || subCategories.length === 0}
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
            >
              <option value="">{!mainCategoryId ? "Select main first" : subCategories.length ? "Select sub category" : "No sub categories"}</option>
              {subCategories.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setProductName("");
            setPrice("");
            setDescription("");
            setStock("");
            setPreview(null);
            setFile(null);
            setSubId("");
            setMainCategoryId("");
            navigate("/dashboard/products");
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
