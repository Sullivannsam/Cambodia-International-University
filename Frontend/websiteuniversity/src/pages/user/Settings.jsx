import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../../context/LanguageContext";

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function Settings() {
  const { t } = useLanguage();
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
      setMessage(t('Passwords do not match.'));
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
        setMessage(t('Changes saved successfully!'));
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          parsed.username = form.username;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      } else {
        const data = await res.json();
        setMsgType('error');
        setMessage(data.message || t('Failed to save changes.'));
      }
    } catch {
      setMsgType('error');
      setMessage(t('Server not reachable.'));
    }
  }

  const inputClass = "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen py-12 px-4" style={{backgroundColor:'var(--bg-secondary)'}}>
      <div className="max-w-2xl mx-auto rounded-xl shadow-sm p-8" style={{backgroundColor:'#f3f4f6'}}>
        <h1 className="text-2xl font-bold mb-8" style={{color:'var(--text-primary)'}}>{t('Account Settings')}</h1>

        {message && (
          <div className={`border text-sm rounded-md px-3 py-2 mb-6`}
            style={{
              color: msgType === 'error' ? 'var(--accent,#dc2626)' : 'var(--accent,#16a34a)',
              backgroundColor: msgType === 'error' ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)',
              borderColor: msgType === 'error' ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.2)',
            }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5" style={{background:'#f9fafb', padding:'24px', borderRadius:'12px'}}>
          <div>
            <label className="block text-sm font-medium mb-1" style={{color:'var(--text-primary)'}}>{t('Email')}</label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className={`${inputClass} cursor-not-allowed`}
              style={{backgroundColor:'var(--bg-secondary)', borderColor:'var(--border)', color:'var(--text-muted)'}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{color:'var(--text-primary)'}}>{t('Username')}</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className={inputClass}
              style={{backgroundColor:'var(--input-bg)', borderColor:'var(--border)', color:'var(--text-primary)'}}
              placeholder={t('Enter username')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{color:'var(--text-primary)'}}>{t('Phone')}</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              style={{backgroundColor:'var(--input-bg)', borderColor:'var(--border)', color:'var(--text-primary)'}}
              placeholder={t('Enter phone number')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{color:'var(--text-primary)'}}>{t('Address')}</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              className={inputClass}
              style={{backgroundColor:'var(--input-bg)', borderColor:'var(--border)', color:'var(--text-primary)'}}
              placeholder={t('Enter address')}
            />
          </div>

          <hr className="my-6" style={{borderColor:'var(--border)'}} />

          <h2 className="text-lg font-semibold" style={{color:'var(--text-primary)'}}>{t('University Email')}</h2>
          <p className="text-sm" style={{color:'var(--text-secondary)'}}>
            {t('Claim your official')} <strong>@ciu.std.kh</strong> {t('email address.')}
          </p>
          <a
            href="/public/claim-email"
            className="inline-block text-white py-2 px-4 rounded-md text-sm font-semibold transition"
            style={{backgroundColor:'var(--accent,#2563eb)'}}
          >
            {t('Get University Email')}
          </a>

          <hr className="my-6" style={{borderColor:'var(--border)'}} />

          <h2 className="text-lg font-semibold" style={{color:'var(--text-primary)'}}>{t('Change Password')}</h2>

          <div>
            <label className="block text-sm font-medium mb-1" style={{color:'var(--text-primary)'}}>{t('Current Password')}</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className={inputClass}
              style={{backgroundColor:'var(--input-bg)', borderColor:'var(--border)', color:'var(--text-primary)'}}
              placeholder={t('Enter current password')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{color:'var(--text-primary)'}}>{t('New Password')}</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className={inputClass}
              style={{backgroundColor:'var(--input-bg)', borderColor:'var(--border)', color:'var(--text-primary)'}}
              placeholder={t('Enter new password')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{color:'var(--text-primary)'}}>{t('Confirm New Password')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={inputClass}
              style={{backgroundColor:'var(--input-bg)', borderColor:'var(--border)', color:'var(--text-primary)'}}
              placeholder={t('Confirm new password')}
            />
          </div>

          <button
            type="submit"
            className="w-full text-white py-2 px-4 rounded-md text-sm font-semibold transition"
            style={{backgroundColor:'var(--accent,#2563eb)'}}
          >
            {t('Save Changes')}
          </button>
        </form>
      </div>
    </div>
  );
}
