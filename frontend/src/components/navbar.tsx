
import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  role: string;
}

type NavbarProps = {
  user: User;
};

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          user.role === "Admin" ? "http://localhost:3000/order" : "http://localhost:3000/order/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const orders = res.data;

        let messages: string[] = [];

        if (user.role === "Admin") {
          
          messages = orders
            .filter((order: any) => order.status === 'Pending') 
            .map((order: any) => `New Order from ${order.user?.name}`);
        }

        setNotifications(messages);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchOrders();
  }, [user.role]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark justify-content-end" style={{ backgroundColor: '#2D2D2D' }}>
      <div className="d-flex align-items-center text-white px-4">
        {/* Notification Bell Icon */}
        <div className="me-3 position-relative">
          <button
            type="button"
            className="btn btn-light position-relative"
            onClick={() => setShowDropdown(prev => !prev)}
          >
            <FaBell size={25} />
            {notifications.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notifications.length}
              </span>
            )}
          </button>

          {showDropdown && (
            <div
              className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm p-2"
              style={{
                width: '250px',
                top: '100%',
                right: '0',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 9999,
              }}
            >
              <strong>Notifications</strong>
              <ul className="list-group list-group-flush mt-2">
                {notifications.length === 0 ? (
                  <li className="list-group-item">No new notifications</li>
                ) : (
                  notifications.map((msg, i) => (
                    <li
                    key={i}
                    className="list-group-item small list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/admin/order")}
                    >
                    {msg}
                  </li>
                  
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <FaUserCircle size={30} className="me-3" />
        <div>
          <div className="fs-4">{user.name}</div>
          <small className="fs-6">{user.role}</small>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
