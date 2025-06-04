import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/Inventory';
import ExpensesPage from './pages/Expenses';
import TransactionPage from './pages/Transaction';
import MenuPage from './pages/MenuPage';
import IncomePage from './pages/Income';
import AddMenuPage from './pages/AddMenu';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute><ExpensesPage /></PrivateRoute>} />
      <Route path="/menu" element={<PrivateRoute><MenuPage /></PrivateRoute>} />
      <Route path="/add-menu" element={<PrivateRoute><AddMenuPage /></PrivateRoute>} />
      <Route path="/income" element={<PrivateRoute><IncomePage /></PrivateRoute>} />
      <Route path="/transaction" element={<PrivateRoute><TransactionPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
