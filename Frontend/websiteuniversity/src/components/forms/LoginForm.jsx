import { useState } from 'react';
import { loginUser } from '../../services/endpoints.js';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircle2, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import AuthShell from '../common/AuthShell';
import { useLanguage } from "../../context/LanguageContext";

export default function LoginForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '', terms: false });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        localStorage.setItem("role", data.role || "USER");
        navigate("/", { state: { loginSuccess: true } });
      } else {
        setError(data.message || t("Invalid credentials"));
      }
    } catch (err) {
      setError(err?.message && !String(err.message).startsWith("Failed to fetch")
        ? err.message
        : t("Server error, please try again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      navbarOffset
      icon={<UserCircle2 size={28} />}
      title={t("Welcome Back")}
      subtitle={t("Sign in to your account to continue")}
      footer={
        <div>
          <p className="auth-footer-text">
            {t("Don't have an account?")}{' '}
            <Link to="/public/register" className="auth-link">{t("Create an account")}</Link>
          </p>
          <div className="auth-footer-links">
            <Link to="/student/register" className="auth-footer-link">{t("Student Register")}</Link>
            <Link to="/student/login" className="auth-footer-link">{t("Student Login")}</Link>
          </div>
        </div>
      }
    >
      <div className="auth-social">
        <button className="auth-social-btn" aria-label={t("Sign in with Google")}>
          <img src="https://www.google.com/favicon.ico" alt={t("Google")} style={{ width: 20, height: 20 }} />
        </button>
        <button className="auth-social-btn" aria-label={t("Sign in with Apple")}>
          <i className="fa-brands fa-apple text-lg" />
        </button>
        <button className="auth-social-btn" aria-label={t("Sign in with Facebook")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </button>
      </div>

      <div className="auth-divider"><span>{t("or")}</span></div>

      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label className="auth-label">{t("Email address")}</label>
          <div className="auth-input-wrap">
            <Mail size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="auth-input"
              style={{ paddingLeft: 42 }}
              placeholder={t("Enter your email address")}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label">{t("Password")}</label>
          <div className="auth-input-wrap">
            <Lock size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type={show ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="auth-input"
              style={{ paddingLeft: 42 }}
              placeholder={t("Enter your password")}
              required
            />
            <button type="button" onClick={() => setShow(!show)} className="auth-toggle-pw" aria-label={show ? t("Hide password") : t("Show password")}>
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="auth-row">
          <label className="auth-check">
            <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} required />
            <span>
              {t("By signing up, you agree to our")} <Link to="/" className="auth-link">{t("Terms")}</Link> {t("and")} <Link to="/" className="auth-link">{t("Privacy Policy")}</Link>.
            </span>
          </label>
        </div>

        <div style={{ textAlign: 'right', marginBottom: 16, marginTop: -8 }}>
          <Link to="/public/forgot-password" className="auth-link">{t("Forgot Password?")}</Link>
        </div>

        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
          {loading ? t("Signing in...") : t("Sign In")}
        </button>
      </form>
    </AuthShell>
  );
}
