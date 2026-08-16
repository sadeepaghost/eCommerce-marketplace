import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../services/api";
import { updateUser } from "../features/auth/authSlice";
import Loader from "../components/Loader";

function Profile() {
  const storedUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: storedUser?.name || "", email: storedUser?.email || "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/users/profile")
      .then(({ data }) => setForm({ name: data.name || "", email: data.email || "" }))
      .catch((error) => toast.error(error.response?.data?.message || "Could not load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put("/users/profile", form);
      dispatch(updateUser(data.user));
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-xl px-6 py-12">
      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold">Profile</h1>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
        </label>
        <p className="mt-4 text-sm text-gray-500">Account role: {storedUser?.role || "user"}</p>
        <button disabled={saving} className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white disabled:opacity-60">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}

export default Profile;