import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import toast from "react-hot-toast";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <NavLink
          to="/"
          className="text-2xl font-bold"
        >
          Marketplace
        </NavLink>

        <div className="flex items-center gap-6">

          <NavLink to="/">Home</NavLink>

          <NavLink to="/products">Products</NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/cart">Cart</NavLink>

              <NavLink to="/orders">Orders</NavLink>

              <NavLink to="/profile">
                {user?.name}
              </NavLink>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>

              <NavLink to="/register">
                Register
              </NavLink>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;