import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/products/low-stock")])
      .then(([statsResponse, stockResponse]) => {
        setStats(statsResponse.data);
        setLowStock(stockResponse.data);
      })
      .catch((error) => toast.error(error.response?.data?.message || "Could not load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    ["Users", stats?.users || 0],
    ["Products", stats?.products || 0],
    ["Orders", stats?.orders || 0],
    ["Revenue", `LKR ${Number(stats?.revenue || 0).toLocaleString()}`],
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-gray-500">Store overview and stock warnings.</p>
        </div>
        <Link to="/admin/products/new" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">Add product</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Low stock</h2>
          <Link to="/admin/products" className="text-sm font-semibold text-blue-600 hover:underline">Manage products</Link>
        </div>
        {lowStock.length === 0 ? (
          <p className="mt-4 text-gray-500">No products are below 10 items.</p>
        ) : (
          <div className="mt-4 divide-y">
            {lowStock.map((product) => (
              <div key={product._id} className="flex items-center justify-between gap-4 py-3">
                <span>{product.name}</span>
                <span className="font-semibold text-red-600">{product.stock} left</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;