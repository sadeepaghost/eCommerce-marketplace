import { NavLink, Outlet } from "react-router-dom";

const links = [
  ["/admin", "Dashboard", true],
  ["/admin/products", "Products"],
  ["/admin/categories", "Categories"],
  ["/admin/orders", "Orders"],
  ["/admin/users", "Users"],
];

function AdminLayout() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-xl bg-slate-900 p-4 text-white shadow">
        <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">Admin panel</p>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {links.map(([to, label, end]) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </section>
  );
}

export default AdminLayout;