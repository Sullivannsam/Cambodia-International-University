import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Calendar, Receipt, ShieldCheck,
  AlertCircle, Loader2, ArrowRight, Landmark, Smartphone, User
} from 'lucide-react';
import Spinner from '../common/Spinner.jsx';
import { useLanguage } from "../../context/LanguageContext";

const paymentTypes = ["tuition", "registration", "library fee", "lab fee", "other"];

const inputClass = {
  width: '100%',
  padding: '13px 15px 13px 44px',
  borderRadius: 12,
  border: '1.5px solid var(--border)',
  background: 'var(--input-bg)',
  fontSize: 14,
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};

const inputFocus = {
  borderColor: '#3E5EDB',
  boxShadow: '0 0 0 3px rgba(62,94,219,0.15)',
};

const labelClass = {
  display: 'block',
  fontSize: 12.5,
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: 7,
};

export default function PaymentForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const userEmail = sessionStorage.getItem('email') || '';

  const [form, setForm] = useState({ studentId: '', amount: '', date: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.studentId.trim()) errs.studentId = t('Please fill the Student ID');
    if (!form.amount) errs.amount = t('Please fill the Amount');
    if (!form.date) errs.date = t('Please select a Date');
    if (!form.type) errs.type = t('Please select a Payment Type');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    const delay = new Promise(r => setTimeout(r, 2000));
    try {
      const [, res] = await Promise.all([
        delay,
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/student/payment-fee`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: form.studentId,
            amount: parseFloat(form.amount),
            date: form.date,
            type: form.type,
          }),
        }),
      ]);
      if (res.ok) {
        try {
          const existing = JSON.parse(localStorage.getItem("payments") || "[]");
          existing.push({ studentId: form.studentId, amount: form.amount, date: form.date, type: form.type, timestamp: new Date().toISOString() });
          localStorage.setItem("payments", JSON.stringify(existing));
        } catch {}
        navigate('/', { state: { paymentSuccess: true } });
      } else {
        const data = await res.json();
        setError(data.message || t('Failed to record payment'));
      }
    } catch {
      setError(t('Server not reachable'));
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (name) => focused[name] ? inputFocus : {};

  return (
    <div className="pf-page">
      <style>{`
        .pf-page {
          min-height: 100vh; background: var(--bg-secondary); position: relative;
          overflow: hidden; padding: 40px 20px; font-family: 'Inter', system-ui, sans-serif;
          display: flex; align-items: center; justify-content: center;
        }
        .pf-blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .pf-blob-1 { width: 360px; height: 360px; background: #3E5EDB; top: -110px; left: -80px; opacity: 0.32; }
        .pf-blob-2 { width: 320px; height: 320px; background: #7A5CDB; bottom: -100px; right: -60px; opacity: 0.28; }
        .pf-wrap { position: relative; z-index: 1; width: min(100%, 980px); }
        .pf-header { text-align: center; margin-bottom: 26px; }
        .pf-header h1 { font-size: 26px; font-weight: 800; color: var(--text-primary); margin: 0 0 6px; }
        .pf-header p { font-size: 14px; color: var(--text-secondary); margin: 0; }
        .pf-badge {
          display: inline-flex; align-items: center; gap: 6px; margin-bottom: 14px;
          background: rgba(62,94,219,0.1); color: #3E5EDB; border: 1px solid rgba(62,94,219,0.25);
          padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 700;
        }
        .pf-card {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 22px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.12); overflow: hidden;
          display: grid; grid-template-columns: 1fr 1.1fr; animation: pfPop 0.45s cubic-bezier(0.34,1.56,0.64,1);
        }
        .pf-side {
          background: linear-gradient(160deg, #3E5EDB 0%, #6A48C9 55%, #7A5CDB 100%);
          color: #fff; padding: 34px 30px; display: flex; flex-direction: column; gap: 20px;
        }
        .pf-side h2 { font-size: 18px; font-weight: 800; margin: 0 0 4px; }
        .pf-side .pf-side-sub { font-size: 13px; opacity: 0.88; line-height: 1.6; margin: 0; }
        .pf-qr {
          background: #fff; border-radius: 16px; padding: 14px; align-self: center;
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }
        .pf-qr img { width: 168px; height: 168px; display: block; border-radius: 8px; }
        .pf-bank {
          background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.25);
          border-radius: 14px; padding: 14px 16px;
        }
        .pf-bank-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .pf-bank-row:last-child { margin-bottom: 0; }
        .pf-bank-row svg { flex-shrink: 0; opacity: 0.9; }
        .pf-bank-row .pf-bank-label { font-size: 11.5px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.05em; }
        .pf-bank-row .pf-bank-value { font-size: 13.5px; font-weight: 700; }
        .pf-steps { display: flex; flex-direction: column; gap: 10px; }
        .pf-step { display: flex; gap: 10px; align-items: flex-start; font-size: 12.5px; opacity: 0.92; line-height: 1.5; }
        .pf-step-num {
          width: 20px; height: 20px; border-radius: 50%; background: rgba(255,255,255,0.22);
          font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }
        .pf-form { padding: 32px 34px; }
        .pf-user {
          display: flex; align-items: center; gap: 10px; background: var(--hover-bg);
          border-radius: 10px; padding: 10px 14px; margin-bottom: 22px; font-size: 13px;
          color: var(--text-secondary);
        }
        .pf-user svg { color: #3E5EDB; flex-shrink: 0; }
        .pf-user strong { color: var(--text-primary); }
        .pf-field { margin-bottom: 16px; }
        .pf-input-wrap { position: relative; }
        .pf-input-wrap > svg {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); pointer-events: none;
        }
        .pf-input-wrap select { appearance: none; cursor: pointer; }
        .pf-err { margin: 5px 0 0; font-size: 12px; color: #D2483C; display: flex; align-items: center; gap: 4px; }
        .pf-alert {
          display: flex; align-items: center; gap: 8px; border-radius: 10px; padding: 11px 14px;
          font-size: 13px; font-weight: 600; margin-bottom: 18px;
        }
        .pf-alert-error { background: rgba(210,72,60,0.1); border: 1px solid rgba(210,72,60,0.35); color: #D2483C; }
        .pf-submit {
          width: 100%; padding: 14px 0; border: none; border-radius: 12px; margin-top: 6px;
          background: linear-gradient(135deg,#3E5EDB,#7A5CDB); color: #fff; font-size: 15px; font-weight: 700;
          cursor: pointer; box-shadow: 0 10px 24px rgba(62,94,219,0.35);
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }
        .pf-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(62,94,219,0.45); }
        .pf-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .pf-note { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 16px; font-size: 12px; color: var(--text-muted); }
        @keyframes pfPop {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 820px) {
          .pf-card { grid-template-columns: 1fr; }
          .pf-form { padding: 26px 22px; }
        }
        @media (max-width: 480px) {
          .pf-header h1 { font-size: 22px; }
        }
      `}</style>

      <div className="pf-blob pf-blob-1" />
      <div className="pf-blob pf-blob-2" />

      <div className="pf-wrap">
        <div className="pf-header">
          <div className="pf-badge"><ShieldCheck size={14} /> {t("Secure Payment Portal")}</div>
          <h1>{t("Make a Payment")}</h1>
          <p>{t("Scan the QR code to pay, then submit the form below")}</p>
        </div>

        <div className="pf-card">
          <aside className="pf-side">
            <div>
              <h2>{t("Scan & Pay")}</h2>
              <p className="pf-side-sub">
                {t("Use any banking app to scan the QR code and send your payment.")}
                {t("Enter the payment details exactly as shown on the form.")}
              </p>
            </div>

            <div className="pf-qr">
              <img src="/img/photo_2026-07-29_23-06-42.jpg" alt={t("Payment QR Code")} />
            </div>

            <div className="pf-bank">
              <div className="pf-bank-row">
                <Landmark size={18} />
                <div>
                  <div className="pf-bank-label">{t("Bank Account")}</div>
                  <div className="pf-bank-value">ACLEDA Bank — Cambodia Int'l University</div>
                </div>
              </div>
              <div className="pf-bank-row">
                <CreditCard size={18} />
                <div>
                  <div className="pf-bank-label">{t("Account No.")}</div>
                  <div className="pf-bank-value">0000-0000-0000-0000</div>
                </div>
              </div>
            </div>

            <div className="pf-steps">
              {[t('Scan the QR code with your banking app'), t('Enter the exact amount and complete the transfer'), t('Submit the form with your payment details')].map((step, i) => (
                <div className="pf-step" key={i}>
                  <span className="pf-step-num">{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="pf-form">
            {userEmail && (
              <div className="pf-user">
                <User size={16} />
                <span>{t("Logged in as")} <strong>{userEmail}</strong></span>
              </div>
            )}

            {error && (
              <div className="pf-alert pf-alert-error"><AlertCircle size={16} /> {error}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="pf-field">
                <label style={labelClass}>{t("Student ID")}</label>
                <div className="pf-input-wrap">
                  <User size={17} />
                  <input
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    onFocus={() => setFocused({ ...focused, studentId: true })}
                    onBlur={() => setFocused({ ...focused, studentId: false })}
                    placeholder={t("e.g. CS-2024-001")}
                    style={{ ...inputClass, ...focusStyle('studentId'), borderColor: errors.studentId ? '#D2483C' : 'var(--border)' }}
                  />
                </div>
                {errors.studentId && <p className="pf-err"><AlertCircle size={13} /> {errors.studentId}</p>}
              </div>

              <div className="pf-field">
                <label style={labelClass}>{t("Amount (US$)")}</label>
                <div className="pf-input-wrap">
                  <Receipt size={17} />
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={handleChange}
                    onFocus={() => setFocused({ ...focused, amount: true })}
                    onBlur={() => setFocused({ ...focused, amount: false })}
                    placeholder="0.00"
                    style={{ ...inputClass, ...focusStyle('amount'), borderColor: errors.amount ? '#D2483C' : 'var(--border)' }}
                  />
                </div>
                {errors.amount && <p className="pf-err"><AlertCircle size={13} /> {errors.amount}</p>}
              </div>

              <div className="pf-field">
                <label style={labelClass}>{t("Date")}</label>
                <div className="pf-input-wrap">
                  <Calendar size={17} />
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    onFocus={() => setFocused({ ...focused, date: true })}
                    onBlur={() => setFocused({ ...focused, date: false })}
                    style={{ ...inputClass, ...focusStyle('date'), borderColor: errors.date ? '#D2483C' : 'var(--border)' }}
                  />
                </div>
                {errors.date && <p className="pf-err"><AlertCircle size={13} /> {errors.date}</p>}
              </div>

              <div className="pf-field">
                <label style={labelClass}>{t("Payment Type")}</label>
                <div className="pf-input-wrap">
                  <CreditCard size={17} />
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    onFocus={() => setFocused({ ...focused, type: true })}
                    onBlur={() => setFocused({ ...focused, type: false })}
                    style={{ ...inputClass, ...focusStyle('type'), borderColor: errors.type ? '#D2483C' : 'var(--border)', paddingRight: 15 }}
                  >
                    <option value="">{t("Select a payment type")}</option>
                    {paymentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {errors.type && <p className="pf-err"><AlertCircle size={13} /> {errors.type}</p>}
              </div>

              <button type="submit" disabled={loading} className="pf-submit">
                {loading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
                {loading ? t('Processing...') : t('Submit Payment')}
              </button>
            </form>

            <p className="pf-note">
              <Smartphone size={13} /> {t("Cambodia International University — Payment Portal")}
            </p>
          </div>
        </div>
      </div>

      {loading && <Spinner text={t("Processing payment...")} />}
    </div>
  );
}
