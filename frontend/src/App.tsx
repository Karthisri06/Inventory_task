


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./pages/formcomponent";
import AdminDashboard from "./admindashboard/Admindashboard";
import ProductTable from "./admindashboard/productdash";
import OrderTable from "./admindashboard/orderdash";
import SalesDashboard from "./salesperson/salesdashboard";
import CreateOrder from "./salesperson/createorder";
import OrderHistory from "./salesperson/myorders";
import PrivateRoute from "./pages/privateroutes"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />

        <Route
          path="/"
          element={
            localStorage.getItem("role") === "admin" ?(
              <Navigate to="/admin" />
            ) : localStorage.getItem("role") === "salesperson" ? (
              <Navigate to="/sp" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

   
        <Route
          path="/admin"
          element={<PrivateRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}
        />
        <Route
          path="/admin/product"
          element={<PrivateRoute element={<ProductTable />} allowedRoles={["admin"]} />}
        />
        <Route
          path="/admin/order"
          element={<PrivateRoute element={<OrderTable />} allowedRoles={["admin"]} />}
        />

        {/* Salesperson Routes */}
        <Route
          path="/sp"
          element={<PrivateRoute element={<SalesDashboard />} allowedRoles={["salesperson"]} />}
        />
        <Route
          path="/sp/create"
          element={<PrivateRoute element={<CreateOrder />} allowedRoles={["salesperson"]} />}
        />
        <Route
          path="/sp/history"
          element={<PrivateRoute element={<OrderHistory />} allowedRoles={["salesperson"]} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
