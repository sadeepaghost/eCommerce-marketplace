import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../components/Loader";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../services/cart/cartService";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(Array.isArray(data) ? data : data.cart || []);
    } catch (error) {
      console.error("Get cart error:", error);

      if (error.response?.status === 401) {
        toast.error("Please log in to view your cart");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message || "Could not load your cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (cartItem, newQuantity) => {
    if (newQuantity < 1) return;

    const availableStock = cartItem.productId?.stock;

    if (
      typeof availableStock === "number" &&
      newQuantity > availableStock
    ) {
      toast.error(`Only ${availableStock} item(s) available`);
      return;
    }

    try {
      setUpdatingId(cartItem._id);

      await updateCartItem(cartItem._id, newQuantity);

      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item._id === cartItem._id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not update quantity"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      setUpdatingId(cartItemId);

      await removeCartItem(cartItemId);

      setCartItems((currentItems) =>
        currentItems.filter((item) => item._id !== cartItemId)
      );

      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not remove item"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const subtotal = cartItems.reduce((total, item) => {
    const price = Number(item.productId?.price || 0);
    return total + price * item.quantity;
  }, 0);

  if (loading) {
    return <Loader />;
  }

  if (cartItems.length === 0) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>

        <p className="mt-3 text-gray-500">
          Add some products before continuing.
        </p>

        <Link
          to="/products"
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {cartItems.map((item) => {
            const product = item.productId;

            const image =
              product?.image ||
              product?.images?.[0] ||
              "https://placehold.co/300x300?text=No+Image";

            const itemTotal =
              Number(product?.price || 0) * item.quantity;

            const isUpdating = updatingId === item._id;

            return (
              <article
                key={item._id}
                className="flex flex-col gap-5 rounded-xl bg-white p-5 shadow sm:flex-row"
              >
                <img
                  src={image}
                  alt={product?.name || "Product"}
                  className="h-36 w-full rounded-lg object-cover sm:w-36"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      to={`/product/${product?._id}`}
                      className="text-xl font-semibold hover:text-blue-600"
                    >
                      {product?.name || "Unavailable product"}
                    </Link>

                    <p className="mt-2 text-gray-500">
                      LKR {Number(product?.price || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={isUpdating || item.quantity <= 1}
                        onClick={() =>
                          handleQuantityChange(item, item.quantity - 1)
                        }
                        className="h-9 w-9 rounded border hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        −
                      </button>

                      <span className="min-w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          handleQuantityChange(item, item.quantity + 1)
                        }
                        className="h-9 w-9 rounded border hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-semibold">
                      LKR {itemTotal.toLocaleString()}
                    </p>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleRemove(item._id)}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="h-fit rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Order Summary</h2>

          <div className="mt-6 flex justify-between border-b pb-4">
            <span>Subtotal</span>
            <span className="font-semibold">
              LKR {subtotal.toLocaleString()}
            </span>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Shipping and discounts will be calculated during checkout.
          </p>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>

          <Link
            to="/products"
            className="mt-4 block text-center text-blue-600 hover:underline"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default Cart;