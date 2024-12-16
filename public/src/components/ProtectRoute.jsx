import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

export const ProtectRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};
