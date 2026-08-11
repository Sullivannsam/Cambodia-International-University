import { useState } from 'react';
import { studentLogin } from '../../services/endpoints';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import AuthShell from '../../components/common/AuthShell';
import { useLanguage } from "../../context/LanguageContext";

export default function StudentLogin() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await studentLogin({ email: form.email, password: form.password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        localStorage.setItem('role', data.role || 'STUDENT');
        navigate('/student/dashboard', { state: { loginSuccess: true } });
      } else {
        setError(data.message || t('Invalid credentials'));
      }
    } catch (err) {
      setError(err?.message && !String(err.message).startsWith("Failed to fetch")
        ? err.message
        : t('Server error, please try again.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      navbarOffset
      icon={<GraduationCap size={28} />}
      title={t("Student Login")}
      subtitle={t("Welcome back! Sign in to access your courses and grades.")}
      footer={
        <div>
          <p className="auth-footer-text">
            {t("Don't have an account?")}{' '}
            <Link to="/student/register" className="auth-link">{t("Create one")}</Link>
          </p>
          <div className="auth-footer-links">
            <Link to="/public/login" className="auth-footer-link">{t("Regular User Login")}</Link>
            <Link to="/public/register" className="auth-footer-link">{t("Regular User Register")}</Link>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label className="auth-label">{t("Email address")}</label>
          <div className="auth-input-wrap">
            <Mail size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="auth-input"
              style={{ paddingLeft: 42 }}
              placeholder={t("student@example.com")}
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label">{t("Password")}</label>
          <div className="auth-input-wrap">
            <Lock size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
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
          <span />
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
