import { useState, useRef } from 'react';
import Spinner from '../common/Spinner';
import { verifyEmail, resendCode } from '../../services/endpoints';
import { useLanguage } from "../../context/LanguageContext";

export default function VerificationForm({ email, onVerified }) {
  const { t } = useLanguage();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError(t('Please enter all 6 digits'));
      return;
    }
    setLoading(true);
    try {
      const data = await verifyEmail({ email, code: fullCode });
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('role', data.role || "USER");
        onVerified();
      } else {
        setError(data.message || t('Invalid code'));
      }
    } catch {
      setError(t('Server error, please try again'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendMessage('');
    setResending(true);
    try {
      const data = await resendCode({ email });
      setResendMessage(data.message || t('New code sent'));
    } catch {
      setError(t('Server error, please try again'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">{t("Verify your email")}</h2>
        <p className="text-sm text-gray-500 mb-6">
          {t("We sent a 6-digit code to")}<br />
          <span className="font-medium text-gray-700">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed">
            {t("Verify email")}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4">
          {t("Didn't receive the code?")}{' '}
          <button type="button" disabled={resending} onClick={handleResend}
            className="text-blue-600 hover:text-blue-700 font-medium bg-transparent border-none cursor-pointer disabled:opacity-50">
            {resending ? t('Sending...') : t('Resend')}
          </button>
        </p>
        {resendMessage && <p className="text-green-600 text-xs text-center mt-2">{resendMessage}</p>}

        {loading && <Spinner text={t("Verifying...")} />}
      </div>
    </div>
  );
}
