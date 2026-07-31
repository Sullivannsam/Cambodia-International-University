import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import InfoPage from '../../components/public/InfoPage';
import { useLanguage } from "../../context/LanguageContext";

const FAQS = [
  {
    q: "How do I apply for admission?",
    a: "Click the 'Enroll' button in the navigation bar, fill out the online application form, and submit it. Our admissions team will contact you within a few business days.",
  },
  {
    q: "What documents do I need for enrollment?",
    a: "You'll need your national ID or passport, high school diploma (or equivalent), recent photos, and proof of payment for the registration fee.",
  },
  {
    q: "How can I claim my student email?",
    a: "Use the 'Claim Student Email' form available on the homepage. Enter your details and you'll receive your official university email address.",
  },
  {
    q: "How do I pay my tuition fees?",
    a: "Go to the Payments page, scan the QR code with your banking app, and submit the payment form with your student ID and amount.",
  },
  {
    q: "Can I change my enrolled course?",
    a: "Yes, you can request a course change by contacting the registrar's office or by speaking with your academic advisor during the add/drop period.",
  },
  {
    q: "How do I access my grades?",
    a: "Log into the Student Portal with your student account and open the 'Grades' section to view your scores and transcripts.",
  },
  {
    q: "Does the university offer scholarships?",
    a: "Yes. Visit the Scholarships page to learn about merit-based and need-based scholarships available to qualified students.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(null);
  const { t } = useLanguage();

  return (
    <InfoPage
      icon={<HelpCircle size={30} />}
      title={t("Frequently Asked Questions")}
      subtitle={t("Find quick answers to the most common questions from students and parents.")}
    >
      <style>{`
        .faq-item {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px;
          margin-bottom: 12px; overflow: hidden;
        }
        .faq-q {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 16px 20px; background: none; border: none; cursor: pointer;
          font-size: 15px; font-weight: 600; color: var(--text-primary); text-align: left;
        }
        .faq-q svg { transition: transform 0.3s ease; color: #3E5EDB; flex-shrink: 0; }
        .faq-q.open svg { transform: rotate(180deg); }
        .faq-a {
          max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
          padding: 0 20px; font-size: 13.5px; color: var(--text-secondary); line-height: 1.7;
        }
        .faq-a.show { max-height: 200px; padding-bottom: 16px; }
      `}</style>

      <div>
        {FAQS.map((f, i) => (
          <div className="faq-item" key={i}>
            <button className={"faq-q" + (open === i ? " open" : "")} onClick={() => setOpen(open === i ? null : i)}>
              {t(f.q)}
              <ChevronDown size={18} />
            </button>
            <div className={"faq-a" + (open === i ? " show" : "")}>{t(f.a)}</div>
          </div>
        ))}
      </div>
    </InfoPage>
  );
}
