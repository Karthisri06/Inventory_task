

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  brand: string;
  image_url:string | null;
}

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    price: 0,
    sku: "",
    quantity: 0,
    brand: "",
    image_url:"",
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:3000/product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async () => {
    if (!token) return;

    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.sku || !newProduct.quantity || !newProduct.brand) {
      toast.error("All fields are required.");
      return;
    }

    try {
      if (editingProductId) {
        await axios.put(`http://localhost:3000/product/${editingProductId}`, newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product updated successfully!");
      } else {
        await axios.post("http://localhost:3000/product", newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product added successfully!");
      }
      setNewProduct({ name: "", category: "", price: 0, quantity: 0, brand: "", sku: "" ,image_url:""});
      setEditingProductId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product", error);
      toast.error("Failed to save product. Please try again.");
    }
  };

  const handleEditProduct = (product: Product) => {
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      brand: product.brand,
      sku: product.sku,
      image_url:product.image_url,
    });
    setEditingProductId(product.id);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:3000/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
      toast.error("Failed to delete product.");
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("csv", csvFile);

    try {
      const response = await axios.post("http://localhost:3000/product/csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message);
      fetchProducts();
    } catch (error) {
      console.error("Error uploading CSV file", error);
      toast.error("Failed to upload CSV file.");
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <div className="bg-dark text-white" style={{ width: "250px", position: "sticky", top: 0, height: "100vh" }}>
        <Sidebar />
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <div style={{ position: "sticky", top: 0, zIndex: 1030 }}>
          <Navbar user={{ name: "Karthisri", role: localStorage.getItem("role") || "Admin" }} />
        </div>

        <div className="flex-grow-1 overflow-auto px-4 py-3 d-flex flex-column align-items-center">
          <h3 className="mb-4 text-center">Product Management</h3>

          <div style={{ maxWidth: "1200px", width: "100%" }}>
      
            <div className="mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">
                  {editingProductId ? "Edit Product" : "Add New Product"}
                </div>
                <div className="card-body">
                  <Form>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter product name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter price"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter quantity"
                          value={newProduct.quantity}
                          onChange={(e) => setNewProduct({ ...newProduct, quantity: +e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter brand"
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Label>SKU</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter SKU"
                          value={newProduct.sku}
                          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        />
                      </div>
                      <div className="col-md-12 mb-3 mx-auto">
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter image URL"
                        value={(newProduct as any).image_url || ""}
                        onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value } as any)}
                      />
                    </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                      <Button variant="secondary" onClick={handleSaveProduct}>
                        <i className={`bi ${editingProductId ? "bi-check-circle" : "bi-plus-circle"} me-2`} />
                        {editingProductId ? "Update Product" : "Add Product"}
                      </Button>

                      <Form.Group controlId="csvInput" className="d-flex align-items-center mb-0">
                        <Form.Label className="btn btn-success mb-0 me-2">
                          <i className="bi bi-file-earmark-arrow-up me-1"></i> Choose CSV
                          <Form.Control
                            type="file"
                            accept=".csv"
                            onChange={(e) => {
                              const fileInput = e.target as HTMLInputElement;
                              setCsvFile(fileInput.files ? fileInput.files[0] : null);
                            }}
                            hidden
                          />
                        </Form.Label>

                        {csvFile && (
                          <Button variant="primary" onClick={handleCSVUpload}>
                            <i className="bi bi-cloud-arrow-up me-1"></i> Upload CSV
                          </Button>
                        )}
                      </Form.Group>

                      {editingProductId && (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingProductId(null);
                            setNewProduct({ name: "", category: "", price: 0, quantity: 0, brand: "", sku: "",image_url:"" });
                          }}
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </div>
                  </Form>
                </div>
              </div>
            </div>

      <div className="row">
        {products.map((prod) => (
          <div key={prod.id} className="col-md-4 mb-4">
            <div className ="card h-100 shadow-sm">
            {prod.image_url && (
                    <img
                      src={prod.image_url.startsWith("http") ? prod.image_url : `http://localhost:3000${prod.image_url}`}
                      alt={prod.name}
                      className="card-img-top"
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                  )}
              <div className = "card-body">
                <h5 className = "card-title">{prod.name}</h5>
                <p className="card-text-mb-1"><strong>Category:</strong>{prod.category}</p>
                <p className="card-text-mb-1"><strong>Price</strong> ₹{Number(prod.price).toFixed(2)}</p>
                <p className="card-text-mb-1"><strong>SKU:</strong> {prod.sku}</p>
                <p className="card-text mb-1"><strong>Quantity:</strong> 
                {prod.quantity ===0?(
                  <span className="text-danger fw-semibold">
                    0(Out of Stock)
                  </span>
                ):(
                  prod.quantity
                )}
                </p>
                <p className="card-text mb-3"><strong>Brand:</strong> {prod.brand}</p>

                <div className="d-flex justify-content-end gap-2">
                 <Button variant ="outline-primary" size="sm" onClick={() => handleEditProduct(prod)}>
                  <i className= "bi bi-pencil-square"></i>
                 </Button>
                 <Button variant = "outline-danger" size="sm" onClick={()=>handleDeleteProduct(prod.id)}>
                  <i className="bi bi-trash"></i>
                 </Button>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
