import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import Loader from "../components/Loader";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my")
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .catch((error) => toast.error(error.response?.data?.message || "Could not load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">My orders</h1>
      {orders.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <p className="text-gray-500">You have not placed any orders yet.</p>
          <Link to="/products" className="mt-5 inline-block text-blue-600 hover:underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order._id} className="rounded-xl bg-white p-6 shadow">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="mt-1 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold capitalize text-blue-700">{order.status}</span>
              </div>
              <div className="mt-4 space-y-3">
                {order.orderItems?.map((item) => (
                  <div key={item._id || item.productId?._id} className="flex justify-between gap-4">
                    <span>{item.productId?.name || "Unavailable product"} × {item.quantity}</span>
                    <span>LKR {(Number(item.productId?.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-t pt-4 text-right text-lg font-bold">Total: LKR {Number(order.totalPrice || 0).toLocaleString()}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Orders;