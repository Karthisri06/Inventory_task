import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaClipboardList } from "react-icons/fa";
import LogoutButton from "./logout";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Product Management", path: "/admin/product", icon: <FaBox /> },
    { name: "Order Management", path: "/admin/order", icon: <FaClipboardList /> },
  ];

  return (
    <div className="d-flex flex-column text-white vh-100 p-3" style={{ width: "250px", backgroundColor: "#2D2D2D" }}>
      <h4 className="text-center mb-4 fw-bold">Admin Panel</h4>

      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center px-3 py-2 gap-2 rounded ${
                location.pathname === item.path ? "active bg-secondary text-white" : "text-white-50"
              }`}
            >
              <span className="fs-4">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-3 border-top text-center">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;

