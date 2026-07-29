import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner.jsx';

const paymentTypes = ["tuition", "registration", "library fee", "lab fee", "other"];

export default function PaymentForm() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email') || '';
  const role = localStorage.getItem('role') || '';

  const [form, setForm] = useState({
    studentId: '',
    amount: '',
    date: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setError('');
    setSuccess('');
  };

  const validate = () => {
    const errs = {};
    if (!form.studentId.trim()) errs.studentId = 'Please fill the Student ID';
    if (!form.amount) errs.amount = 'Please fill the Amount';
    if (!form.date) errs.date = 'Please select a Date';
    if (!form.type) errs.type = 'Please select a Payment Type';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    const delay = new Promise(r => setTimeout(r, 2000));
    try {
      const [, res] = await Promise.all([
        delay,
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/student/payment-fee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: form.studentId,
          amount: parseFloat(form.amount),
          date: form.date,
          type: form.type,
        }),
      })]);
      if (res.ok) {
        navigate('/', { state: { paymentSuccess: true } });
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to record payment');
      }
    } catch {
      setError('Server not reachable');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition";

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: '40px', width: '100%', maxWidth: 600 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Make a Payment</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>Scan the QR code to pay, then fill in the form below</p>

        {userEmail && (
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
            Logged in as: <strong style={{ color: 'var(--text-primary)' }}>{userEmail}</strong>
          </div>
        )}

        {/* QR Code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <img src="/img/photo_2026-07-29_23-06-42.jpg" alt="Payment QR Code"
            style={{ width: 200, height: 200, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Scan to pay with your banking app</p>
        </div>

        {success && (
          <div style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, color: 'var(--accent,#16a34a)', fontSize: 14, fontWeight: 500 }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, color: 'var(--accent,#ef4444)', fontSize: 14, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Student ID</label>
            <input name="studentId" value={form.studentId} onChange={handleChange} placeholder="e.g. CS-2024-001"
              className={inputClass}
              style={{ background: 'var(--input-bg)', borderColor: errors.studentId ? '#ef4444' : 'var(--border)', color: 'var(--text-primary)' }} />
            {errors.studentId && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.studentId}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Amount ($)</label>
            <input name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={handleChange} placeholder="0.00"
              className={inputClass}
              style={{ background: 'var(--input-bg)', borderColor: errors.amount ? '#ef4444' : 'var(--border)', color: 'var(--text-primary)' }} />
            {errors.amount && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.amount}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange}
              className={inputClass}
              style={{ background: 'var(--input-bg)', borderColor: errors.date ? '#ef4444' : 'var(--border)', color: 'var(--text-primary)' }} />
            {errors.date && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.date}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Payment Type</label>
            <select name="type" value={form.type} onChange={handleChange}
              className={inputClass}
              style={{ background: 'var(--input-bg)', borderColor: errors.type ? '#ef4444' : 'var(--border)', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <option value="">Select type</option>
              {paymentTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.type}</p>}
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'var(--accent,#2563eb)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          Cambodia International University — Payment Portal
        </p>
      </div>
      {loading && <Spinner text="Processing payment..." />}
    </div>
  );
}
