import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebarsales from "../components/sidebarSales";
import NavbarSales from "../components/navbarSales";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: Product;
}

interface Order {
  id: number;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

const UserOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/order/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data);
      } catch (err) {
        setError("Couldn't load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Please log in to see your orders.");
    }
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Processed":
        return "success"; 
      case "Cancelled":
        return "danger"; 
      default:
        return "secondary"; 
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2>My Orders</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      <div
        style={{
          width: "250px",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Sidebarsales />
      </div>


      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: "250px",
          height: "100vh",
          overflowY: "auto", 
        }}
      >

        <div
          style={{
            position: "fixed",
            top: 0,
            left: "250px",
            right: 0,
            zIndex: 1000,
            width: "calc(100% - 250px)", 
          }}
        >
          <NavbarSales
            user={{ name: "Karthisri", role: localStorage.getItem("role") || "Admin" }}
          />
        </div>

        <div
          className="container mt-4 pt-5"
          style={{
            flex: 1,
            marginTop: "56px",
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "960px",
            paddingBottom: "60px",
          }}
        >
          <h2>My Orders</h2>
          {orders.length === 0 ? (
            <p>You haven’t placed any orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card mb-4 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Order - {order.id}</h5>
                  <p>
                    <strong>Status: </strong>
                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
                  </p>

                  <h6>Items:</h6>
                  <ul className="list-group">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{item.product?.name || "Unknown Product"}</strong>
                          Quantity: {item.quantity} * ₹{item.price}
                        </div>
                        <span>Subtotal: ₹{item.subtotal}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Move Total Amount to the Bottom of the Card */}
                  <div className="mt-auto">
                    <h6 className="card-footer">
                      <strong>Total Amount:</strong> ₹{Number(order.total_amount).toFixed(2)}
                    </h6>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrdersPage;
