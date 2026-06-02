import React, { useState, useEffect } from 'react';

const SlideShow = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            title: "Excellence in Education",
            subtitle: "Shaping future leaders since 2005"
        },
        {
            url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            title: "World-Class Campus",
            subtitle: "State-of-the-art facilities for modern learning"
        },
        {
            url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            title: "Global Community",
            subtitle: "Students from over 50 countries"
        },
        {
            url: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1186&q=80",
            title: "Innovation Hub",
            subtitle: "Where ideas become reality"
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

    return (
        <div className="relative w-full h-[600px] overflow-hidden bg-gray-50">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                        index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                >
                    {/* Dark overlay for better text readability - matches navbar's glass aesthetic */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-10"></div>
                    
                    <img 
                        src={slide.url} 
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Caption overlay - matching navbar's glass style */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 pb-20 pt-32 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="transform transition-all duration-500 delay-100 translate-y-0">
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 font-['Inter'] tracking-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-lg sm:text-xl text-white/90 font-['Inter']">
                                    {slide.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows - matching navbar's blue accent */}
            <button
                onClick={prevSlide}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-md hover:bg-white/95 text-gray-800 rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                aria-label="Previous slide"
            >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-md hover:bg-white/95 text-gray-800 rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                aria-label="Next slide"
            >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots indicator - matching navbar's clean minimal style */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            index === currentSlide 
                                ? 'w-8 h-2 bg-blue-600' 
                                : 'w-2 h-2 bg-white/60 hover:bg-white/90 hover:w-4'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Optional: Slide counter - subtle like navbar's search bar */}
            <div className="absolute bottom-6 right-4 sm:right-6 z-30 bg-white/80 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 font-['Inter'] shadow-sm">
                {currentSlide + 1} / {slides.length}
            </div>
        </div>
    );
};

export default SlideShow;