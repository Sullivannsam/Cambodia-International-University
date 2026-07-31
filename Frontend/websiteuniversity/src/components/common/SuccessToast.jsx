import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function SuccessToast() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const state = location.state || {};
    if (state.loginSuccess) {
      setMessage("Logged in successfully!");
      setVisible(true);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
    if (state.paymentSuccess) {
      setMessage("Payment submitted successfully!");
      setVisible(true);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
    if (state.logoutSuccess) {
      setMessage("Logged out successfully!");
      setVisible(true);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state?.loginSuccess, location.state?.paymentSuccess, location.state?.logoutSuccess]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: '#16a34a', color: 'white', borderRadius: 12,
      padding: '16px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'center', gap: 12,
      fontSize: 15, fontWeight: 600, animation: 'slideIn 0.3s ease'
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      {message}
    </div>
  );
}
