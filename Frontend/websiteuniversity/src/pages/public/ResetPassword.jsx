import { useState } from 'react';
import { resetPassword } from '../../services/endpoints';
import { useLanguage } from '../../context/LanguageContext';

const ResetPassword = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ token: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.token.trim() || !form.password) {
      setError(t('Reset code and new password are required.'));
      return;
    }
    if (form.password.length < 6) {
      setError(t('Password must be at least 6 characters.'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t('Passwords do not match.'));
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword({
        token: form.token.trim(),
        password: form.password,
      });
      if (data.message && String(data.message).toLowerCase().includes('success')) {
        setSuccess(true);
      } else {
        setError(data.message || t('Failed to reset password. The code may be invalid or expired.'));
      }
    } catch {
      setError(t('Server error, please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="w-full max-w-md rounded-2xl shadow-lg border p-8 text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('Password Reset')}</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {t('Your password has been reset successfully. You can now sign in with your new password.')}
          </p>
          <a href="/public/login"
            className="inline-block w-full py-3 text-white font-semibold rounded-xl transition"
            style={{ backgroundColor: 'var(--accent,#2563eb)' }}>
            {t('Go to Login')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="w-full max-w-md rounded-2xl shadow-lg border p-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('Reset Password')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{t('Enter the reset code from your email and choose a new password')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{t('Reset code')}</label>
            <input
              name="token"
              value={form.token}
              onChange={handleChange}
              placeholder={t('Enter the reset code / token')}
              className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{t('New password')}</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t('At least 6 characters')}
              className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{t('Confirm new password')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder={t('Re-enter the new password')}
              className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          {error && <p className="text-xs text-center" style={{ color: 'var(--accent,#ef4444)' }}>{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent,#2563eb)' }}>
            {loading ? t('Resetting...') : t('Reset Password')}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
          {t('Remember your password?')}{' '}
          <a href="/public/login" className="font-medium" style={{ color: 'var(--accent,#2563eb)' }}>{t('Sign In')}</a>
        </p>
        <p className="text-center text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          {t("Haven't requested a reset?")}{' '}
          <a href="/public/forgot-password" className="font-medium" style={{ color: 'var(--accent,#2563eb)' }}>{t('Request one')}</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
