import React from 'react';

const Footer = () => {
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
                                Cambodia International University
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Empowering minds, shaping futures. Committed to excellence in education, research, and innovation since 2005.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-3 pt-2">
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.584-12.045c0-.21-.005-.42-.014-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {['About Us', 'Academics', 'Admissions', 'Research', 'Campus Life'].map((item) => (
                                <li key={item}>
                                    <a href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-xs text-gray-500 hover:text-blue-600 transition duration-150 block py-0.5">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Resources */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            {['Library', 'Careers', 'Alumni', 'Events', 'FAQ'].map((item) => (
                                <li key={item}>
                                    <a href={`/${item.toLowerCase()}`} className="text-xs text-gray-500 hover:text-blue-600 transition duration-150 block py-0.5">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 - Contact & Newsletter */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
                                Stay Updated
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">
                                Subscribe to receive our digital announcements.
                            </p>
                            {/* Refined Integrated Input Bar */}
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
                                <input 
                                    type="email" 
                                    placeholder="Your email" 
                                    className="bg-transparent text-gray-900 placeholder-gray-400 px-3 py-1 w-full text-xs focus:outline-none"
                                />
                                <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3 py-1.5 rounded-md transition duration-150 focus:outline-none">
                                    Join
                                </button>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="pt-2 space-y-2 border-t border-gray-100">
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <span>Phnom Penh, Cambodia</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                <a href="mailto:info@ciu.edu.kh" className="hover:text-blue-600 transition">info@ciu.edu.kh</a>
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
                            © {new Date().getFullYear()} Cambodia International University. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a href="/privacy" className="text-[11px] text-gray-400 hover:text-blue-600 transition duration-150">
                                Privacy Policy
                            </a>
                            <a href="/terms" className="text-[11px] text-gray-400 hover:text-blue-600 transition duration-150">
                                Terms of Service
                            </a>
                            <a href="/sitemap" className="text-[11px] text-gray-400 hover:text-blue-600 transition duration-150">
                                Sitemap
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;