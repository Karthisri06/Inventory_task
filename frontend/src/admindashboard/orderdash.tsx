import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Spinner, Alert, Form } from "react-bootstrap";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import { BsCheckCircleFill, BsXCircleFill, BsHourglassSplit } from "react-icons/bs";


interface Order {
  user: any;
  store: string;
  id: number;
  total_amount: number;
  status: string;
  name: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const statusOptions = ["Pending", "Processed", "Canceled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/order/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const allOrders = res.data.flatMap((entry: any) => entry.orders);
      setOrders(allOrders);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return { icon: <BsHourglassSplit color="#ffc107" />, text: "Pending" };
      case "Processed":
        return { icon: <BsCheckCircleFill color="#28a745" />, text: "Processed" };
      case "Canceled":
        return { icon: <BsXCircleFill color="#dc3545" />, text: "Canceled" };
      default:
        return { icon: null, text: status };
    }
  };
  

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      await axios.put(
        `http://localhost:3000/order/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      setError("Failed to update status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar - fixed left */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#343a40",
          color: "#fff",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: "250px", height: "100vh", overflow: "hidden" }}
      >
        {/* Navbar - fixed top */}
        <div style={{ position: "sticky", top: 0, zIndex: 1030 }}>
          <Navbar
            user={{
              name: "Karthisri",
              role: localStorage.getItem("role") || "Admin",
            }}
          />
        </div>

        {/* Scrollable content */}
        <div
          className="flex-grow-1 overflow-auto p-4"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <h2 className="mb-4">Manage Orders</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User Id</th>
                <th>Store Name</th>
                <th>Order ID</th>
                <th>Total Amount (₹)</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.user.id}</td>
                  <td>{order.store}</td>
                  <td>{order.id}</td>
                  <td>₹{order.total_amount}</td>
                  <td className="fw-bold d-flex align-items-center gap-2">
  {getStatusStyle(order.status).icon}
  {getStatusStyle(order.status).text}
</td>
                  <td>
                    <Form.Select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={order.status !== "Pending" || updatingOrderId === order.id}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
