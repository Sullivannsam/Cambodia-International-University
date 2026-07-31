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

    useEffect(() => {
        const closeOnClickOutside = (e) => {
            if (!e.target.closest(".admin-toggle-wrap")) closeAdminMenu();
        };
        document.addEventListener("click", closeOnClickOutside);
        return () => document.removeEventListener("click", closeOnClickOutside);
    }, []);

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const email = localStorage.getItem("email") || (userData ? JSON.parse(userData).email : null);
    const role = localStorage.getItem("role");
    const [adminOpen, setAdminOpen] = useState(false);
    const [adminClosing, setAdminClosing] = useState(false);

    const closeAdminMenu = () => {
        setAdminOpen(false);
        setAdminClosing(true);
        setTimeout(() => setAdminClosing(false), 250);
    };

    const toggleAdminMenu = () => {
        if (adminOpen) {
            closeAdminMenu();
        } else {
            setAdminOpen(true);
        }
    };
 
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
 
                    {/* Desktop Nav Links (hidden for logged-in users, they use the hamburger) */}
                    {!token && (
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
                    )}
 
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

                        {/* Account hamburger toggle (for every logged-in user) */}
                        {token && (
                            <div style={{ position: "relative" }} className="admin-toggle-wrap">
                                <button
                                    onClick={toggleAdminMenu}
                                    style={{
                                        background: "#2563eb", color: "white",
                                        border: "none", cursor: "pointer",
                                        padding: "8px 12px", borderRadius: 10,
                                        display: "flex", alignItems: "center", gap: 6,
                                        fontSize: 13, fontWeight: 600,
                                        boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                                    }}>
                                    <span className={`burger-box${adminOpen ? " open" : ""}`}>
                                        <span />
                                        <span />
                                        <span />
                                    </span>
                                    {role ? role.charAt(0) + role.slice(1).toLowerCase() : "Menu"}
                                </button>
                                {(adminOpen || adminClosing) && (
                                    <div style={{
                                        position: "absolute", right: 0, top: "calc(100% + 8px)",
                                        background: "var(--nav-bg)", border: "1px solid var(--border)",
                                        borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,0.15)",
                                        minWidth: 220, padding: 8, zIndex: 60,
                                        animation: adminOpen ? "slideDown 0.25s ease" : "slideUp 0.25s ease forwards",
                                    }}>
                                        <a href="/user/settings" onClick={closeAdminMenu} style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                            padding: "10px 12px", borderRadius: 8,
                                            color: "var(--text-primary)", textDecoration: "none",
                                            fontSize: 14, fontWeight: 600,
                                        }}>
                                            <svg style={{ width: 16, height: 16, color: "#2563eb" }} fill="none" stroke="#2563eb" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Account Setting
                                        </a>
                                        {role === "ADMIN" && (
                                            <a href="/admin/dashboard" onClick={closeAdminMenu} style={{
                                                display: "flex", alignItems: "center", gap: 10,
                                                padding: "10px 12px", borderRadius: 8,
                                                color: "var(--text-primary)", textDecoration: "none",
                                                fontSize: 14, fontWeight: 600,
                                            }}>
                                                <svg style={{ width: 16, height: 16, color: "#2563eb" }} fill="none" stroke="#2563eb" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                                </svg>
                                                Admin Dashboard
                                            </a>
                                        )}
                                        <div style={{ margin: "6px 0", borderTop: "1px solid var(--border)" }} />
                                        {[
                                            {
                                                label: "Home", href: "/",
                                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />,
                                            },
                                            {
                                                label: "Course", href: "/public/course",
                                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
                                            },
                                            {
                                                label: "About Us", href: "/public/aboutus",
                                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                                            },
                                            {
                                                label: "Contact", href: "/public/contact",
                                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
                                            },
                                            {
                                                label: "Enroll", href: "/public/content/enroll",
                                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />,
                                            },
                                        ].map(({ label, href, icon }) => (
                                            <a key={label} href={href} onClick={closeAdminMenu} style={{
                                                display: "flex", alignItems: "center", gap: 10,
                                                padding: "10px 12px", borderRadius: 8,
                                                color: "var(--text-secondary)", textDecoration: "none",
                                                fontSize: 14, fontWeight: 500,
                                            }}>
                                                <svg style={{ width: 16, height: 16, color: "#2563eb", flexShrink: 0 }} fill="none" stroke="#2563eb" viewBox="0 0 24 24">
                                                    {icon}
                                                </svg>
                                                {label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

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

                .admin-toggle-wrap a:hover {
                    background: var(--hover-bg);
                    color: #2563eb !important;
                    transform: translateX(3px);
                }

                .burger-box {
                    width: 16px;
                    height: 16px;
                    position: relative;
                    flex-shrink: 0;
                }

                .burger-box span {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: white;
                    border-radius: 2px;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
                }

                .burger-box span:nth-child(1) { top: 2px; }
                .burger-box span:nth-child(2) { top: 7px; }
                .burger-box span:nth-child(3) { top: 12px; }

                .burger-box.open span:nth-child(1) {
                    transform: translateY(5px) rotate(45deg);
                }

                .burger-box.open span:nth-child(2) {
                    opacity: 0;
                    transform: translateX(8px);
                }

                .burger-box.open span:nth-child(3) {
                    transform: translateY(-5px) rotate(-45deg);
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
                @keyframes slideUp {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-12px); }
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
