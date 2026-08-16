import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users")
      .then(({ data }) => setUsers(Array.isArray(data) ? data : []))
      .catch((error) => toast.error(error.response?.data?.message || "Could not load users"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold">Users</h1>
      <p className="mt-1 text-gray-500">Read-only account list. Roles should not be changed from the public frontend.</p>
      <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Created</th></tr></thead>
          <tbody className="divide-y">
            {users.map((user) => <tr key={user._id}><td className="px-4 py-3 font-medium">{user.name}</td><td className="px-4 py-3">{user.email}</td><td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize">{user.role}</span></td><td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-8 text-center text-gray-500">No users found.</p>}
      </div>
    </div>
  );
}

export default AdminUsers;