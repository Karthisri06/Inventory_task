import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Order {
  user: { id: number; name: string };
  store: string;
  id: number;
  total_amount: number;
  status: string;
}

const OrdersChart = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:3000/order/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allOrders = response.data.flatMap((entry: any) => entry.orders);
        setOrders(allOrders.slice(-6)); // Last 6 orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);


  const chartData = {
    labels: orders.map((order) => order.store),
    datasets: [
      {
        label: "Total Amount (₹)",
        data: orders.map((order) => order.total_amount),
        backgroundColor: "#36A2EB",
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        height: "500px",
        margin: "0 auto",
      }}
    >
      <h5 className="mb-4 text-center">Recent Orders (Last 6)</h5>
      <div style={{ height: "70%", width: "800px" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false, 
            plugins: {
              legend: {
                position: "top" as const,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
  
export default OrdersChart;