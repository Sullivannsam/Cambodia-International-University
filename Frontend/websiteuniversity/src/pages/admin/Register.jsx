import { useState } from 'react';
import { adminRegister } from '../../services/endpoints';
import { Link } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import AuthShell from '../../components/common/AuthShell';
import { useLanguage } from "../../context/LanguageContext";

export default function Register() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'ADMIN' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.username || !form.email || !form.password) {
      setError(t('All fields are required.'));
      return;
    }

    if (form.password.length < 6) {
      setError(t('Password must be at least 6 characters.'));
      return;
    }

    setLoading(true);
    try {
      const data = await adminRegister({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (data.message === 'Admin registered successfully') {
        setSuccess(true);
        setForm({ username: '', email: '', password: '', role: 'ADMIN' });
      } else {
        setError(data.message || t('Registration failed.'));
      }
    } catch (err) {
      setError(t('Server error, please try again.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      icon={<ShieldCheck size={28} />}
      title={t("Admin Registration")}
      subtitle={t("Create a new administrator account for the CIU management system.")}
      footer={
        <p className="auth-footer-text">
          {t("Already have an account?")}{' '}
          <Link to="/admin/login" className="auth-link">{t("Sign in")}</Link>
        </p>
      }
    >
      {success && (
        <div className="auth-success">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <CheckCircle2 size={18} /> {t("Admin registered successfully!")}
          </div>
          <Link to="/admin/login" className="auth-link">{t("Go to Admin Login")}</Link>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="username" className="auth-label">{t("Username")}</label>
            <div className="auth-input-wrap">
              <User size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                className="auth-input"
                style={{ paddingLeft: 42 }}
                placeholder={t("Enter username")}
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">{t("Email address")}</label>
            <div className="auth-input-wrap">
              <Mail size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="auth-input"
                style={{ paddingLeft: 42 }}
                placeholder={t("Enter email address")}
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">{t("Password")}</label>
            <div className="auth-input-wrap">
              <Lock size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="auth-input"
                style={{ paddingLeft: 42 }}
                placeholder={t("Enter password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-toggle-pw"
                aria-label={showPassword ? t("Hide password") : t("Show password")}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
            {loading ? t("Registering...") : t("Register")}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
