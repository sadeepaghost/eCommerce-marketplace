import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api.get("/admin/products")
      .then(({ data }) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => toast.error(error.response?.data?.message || "Could not load products"))
      .finally(() => setLoading(false));
  }, []);

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;

    try {
      setDeletingId(product._id);
      await api.delete(`/products/${product._id}`);
      setProducts((current) => current.filter((item) => item._id !== product._id));
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-1 text-gray-500">Add, edit, and remove catalogue items.</p>
        </div>
        <Link to="/admin/products/new" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Add product</Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-4 py-3">
                  <div className="flex min-w-56 items-center gap-3">
                    <img src={product.image || "https://placehold.co/80x80?text=No+Image"} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div><p className="font-semibold text-gray-900">{product.name}</p><p className="text-xs text-gray-500">{product.brand}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">LKR {Number(product.price).toLocaleString()}</td>
                <td className={`px-4 py-3 font-semibold ${product.stock < 10 ? "text-red-600" : "text-green-600"}`}>{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link to={`/admin/products/${product._id}/edit`} className="font-semibold text-blue-600 hover:underline">Edit</Link>
                    <button disabled={deletingId === product._id} onClick={() => deleteProduct(product)} className="font-semibold text-red-600 hover:underline disabled:opacity-50">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-gray-500">No products found.</p>}
      </div>
    </div>
  );
}

export default AdminProducts;