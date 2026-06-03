import React from 'react';

const AboutPage = () => {
    return (
        <div className="bg-[#f8fafc] font-['Inter'] min-h-screen text-slate-900 antialiased selection:bg-blue-500 selection:text-white">

            {/* Main Wrapper Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

                {/* THE CORE ABOUT SECTION - Matches image_3c7e67.jpg layout dynamically */}
                {/* បានប្តូរទៅជា rounded-[2rem] ដើម្បីឱ្យវាមានរាងមូលស្អាតពេលដាច់ចេញពីគ្នា */}
                <div className="relative bg-gradient-to-r from-[#4d79ff] via-[#8585e6] to-[#ffb3b3] rounded-[2rem] p-8 lg:p-16 shadow-xl overflow-hidden">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

                        {/* LEFT COLUMN (6 Columns): Brand Identity & Info */}
                        <div className="lg:col-span-6 space-y-6 text-white pr-0 lg:pr-6">
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                                <span className="text-[#ffff00]">Cambodia</span> International <br />
                                University
                            </h1>

                            <p className="text-white/90 text-sm lg:text-base leading-relaxed max-w-md font-normal">
                                Building your dream with our University, and make a wish come true,
                                taste more Experincce then you you had, more labs and over 1000 students
                                achived their goal. Welcome to Cambodia International University.
                            </p>
                        </div>

                        {/* MIDDLE COLUMN: Artistic Vertical Divider Line */}
                        <div className="hidden lg:flex lg:col-span-1 justify-center h-full py-4">
                            <div className="w-[2px] bg-white/40 h-48 rounded-full"></div>
                        </div>

                        {/* RIGHT COLUMN (5 Columns): Lab Stats & Call To Actions */}
                        <div className="lg:col-span-5 text-slate-900 space-y-6">

                            {/* Headline & Subhead */}
                            <div className="space-y-4">
                                <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-950 max-w-sm leading-snug">
                                    Our Labs had over 200 for students to study in their dream
                                </h2>
                                <p className="text-sm font-bold tracking-tight text-slate-900">
                                    Enroll now to match your skills
                                </p>
                            </div>

                            {/* Row Layout: Split between Buttons Stack and Camp Image */}
                            <div className="flex flex-row items-start gap-6">

                                {/* Dynamic Pill Buttons Stack */}
                                <div className="flex flex-col gap-2.5 shrink-0 w-32">
                                    {/* Enroll Pill */}
                                    <button className="bg-black hover:bg-slate-900 text-white text-xs font-semibold py-2 px-4 rounded-full flex items-center justify-between transition-colors shadow-sm">
                                        <span>Enroll</span>
                                        <span className="text-[10px]">➔</span>
                                    </button>

                                    {/* View Course Pill */}
                                    <button className="bg-white/80 hover:bg-white text-slate-900 border border-slate-300 text-xs font-semibold py-2 px-4 rounded-full text-center transition-colors shadow-sm">
                                        View Course
                                    </button>

                                    {/* See More Pill */}
                                    <button className="bg-white/80 hover:bg-white text-slate-900 border border-slate-300 text-xs font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-1 transition-colors shadow-sm">
                                        <span>See More</span>
                                        <span className="text-[10px]">⌂</span>
                                    </button>
                                </div>

                                {/* Campus Miniature Preview Frame */}
                                <div className="flex-1 max-w-[200px] h-28 rounded-xl overflow-hidden border-2 border-white/40 shadow-md">
                                    <img
                                        src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                                        alt="CIU Campus Arial View"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;