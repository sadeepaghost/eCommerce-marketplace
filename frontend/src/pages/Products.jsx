import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts } from "../api/productApi";
import ProductGrid from "../components/ProductGrid";
import Loader from "../components/Loader";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : data.products || []))
      .catch((error) => toast.error(error.response?.data?.message || "Could not load products"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>
      {loading ? <Loader /> : products.length > 0 ? <ProductGrid products={products} /> : <p className="text-gray-500">No products found.</p>}
    </section>
  );
}

export default Products;