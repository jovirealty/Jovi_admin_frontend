import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ allow = [] }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if(!user) return <Navigate to="/login" replace />;
    const ok = allow.length === 0 || user.roles?.some(r => allow.includes(r));
    return ok ? <Outlet /> : <Navigate to="/403" replace />;
}