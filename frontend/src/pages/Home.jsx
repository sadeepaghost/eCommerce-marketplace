import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Hero from "../components/Hero";
import SectionTitle from "../components/SectionTitle";
import Loader from "../components/Loader";
import ProductGrid from "../components/ProductGrid";

import { getAllProducts } from "../services/products/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();

        setProducts(data.products || data);
      } catch (error) {
        console.error("Product fetch error:", error);

        toast.error(
          error.response?.data?.message || "Could not load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <SectionTitle title="Featured Products" />

        {loading ? (
          <Loader />
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </section>
    </div>
  );
}

export default Home;