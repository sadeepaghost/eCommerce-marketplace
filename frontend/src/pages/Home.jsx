import { useEffect, useState } from "react";

import Hero from "../components/Hero";
import SectionTitle from "../components/SectionTitle";
import Loader from "../components/Loader";
import ProductGrid from "../components/ProductGrid";

import { getAllProducts } from "../services/product/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();

      setProducts(data.products || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <SectionTitle title="Featured Products" />

        {loading ? (
          <Loader />
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </div>
  );
}

export default Home;