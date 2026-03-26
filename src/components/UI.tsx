import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }: any) => {
    // Gradients and glow effects using new #2934FF base
    const variants: any = {
        primary: "bg-gradient-primary hover:opacity-90 text-white shadow-[0_0_20px_rgba(41,52,255,0.4)] border border-transparent",
        outline: "bg-transparent border border-white/10 text-white hover:bg-white/5",
        ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border-transparent",
        danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                px-6 py-3 rounded-2xl font-bold transition-all active:scale-[0.98]
                flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : children}
        </button>
    );
};

export const GlassCard = ({ children, className = '', onClick }: any) => (
    <div 
        onClick={onClick} 
        className={`relative bg-surface/80 border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl overflow-hidden ${className} ${onClick ? 'cursor-pointer hover:border-primary/50 transition-colors' : ''}`} 
        style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--border-color)',
            WebkitMaskImage: '-webkit-radial-gradient(white, black)', // Fix for rounding on safari/chrome mobile
            transform: 'translateZ(0)' // Force hardware acceleration for smooth corners
        }}
    >
        {children}
    </div>
);

export const Input = ({ placeholder, value, onChange, type = "text", className = "" }: any) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-2xl px-5 py-4 placeholder-slate-500 focus:outline-none focus:border-primary transition-all ${className}`}
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
    />
);

export const TextArea = ({ placeholder, value, onChange, className = "" }: any) => (
    <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={4}
        className={`w-full border rounded-3xl px-6 py-4 placeholder-slate-500 focus:outline-none focus:border-primary transition-all backdrop-blur-sm resize-none ${className}`}
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
    />
);

export const HorizontalScroll = ({ children, className = "" }: any) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeft(scrollLeft > 0);
        setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        const timeoutId = setTimeout(checkScroll, 500);
        return () => {
            window.removeEventListener('resize', checkScroll);
            clearTimeout(timeoutId);
        };
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const { clientWidth } = scrollRef.current;
        const scrollAmount = clientWidth * 0.75;
        scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        setTimeout(checkScroll, 400);
    };

    return (
        <div className={`relative group ${className}`}>
            {showLeft && (
                <>
                    <div className="absolute left-0 top-0 bottom-8 w-32 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-10 hidden sm:block" />
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('left'); }}
                        className="absolute left-2 top-1/2 -translate-y-[calc(50%+1rem)] z-20 w-12 h-12 bg-surface border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hidden sm:flex shadow-2xl backdrop-blur-md hover:scale-105"
                    >
                        <Icons.ChevronLeft className="w-6 h-6 mr-1" />
                    </button>
                </>
            )}

            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto gap-4 no-scrollbar snap-x pb-8 relative z-0"
            >
                {children}
            </div>

            {showRight && (
                <>
                    <div className="absolute right-0 top-0 bottom-8 w-32 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-10 hidden sm:block" />
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('right'); }}
                        className="absolute right-2 top-1/2 -translate-y-[calc(50%+1rem)] z-20 w-12 h-12 bg-surface border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hidden sm:flex shadow-2xl backdrop-blur-md hover:scale-105"
                    >
                        <Icons.ChevronRight className="w-6 h-6 ml-1" />
                    </button>
                </>
            )}
        </div>
    );
};
