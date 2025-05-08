import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";  // Import SweetAlert2
import NavbarSales from "../components/navbarSales";
import Sidebarsales from "../components/sidebarSales";

interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  price: number;
  quantity: number;
  brand: string;
  image_url?: string;
}
interface ReviewItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

const SalespersonOrderPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<Record<number, number>>({});
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [reviewTotal, setReviewTotal] = useState<number>(0);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId: number, qty: number) => {
    const maxQuantity = products.find((p) => p.id === productId)?.quantity || 0;
    if (qty > maxQuantity) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: `Quantity cannot exceed the available stock of ${maxQuantity}`,
      });
      qty = maxQuantity;
    }

    setOrderItems((prev) => ({
      ...prev,
      [productId]: qty,
    }));
  };

  const handleReviewOrder = () => {
    const items = products
      .filter((p) => orderItems[p.id] && orderItems[p.id] > 0)
      .map((p) => {
        const quantity = orderItems[p.id];
        return {
          productId: p.id,
          name: p.name,
          quantity,
          price: p.price,
          subtotal: quantity * p.price,
        };
      });

    if (items.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Select at least one product with quantity",
      });
      return;
    }

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    setReviewItems(items);
    setReviewTotal(total);
    setShowReview(true);
  };

  const handleConfirmOrder = async () => {
    try {
      await axios.post(
        "http://localhost:3000/order",
        {
          items: reviewItems,
          total_amount: reviewTotal,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Order Placed",
        text: "Your order has been successfully placed!",
      });

      setOrderItems({});
      setReviewItems([]);
      setReviewTotal(0);
      setShowReview(false);
      fetchProducts();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: "There was an error while placing the order. Please try again.",
      });
      console.error(error);
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div
        style={{
          width: "250px",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <Sidebarsales />
      </div>

      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: "250px", height: "100vh" }}
      >
        {/* Navbar */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "250px",
            right: 0,
            zIndex: 1000,
          }}
        >
          <NavbarSales
            user={{
              name: "Karthisri",
              role: localStorage.getItem("role") || "Admin",
            }}
          />
        </div>

        {/* Main Content */}
        <div
          className="pt-5 px-4"
          style={{
            flex: 1,
            marginTop: "56px",
            maxWidth: "1200px",
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
            paddingBottom: "60px",
          }}
        >
          <h2 className="mb-4">Place New Order</h2>
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search products by name, category, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="row">
            {products
              .filter((p) =>
                `${p.name} ${p.category} ${p.sku}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((p) => (
                <div className="col-md-4 mb-4" key={p.id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={
                        p.image_url ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={p.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text mb-1">
                        <strong>Category:</strong> {p.category}
                      </p>
                      <p className="card-text mb-1">
                        <strong>SKU:</strong> {p.sku}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Price:</strong> ₹{p.price}
                      </p>
                      <p className="card-text mb-2">
                        <strong>Available:</strong> {p.quantity}
                      </p>
                      {p.quantity > 0 ? (
                        <input
                          type="number"
                          min="0"
                          max={p.quantity}
                          value={orderItems[p.id]?.toString() ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              p.id,
                              parseInt(e.target.value || "0")
                            )
                          }
                          placeholder="Enter quantity"
                          className="form-control mt-auto"
                        />
                      ) : (
                        <div className="text-danger mt-auto fw-bold">
                          Not Available for now 
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <button className="btn btn-primary mt-3" onClick={handleReviewOrder}>
            Review Order
          </button>

          {showReview && (
            <div className="mt-5">
              <h4 className="mb-3">Review Your Order</h4>
              <ul className="list-group">
                {reviewItems.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>
                      {item.name} * {item.quantity}
                    </span>
                    <span>₹{item.subtotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <h5 className="mt-3">Total: ₹{reviewTotal.toFixed(2)}</h5>
              <button
                className="btn btn-success mt-3"
                onClick={handleConfirmOrder}
              >
                Confirm Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalespersonOrderPage;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import NavbarSales from "../components/navbarSales";
// import Sidebarsales from "../components/sidebarSales";

// interface Product {
//   id: number;
//   name: string;
//   category: string;
//   sku: string;
//   price: number;
//   quantity: number;
//   brand: string;
//   image_url?: string;
// }

// interface ReviewItem {
//   productId: number;
//   name: string;
//   quantity: number;
//   price: number;
//   subtotal: number;
// }

// const SalespersonOrderPage = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [orderItems, setOrderItems] = useState<Record<number, number>>({});
//   const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
//   const [reviewTotal, setReviewTotal] = useState<number>(0);
//   const [showReview, setShowReview] = useState<boolean>(false);
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/product", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Error fetching products", err);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleQuantityChange = (productId: number, qty: number) => {
//     const maxQuantity = products.find(p => p.id === productId)?.quantity || 0;
//     if (qty > maxQuantity) {
//       alert(`Quantity cannot exceed the available stock of ${maxQuantity}`);
//       qty = maxQuantity;
//     }

//     setOrderItems((prev) => ({
//       ...prev,
//       [productId]: qty,
//     }));
//   };

//   const handleReviewOrder = () => {
//     const items = products
//       .filter((p) => orderItems[p.id] && orderItems[p.id] > 0)
//       .map((p) => {
//         const quantity = orderItems[p.id];
//         return {
//           productId: p.id,
//           name: p.name,
//           quantity,
//           price: p.price,
//           subtotal: quantity * p.price,
//         };
//       });

//     if (items.length === 0) {
//       alert("Select at least one product with quantity");
//       return;
//     }

//     const total = items.reduce((sum, item) => sum + item.subtotal, 0);
//     setReviewItems(items);
//     setReviewTotal(total);
//     setShowReview(true);
//   };

//   const handleConfirmOrder = async () => {
//     try {
//       await axios.post(
//         "http://localhost:3000/order",
//         {
//           items: reviewItems,
//           total_amount: reviewTotal,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       alert("Order placed successfully!");
//       setOrderItems({});
//       setReviewItems([]);
//       setReviewTotal(0);
//       setShowReview(false);
//       fetchProducts();
//     } catch (error) {
//       alert("Failed to place order");
//       console.error(error);
//     }
//   };

//   // Filter products based on search term
//   const filteredProducts = products.filter((p) =>
//     [p.name, p.category, p.sku].some((field) =>
//       field.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   return (
//     <div className="d-flex" style={{ height: "100vh" }}>
//       <div
//         style={{
//           width: "250px",
//           height: "100vh",
//           position: "fixed",
//           top: 0,
//           left: 0,
//           zIndex: 1000,
//         }}
//       >
//         <Sidebarsales />
//       </div>

//       <div
//         className="flex-grow-1 d-flex flex-column"
//         style={{ marginLeft: "250px", height: "100vh" }}
//       >
//         {/* Navbar */}
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: "250px",
//             right: 0,
//             zIndex: 1000,
//           }}
//         >
//           <NavbarSales
//             user={{
//               name: "Karthisri",
//               role: localStorage.getItem("role") || "Admin",
//             }}
//           />
//         </div>

//         {/* Main Content */}
//         <div
//           className="pt-5 px-4"
//           style={{
//             flex: 1,
//             marginTop: "56px",
//             maxWidth: "1200px",
//             marginLeft: "auto",
//             marginRight: "auto",
//             width: "100%",
//             paddingBottom: "60px",
//           }}
//         >
//           <h2 className="mb-4">Place New Order</h2>

//           {/* Search Bar */}
//           <div className="mb-4">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search products"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="row">
//             {filteredProducts.map((p) => (
//               <div className="col-md-4 mb-4" key={p.id}>
//                 <div className="card h-100 shadow-sm">
//                   <img
//                     src={p.image_url}
//                     alt={p.name}
//                     className="card-img-top"
//                     style={{ height: "200px", objectFit: "cover" }}
//                   />
//                   <div className="card-body d-flex flex-column">
//                     <h5 className="card-title">{p.name}</h5>
//                     <p className="card-text mb-1">
//                       <strong>Category:</strong> {p.category}
//                     </p>
//                     <p className="card-text mb-1">
//                       <strong>SKU:</strong> {p.sku}
//                     </p>
//                     <p className="card-text mb-1">
//                       <strong>Price:</strong> ₹{p.price}
//                     </p>
//                     <p className="card-text mb-2">
//                       <strong>Available:</strong> {p.quantity}
//                     </p>
//                     <input
//                       type="number"
//                       min="0"
//                       max={p.quantity}
//                       value={orderItems[p.id]?.toString() ?? ""}
//                       onChange={(e) =>
//                         handleQuantityChange(p.id, parseInt(e.target.value || "0"))
//                       }
//                       placeholder="Enter quantity"
//                       className="form-control mt-auto"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button className="btn btn-primary mt-3" onClick={handleReviewOrder}>
//             Review Order
//           </button>

//           {showReview && (
//             <div className="mt-5">
//               <h4 className="mb-3">Review Your Order</h4>
//               <ul className="list-group">
//                 {reviewItems.map((item, index) => (
//                   <li
//                     key={index}
//                     className="list-group-item d-flex justify-content-between"
//                   >
//                     <span>
//                       {item.name} * {item.quantity}
//                     </span>
//                     <span>₹{item.subtotal.toFixed(2)}</span>
//                   </li>
//                 ))}
//               </ul>
//               <h5 className="mt-3">Total: ₹{reviewTotal.toFixed(2)}</h5>
//               <button
//                 className="btn btn-success mt-3"
//                 onClick={handleConfirmOrder}
//               >
//                 Confirm Order
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalespersonOrderPage;
