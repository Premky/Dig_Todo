import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
    const { state } = useAuth();
    // console.log(state);
    return state.valid ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
