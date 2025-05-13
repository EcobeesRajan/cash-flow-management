
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SigninPage from "./SigninPage";
import AdminPage from "./AdminPage";
import StaffPage from "./StaffPage";
import ManageProductPage from "./Manage_product";
import AddProductPage from "./AddProductPage"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/manage-product" element={<ManageProductPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/staff" element={<StaffPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;