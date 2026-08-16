import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminRoute({ children }) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;