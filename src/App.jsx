
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";


import Dashboard from "./Admin/Dashboard";
import InventoryPage from "./Admin/InventoryPage";
import ExpensesPage from "./Admin/ExpensesPage";
import TransactionPage from "./Admin/TransactionPage";

import MenuPage from "./MenuPage";
import IncomePage from "./IncomePage";
import AddMenuPage from "./Admin/AddMenuPage";
import ViewMenuPage from "./ViewMenuPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/add-menu" element={<AddMenuPage/>} />
        <Route path="/view-menu" element={<ViewMenuPage/>} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

