import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const SlideShow = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const dragStartX = useRef(null);
    const dragging = useRef(false);
    const { t } = useLanguage();
    
    const slides = [
        {
            url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            title: t("Excellence in Education"),
            subtitle: t("Shaping future leaders since 2005")
        },
        {
            url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpaperaccess.com%2Ffull%2F2137313.jpg&f=1&nofb=1&ipt=a4ed63f0861b8bd7a83c9f35b427c573361471c1d4866fa3ea0c1539467bef0a",
            title: t("World-Class Campus"),
            subtitle: t("State-of-the-art facilities for modern learning")
        },
        {
            url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            title: t("Global Community"),
            subtitle: t("Students from over 50 countries")
        },
        {
            url: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1186&q=80",
            title: t("Innovation Hub"),
            subtitle: t("Where ideas become reality")
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handlePointerDown = (e) => {
        dragging.current = true;
        dragStartX.current = e.clientX;
    };

    const handlePointerMove = (e) => {
        if (!dragging.current) return;
        e.preventDefault();
        const delta = e.clientX - dragStartX.current;
        if (delta < -50) {
            dragging.current = false;
            nextSlide();
        } else if (delta > 50) {
            dragging.current = false;
            prevSlide();
        }
    };

    const handlePointerUp = () => {
        dragging.current = false;
        dragStartX.current = null;
    };

    return (
        /* កែប្រែទំហំមកត្រឹម h-[350px] លើ Mobile និង h-[450px] លើ Desktop ដើម្បីឱ្យសមល្មមមើល (Attractive Size) */
        /* បន្ថែម rounded-t-[2rem] ឱ្យស៊ីគ្នានឹងកាត AboutPage ខាងក្រោម */
        <div
            className="relative w-full h-[350px] lg:h-[450px] overflow-hidden bg-slate-100 rounded-t-[2rem] shadow-sm select-none cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'pan-y' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                >
                    {/* បន្ថែម Gradient ងងឹតផ្នែកខាងក្រោម ដើម្បីជួយឱ្យអក្សរកាន់តែច្បាស់ស្អាត */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent z-10"></div>
                    
                    <img 
                        src={slide.url} 
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Caption Overlay - រៀបចំទីតាំង និងទំហំអក្សរឱ្យសមរម្យជាមួយទំហំស្លាយថ្មី */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-24">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                            <div className={`transform transition-all duration-700 ${
                                index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 font-['Inter'] tracking-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 font-['Inter'] font-normal max-w-xl">
                                    {slide.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows - រចនាបថថ្លាៗបែប Glassmorphism ស្អាតប្លែកភ្នែក */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-2.5 transition-all duration-200 hover:scale-105 active:scale-95 border border-white/20 shadow-md"
                aria-label="Previous slide"
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-2.5 transition-all duration-200 hover:scale-105 active:scale-95 border border-white/20 shadow-md"
                aria-label="Next slide"
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots indicator - ប្តូរមកពណ៌សថ្លា និងខៀវ (Blue-600) ឱ្យត្រូវនឹង Brand សាលា */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                            index === currentSlide 
                                ? 'w-6 h-2 bg-blue-600' 
                                : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Slide counter - កែសម្រួលទីតាំងឱ្យស្អាតស្រទន់ */}
            <div className="absolute bottom-5 right-6 z-30 bg-slate-950/40 backdrop-blur-md rounded-full px-3 py-1 text-[11px] font-semibold text-slate-200 border border-white/10 tracking-wider">
                {currentSlide + 1} / {slides.length}
            </div>
        </div>
    );
};

export default SlideShow;
