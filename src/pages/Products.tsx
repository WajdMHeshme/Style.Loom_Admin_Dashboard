import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/Cards/ProductCard";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product", axiosConfig);
        setProducts(response.data);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  const handleEdit = (id: number) => {
    toast.info(`Edit product ${id}`);
    // هنا ممكن تعمل redirect لصفحة التعديل
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/product/${id}`, axiosConfig);
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <p className="p-6 text-[var(--color-black06)] dark:text-white">
        Loading products...
      </p>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.length === 0 && (
        <p className="col-span-full text-center text-[var(--color-black06)] dark:text-white">
          No products available.
        </p>
      )}

      {products.map((product) => (
        <ProductCard
          key={product.id}
          image={`http://localhost:3000/${product.imageUrl}`}
          name={product.name}
          price={product.price}
          onEdit={() => handleEdit(product.id)}
          onDelete={() => handleDelete(product.id)}
        />
      ))}
    </div>
  );
};

export default Products;
