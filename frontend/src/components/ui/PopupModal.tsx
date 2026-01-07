"use client";

import { useEffect, useState, useRef } from "react";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

// 👇 CONFIGURATION
const WA_NUMBER = "919577828813"; 
const WA_MESSAGE = "Hello, I saw the poster on your website and would like to know more.";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

type PopupModalProps = {
  notifications: any[];
};

export default function PopupModal({ notifications }: PopupModalProps) {
  const [popups, setPopups] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const autoSlideTimer = useRef<NodeJS.Timeout | null>(null);

  // 1. FILTER & SORT POSTERS
  useEffect(() => {
    const activePopups = notifications.filter((n: any) => {
      // Allow explicit POSTERS
      if (n.type === "POSTER") return true;
      // Allow POPUPS with valid Images
      if (n.type === "POPUP" && n.link) {
         return n.link.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i) || 
                n.link.includes("/uploads/") ||
                n.link.includes("images") ||
                n.link.includes("cloudinary");
      }
      return false;
    });

    if (activePopups.length > 0) {
      // Check if the LATEST (first) poster has been seen
      const latestPopup = activePopups[0];
      const hasSeenLatest = sessionStorage.getItem(`seen_popup_${latestPopup.id}`);
      
      if (!hasSeenLatest) {
        setPopups(activePopups);
        setCurrentIndex(0);
        
        // Slight delay for smooth entrance
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  // 2. AUTO-ROTATION LOGIC (5 Seconds)
  useEffect(() => {
    if (!isVisible || popups.length <= 1) return;

    const startTimer = () => {
      // Clear existing to avoid double timers
      if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
      
      autoSlideTimer.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % popups.length);
      }, 5000); // 5 Seconds Rotation
    };

    startTimer();

    // Cleanup on unmount or close
    return () => {
      if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    };
  }, [isVisible, popups.length]);

  // 3. HANDLERS
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsVisible(false);
    // Stop rotation immediately
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);

    // Mark seen
    if (popups.length > 0) {
      sessionStorage.setItem(`seen_popup_${popups[0].id}`, "true");
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Reset timer on manual interaction so it doesn't jump immediately after click
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    setCurrentIndex((prev) => (prev + 1) % popups.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    setCurrentIndex((prev) => (prev - 1 + popups.length) % popups.length);
  };

  if (popups.length === 0) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div 
        className={`relative w-full max-w-lg transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}
      >
        
        {/* ❌ CLOSE BUTTON */}
        <button 
          onClick={handleClose} 
          className="absolute -top-10 right-0 z-50 flex items-center gap-2 text-white hover:text-red-400 transition-colors group"
        >
          <span className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
          <div className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/20">
            <X size={20} />
          </div>
        </button>

        {/* 🔗 CONTENT CARD */}
        <a 
          href={WA_LINK} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group relative rounded-xl overflow-hidden shadow-2xl bg-black select-none border border-white/10"
        >
            <div className="relative min-h-[300px] flex items-center justify-center bg-black">
               
               {/* 🟢 PRELOADER LOGIC: Render ALL images hidden, show only active. 
                   This fixes the "loading delay" when switching. */}
               {popups.map((popup, idx) => {
                 const imageUrl = popup.fileUrl || popup.link;
                 const isActive = idx === currentIndex;
                 
                 return (
                   <div 
                      key={popup.id || idx}
                      className={`transition-opacity duration-500 ease-in-out absolute inset-0 flex items-center justify-center ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      // Use "relative" for active to give container height, "absolute" for others to stack
                      style={{ position: isActive ? 'relative' : 'absolute' }}
                   >
                     <img 
                       src={imageUrl} 
                       alt="Poster" 
                       className="w-full h-auto max-h-[75vh] object-contain" 
                     />
                   </div>
                 );
               })}

               {/* "Click to know more" Overlay */}
               <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-4 px-4 text-center z-20">
                  <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-widest animate-pulse">
                     <ExternalLink size={14} /> Click to know more
                  </div>
               </div>
            </div>

            {/* ⬅️ ➡️ NAVIGATION ARROWS */}
            {popups.length > 1 && (
              <>
                {/* ✅ FIXED FOR MOBILE: 
                   Removed 'opacity-0 group-hover:opacity-100'. 
                   Now using 'opacity-70' by default so they are always visible on phones.
                */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 hover:bg-black/80 z-30 opacity-70 hover:opacity-100"
                  title="Previous"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 hover:bg-black/80 z-30 opacity-70 hover:opacity-100"
                  title="Next"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
                  {popups.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40'}`} 
                    />
                  ))}
                </div>
              </>
            )}
        </a>
      </div>
    </div>
  );
}
