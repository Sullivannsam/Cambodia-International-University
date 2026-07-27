import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
 
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const closeOnResize = () => {
            if (window.innerWidth > 768) setIsOpen(false);
        };
        window.addEventListener("resize", closeOnResize);
        return () => window.removeEventListener("resize", closeOnResize);
    }, []);
 
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const email = localStorage.getItem("email") || (userData ? JSON.parse(userData).email : null);
 
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/");
    };
 
    const linkStyle = {
        fontSize: 14,
        fontWeight: 500,
        color: "var(--text-secondary)",
        textDecoration: "none",
        transition: "color 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        paddingBottom: 4,
        cursor: "pointer",
    };
 
    return (
        <nav style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backgroundColor: "var(--nav-bg)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
            fontFamily: "'Inter', sans-serif",
            boxShadow: "var(--nav-shadow)",
        }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
  
                    {/* Brand Logo & Title */}
                    <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                        <div style={{
                            background: "#2563eb",
                            padding: 8,
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <svg style={{ width: 20, height: 20, color: "white" }} fill="none" stroke="white" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                            Cambodia International University
                        </span>
                    </a>
 
                    {/* Desktop Nav Links */}
                    <div style={{ display: "flex", alignItems: "center", gap: 32 }}
                        className="desktop-nav">
                        {[
                            { label: "Home", href: "/" },
                            { label: "Course", href: "/public/course" },
                            { label: "About Us", href: "/public/aboutus" },
                            { label: "Contact", href: "/public/contact" },
                            { label: "Enroll", href: "/public/content/enroll" },
                        ].map(({ label, href }) => (
                            <a key={label} href={href} className="nav-link" style={linkStyle}>
                                {label}
                            </a>
                        ))}
                    </div>
 
                    {/* Search + Buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}
                        className="desktop-actions">
                        {/* Search */}
                        <div style={{ position: "relative" }}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    style={{
                                        width: 176,
                                        background: "var(--input-bg)",
                                        border: "1px solid var(--border)",
                                        borderRadius: 10,
                                        padding: "7px 36px 7px 14px",
                                        fontSize: 14,
                                        color: "var(--text-primary)",
                                        outline: "none",
                                    }}
                                />
                                <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "var(--text-muted)" }}
                                    fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Dark Mode Toggle */}
                        <button onClick={toggleTheme} className="theme-toggle" style={{
                            background: "none", border: "none", cursor: "pointer",
                            padding: 6, borderRadius: 8, color: "var(--text-secondary)",
                            display: "flex", alignItems: "center",
                            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s",
                        }}>
                            {theme === "dark" ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>

                        {/* Auth Buttons */}
                        {token ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                {/* User avatar circle */}
                                <a href="/user/settings" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                                    <div style={{
                                        width: 34, height: 34, borderRadius: "50%",
                                        background: "#2563eb", color: "white",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 13, fontWeight: 700,
                                    }}>
                                        {email ? email[0].toUpperCase() : "U"}
                                    </div>
                                    <span style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {email}
                                    </span>
                                </a>
                                <button onClick={logout} style={{
                                    background: "#ef4444", color: "white",
                                    fontSize: 13, fontWeight: 600,
                                    padding: "7px 16px", borderRadius: 10,
                                    border: "none", cursor: "pointer",
                                    whiteSpace: "nowrap",
                                }}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <a href="/public/login" className="btn-signin" style={{
                                    background: "transparent", color: "#2563eb",
                                    fontSize: 14, fontWeight: 600,
                                    padding: "8px 18px", borderRadius: 10,
                                    textDecoration: "none", whiteSpace: "nowrap",
                                    border: "1.5px solid #2563eb",
                                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                                    cursor: "pointer",
                                }}>Sign In</a>
                                <a href="/public/register" className="btn-signup" style={{
                                    background: "#2563eb", color: "white",
                                    fontSize: 14, fontWeight: 600,
                                    padding: "8px 18px", borderRadius: 10,
                                    textDecoration: "none", whiteSpace: "nowrap",
                                    boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                                    cursor: "pointer",
                                }}>Sign up</a>
                            </>
                        )}
                    </div>
 
                    {/* Hamburger (mobile) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="mobile-menu-btn"
                        style={{
                            display: "none",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 6,
                            borderRadius: 8,
                            color: "var(--text-secondary)",
                            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s",
                        }}>
                        <svg style={{ width: 24, height: 24, transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </div>
 
            {/* Mobile Menu */}
            {isOpen && (
                <div className="mobile-menu" style={{
                    background: "var(--nav-bg)",
                    borderTop: "1px solid var(--border)",
                    padding: "12px 24px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    boxShadow: "var(--nav-shadow)",
                }}>
                    {[
                        { label: "Home", href: "/" },
                        { label: "Course", href: "/public/course" },
                        { label: "About Us", href: "/public/aboutus" },
                        { label: "Contact", href: "/public/contact" },
                        { label: "Enroll", href: "/enroll" },
                    ].map(({ label, href }) => (
                        <a key={label} href={href} className="mobile-link" style={{ ...linkStyle, padding: "10px 0", display: "block", borderBottom: "1px solid var(--border)" }}>
                            {label}
                        </a>
                    ))}
                  
                    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ position: "relative" }}>
                            <input type="text" placeholder="Search..."
                                style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "9px 36px 9px 14px", fontSize: 14, color: "var(--text-primary)", outline: "none" }} />
                            <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "var(--text-muted)" }}
                                fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button onClick={toggleTheme} style={{
                            background: "var(--hover-bg)", border: "none", cursor: "pointer",
                            padding: "8px 12px", borderRadius: 10, color: "var(--text-secondary)",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14,
                        }}>
                            {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
                        </button>
                        {token ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <a href="/user/settings" style={{ color: "#2563eb", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "10px 0" }}>👤 {email}</a>
                                <button onClick={logout} style={{ background: "#ef4444", color: "white", padding: "10px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <a href="/public/login" style={{ background: "transparent", color: "#2563eb", textAlign: "center", padding: "10px", borderRadius: 12, textDecoration: "none", fontSize: 14, fontWeight: 600, border: "1.5px solid #2563eb" }}>Sign In</a>
                                <a href="/public/register" style={{ background: "#2563eb", color: "white", textAlign: "center", padding: "10px", borderRadius: 12, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Sign up</a>
                            </>
                        )}
                    </div>
                </div>
            )}
 
            {/* Responsive styles via <style> tag */}
            <style>{`
                .nav-link {
                    will-change: transform;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background: #2563eb;
                    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 2px;
                }
                .nav-link:hover::after {
                    width: 100%;
                    left: 0;
                }
                .nav-link:hover {
                    color: #2563eb !important;
                    transform: translateY(-2px);
                }

                .btn-signin {
                    will-change: transform;
                }
                .btn-signin:hover {
                    background: #2563eb !important;
                    color: white !important;
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 6px 20px rgba(37,99,235,0.35);
                }
                .btn-signup {
                    will-change: transform;
                }
                .btn-signup:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 6px 24px rgba(37,99,235,0.45);
                }

                .theme-toggle:hover {
                    transform: rotate(30deg) scale(1.1);
                    color: #2563eb !important;
                }

                .mobile-menu {
                    animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                .mobile-link {
                    animation: fadeInUp 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    opacity: 0;
                    will-change: transform, opacity;
                }
                .mobile-link:nth-child(1) { animation-delay: 0.04s; }
                .mobile-link:nth-child(2) { animation-delay: 0.08s; }
                .mobile-link:nth-child(3) { animation-delay: 0.12s; }
                .mobile-link:nth-child(4) { animation-delay: 0.16s; }
                .mobile-link:nth-child(5) { animation-delay: 0.20s; }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .desktop-actions { display: none !important; }
                    .mobile-menu-btn { display: flex !important; }
                }
            `}</style>
        </nav>
    );
};
 
export default Navbar;
