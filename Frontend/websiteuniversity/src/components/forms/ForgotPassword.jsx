import { useState } from 'react';
import { useLanguage } from "../../context/LanguageContext";

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.message || t("Email not found"));
      }
    } catch {
      setError(t("Server not reachable"));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{backgroundColor:'var(--bg-secondary)'}}>
        <div className="w-full max-w-md rounded-2xl shadow-lg border p-8 text-center" style={{backgroundColor:'var(--bg-card)', borderColor:'var(--border)'}}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{color:'var(--text-primary)'}}>{t("Check Your Email")}</h2>
          <p className="text-sm mb-6" style={{color:'var(--text-secondary)'}}>
            {t("We sent a password reset link to")} <strong style={{color:'var(--text-primary)'}}>{email}</strong>
          </p>
          <a href="/public/login"
            className="inline-block w-full py-3 text-white font-semibold rounded-xl transition"
            style={{backgroundColor:'var(--accent,#2563eb)'}}>
            {t("Back to Login")}
          </a>
          <a href="/public/reset-password"
            className="inline-block w-full py-3 font-semibold rounded-xl transition mt-3 border"
            style={{color:'var(--accent,#2563eb)', borderColor:'var(--border)'}}>
            {t("I have a reset code — enter it here")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{backgroundColor:'var(--bg-secondary)'}}>
      <div className="w-full max-w-md rounded-2xl shadow-lg border p-8" style={{backgroundColor:'var(--bg-card)', borderColor:'var(--border)'}}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{color:'var(--text-primary)'}}>{t("Forgot Password?")}</h1>
          <p className="text-sm mt-1" style={{color:'var(--text-secondary)'}}>{t("Enter your email and we'll send you a reset link")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("Email address")}
            className="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            style={{backgroundColor:'var(--input-bg)', borderColor:'var(--border)', color:'var(--text-primary)'}}
            required
          />

          {error && <p className="text-xs text-center" style={{color:'var(--accent,#ef4444)'}}>{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50"
            style={{backgroundColor:'var(--accent,#2563eb)'}}>
            {loading ? t("Sending...") : t("Send Reset Link")}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{color:'var(--text-secondary)'}}>
          {t("Remember your password?")}{' '}
          <a href="/public/login" className="font-medium" style={{color:'var(--accent,#2563eb)'}}>{t("Sign In")}</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
