// import { Pencil, Trash } from "lucide-react";
import img from '../assets/t.jpg'
export default function ProductDetails() {
    return (
        <div className=" min-h-screen bg-black12 p-6 text-gray90">
            {/* Title */}
            <h1 className="text-2xl font-semibold text-brown90">Product Details</h1>
            <p className="text-gray50 mb-6">
                View and manage product information.
            </p>

            {/* Product Card */}
            <div className="bg-black15 rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="bg-black10 flex items-center justify-center  md:w-1/2">
                    <img
                        src={img}
                        alt="Product"
                        className="w-full  object-cover"
                    />
                </div>

                {/* Product Info */}
                <div className="p-6 md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-brown80">
                            Classic Cotton T-Shirt
                        </h2>
                        <p className="text-gray50 mb-3">
                            A comfortable and versatile t-shirt.
                        </p>

                        <p className="text-2xl font-bold text-brown90 mb-4">$25.00</p>

                        <div className="space-y-6 text-sm text-gray70">
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
                                timeless style. Perfect for casual wear or layering under jackets
                                and sweaters.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button className="flex items-center gap-2 bg-brown70 text-black06 px-4 py-2 rounded-lg hover:bg-brown65 transition">
                            {/* <Pencil size={16} /> */}
                            Edit Product
                        </button>
                        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                            {/* <Trash size={16} /> */}
                            Delete Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
