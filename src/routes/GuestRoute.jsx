import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function GuestRoute () {
    const {user, loading} = useAuth();
    if(loading) return null; // spinner will be added here
    return user ? <Navigate to="/" replace /> : <Outlet />;
}