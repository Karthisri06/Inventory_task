

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faChartBar } from '@fortawesome/free-solid-svg-icons'; 
 import Sidebar from '../components/sidebar';
import TopCards from '../components/topcards';
import ProductTable from '../components/product.table';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';
import OrderStatusChart from '../components/graph';

const AdminDashboard = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
   
      <div style={{ width: '250px', backgroundColor: '#343a40' }}>
        <Sidebar />
      </div>


      <div className="flex-grow-1 d-flex flex-column">
        <Navbar user={{ name: "Karthisri", role: localStorage.getItem("role") || "Admin" }} />

        <div className="p-4">
      
          <TopCards />

  
          <div className="row g-4 mt-3">
        
            <div className="col-lg-7 col-md-12">
              <div className="card shadow-sm p-3 bg-white rounded h-100">
                <h5 className="mb-3 d-flex align-items-center">
                  <FontAwesomeIcon icon={faBox} className="me-2" />
                  Product Inventory
                </h5>
                <ProductTable />
              </div>
            </div>

            <div className="col-lg-5 col-md-12">
              <div className="card shadow-sm p-3 bg-white rounded h-100">
                <h5 className="mb-3 d-flex align-items-center">
                  <FontAwesomeIcon icon={faChartBar} className="me-2" />
                  Order Status Overview
                </h5>
                <OrderStatusChart />
              </div>
            </div>
          </div>

  
          <div className="mt-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
