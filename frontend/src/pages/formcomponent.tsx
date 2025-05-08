import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = () => {
  const [name, setName] = useState('');
  const [store, setStore] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const response = await axios.post(
          'http://localhost:3000/auth/login',
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );

        const { token, name, role } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ name, role }));
        localStorage.setItem('role', role);
        toast.success('Login Successful');

        if (role.toLowerCase() === 'admin') {
          navigate('/admin');
        } else if (role.toLowerCase() === 'salesperson') {
          navigate('/sp');
        } else {
          toast.error('Unknown role. Cannot redirect.');
        }
      } else {
        await axios.post('http://localhost:3000/auth/register', {
          name,
          email,
          password,
          role: 'Salesperson',
          store,
        });

        toast.success('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong.';
        toast.error(errorMessage);
      } else {
        toast.error('Unexpected error occurred.');
      }
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{
        background: 'linear-gradient(to right,rgb(253, 153, 146),rgb(243, 179, 179))',
      }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '15px',
          backgroundColor: 'rgba(255, 252, 252, 0.95)',
        }}
      >
        <h2 className="text-center mb-4" style={{ fontWeight: 500 }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  Username
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="store" className="form-label fw-semibold">
                  Store Name
                </label>
                <input
                  type="text"
                  id="store"
                  className="form-control"
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  placeholder="e.g., name of your store"
                  required
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold fs-6">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold fs-6">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-danger w-100 fw-bold">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-3 text-center">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(false);
                }}
              >
                <strong>Sign Up</strong>
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(true);
                }}
              >
                <strong>Log In</strong>
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;


