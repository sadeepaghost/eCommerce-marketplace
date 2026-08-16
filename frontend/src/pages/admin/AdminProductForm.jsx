import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";

const emptyProduct = {
  name: "",
  price: "",
  description: "",
  category: "general",
  brand: "Generic",
  stock: "0",
  image: "",
  isFeatured: false,
};

function AdminProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyProduct);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const requests = [api.get("/categories")];
    if (editing) requests.push(api.get(`/products/${id}`));

    Promise.all(requests)
      .then(([categoryResponse, productResponse]) => {
        setCategories(categoryResponse.data || []);
        if (productResponse) {
          const product = productResponse.data.product || productResponse.data;
          setForm({
            name: product.name || "",
            price: String(product.price ?? ""),
            description: product.description || "",
            category: product.category || "general",
            brand: product.brand || "Generic",
            stock: String(product.stock ?? 0),
            image: product.image || "",
            isFeatured: Boolean(product.isFeatured),
          });
        }
      })
      .catch((error) => toast.error(error.response?.data?.message || "Could not load product form"))
      .finally(() => setLoading(false));
  }, [editing, id]);

  const change = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const uploadImage = async () => {
    if (!file) return form.image;
    const data = new FormData();
    data.append("image", file);
    const response = await api.post("/upload", data);
    return response.data.imageUrl;
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const image = await uploadImage();
      const payload = {
        ...form,
        image,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editing) {
        await api.put(`/products/${id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  const fields = [
    ["name", "Product name", "text"],
    ["price", "Price (LKR)", "number"],
    ["brand", "Brand", "text"],
    ["stock", "Stock", "number"],
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold">{editing ? "Edit product" : "Add product"}</h1><p className="mt-1 text-gray-500">Product information and image.</p></div>
        <Link to="/admin/products" className="text-blue-600 hover:underline">Back to products</Link>
      </div>

      <form onSubmit={submit} className="mt-8 rounded-xl bg-white p-6 shadow">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(([name, label, type]) => (
            <label key={name} className="block">
              <span className="mb-1 block text-sm font-medium">{label}</span>
              <input name={name} type={type} min={type === "number" ? 0 : undefined} step={name === "price" ? "0.01" : undefined} value={form[name]} onChange={change} required className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
            </label>
          ))}

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Category</span>
            <input name="category" list="category-list" value={form.category} onChange={change} required className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
            <datalist id="category-list">{categories.map((category) => <option key={category._id} value={category.name} />)}</datalist>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Image file</span>
            <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            <span className="mt-1 block text-xs text-gray-500">Maximum 5 MB. Leave empty to keep the existing image.</span>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Image URL (optional alternative)</span>
            <input name="image" type="url" value={form.image} onChange={change} className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Description</span>
            <textarea name="description" value={form.description} onChange={change} required rows="5" className="w-full rounded-lg border border-gray-300 px-3 py-2.5" />
          </label>

          <label className="flex items-center gap-3 sm:col-span-2">
            <input name="isFeatured" type="checkbox" checked={form.isFeatured} onChange={change} className="h-4 w-4" />
            <span className="font-medium">Featured product</span>
          </label>
        </div>

        {form.image && <img src={form.image} alt="Current product" className="mt-6 h-40 w-40 rounded-xl object-cover" />}
        <button disabled={saving} className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : editing ? "Update product" : "Create product"}</button>
      </form>
    </div>
  );
}

export default AdminProductForm;