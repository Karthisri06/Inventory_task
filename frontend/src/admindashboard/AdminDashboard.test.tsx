
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminDashboard from './Admindashboard';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../components/sidebar', () => ({
    default: () => <div>Sidebar</div>,
  }));
  
  vi.mock('../components/navbar', () => ({
    default: () => <div>Navbar</div>,
  }));
  
  vi.mock('../components/topcards', () => ({
    default: () => <div>TopCards</div>,
  }));
  
  vi.mock('../components/product.table', () => ({
    default: () => <div>ProductTable</div>,
  }));
  
  vi.mock('../components/graph', () => ({
    default: () => <div>OrderStatusChart</div>,
  }));
  
describe('AdminDashboard', () => {
  beforeEach(() => {
  
    localStorage.setItem('role', 'Admin');
  });

  it('renders dashboard layout with key sections', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Navbar')).toBeInTheDocument();
    expect(screen.getByText('TopCards')).toBeInTheDocument();
    expect(screen.getByText('Product Inventory')).toBeInTheDocument();
    expect(screen.getByText('ProductTable')).toBeInTheDocument();
    expect(screen.getByText('Order Status Overview')).toBeInTheDocument();
    expect(screen.getByText('OrderStatusChart')).toBeInTheDocument();
  });
});
