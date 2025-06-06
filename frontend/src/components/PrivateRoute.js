import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // 👈 prevent early redirect

  return token ? children : <Navigate to="/login" />;
}
