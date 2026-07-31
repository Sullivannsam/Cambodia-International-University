import { useState } from 'react';
import { studentLogin } from '../../services/endpoints';
import Spinner from '../../components/common/Spinner';
import { Link, useNavigate } from 'react-router-dom';

export default function StudentLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await studentLogin({ email: form.email, password: form.password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        localStorage.setItem('role', data.role || 'STUDENT');
        navigate('/', { state: { loginSuccess: true } });
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Server error, please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Student Login
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="student@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter password" />
            </div>

            <button type="submit" disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed">
              Sign in
            </button>
            {loading && <Spinner text="Signing in..." />}
          </form>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/student/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Create one
            </Link>
          </div>
          <div className="mt-2 text-center text-sm">
            <Link to="/public/login" className="text-gray-500 hover:text-gray-700">
              Login as a regular user instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
