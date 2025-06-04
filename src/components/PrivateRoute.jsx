import { Navigate } from 'react-router-dom';
import { useAuth } from '/home/rajan/Desktop/New Cash FLow Management/cash-flow-management/src/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;

