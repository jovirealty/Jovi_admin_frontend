import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function GuestRoute () {
    const {user, loading} = useAuth();
    if(loading) return null; // spinner will be added here
    if(!user) return <Outlet />;
    const isSuper = user?.roles?.includes('superadmin');
    const to = isSuper ? '/admin/dashboard' : '/agent/dashboard';
    return <Navigate to={to} replace />;
}