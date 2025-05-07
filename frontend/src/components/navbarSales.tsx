

import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavbarSales: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  
  const storedUser = localStorage.getItem('user');
  let user = { name: '', role: '' };  
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error('Invalid user data in localStorage');
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/order/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const orders = res.data;

        let messages: string[] = [];

      
        messages = orders.map((order: any) => {
          if (order.status === 'Processed') {
            return ` Your Order #${order.id} has been processed.`;

          } else if (order.status === 'Cancelled') {
            return `Your Order #${order.id} was cancelled.`;
          } else {
            return null; 
          }
        }).filter(Boolean);
        
        setNotifications(messages);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-4 justify-content-end" style={{ backgroundColor: '#2D2D2D' }}>
      <div className="d-flex align-items-center text-white">

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
                  notifications.map((notification, index) => (
                    <li key={index} className="list-group-item">
                      {notification}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        <div className="d-flex align-items-center">
          <FaUserCircle size={30} className="text-white" />
          <div className="ms-2 text-white">
            <div className="fs-4">{user.name}</div>
            <small className="fs-6">{user.role}</small>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarSales;
