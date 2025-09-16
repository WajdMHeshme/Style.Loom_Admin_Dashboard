import img from "../assets/t.jpg";
import { MdDeleteForever } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";

export default function ProductDetails() {
  return (
    <div className="min-h-screen bg-black12 p-6 text-gray90">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-white mb-1">
        Product Details
      </h1>
      <p className="text-gray50 mb-6">
        View and manage product information.
      </p>

      {/* Product Card */}
      <div className="bg-black15 rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Product Image */}
<div className="
  bg-black10 flex items-center justify-center 
  border-2 border-dashed border-brown70 
  border-b-0 md:border-b-2 md:border-r-0 md:w-1/2
">
  <img
    src={img}
    alt="Product"
    className="w-full object-contain max-h-[500px]"
  />
</div>


        {/* Product Info */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">
              Classic Cotton T-Shirt
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray50 mb-3">
              A comfortable and versatile t-shirt.
            </p>

            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4">
              $25.00
            </p>

            <div className="space-y-6 text-xs md:text-sm lg:text-base text-gray70">
              <p>
                <span className="font-semibold text-gray90">Product Type: </span>
                T-Shirt
              </p>
              <p>
                <span className="font-semibold text-gray90">Available Sizes: </span>
                S, M, L
              </p>
              <p>
                <span className="font-semibold text-gray90">Description: </span>
                This classic cotton t-shirt is a wardrobe essential. Made from
                soft, breathable 100% cotton, it offers all-day comfort and a
                timeless style.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex items-center gap-2 bg-brown70 text-white px-4 py-2 rounded-lg hover:bg-brown65 transition text-sm md:text-base cursor-pointer">
              <MdModeEditOutline size={18} />
              Edit Product
            </button>
            <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm md:text-base cursor-pointer">
              <MdDeleteForever size={20} />
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
