import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";

const statuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api.get("/admin/orders")
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .catch((error) => toast.error(error.response?.data?.message || "Could not load orders"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status: data.status } : order));
      toast.success("Order status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update order");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold">Orders</h1>
      <p className="mt-1 text-gray-500">Review orders and update fulfilment status.</p>
      <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th></tr></thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-3"><p className="font-medium">{order.userId?.name || "Unknown user"}</p><p className="text-xs text-gray-500">{order.userId?.email}</p></td>
                <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold">LKR {Number(order.totalPrice || 0).toLocaleString()}</td>
                <td className="px-4 py-3"><select value={order.status} disabled={updatingId === order._id} onChange={(event) => updateStatus(order._id, event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 capitalize disabled:opacity-50">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-8 text-center text-gray-500">No orders found.</p>}
      </div>
    </div>
  );
}

export default AdminOrders;