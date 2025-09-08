import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import DashboardLayout from "./layout/DashboardLayout";

import Products from "./pages/Products";
import Overview from "./pages/Overview";
import Man from "./pages/Categories/Man";
import Woman from "./pages/Categories/Woman";
import Child from "./pages/Categories/Child";


const routes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "products", element: <Products /> },
      { path: "overview", element: <Overview /> },
      {
        path: "categories",
        children: [
          { path: "man", element: <Man /> },
          { path: "woman", element: <Woman /> },
          { path: "child", element: <Child /> },
        ],
      },
    ],
  },
];

const renderRoutes = (routes: any[]) =>
  routes.map((route, i) => {
    if (route.children) {
      return (
        <Route key={i} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return <Route key={i} path={route.path} element={route.element} />;
  });

function App() {
  return (
    <Router>
      <Routes>{renderRoutes(routes)}</Routes>
    </Router>
  );
}

export default App;
