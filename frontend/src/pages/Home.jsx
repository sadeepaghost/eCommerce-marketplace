import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Home Page
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-5 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;