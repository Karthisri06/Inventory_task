import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from './formcomponent';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AuthForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('switches to signup form when clicking Sign Up link', () => {
    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Sign Up'));

    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Store Name')).toBeInTheDocument();
  });

  it('submits login form and redirects admin user', async () => {
    (axios.post as any).mockResolvedValueOnce({
      data: {
        token: 'test-token',
        name: 'AdminUser',
        role: 'Admin'
      }
    });

    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'admin@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'adminpass' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/auth/login',
        {
          email: 'admin@example.com',
          password: 'adminpass',
        },
        { withCredentials: true }
      );

      expect(toast.success).toHaveBeenCalledWith('Login Successful');
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });
});
