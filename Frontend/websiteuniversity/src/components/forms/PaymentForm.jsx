import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Receipt, ShieldCheck,
  AlertCircle, Loader2, ArrowRight, Landmark, Smartphone, User, CheckCircle2, X
} from 'lucide-react';
import Spinner from '../common/Spinner.jsx';
import StyledSelect from '../common/StyledSelect';
import { useLanguage } from "../../context/LanguageContext";
import { lookupStudentForPayment, submitStudentPayment } from "../../services/endpoints";

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

  const [form, setForm] = useState({ studentId: '', amount: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});
  const [studentInfo, setStudentInfo] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [successCode, setSuccessCode] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setError('');
    if (e.target.name === 'studentId') {
      setStudentInfo(null);
      setLookupError('');
    }
  };

  const handleLookup = async () => {
    const cardCode = form.studentId.trim();
    if (!cardCode) return;
    setLookupLoading(true);
    setLookupError('');
    setStudentInfo(null);
    try {
      const info = await lookupStudentForPayment(cardCode);
      setStudentInfo(info);
      setForm(prev => ({ ...prev, amount: String(info.price || 0), type: prev.type || "tuition" }));
    } catch (err) {
      setLookupError(err.message || t('Student not found'));
    } finally {
      setLookupLoading(false);
    }
  };

  const clearStudent = () => {
    setStudentInfo(null);
    setForm(prev => ({ ...prev, studentId: '', amount: '' }));
    setLookupError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.studentId.trim()) errs.studentId = t('Please fill the Student ID');
    if (!studentInfo) errs.studentId = t('Please look up a student first');
    if (!form.amount) errs.amount = t('Please fill the Amount');
    if (!form.type) errs.type = t('Please select a Payment Type');
    if (form.type === 'tuition' && studentInfo && !studentInfo.scheduleReady)
      errs.type = t('The class has not been created yet. Payment cannot be accepted.');
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
      const [data] = await Promise.all([
        submitStudentPayment({
          studentId: studentInfo.studentId,
          amount: parseFloat(form.amount),
          type: form.type,
        }),
        delay,
      ]);
      try {
        const existing = JSON.parse(localStorage.getItem("payments") || "[]");
        existing.push({ studentId: form.studentId, amount: form.amount, type: form.type, timestamp: new Date().toISOString() });
        localStorage.setItem("payments", JSON.stringify(existing));
      } catch {}
      if (data.joinCode) {
        setSuccessCode(data.joinCode);
      } else {
        navigate('/', { state: { paymentSuccess: true } });
      }
    } catch (err) {
      setError(err?.message || t('Server not reachable'));
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
        .pf-alert-info { background: rgba(62,94,219,0.08); border: 1px solid rgba(62,94,219,0.2); color: #3E5EDB; }
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
        .pf-info {
          background: var(--hover-bg); border: 1px solid var(--border); border-radius: 14px;
          padding: 16px 18px; margin-bottom: 18px; animation: pfPop 0.3s ease;
        }
        .pf-info-head {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
        }
        .pf-info-title { font-size: 13px; font-weight: 700; color: #2E9E6C; display: flex; align-items: center; gap: 6px; }
        .pf-info-close {
          background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px;
          color: var(--text-muted); display: flex; align-items: center; transition: background 0.15s;
        }
        .pf-info-close:hover { background: rgba(0,0,0,0.06); }
        .pf-info-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 6px 0; font-size: 13px; color: var(--text-secondary);
        }
        .pf-info-row strong { color: var(--text-primary); font-weight: 600; }
        .pf-info-row + .pf-info-row { border-top: 1px solid var(--border); }
        .pf-info-price {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0 2px; font-size: 14px; font-weight: 700;
        }
        .pf-info-price span:last-child { color: #182644; font-size: 18px; }
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

            {successCode && (
              <div className="pf-info" style={{ border: '1px solid rgba(46,158,108,0.4)', background: 'rgba(46,158,108,0.08)' }}>
                <div className="pf-info-head">
                  <div className="pf-info-title"><CheckCircle2 size={15} /> {t("Payment Successful")}</div>
                  <button type="button" className="pf-info-close" onClick={() => { setSuccessCode(''); setStudentInfo(null); setForm({ studentId: '', amount: '', type: '' }); }}><X size={15} /></button>
                </div>
                <div className="pf-info-row">
                  <span>{t("Your class join key")}</span>
                  <strong style={{ fontSize: 16, letterSpacing: 1, color: '#182644' }}>{successCode}</strong>
                </div>
                <p className="pf-note" style={{ marginTop: 10, justifyContent: 'flex-start', textAlign: 'left', lineHeight: 1.6 }}>
                  {t("Use this key in \"Join Class by ID\" to view your class and teacher.")}
                </p>
              </div>
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
                    onBlur={(e) => { setFocused({ ...focused, studentId: false }); if (e.target.value.trim()) handleLookup(); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLookup(); } }}
                    placeholder={t("e.g. CS-2024-001")}
                    disabled={!!studentInfo}
                    style={{
                      ...inputClass, ...focusStyle('studentId'),
                      borderColor: errors.studentId || lookupError ? '#D2483C' : studentInfo ? '#2E9E6C' : 'var(--border)',
                      opacity: studentInfo ? 0.7 : 1,
                    }}
                  />
                </div>
                {errors.studentId && <p className="pf-err"><AlertCircle size={13} /> {errors.studentId}</p>}
                {lookupError && !studentInfo && <p className="pf-err"><AlertCircle size={13} /> {lookupError}</p>}
                {lookupLoading && <p className="pf-err" style={{ color: '#3E5EDB' }}><Loader2 size={13} className="animate-spin" /> {t("Looking up student...")}</p>}
              </div>

              {studentInfo && (
                <div className="pf-info">
                  <div className="pf-info-head">
                    <div className="pf-info-title"><CheckCircle2 size={15} /> {t("Student Found")}</div>
                    <button type="button" className="pf-info-close" onClick={clearStudent}><X size={15} /></button>
                  </div>
                  <div className="pf-info-row"><span>{t("Name")}</span><strong>{studentInfo.username}</strong></div>
                  <div className="pf-info-row"><span>{t("Degree")}</span><strong>{studentInfo.degree || "-"}</strong></div>
                  <div className="pf-info-row"><span>{t("Major")}</span><strong>{studentInfo.major || "-"}</strong></div>
                  <div className="pf-info-row"><span>{t("Field / Specialization")}</span><strong>{studentInfo.field || "-"}</strong></div>
                  <div className="pf-info-row"><span>{t("Current Class")}</span><strong>{studentInfo.classLabel}</strong></div>
                  <div className="pf-info-row"><span>{t("Next Class")}</span><strong>{studentInfo.nextLabel}</strong></div>
                  <div className="pf-info-price"><span>{t("Tuition Fee")}</span><span>${Number(studentInfo.price || 0).toFixed(2)}</span></div>
                  {studentInfo.scheduleReady === false && (
                    <p className="pf-err" style={{ marginTop: 10 }}>
                      <AlertCircle size={13} /> {t("Your next class has not been created yet. Payment cannot be accepted until the schedule is published.")}
                    </p>
                  )}
                </div>
              )}

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
                    readOnly={!!studentInfo}
                    style={{
                      ...inputClass, ...focusStyle('amount'),
                      borderColor: errors.amount ? '#D2483C' : studentInfo ? '#2E9E6C' : 'var(--border)',
                      background: studentInfo ? 'var(--hover-bg)' : 'var(--input-bg)',
                    }}
                  />
                </div>
                {errors.amount && <p className="pf-err"><AlertCircle size={13} /> {errors.amount}</p>}
              </div>

              <div className="pf-field">
                <label style={labelClass}>{t("Payment Type")}</label>
                <div className="pf-input-wrap">
                  <CreditCard size={17} />
                  <StyledSelect
                    value={form.type}
                    onChange={(v) => { setForm({ ...form, type: v }); setErrors({ ...errors, type: undefined }); }}
                    width="100%"
                    placeholder={t("Select a payment type")}
                    buttonStyle={{ ...inputClass, paddingLeft: 44, paddingRight: 15, borderColor: errors.type ? '#D2483C' : 'var(--border)' }}
                    options={paymentTypes.map(t => ({ value: t, label: t }))}
                  />
                </div>
                {errors.type && <p className="pf-err"><AlertCircle size={13} /> {errors.type}</p>}
              </div>

              <button
              type="submit"
              disabled={loading || !studentInfo || (form.type === 'tuition' && studentInfo.scheduleReady === false) || !!successCode}
              className="pf-submit"
            >
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
