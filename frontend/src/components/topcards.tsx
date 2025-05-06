
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";

const TopCards = () => {
  const [ordersCount, setOrdersCount] = useState('');
  const [lowStockCount, setLowStockCount] = useState('');
  const [usersCount, setUsersCount] = useState('');
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/order/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allOrders = res.data.flatMap((entry: any) => entry.orders);
        setOrdersCount(allOrders.length.toString());
        
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/product", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lowStockProducts = res.data.filter((product: { quantity: number }) => product.quantity < 10);
        setLowStockCount(lowStockProducts.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsersCount(res.data.length);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchOrders();
    fetchProducts();
    fetchUsers();
  }, [token]);

  const data = [
    { title: "Orders", count: ordersCount, variant: "secondary" },
    { title: "Low Stock Alert", count: lowStockCount, variant: "warning" },
    { title: "Customers", count: usersCount, variant: "success" },
  ];

  return (
    <div className="d-flex gap-3 mb-4">
      {data.map((item, num) => (
        <Card
          key={num}
          bg={item.variant}
          text="white"
          className="flex-fill text-center"
          style={{ minHeight: "200px" }}
        >
          <Card.Body className="d-flex flex-column justify-content-center">
            <Card.Title>{item.title}</Card.Title>
            <Card.Text style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              {item.count}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default TopCards;
