import Link from "next/link";
import PopupModal from "@/components/ui/PopupModal"; 
import CardCarousel from "@/components/ui/CardCarousel"; 
import BottomNav from "@/components/layout/BottomNav";
import { 
  ArrowRight, BookOpen, Trophy, 
  MessageCircle, Star, GraduationCap,
  MapPin, Phone, Globe, Facebook, Instagram, Twitter, Send, ExternalLink 
} from "lucide-react";

// 👇 CONFIGURATION
const WA_NUMBER = "919876543210"; 
const WA_MESSAGE = "Hello Abhinna Institute, I am interested in your courses. Please guide me regarding admissions.";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

// 👇 MAP CONFIGURATION
const MAP_QUERY = "Abhinna Institute Uzanbazar Guwahati";
const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

// 🟢 HELPER: URL CLEANER
const cleanUrl = (url: string | undefined) => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.includes("/uploads/")) {
    return "/uploads/" + url.split("/uploads/")[1];
  }
  return url;
};

// 🟢 CUSTOM WHATSAPP ICON (Using your downloaded file)
const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/whatsapp.svg" 
    alt="WhatsApp" 
    width={size} 
    height={size} 
    className={className} 
    // Ensure the icon doesn't get squashed
    style={{ minWidth: size, minHeight: size }}
  />
);

// 🟢 SMART DATA FETCHER
async function getHomeData() {
  try {
    const baseUrl = typeof window === "undefined" 
      ? "https://stick-gis-tier-reflection.trycloudflare.com" 
      : process.env.NEXT_PUBLIC_API_URL;

    const fetchUrl = typeof window === "undefined" 
      ? `${baseUrl}/public/home` 
      : `${baseUrl}/public/home`;

    const res = await fetch(fetchUrl, { next: { revalidate: 60 } });
    
    if (!res.ok) throw new Error("Failed");
    const json = await res.json();

    if (json.success && json.data) {
       const d = json.data;
       if(d.gallery) d.gallery = d.gallery.map((i: any) => ({...i, fileUrl: cleanUrl(i.fileUrl)}));
       if(d.results) d.results = d.results.map((i: any) => ({...i, fileUrl: cleanUrl(i.fileUrl)}));
       if(d.faculty) d.faculty = d.faculty.map((i: any) => ({...i, photo: { ...i.photo, fileUrl: cleanUrl(i.photo?.fileUrl) }}));
       if(d.leadership) d.leadership = d.leadership.map((i: any) => ({...i, photo: { ...i.photo, fileUrl: cleanUrl(i.photo?.fileUrl) }}));
    }
    
    return json;
  } catch (e) {
    console.error("Home Data Fetch Error:", e);
    return { success: false, data: { courses: [], faculty: [], leadership: [], notifications: [], banners: [], gallery: [], results: [] } };
  }
}

export default async function HomePage() {
  const { data } = await getHomeData();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20 md:pb-0">
      
      {/* 🔹 POPUP MODAL */}
      <PopupModal notifications={data?.notifications || []} />

      {/* 🔹 1. TICKER */}
      {data?.notifications.some((n: any) => n.type !== "POPUP") && (
        <div className="bg-[#003153] text-white text-xs md:text-sm py-2 relative z-50 border-b border-[#D4AF37]/30">
          <div className="max-w-7xl mx-auto flex items-center px-4">
            <div className="bg-[#D4AF37] text-[#003153] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm mr-4 flex-shrink-0">New</div>
            <div className="overflow-hidden w-full relative h-6">
                <div className="absolute animate-marquee whitespace-nowrap flex gap-16">
                    {data.notifications.filter((n: any) => n.type !== "POPUP").map((n: any) => (
                        <a key={n.id} href={n.link || WA_LINK} target="_blank" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                            {n.message}
                        </a>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 2. SIGNATURE NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg h-24 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-3 md:gap-8">
            {/* Logo Container */}
            <div className="h-24 w-28 md:h-36 md:w-40 relative shrink-0 z-50 transform translate-y-3 md:translate-y-5 transition-all duration-300 hover:scale-110 filter drop-shadow-2xl rounded-[10%] overflow-hidden bg-white">
                <img 
                  src="/logo.jpg" 
                  alt="Abhinna Icon" 
                  className="w-full h-full object-contain" 
                />
            </div>

            {/* Brand Text */}
            <div className="flex flex-col justify-center h-full py-1 md:py-2 min-w-0">
                <div className="h-10 md:h-10 relative w-fit">
                  <img 
                    src="/brand.jpg" 
                    alt="ABHINNA" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="font-script text-[#D4AF37] text-sm md:text-lg mt-0.5 md:mt-1 ml-0.5 md:ml-1 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                  A destination of Art & Academia
                </p>
            </div>
          </div>
          
          {/* Desktop Menu Links */}
          <div className="hidden lg:flex gap-8 text-sm font-bold text-[#003153] tracking-wider uppercase">
            <Link href="#about" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Why Us</Link>
            <Link href="#courses" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Courses</Link>
            <Link href="#results" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Results</Link>
            <Link href="#faculty" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Faculty</Link>
          </div>

          {/* ✅ DESKTOP: Full Button with Text (Hidden on Mobile/Tablet) */}
          <a 
             href={WA_LINK} 
             target="_blank" 
             className="hidden lg:flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#1fb855] transition-all shadow-md transform hover:scale-105"
          >
            <WhatsAppIcon size={18} /> 
            <span>Chat Now</span>
          </a>
        </div>
      </nav>

      {/* 🔹 3. HERO SECTION */}
      <header className="relative bg-[#003153] text-white pt-12 pb-20 px-6 overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-5/12 space-y-8 z-20">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              <Star size={12} className="fill-[#D4AF37]" /> Admissions Open 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Forging <span className="text-[#D4AF37]">Excellence.</span> <br /> Inspiring Minds.
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed font-light">
              Join Guwahati's premier institute. Traversing the paragon of creativity locked in every student.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href={WA_LINK} target="_blank" className="bg-[#D4AF37] text-[#003153] px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#F4C430] transition shadow-lg flex items-center gap-2">
                <MessageCircle size={18} /> Admission Enquiry
              </a>
              <Link href="#courses" className="border border-gray-500 text-gray-200 px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-white/5 transition">
                View Courses
              </Link>
            </div>
          </div>
          
          <div className="md:w-7/12 w-full h-[300px] md:h-[450px] relative"> 
             {data?.gallery && data.gallery.length > 0 ? (
                <CardCarousel items={data.gallery} variant="hero" />
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-2xl border border-white/10">
                   <GraduationCap size={64} className="opacity-20 mb-4" />
                   <p className="text-xs font-mono uppercase">Upload 'GALLERY' Assets</p>
                </div>
             )}
          </div>
        </div>
      </header>

      {/* 🔹 4. LEADERSHIP */}
      <section id="about" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-3xl font-bold text-[#003153] mb-4">Leadership & Vision</h2>
                <div className="h-1 w-24 bg-[#D4AF37] mx-auto rounded-full mb-6" />
                <p className="text-gray-600 leading-relaxed">Guided by experts with decades of experience in academia and management.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                {data?.leadership?.map((leader: any) => (
                    <div key={leader.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition flex gap-6 items-start group">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0 group-hover:border-[#D4AF37] transition-colors">
                            <img src={leader.photo?.fileUrl} alt={leader.name} className="w-full h-full object-cover"/>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#003153]">{leader.name}</h3>
                            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3">{leader.designation}</p>
                            <p className="text-sm text-gray-600 line-clamp-4">{leader.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 🔹 5. COURSES */}
      <section id="courses" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="mb-12"><span className="text-[#D4AF37] font-bold uppercase tracking-wider text-xs">Academic Programs</span><h2 className="text-3xl font-bold text-[#003153] mt-2">Targeted Learning</h2></div>
            <div className="grid md:grid-cols-3 gap-8">
                {data?.courses?.map((course: any) => (
                <div key={course.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col h-full">
                    <div className="h-2 bg-[#003153] w-full" />
                    <div className="p-8 flex-1 flex flex-col">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#003153] mb-6 group-hover:scale-110 transition-transform"><BookOpen size={24} /></div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#003153] transition-colors">{course.title}</h3>
                        <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed">{course.description}</p>
                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                            <a href={WA_LINK} target="_blank" className="text-sm font-bold text-[#003153] hover:text-[#D4AF37] transition flex items-center gap-1">Enquire <ArrowRight size={16} /></a>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
      </section>

      {/* 🔹 6. FACULTY */}
      <section id="faculty" className="py-24 px-6 bg-slate-50">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16"><h2 className="text-3xl font-bold text-[#003153]">Meet Our Expert Faculty</h2><div className="h-1 w-20 bg-[#D4AF37] mx-auto rounded-full mt-3" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data?.faculty?.map((f: any) => (
                    <div key={f.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                            <img src={f.photo?.fileUrl} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                        </div>
                        <div className="p-4 text-center">
                            <h4 className="font-bold text-lg text-[#003153]">{f.name}</h4>
                            <p className="text-sm text-[#D4AF37] font-medium mb-2">{f.designation}</p>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* 🔹 7. RESULTS CAROUSEL */}
      <section id="results" className="py-24 bg-[#003153] text-white overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-12 items-center">
             <div className="md:w-1/3">
                 <Trophy className="text-[#D4AF37] mb-6" size={48} />
                 <h2 className="text-4xl font-bold mb-4">Hall of Fame</h2>
                 <p className="text-gray-300 mb-8">Celebrating our top performers. Consistent results since inception.</p>
                 <a href={WA_LINK} target="_blank" className="inline-block border border-[#D4AF37] text-[#D4AF37] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#D4AF37] hover:text-[#003153] transition">Join Toppers</a>
             </div>
             
             <div className="md:w-2/3 h-[500px] w-full relative">
                 {data?.results && data.results.length > 0 ? (
                     <CardCarousel items={data.results} variant="portrait" />
                 ) : (
                     <div className="flex items-center justify-center h-full border border-white/20 rounded-xl text-white/50 bg-white/5">
                        No Results Uploaded
                     </div>
                 )}
             </div>
         </div>
      </section>

      {/* 🔹 8. PROFESSIONAL FOOTER */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 mb-16">
               {/* Column 1: Brand & Desc */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-24 h-12 bg-white/10 rounded-lg p-1 flex items-center justify-center border border-white/10">
                        <img src="/logo.jpg" alt="Logo" className="max-w-full max-h-full" />
                     </div>
                     <div>
                        <h3 className="font-bold text-lg text-[#D4AF37]">ABHINNA INSTITUTE</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Est. 2016</p>
                     </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed pr-6">
                     Abhinna is an initiative born out of passion for the student community of Guwahati. Our quest is to traverse the paragon of excellence and creativity locked in every student and to help those students who have positive attitude towards academia.
                  </p>
                  
                  {/* Social Icons */}
                  <div className="flex gap-3 flex-wrap">
                     <a href="https://www.facebook.com/abhinna.assam/" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all hover:-translate-y-1">
                        <Facebook size={16} />
                     </a>
                     <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-[#E4405F] hover:text-white transition-all hover:-translate-y-1">
                        <Instagram size={16} />
                     </a>
                     <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-all hover:-translate-y-1">
                        <Twitter size={16} />
                     </a>
                     <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-[#0088cc] hover:text-white transition-all hover:-translate-y-1">
                        <Send size={16} />
                     </a>
                  </div>
               </div>

               {/* Column 2: Contact Info */}
               <div>
                  <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                     <span className="w-8 h-[2px] bg-[#D4AF37]"></span> Visit Us
                  </h4>
                  <ul className="space-y-5">
                     <li className="flex items-start gap-4 text-gray-400">
                        <MapPin className="text-[#D4AF37] mt-1 shrink-0" size={20} />
                        <span className="text-sm leading-relaxed">
                           "ABHINNA" – Uzanbazar,<br /> Naojan Path, Guwahati - 781001
                        </span>
                     </li>
                     <li className="flex items-center gap-4 text-gray-400 group">
                        <Phone className="text-[#D4AF37] shrink-0" size={20} />
                        <div>
                           {/* Click to Call */}
                           <a href="tel:+919387866634" className="text-white font-medium group-hover:text-[#D4AF37] transition-colors block">
                              +91 93878 66634
                           </a>
                           <span className="text-xs text-gray-500 block mt-0.5">10:00 AM – 7:00 PM (Office Hours)</span>
                        </div>
                     </li>
                  </ul>
               </div>

               {/* Column 3: The Map */}
               <div>
                  <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                     <span className="w-8 h-[2px] bg-[#D4AF37]"></span> Locate Us
                  </h4>
                  {/* 🗺️ INTERACTIVE MAP LINK */}
                  <a 
                    href={GOOGLE_MAPS_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative w-full h-48 rounded-xl overflow-hidden border border-slate-700 shadow-2xl group hover:border-[#D4AF37] transition-colors"
                  >
                     {/* The Embed (COLORED) */}
                     <iframe 
                        src={MAP_EMBED_URL}
                        width="100%" 
                        height="100%" 
                        // Removed 'filter grayscale opacity-80' to make it fully colored and bright
                        className="w-full h-full border-0 pointer-events-none"
                        loading="lazy"
                     />
                     
                     {/* Overlay Effect */}
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
                        <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                            <ExternalLink size={14} /> View on Google Maps
                        </div>
                     </div>
                  </a>
               </div>
            </div>

            {/* Bottom Bar - ADMIN LOGIN REMOVED */}
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
               <p>© 2026 Abhinna Institute. All rights reserved.</p>
               <div className="flex gap-6">
                  <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
                  <Link href="#" className="hover:text-white transition">Terms of Service</Link>
                  {/* Secret Admin Link Hidden */}
               </div>
            </div>
         </div>
      </footer>

      {/* 🔹 MOBILE/TABLET FLOATING WHATSAPP BUTTON */}
      {/* Fixed position above bottom nav, hidden on Desktop (lg) */}
      <a
        href={WA_LINK}
        target="_blank"
        className="fixed bottom-24 right-8 z-50 bg-[#D4AF37] text-white rounded-full shadow-2xl animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon size={60} />
      </a>

      {/* 🔹 MOBILE BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}