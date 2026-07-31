import { useState } from 'react';
import { adminLogin } from '../../services/endpoints';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import AuthShell from '../../components/common/AuthShell';
import { useLanguage } from "../../context/LanguageContext";

export default function Login() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError(t('Please enter both email and password.'));
      return;
    }

    setLoading(true);
    try {
      const data = await adminLogin({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || "ADMIN");
        localStorage.setItem("user", JSON.stringify({ email: data.email, username: data.username }));
        navigate("/admin/dashboard", { state: { loginSuccess: true } });
      } else {
        setError(data.message || t('Invalid email or password.'));
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
      title={t("Admin Login")}
      subtitle={t("Welcome back, admin. Sign in to manage Cambodia International University.")}
      footer={
        <>
          <p className="auth-footer-text">
            {t("Don't have an admin account?")}{' '}
            <Link to="/admin/register" className="auth-link">{t("Register as admin")}</Link>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label htmlFor="email" className="auth-label">{t("Email address")}</label>
          <div className="auth-input-wrap">
            <Mail size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
              className="auth-input"
              style={{ paddingLeft: 42 }}
              placeholder={t("Enter your email address")}
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
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
              className="auth-input"
              style={{ paddingLeft: 42 }}
              placeholder={t("Enter your password")}
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

        <div className="auth-row">
          <label className="auth-check">
            <input
              id="remember_me"
              name="rememberMe"
              type="checkbox"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            {t("Remember me")}
          </label>
          <a href="/public/forgot-password" className="auth-link">{t("Forgot password?")}</a>
        </div>

        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
          {loading ? t("Signing in...") : t("Sign In")}
        </button>
      </form>
    </AuthShell>
  );
}
