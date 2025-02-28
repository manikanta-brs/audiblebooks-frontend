import { Outlet, Navigate } from "react-router";
import { useSelector } from "react-redux";
const ProtectedRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
