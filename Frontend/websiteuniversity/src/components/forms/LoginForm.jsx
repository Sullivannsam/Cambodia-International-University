import { useState } from 'react';
import { loginUser } from '../../services/endpoints.js';
import Spinner from '../common/Spinner';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', terms: false });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email: form.email, password: form.password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);
        window.location.href = "/";
      } else {
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{backgroundColor:'var(--bg-secondary)'}}>
      <div className="w-full max-w-md rounded-2xl shadow-lg border p-8" style={{backgroundColor:'var(--bg-card)', borderColor:'var(--border)'}}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{color:'var(--text-primary)'}}>Sign in Your Account with Us Right Now</h1>
          <p className="text-sm mt-1" style={{color:'var(--text-secondary)'}}>Welcome Back</p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          <button className="flex items-center justify-center w-12 h-12 border rounded-xl transition" style={{borderColor:'var(--border)'}}>
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center w-12 h-12 border rounded-xl transition" style={{borderColor:'var(--border)'}}>
            <i className="fa-brands fa-apple text-lg"></i>
          </button>
          <button className="flex items-center justify-center w-12 h-12 border rounded-xl transition" style={{borderColor:'var(--border)'}}>
            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{backgroundColor:'var(--border)'}} />
          <span className="text-xs uppercase tracking-wider" style={{color:'var(--text-muted)'}}>or</span>
          <div className="flex-1 h-px" style={{backgroundColor:'var(--border)'}} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              style={{backgroundColor:'var(--input-bg)', borderColor:'var(--border)', color:'var(--text-primary)'}}
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
              className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pr-10"
              style={{backgroundColor:'var(--input-bg)', borderColor:'var(--border)', color:'var(--text-primary)'}}
              required
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5" style={{color:'var(--text-muted)'}}>
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

          <div className="flex justify-end">
            <a href="/public/forgot-password" className="text-sm font-medium" style={{color:'var(--accent,#2563eb)'}}>
              Forgot Password?
            </a>
          </div>

          <label className="flex items-start gap-3 text-sm cursor-pointer" style={{color:'var(--text-secondary)'}}>
            <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange}
              className="w-4 h-4 mt-0.5 accent-blue-600 rounded" required />
            <span>By signing up, you agree to our <a href="#" className="font-medium" style={{color:'var(--accent,#2563eb)'}}>Terms</a> and <a href="#" className="font-medium" style={{color:'var(--accent,#2563eb)'}}>Privacy Policy</a>.</span>
          </label>

          {error && <p className="text-xs text-center" style={{color:'var(--accent,#ef4444)'}}>{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{backgroundColor:'var(--accent,#2563eb)'}}>
           Sign In 
          </button>

          {loading && <Spinner text="Creating your account..." />}
        </form>

        <p className="text-center text-sm mt-6" style={{color:'var(--text-secondary)'}}>
          don't have an account?{' '}
          <a href="/public/register" className="font-medium" style={{color:'var(--accent,#2563eb)'}}>Create an account</a>
        </p>
        <div className="mt-4 pt-4 border-t" style={{borderColor:'var(--border)'}}>
          <p className="text-center text-xs mb-2" style={{color:'var(--text-muted)'}}>Are you a student?</p>
          <div className="flex gap-2">
            <a href="/student/register"
              className="flex-1 text-center py-2 px-3 text-sm font-medium rounded-lg transition"
              style={{backgroundColor:'var(--hover-bg)', color:'var(--accent,#4f46e5)'}}>
              Student Register
            </a>
            <a href="/student/login"
              className="flex-1 text-center py-2 px-3 text-sm font-medium rounded-lg transition"
              style={{backgroundColor:'var(--hover-bg)', color:'var(--accent,#4f46e5)'}}>
              Student Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
