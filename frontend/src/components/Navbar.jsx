import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import toast from "react-hot-toast";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const linkClass = ({ isActive }) => isActive ? "font-semibold text-white" : "text-blue-100 hover:text-white";

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <NavLink to="/" className="text-xl font-bold sm:text-2xl">Marketplace</NavLink>
        <div className="flex flex-wrap items-center justify-end gap-3 text-sm sm:gap-5 sm:text-base">
          <NavLink className={linkClass} to="/">Home</NavLink>
          <NavLink className={linkClass} to="/products">Products</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink className={linkClass} to="/cart">Cart</NavLink>
              <NavLink className={linkClass} to="/orders">Orders</NavLink>
              <NavLink className={linkClass} to="/profile">{user?.name || "Profile"}</NavLink>
              <button onClick={handleLogout} className="rounded-lg bg-blue-800 px-3 py-2 hover:bg-blue-900">Logout</button>
            </>
          ) : (
            <>
              <NavLink className={linkClass} to="/login">Login</NavLink>
              <NavLink to="/register" className="rounded-lg bg-white px-3 py-2 font-semibold text-blue-600">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;