import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Spinner, Alert, Form } from "react-bootstrap";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

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
  
      console.log("Full response data:", res.data);
  

      const allOrders = res.data
        .flatMap((entry: any) => entry.orders)
        // .filter((order: Order) => order.status !== "Canceled");
  
      console.log("Filtered orders:", allOrders);
      setOrders(allOrders);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-warning fw-bold";
      case "Processed":
        return "text-success fw-bold";
      case "Canceled":
        return "text-danger fw-bold"; 
      default:
        return "";
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

  // if (loading) return <Spinner animation="border" className="mt-4" />;

  return (
    <div className="d-flex">
      <div style={{ width: "250px" }}>
        <Sidebar />
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <Navbar
          user={{
            name: "Karthisri",
            role: localStorage.getItem("role") || "Admin",
          }}
        />

        <Container className="mt-5">
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
                  <td className={getStatusClass(order.status)}>{order.status}</td>

                  <td>
                    <Form.Select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updatingOrderId === order.id}
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
        </Container>
      </div>
    </div>
  );
};

export default AdminOrders;
