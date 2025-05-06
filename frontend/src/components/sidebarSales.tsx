import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaPlus, FaHistory } from "react-icons/fa";
import LogoutButton from "./logout";

const Sidebarsales = () => {
  const location = useLocation();

  return (
    <div
      className="d-flex flex-column justify-content-between text-white p-3"
      style={{ minHeight: "100vh", width: "250px", backgroundColor: "#2D2D2D" }}
    >
      {/* Top Section */}
      <div className="flex-grow-1">
        <h4>Salesperson Panel</h4>
        <ul className="nav flex-column mt-4">
          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center px-3 py-2 gap-2 rounded ${
                location.pathname === "/sp"
                  ? "active bg-secondary text-white"
                  : "text-white-50"
              }`}
              to="/sp"
            >
              <FaTachometerAlt className="fs-4" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center px-3 py-2 gap-2 rounded ${
                location.pathname === "/sp/create"
                  ? "active bg-secondary text-white"
                  : "text-white-50"
              }`}
              to="/sp/create"
            >
              <FaPlus className="fs-4" />
              <span>Create Order</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link d-flex align-items-center px-3 py-2 gap-2 rounded ${
                location.pathname === "/sp/history"
                  ? "active bg-secondary text-white"
                  : "text-white-50"
              }`}
              to="/sp/history"
            >
              <FaHistory className="fs-4" />
              <span>Order History</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Bottom Section (Logout) */}
      <div className="pt-3 mt-3 border-top text-center">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebarsales;
