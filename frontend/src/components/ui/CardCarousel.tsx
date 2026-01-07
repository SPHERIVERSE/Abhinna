"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselItem = {
  id: string;
  fileUrl: string;
  title?: string;
};

type CarouselProps = {
  items: CarouselItem[];
  autoPlay?: boolean;
  variant?: "hero" | "portrait"; // 👈 New Prop to control shape
};

export default function CardCarousel({ items, autoPlay = true, variant = "portrait" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 🔄 LOOP LOGIC
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // ⏳ AUTO PLAY
  useEffect(() => {
    if (!autoPlay || items.length <= 1 || isPaused) return;
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlay, items.length, isPaused]);

  // Helper for circular indexing
  const getIndex = (offset: number) => {
    return (currentIndex + offset + items.length) % items.length;
  };

  if (!items || items.length === 0) return null;

  // 🎨 DYNAMIC DIMENSIONS BASED ON VARIANT
  const isHero = variant === "hero";

  // Dimensions for the CENTER card
  const centerClasses = isHero 
    ? "w-[320px] h-[200px] md:w-[650px] md:h-[400px]" // Landscape (Hero)
    : "w-[260px] h-[380px] md:w-[340px] md:h-[480px]"; // Portrait (Result)

  // Dimensions for the SIDE cards (Background)
  const sideClasses = isHero
    ? "w-[280px] h-[180px] md:w-[500px] md:h-[300px]" 
    : "w-[220px] h-[320px] md:w-[280px] md:h-[400px]";

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* Container Width */}
      <div className={`relative w-full flex items-center justify-center perspective-1000 ${isHero ? 'max-w-6xl h-[250px] md:h-[450px]' : 'max-w-5xl h-[450px] md:h-[550px]'}`}>
        
        {/* 🌑 LEFT CARD */}
        {items.length > 1 && (
          <div 
            className={`absolute transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] z-10 opacity-60
            transform -translate-x-[50%] md:-translate-x-[60%] blur-[2px] cursor-pointer hover:opacity-80 scale-90 ${sideClasses}`}
            onClick={prevSlide}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
              <img src={items[getIndex(-1)].fileUrl} alt="Prev" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* 🌟 CENTER CARD (Active) */}
        <div className={`absolute z-30 transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform scale-100 cursor-grab active:cursor-grabbing ${centerClasses}`}>
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-4 border-white/20 bg-slate-800 group">
             <img 
               src={items[currentIndex].fileUrl} 
               alt="Main" 
               className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
             />
             
             {/* Text Overlay - Standard Font (No Cursive) */}
             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#003153] via-[#003153]/80 to-transparent pt-12 pb-6 px-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
               <p className="text-white font-bold text-center text-lg md:text-xl tracking-wide drop-shadow-md">
                 {items[currentIndex].title || "Gallery"}
               </p>
             </div>
          </div>
        </div>

        {/* 🌑 RIGHT CARD */}
        {items.length > 1 && (
          <div 
            className={`absolute transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] z-10 opacity-60
            transform translate-x-[50%] md:translate-x-[60%] blur-[2px] cursor-pointer hover:opacity-80 scale-90 ${sideClasses}`}
            onClick={nextSlide}
          >
             <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
              <img src={items[getIndex(1)].fileUrl} alt="Next" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

      </div>

      {/* 🎮 NAVIGATION BUTTONS */}
      <button 
        onClick={prevSlide} 
        className="absolute left-2 md:left-4 z-40 p-3 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-[#003153] text-white backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide} 
        className="absolute right-2 md:right-4 z-40 p-3 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-[#003153] text-white backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg"
      >
        <ChevronRight size={24} />
      </button>

      {/* 📍 DOTS */}
      <div className="absolute bottom-0 flex gap-2 z-40">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 rounded-full shadow-sm ${
              idx === currentIndex 
                ? 'w-8 h-2 bg-[#D4AF37]' 
                : 'w-2 h-2 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
