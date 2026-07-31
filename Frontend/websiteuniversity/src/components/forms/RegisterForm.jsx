import { useState } from 'react';
import { registerUser } from '../../services/endpoints.js';
import Spinner from '../common/Spinner';
import VerificationForm from './VerificationForm';

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '',  password: '', repeatPassword: '',  phoneNumber: '', terms: false });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if(form.password !== form. repeatPassword){
      setError(`Password don't matached`);
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ email: form.email, username: form.username,  password: form.password, phone: form.phoneNumber });
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role || "USER");
        window.location.href = "/";
      } else {
        setRegisteredEmail(form.email);
      }
    } catch {
      setError("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = () => {
    window.location.href = "/";
  };

  if (registeredEmail) {
    return <VerificationForm email={registeredEmail} onVerified={handleVerified} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-sm text-gray-500 mt-1">Get started with a free account</p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          <button className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <i className="fa-brands fa-apple text-lg"></i>
          </button>
          <button className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Your Email address"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Your Username"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pr-10"
              required
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600">
              {show ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="repeatPassword"
              value={form.repeatPassword}
              onChange={handleChange}
              placeholder="Repeat a password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pr-10"
              required
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600">
              {show ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-gray-500 cursor-pointer">
            <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange}
              className="w-4 h-4 mt-0.5 accent-blue-600 rounded border-gray-300" required />
            <span>By signing up, you agree to our <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms</a> and <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>.</span>
          </label>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Create account
          </button>

          {loading && <Spinner text="Creating your account..." />}
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/public/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</a>
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-center text-xs text-gray-400 mb-2">Are you a student?</p>
          <div className="flex gap-2">
            <a href="/student/register"
              className="flex-1 text-center py-2 px-3 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition">
              Student Register
            </a>
            <a href="/student/login"
              className="flex-1 text-center py-2 px-3 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition">
              Student Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
