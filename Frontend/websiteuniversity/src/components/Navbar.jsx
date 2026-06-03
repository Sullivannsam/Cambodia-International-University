import React, { useState } from 'react';

const Navbar = () => {
    // បន្ថែម State សម្រាប់បើក/បិទ Mobile Menu
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 text-gray-800 font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Brand Logo & Title */}
                    <div className="flex items-center space-x-3 cursor-pointer group">
                        <div className="flex-shrink-0 bg-blue-600 p-2 rounded-xl transition-transform duration-300 group-hover:scale-105">
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.5" />
                            </svg>
                        </div>
                        <span className="font-semibold text-base lg:text-lg tracking-tight text-gray-900 dynamic-title">
                            Cambodia International University
                        </span>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <a href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-200">
                            Home
                        </a>
                        <a href="/about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-200">
                            About
                        </a>
                        <a href="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-200">
                            Contact
                        </a>
                        {/* បានប្តូរពី Email ទៅជា Enroll រួចរាល់ */}
                        <a href="/enroll" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-200">
                            Enroll
                        </a>
                    </div>

                    {/* Search Bar & Action Block (Login Button) */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {/* Search Input */}
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="w-40 lg:w-48 bg-gray-50 text-gray-900 placeholder-gray-400 pl-4 pr-10 py-1.5 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                            />
                            <svg className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Modern Login Button */}
                        <a 
                            href="/login" 
                            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
                        >
                            Login
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                    
                </div>
            </div>

            {/* Mobile Navigation Menu (Responsive Dropdown) */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-inner">
                    <a href="/" className="block text-sm font-medium text-gray-600 hover:text-blue-600 py-2 transition">Home</a>
                    <a href="/about" className="block text-sm font-medium text-gray-600 hover:text-blue-600 py-2 transition">About</a>
                    <a href="/contact" className="block text-sm font-medium text-gray-600 hover:text-blue-600 py-2 transition">Contact</a>
                    {/* បានប្តូរពី Email ទៅជា Enroll សម្រាប់អេក្រង់ទូរស័ព្ទ */}
                    <a href="/enroll" className="block text-sm font-medium text-gray-600 hover:text-blue-600 py-2 transition">Enroll</a>
                    
                    <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                        {/* Search on Mobile */}
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 pl-4 pr-10 py-2 rounded-lg text-sm border border-gray-200"
                            />
                            <svg className="absolute right-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {/* Login Button on Mobile */}
                        <a 
                            href="/login" 
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-center text-sm font-medium py-2 rounded-xl block transition duration-200"
                        >
                            Login
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;