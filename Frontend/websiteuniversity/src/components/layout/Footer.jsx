import React, { useState } from 'react';
import { useLanguage } from "../../context/LanguageContext";
import { subscribeNewsletter } from "../../services/endpoints";

const Footer = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setStatus("");
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setStatus("error");
            return;
        }
        try {
            await subscribeNewsletter({ email: email.trim() });
            setStatus("success");
            setEmail("");
        } catch {
            setStatus("success");
            setEmail("");
        }
    };
    return (
        <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100 text-gray-600 font-['Inter']">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">

                    {/* Column 1 - Logo & About */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="flex-shrink-0 bg-blue-600 p-2 rounded-xl transition-transform duration-300 group-hover:scale-105">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.5" />
                                </svg>
                            </div>
                            <span className="font-semibold text-sm tracking-tight text-gray-900">
                                {t("Cambodia International University")}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {t("Empowering minds, shaping futures. Committed to excellence in education, research, and innovation since 2005.")}
                        </p>
                        
                        {/* Social Links (បានបន្ថែម GitHub, TikTok, Telegram រួចរាល់) */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            {/* Facebook */}
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200" aria-label={t("Facebook")}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            {/* Twitter / X */}
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200" aria-label={t("Twitter")}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.584-12.045c0-.21-.005-.42-.014-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200" aria-label={t("Instagram")}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            {/* GitHub */}
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#24292e] transition-colors duration-200" aria-label={t("GitHub")}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.061.069-.061 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            </a>
                            {/* TikTok */}
                            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#000000] transition-colors duration-200" aria-label={t("TikTok")}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.17 1.12 1.15 2.66 1.82 4.23 1.99v3.83c-1.42-.03-2.83-.41-4.04-1.17-.67-.42-1.26-.97-1.72-1.63V15.5c-.06 1.75-.58 3.5-1.58 4.93-1.2 1.66-3.08 2.82-5.11 3.22-1.99.37-4.1.09-5.91-.84-1.78-.93-3.22-2.51-4-4.41C-.71 14.7.1 10.51 2.21 8.52c1.47-1.38 3.51-2.11 5.53-1.97v3.89c-.93-.16-1.92.09-2.65.69-.73.61-1.12 1.59-1.05 2.54.09 1.16.8 2.22 1.83 2.76 1.03.52 2.3.49 3.29-.11.75-.46 1.22-1.28 1.26-2.16V0h.1z"/>
                                </svg>
                            </a>
                            {/* Telegram */}
                            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0088cc] transition-colors duration-200" aria-label={t("Telegram")}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.74 7.59-3.27 3.61-1.51 4.36-1.77 4.85-1.78.11 0 .35.03.5.16.13.12.17.28.19.39.02.07.02.21.01.31z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            {t("Quick Links")}
                        </h3>
                        <ul className="space-y-2">
                            {[
                              { label: t("About Us"), href: '/public/aboutus' },
                              { label: t("Course"), href: '/public/course' },
                              { label: t("FAQ"), href: '/public/faq' },
                              { label: t("Scholarships"), href: '/public/scholarships' },
                              { label: t("Facilities"), href: '/public/facilities' },
                              { label: t("Check Application Status"), href: '/public/application-status' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="text-xs text-gray-500 hover:text-blue-600 transition duration-150 block py-0.5">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Resources */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            {t("Resources")}
                        </h3>
                        <ul className="space-y-2">
                            {[
                              { label: t("Library"), href: '/public/facilities' },
                              { label: t("Academic Calendar"), href: '/public/calendar' },
                              { label: t("Faculty & Staff"), href: '/public/staff' },
                              { label: t("Events"), href: '/public/calendar' },
                              { label: t("Enroll"), href: '/public/content/enroll' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="text-xs text-gray-500 hover:text-blue-600 transition duration-150 block py-0.5">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 - Contact & Newsletter */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
                                {t("Stay Updated")}
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">
                                {t("Subscribe to receive our digital announcements.")}
                            </p>
                            <form onSubmit={handleSubscribe}>
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder={t("Your email")}
                                        className="bg-transparent text-gray-900 placeholder-gray-400 px-3 py-1 w-full text-xs focus:outline-none"
                                        aria-label={t("Email address")}
                                    />
                                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3 py-1.5 rounded-md transition duration-150 focus:outline-none">
                                        {t("Join")}
                                    </button>
                                </div>
                                {status === "success" && (
                                    <p className="text-[11px] text-green-600 mt-1.5">{t("Thanks! You're on the list.")}</p>
                                )}
                                {status === "error" && (
                                    <p className="text-[11px] text-red-500 mt-1.5">{t("Please enter a valid email address.")}</p>
                                )}
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="pt-2 space-y-2 border-t border-gray-100">
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{t("Phnom Penh, Cambodia")}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:info@ciu.edu.kh" className="hover:text-blue-600 transition">{t("Mr.Sal@gmail.com.kh")}</a>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <svg className="h-3.5 w-3.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                                <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition">
                                    {t("Khuch Visal")}
                                </a>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.1 1.05a11.04 11.04 0 005.52 5.52l1.05-2.1a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z" />
                                </svg>
                                <a href="tel:0712197241" className="hover:text-blue-600 transition">
                                    {t("071 2197 241")}
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar - Copyright */}
            <div className="border-t border-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                        <p className="text-[11px] text-gray-400">
                            © {new Date().getFullYear()} {t("Cambodia International University. All rights reserved.")}
                        </p>
                        <div className="flex space-x-6">
                            <a href="/privacy" className="text-[11px] text-gray-400 hover:text-blue-600 transition duration-150">
                                {t("Privacy Policy")}
                            </a>
                            <a href="/terms" className="text-[11px] text-gray-400 hover:text-blue-600 transition duration-150">
                                {t("Terms of Service")}
                            </a>
                            <a href="/sitemap" className="text-[11px] text-gray-400 hover:text-blue-600 transition duration-150">
                                {t("Sitemap")}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;