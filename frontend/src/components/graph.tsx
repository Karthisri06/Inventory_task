import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Container, Spinner, Alert } from "react-bootstrap";


ChartJS.register(ArcElement, Tooltip, Legend);

interface Order {
  status: "Pending" | "Processed" | "Cancelled";
}

const OrdersChart: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/order/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const allOrders = res.data.flatMap((entry: any) => entry.orders);
        setOrders(allOrders);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusCounts = () => {
    const counts = { Pending: 0, Processed: 0, Canceled: 0 };

    orders.forEach((order) => {
      if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const chartData = {
    labels: ["Pending", "Processed", "Canceled"],
    datasets: [
      {
        data: [
          statusCounts.Pending,
          statusCounts.Processed,
          statusCounts.Canceled,
        ],
        backgroundColor: ["#F6C85F", "#4E79A7", "#E15759"],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5 text-center">
      <h3 className="mb-4">Order Status Distribution</h3>

    
      <div
        style={{
          width: "400px",
          height: "300px",
          margin: "0 auto", 
        }}
      >
        <Pie data={chartData} options={chartOptions} />
      </div>
    </Container>
  );
};

export default OrdersChart;
