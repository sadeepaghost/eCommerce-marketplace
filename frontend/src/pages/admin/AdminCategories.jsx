import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/categories")
      .then(({ data }) => setCategories(data || []))
      .catch((error) => toast.error(error.response?.data?.message || "Could not load categories"))
      .finally(() => setLoading(false));
  }, []);

  const reset = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        const { data } = await api.put(`/categories/${editingId}`, form);
        setCategories((current) => current.map((category) => category._id === editingId ? data : category));
        toast.success("Category updated");
      } else {
        const { data } = await api.post("/categories", form);
        setCategories((current) => [...current, data]);
        toast.success("Category created");
      }
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save category");
    } finally {
      setSaving(false);
    }
  };

  const edit = (category) => {
    setEditingId(category._id);
    setForm({ name: category.name, description: category.description || "" });
  };

  const remove = async (category) => {
    if (!window.confirm(`Delete ${category.name}?`)) return;
    try {
      await api.delete(`/categories/${category._id}`);
      setCategories((current) => current.filter((item) => item._id !== category._id));
      if (editingId === category._id) reset();
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete category");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold">Categories</h1>
      <p className="mt-1 text-gray-500">Create the names used by the product form.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="h-fit rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">{editingId ? "Edit category" : "Add category"}</h2>
          <label className="mt-5 block"><span className="mb-1 block text-sm font-medium">Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2.5" /></label>
          <label className="mt-4 block"><span className="mb-1 block text-sm font-medium">Description</span><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="4" className="w-full rounded-lg border border-gray-300 px-3 py-2.5" /></label>
          <div className="mt-5 flex gap-3"><button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>{editingId && <button type="button" onClick={reset} className="rounded-lg border px-4 py-2">Cancel</button>}</div>
        </form>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          {categories.map((category) => (
            <div key={category._id} className="flex flex-wrap items-center justify-between gap-4 border-b p-5 last:border-0">
              <div><p className="font-semibold text-gray-900">{category.name}</p><p className="mt-1 text-sm text-gray-500">{category.description || "No description"}</p></div>
              <div className="flex gap-3"><button onClick={() => edit(category)} className="font-semibold text-blue-600">Edit</button><button onClick={() => remove(category)} className="font-semibold text-red-600">Delete</button></div>
            </div>
          ))}
          {categories.length === 0 && <p className="p-8 text-center text-gray-500">No categories found.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;