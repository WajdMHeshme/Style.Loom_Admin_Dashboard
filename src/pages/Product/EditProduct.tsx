// src/pages/EditProduct.tsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TbFileUpload } from "react-icons/tb";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchProductById,
  updateProduct,
  clearCurrentProduct,
} from "../../redux/features/productsSlice";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentProduct = useAppSelector((s) => s.products.currentProduct);
  const currentStatus = useAppSelector((s) => s.products.status);
  const updateStatus = useAppSelector((s) => s.products.updateStatus);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loadingLocal, setLoadingLocal] = useState(false);

  // ref to prevent duplicate toasts per product update action
  const updateToastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  // populate local form when currentProduct loads
  useEffect(() => {
    if (!currentProduct) return;
    setName(currentProduct.productName ?? currentProduct.name ?? "");
    setType(currentProduct.type ?? "");
    setPrice(String(currentProduct.price ?? ""));
    setDescription(currentProduct.description ?? "");
    if (currentProduct.imageUrl) {
      setPreview(
        currentProduct.imageUrl.startsWith("http")
          ? currentProduct.imageUrl
          : `http://localhost:3000${currentProduct.imageUrl}`
      );
    }
  }, [currentProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please select a valid image file.", {
        toastId: `error-image-${id ?? "noid"}`,
      });
      return;
    }
    // revoke previous preview URL to avoid memory leaks
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!name.trim() || !price.trim() || !description.trim()) {
      toast.error("Please fill all fields.", {
        toastId: `error-fill-${id ?? "noid"}`,
      });
      return;
    }

    if (!id) return;

    const formData = new FormData();
    formData.append("productName", name.trim());
    formData.append("type", type.trim());
    formData.append("price", price.trim());
    formData.append("description", description.trim());
    if (file) formData.append("image", file);

    try {
      setLoadingLocal(true);

      // dispatch update thunk
      const result = await dispatch(
        updateProduct({ id, data: formData })
      ).unwrap();

      // prepare a stable toast id so duplicates are ignored
      const toastId = `update-${id}`;

      // store id in ref (optional, but handy if you want to programmatically dismiss later)
      updateToastIdRef.current = toastId;

      // show success toast once (react-toastify will ignore duplicates with same id)
      toast.success(result?.message ?? "Product updated successfully", {
        toastId,
      });

      // navigate to products WITHOUT passing toast in location.state (avoid duplicates)
      navigate("/dashboard/products");
    } catch (err: any) {
      console.error("Update error:", err);
      const errMsg =
        typeof err === "string"
          ? err
          : err?.message ?? "Failed to update product";
      // use a consistent id for error too
      toast.error(errMsg, { toastId: `update-error-${id}` });
    } finally {
      setLoadingLocal(false);
    }
  };

  if (currentStatus === "loading" || !currentProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-400">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black12 p-6">
      <h1 className="text-2xl font-semibold text-white mb-1">Edit Product</h1>
      <p className="text-gray50 mb-6">
        Modify product details and save your changes.
      </p>

      <div className="bg-black15 rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6 items-stretch">
        <div className="flex flex-col items-center w-full md:w-[48%]">
          <div className="w-full h-72 min-h-64 bg-black12 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-brown70">
            {preview && (
              <img
                src={preview}
                alt="Product"
                className="object-contain h-full"
              />
            )}
          </div>

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
              Price
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
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
              className="mt-1 w-full rounded-lg border border-gray50 bg-black12 px-3 py-2 text-sm text-gray90"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => navigate("/dashboard/products")}
          className="px-4 py-2 rounded-lg border border-gray-300 text-white text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loadingLocal || updateStatus === "loading"}
          className="px-4 py-2 rounded-lg bg-brown70 text-white hover:bg-brown65 transition cursor-pointer"
        >
          {loadingLocal || updateStatus === "loading"
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
