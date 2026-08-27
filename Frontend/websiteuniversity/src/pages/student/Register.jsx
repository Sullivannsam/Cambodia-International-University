import { useState } from 'react';
import { studentRegister } from '../../services/endpoints';
import { Link } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import AuthShell from '../../components/common/AuthShell';
import { useLanguage } from "../../context/LanguageContext";

export default function StudentRegister() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    username: '', email: '', password: '', phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.username || !form.email || !form.password) {
      setError(t('Username, email, and password are required.'));
      return;
    }

    if (form.password.length < 6) {
      setError(t('Password must be at least 6 characters.'));
      return;
    }

    setLoading(true);
    try {
      const data = await studentRegister({
        username: form.username,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      if (data.token || data.message) {
        setSuccess(true);
      } else {
        setError(data.message || t('Registration failed.'));
      }
    } catch {
      setError(t('Server error, please try again.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      navbarOffset
      icon={<GraduationCap size={28} />}
      title={t("Student Registration")}
      subtitle={t("Join Cambodia International University and start your academic journey.")}
      footer={
        <div>
          <p className="auth-footer-text">
            {t("Already have an account?")}{' '}
            <Link to="/student/login" className="auth-link">{t("Sign in")}</Link>
          </p>
          <div className="auth-footer-links">
            <Link to="/public/login" className="auth-footer-link">{t("Regular User Login")}</Link>
            <Link to="/public/register" className="auth-footer-link">{t("Regular User Register")}</Link>
          </div>
        </div>
      }
    >
      {success && (
        <div className="auth-success">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <CheckCircle2 size={18} /> {t("Student registered successfully!")}
          </div>
          <Link to="/student/login" className="auth-link">{t("Go to Student Login")}</Link>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label className="auth-label">{t("Username")}</label>
            <div className="auth-input-wrap">
              <User size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                className="auth-input"
                style={{ paddingLeft: 42 }}
                placeholder={t("Full name")}
              />
            </div>
          </div>

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
                placeholder={t("Create a password")}
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

          <div className="auth-field">
            <label className="auth-label">{t("Phone number")}</label>
            <div className="auth-input-wrap">
              <Phone size={17} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="auth-input"
                style={{ paddingLeft: 42 }}
                placeholder={t("Optional")}
              />
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
