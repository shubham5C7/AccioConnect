import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  if (!currentUser) {
    return <Navigate to="/signIn" replace />;
  }

  return children;
};

export default ProtectedRoute;
