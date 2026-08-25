import { useState } from 'react';
import { resetPassword } from '../../services/endpoints';
import { useLanguage } from '../../context/LanguageContext';

const EyeIcon = ({ open }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    {open ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </>
    )}
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const ResetPassword = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ token: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={t('At least 6 characters')}
                className="w-full px-4 py-3 pr-11 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition"
                style={{ color: 'var(--text-secondary)' }}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{t('Confirm new password')}</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder={t('Re-enter the new password')}
                className="w-full px-4 py-3 pr-11 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition"
                style={{ color: 'var(--text-secondary)' }}>
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-center" style={{ color: 'var(--accent,#ef4444)' }}>{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent,#2563eb)' }}>
            {loading ? <><Spinner />{t('Resetting...')}</> : t('Reset Password')}
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
