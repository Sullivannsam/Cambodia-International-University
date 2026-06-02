import React from 'react';

const AboutPage = () => {
    return (
        <div className="bg-[#f8fafc] font-['Inter'] min-h-screen text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
            
            {/* Main Wrapper Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                
                {/* Upper Grid Layout: Splitting Content Artistically */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                    
                    {/* LEFT CARD (7 Columns): Brand Identity & Main Intro */}
                    <div className="lg:col-span-7 bg-white rounded-[2rem] border border-slate-100 p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between relative overflow-hidden group">
                        {/* Decorative Background Blur Subtle Element */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-500"></div>
                        
                        <div className="space-y-8 relative z-10">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                Global Excellence
                            </div>
                            
                            <h1 className="text-4xl lg:text-[3.25rem] font-black tracking-tight leading-[1.1] text-slate-950">
                                Cambodia <br />
                                International <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">University</span>
                            </h1>
                        </div>

                        <div className="pt-12 lg:pt-24 relative z-10">
                            <p className="text-slate-500 text-base lg:text-lg leading-relaxed max-w-xl font-normal">
                                Building your dream with our University, and make a wish come true, 
                                taste more Experience then you you had, more labs and over 1000 students 
                                achieved their goal. Welcome to Cambodia International University.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT CARD (5 Columns): Lab Stats & Dynamic Call To Actions */}
                    {/* កែសម្រួលឱ្យដូចទៅនឹងរូបភាព Screenshot 2026-06-02 221157.png */}
                    <div className="lg:col-span-5 bg-[#030712] text-white rounded-[2rem] p-8 lg:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative Gradient Glow */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                        
                        {/* Top Content Block */}
                        <div className="space-y-8 relative z-10">
                            {/* ប្តូរមកប្រើ Flex-col ដើម្បីរុញអត្ថបទទៅខាងលើ និងរូបភាពនៅខាងក្រោម */}
                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug max-w-md">
                                    Our Labs had over <span className="text-blue-500 font-extrabold">200+</span> spaces for students to innovate.
                                </h2>
                                
                                {/* ទីតាំងរូបភាពស្ថិតនៅក្រោមអត្ថបទ */}
                                <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden border border-white/5 shadow-lg group">
                                    <img 
                                        src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                                        alt="CIU Campus Lab" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                                Enroll now to match your skills
                            </p>
                        </div>

                        {/* Bottom Section: Modern UI Buttons Stacking */}
                        <div className="mt-10 flex flex-col gap-3 relative z-10">
                            {/* Primary Ultra-Modern Button */}
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-4 px-5 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-lg shadow-blue-600/20 active:scale-[0.98] group">
                                <span>Get Started & Enroll</span>
                                <div className="bg-white/10 p-1 rounded-lg group-hover:translate-x-1 transition-transform">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </button>

                            {/* Secondary Glossy Dark Button */}
                            <button className="w-full bg-white/5 hover:bg-white/10 text-white text-sm font-semibold py-4 px-5 rounded-2xl text-left border border-white/5 transition-all duration-200 active:scale-[0.98]">
                                View Programs & Courses
                            </button>

                            {/* Minimal Anchor Action */}
                            <button className="w-full text-slate-400 hover:text-white text-xs font-semibold py-2 text-center transition-colors duration-200">
                                Explore Campus Facility Details →
                            </button>
                        </div>

                    </div>

                </div>

                {/* LOWER SECTION: Interactive Slider Placeholder Grid Layout */}
                <div className="mt-8">
                    <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.008)]">
                        <div className="bg-slate-50 rounded-2xl py-12 text-center text-xs font-bold tracking-widest text-slate-400 border border-dashed border-slate-200 uppercase">
                            Interactive Content Slide Gallery Viewport
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutPage; 