import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { getCart } from "../services/cart/cartService";
import Loader from "../components/Loader";

const emptyForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  postalCode: "",
  country: "Sri Lanka",
};

function Checkout() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCart()
      .then((data) => setItems(Array.isArray(data) ? data : data.cart || []))
      .catch((error) => {
        toast.error(error.response?.data?.message || "Could not load your cart");
      })
      .finally(() => setLoading(false));
  }, []);

  const total = items.reduce(
    (sum, item) => sum + Number(item.productId?.price || 0) * item.quantity,
    0
  );

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    if (items.length === 0) return;

    try {
      setSubmitting(true);
      await api.post("/address", { ...form, isDefault: true });
      await api.post("/orders");
      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Nothing to check out</h1>
        <p className="mt-3 text-gray-500">Your cart is empty.</p>
        <Link to="/products" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={placeOrder} className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">Delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["fullName", "Full name"],
              ["phone", "Phone"],
              ["addressLine1", "Address line 1"],
              ["addressLine2", "Address line 2 (optional)"],
              ["city", "City"],
              ["district", "District"],
              ["postalCode", "Postal code"],
              ["country", "Country"],
            ].map(([name, label]) => (
              <label key={name} className={name.startsWith("address") ? "sm:col-span-2" : ""}>
                <span className="mb-1 block text-sm font-medium">{label}</span>
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={name !== "addressLine2"}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
            ))}
          </div>
          <button disabled={submitting} className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white disabled:opacity-60">
            {submitting ? "Placing order..." : "Place order (Cash on delivery)"}
          </button>
        </form>

        <aside className="h-fit rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between gap-4 text-sm">
                <span>{item.productId?.name || "Product"} × {item.quantity}</span>
                <span>LKR {(Number(item.productId?.price || 0) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span><span>LKR {total.toLocaleString()}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;