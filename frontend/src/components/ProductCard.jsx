import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../services/cart/cartService";

function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const inStock = Number(product.stock || 0) > 0;

  const handleAdd = async () => {
    if (!localStorage.getItem("token")) {
      toast.error("Please log in before adding products");
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      await addToCart(product._id, 1);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="flex flex-col rounded-xl bg-white p-4 shadow transition hover:shadow-lg">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image || product.images?.[0] || "https://placehold.co/600x400?text=No+Image"}
          alt={product.name}
          className="h-52 w-full rounded-lg object-cover"
        />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{product.name}</h3>
      </Link>
      <p className="mt-2 text-gray-600">LKR {Number(product.price || 0).toLocaleString()}</p>
      <p className={`mt-1 text-sm ${inStock ? "text-green-600" : "text-red-600"}`}>
        {inStock ? `${product.stock} in stock` : "Out of stock"}
      </p>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!inStock || adding}
        className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {adding ? "Adding..." : inStock ? "Add to cart" : "Out of stock"}
      </button>
    </article>
  );
}

export default ProductCard;