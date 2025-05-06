import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebarsales from '../components/sidebarSales';
import NavbarSales from '../components/navbarSales';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Order {
  id: number;
  status: string;
  total_amount: number;
  created_at: string;
}

const SalesDashboard = () => {
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
        setError("Failed to load your sales data.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setError("Please log in to view dashboard.");
      setLoading(false);
    }
  }, [token]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const completedOrders = orders.filter(o => o.status === "Processed").length;

  const chartData = {
    labels: ['Total Orders', 'Pending Orders', 'Completed Orders'],
    datasets: [
      {
        label: 'Order Stats',
        data: [totalOrders, pendingOrders, completedOrders],
        backgroundColor: ['#007bff', '#ffc107', '#28a745'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Your Order Summary' },
    },
  };

  return (
    <div className="d-flex">
      <div style={{ width: "250px" }}>
        <Sidebarsales />
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <NavbarSales user={{ name: "Karthisri", role: localStorage.getItem("role") || "Salesperson" }} />

        <div className="container mt-4">
    

          {loading ? (
            <p>Loading dashboard...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <>
              <div className="row mt-4">
                {[
                  { label: 'Total Orders', value: totalOrders, color: 'primary' },
                  { label: 'Pending Orders', value: pendingOrders, color: 'warning' },
                  { label: 'Completed Orders', value: completedOrders, color: 'success' },
                ].map((item, num) => (
                  <div key={num} className="col-md-4 mb-3">
                    <div className={`card border-${item.color}`}>
                      <div className="card-body">
                        <h5 className="card-title">{item.label}</h5>
                        <p className="card-text fs-4">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 d-flex justify-content-center">
  <div style={{ width: '500px', height: '300px' }}>
    <Bar data={chartData} options={chartOptions} />
  </div>
</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;




