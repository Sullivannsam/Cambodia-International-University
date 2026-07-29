import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function Settings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/public/login');
      return;
    }
    const storedEmail = localStorage.getItem('email');
    const userData = localStorage.getItem('user');
    const parsedUser = userData ? JSON.parse(userData) : null;
    setForm(prev => ({
      ...prev,
      email: storedEmail || parsedUser?.email || '',
      username: parsedUser?.username || '',
    }));
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMsgType('error');
      setMessage('Passwords do not match.');
      return;
    }
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      const res = await fetch(`${BASE_URL}/api/auth/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: form.username,
          phone: form.phone,
          address: form.address,
        }),
      });
      if (res.ok) {
        setMsgType('success');
        setMessage('Changes saved successfully!');
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          parsed.username = form.username;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      } else {
        const data = await res.json();
        setMsgType('error');
        setMessage(data.message || 'Failed to save changes.');
      }
    } catch {
      setMsgType('error');
      setMessage('Server not reachable.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

        {message && (
          <div className={`${msgType === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'} border text-sm rounded-md px-3 py-2 mb-6`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address"
            />
          </div>

          <hr className="my-6" />

          <h2 className="text-lg font-semibold text-gray-900">University Email</h2>
          <p className="text-sm text-gray-600">
            Claim your official <strong>@ciu.std.kh</strong> email address.
          </p>
          <a
            href="/public/claim-email"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Get University Email
          </a>

          <hr className="my-6" />

          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
