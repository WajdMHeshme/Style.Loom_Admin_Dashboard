import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import DashboardLayout from "./layout/DashboardLayout";
import Products from "./pages/Products";
import Overview from "./pages/Overview";

import Man from "./pages/Categories/Man";
import Woman from "./pages/Categories/Woman";
import Child from "./pages/Categories/Child";

function App() {
  return (
    <Router>
      <Routes>
        {/* أول ما تفتح المشروع يوجهك على login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<Login />} />

        {/* مسارات الداشبورد */}
        <Route path="/dashboard/" element={<DashboardLayout />}>
          <Route path="products" element={<Products />} />
          <Route path="overview" element={<Overview />} />

          {/* مسارات الكاتيجوريز */}
          <Route path="categories/man" element={<Man />} />
          <Route path="categories/woman" element={<Woman />} />
          <Route path="categories/child" element={<Child />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
