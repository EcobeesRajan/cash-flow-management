import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import InventoryPage from "./pages/InventoryPage";
import ExpensesPage from "./pages/ExpensesPage";
import TransactionPage from "./pages/TransactionPage";
import MenuPage from "./pages/MenuPage";
import IncomePage from "./pages/IncomePage";
import AddMenuPage from "./pages/AddMenuPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/add-menu" element={<AddMenuPage />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
