import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../components/Loader";
import { addToCart } from "../services/cart/cartService";
import { getProductById } from "../services/product/productService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product || data);
      } catch (error) {
        console.error("Product details error:", error);

        toast.error(
          error.response?.data?.message || "Could not load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in before adding products");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);

      const response = await addToCart(product._id, quantity);

      console.log("Add to cart response:", response);

      toast.success("Added to cart!");
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart error:", error);

      if (error.response?.status === 401) {
        toast.error("Your login session is invalid. Please log in again.");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message || "Could not add to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((previousQuantity) => previousQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((previousQuantity) => previousQuantity - 1);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xl text-gray-500">Product not found.</p>
      </div>
    );
  }

  const productImage =
    product.image ||
    product.images?.[0] ||
    "https://placehold.co/700x600?text=No+Image";

  const isInStock = product.stock > 0;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-xl shadow"
          />
        </div>

        <div>
          <p className="text-sm text-blue-600 font-medium">
            {product.category || "Uncategorized"}
          </p>

          <h1 className="text-3xl font-bold mt-2">
            {product.name}
          </h1>

          <p className="text-2xl font-semibold mt-4">
            LKR {Number(product.price).toLocaleString()}
          </p>

          <p className="text-gray-600 leading-7 mt-6">
            {product.description || "No description available."}
          </p>

          <div className="mt-6 space-y-2">
            <p>
              <span className="font-semibold">Brand:</span>{" "}
              {product.brand || "Not specified"}
            </p>

            <p>
              <span className="font-semibold">Stock:</span>{" "}
              <span
                className={
                  isInStock ? "text-green-600" : "text-red-600"
                }
              >
                {isInStock
                  ? `${product.stock} available`
                  : "Out of stock"}
              </span>
            </p>
          </div>

          {isInStock && (
            <div className="mt-8">
              <p className="font-semibold mb-3">Quantity</p>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border rounded-lg text-xl hover:bg-gray-100 disabled:opacity-50"
                >
                  −
                </button>

                <span className="text-lg font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 border rounded-lg text-xl hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isInStock || addingToCart}
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {addingToCart
              ? "Adding..."
              : isInStock
                ? "Add to Cart"
                : "Out of Stock"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;