import Link from "next/link";
import { cn } from "@/lib/utils";
import PopupModal from "@/components/ui/PopupModal"; 
import CardCarousel from "@/components/ui/CardCarousel"; 
import BottomNav from "@/components/layout/BottomNav";
import { 
  ArrowRight, BookOpen, Trophy, 
  MessageCircle, Star, GraduationCap,
  MapPin, Phone, Globe, Facebook, Instagram, Twitter, Send, ExternalLink 
} from "lucide-react";

// CONFIGURATION
const WA_NUMBER = "919577828813"; 
const WA_MESSAGE = "Hello Abhinna Institute, I am interested in your courses. Please guide me regarding admissions.";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

// MAP CONFIGURATION
const MAP_QUERY = "Abhinna Institute Uzanbazar Guwahati";
const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

// HELPER: URL CLEANER
const cleanUrl = (url: string | undefined) => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.includes("/uploads/")) {
    return "/uploads/" + url.split("/uploads/")[1];
  }
  return url;
};

// CUSTOM WHATSAPP ICON
const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/whatsapp.svg" 
    alt="WhatsApp" 
    width={size} 
    height={size} 
    className={className}
    style={{ minWidth: size, minHeight: size }}
  />
);

// SMART DATA FETCHER
async function getHomeData() {
  try {
    const baseUrl = typeof window === "undefined" 
      ? "http://localhost:4000" 
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
    
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-[#D4AF37] shadow-lg transition-all duration-300 flex flex-col">
    
    {/* 1. TICKER */}
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

      {/* 2. SIGNATURE NAVBAR */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full h-24 flex items-center justify-between">
          
          <div className="flex items-center gap-3 md:gap-8">
          {/* RESPONSIVE HANGING BADGE */}
          <div className="h-24 w-28 md:h-36 md:w-40 relative shrink-0 z-50 transform translate-y-3 md:translate-y-5 transition-all duration-300 hover:scale-105 filter drop-shadow-2xl rounded-[10%] overflow-hidden bg-white">
              <img 
                src="/logo.avif" 
                alt="Abhinna Icon" 
                className="w-full h-full object-contain" 
              />
          </div>

          {/* RESPONSIVE BRAND CONTAINER */}
          <div className="flex flex-col justify-center h-full py-1 md:py-2 min-w-0">
              {/* Brand Image - Sizes down on mobile */}
              <div className="h-10 md:h-10 relative w-fit">
                <img 
                  src="/brand.avif" 
                  alt="ABHINNA" 
                  className="h-full w-full object-contain"
                />
              </div>
              
              {/* Smaller and allows wrapping on very small screens if necessary */}
              <p className="font-script text-[#D4AF37] tracking-wide text-sm md:text-lg mt-0.5 md:mt-1 ml-0.5 md:ml-1 whitespace-nowrap overflow-hidden text-ellipsis">
                A destination of Art & Academia
              </p>
          </div>
        </div>
          
          <div className="hidden lg:flex gap-8 text-sm font-bold text-[#003153] tracking-wider uppercase">
            <Link href="#about" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Why Us</Link>
            <Link href="#courses" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Courses</Link>
            <Link href="#results" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Results</Link>
            <Link href="#faculty" className="hover:text-[#D4AF37] transition duration-300 transform hover:scale-105">Faculty</Link>
          </div>

          {/* DESKTOP: Full Button with Text (Hidden on Mobile/Tablet) */}
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

      {/* 3. HERO SECTION */}
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
              <a href={WA_LINK} target="_blank" className="bg-[#D4AF37] text-[#003153] px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#F4C430] transition shadow-lg flex items-center gap-2 hover:scale-105">
                <MessageCircle size={20} /> Admission Enquiry
              </a>
              <Link href="#courses" className="border border-gray-500 text-gray-200 px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-white/5 hover:scale-105 transition">
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

      {/* 4. LEADERSHIP */}
	<section id="about" className="py-24 px-6 bg-[#FDFBF7]">
	  <div className="max-w-7xl mx-auto"> {/* Narrower container for better readability */}
	    <div className="text-center mb-20">
	      <h2 className="text-4xl font-extrabold text-[#003153] tracking-tight">Leadership & Vision</h2>
	      <div className="h-1.5 w-24 bg-[#D4AF37] mx-auto rounded-full mt-4" />
	      <p className="text-slate-600 mt-6 text-lg max-w-2xl mx-auto italic">
		"Guided by experts with decades of experience in academia and management."
	      </p>
	    </div>

	    {/* Flex-col for stacked layout (One above the other) */}
	    <div className="flex flex-col gap-16"> 
	      {data?.leadership?.map((leader: any, index: number) => (
		<div 
		  key={leader.id} 
		  className={cn(
		    "flex flex-col md:flex-row items-center gap-10 p-10 rounded-[5rem] bg-[#9e1919]/70 border-2 border-[#003153]/10 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:70ranslate-x-1",
		    index % 2 !== 0 ? "md:flex-row-reverse text-right" : "text-left"
		  )}
		>
		  {/* Large Photo with Triple Border Design */}
		  <div className="relative shrink-0">
		    <div className="absolute inset-0 bg-[#D4AF37] rounded-[30px] translate-x-1.5 translate-y-1.5" /> {/* Gold Offset background */}
		    <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-[30px] overflow-hidden border-2 border-white shadow-inner z-10">
		      <img 
		        src={leader.photo?.fileUrl} 
		        alt={leader.name} 
		        className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
		      />
		    </div>
		    {/* Outer Blue Boundary*/}
		    <div className="absolute inset-1.5 border-[30px] border-[#003153] rounded-[30px] scale-110 -z-10 translate-x-1.5 translate-y-1.5" />
		  </div>

		  {/* Text Content */}
		  <div className="flex-1 space-y-4">
		    <div>
		      <h3 className="text-4xl font-bold text-[#003153] leading-tight">
		        {leader.name}
		      </h3>
		      <p className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-sm mt-1">
		        {leader.designation}
		      </p>
		    </div>
		    
		    {/* Elegant bio */}
		    <div className="relative">
		      <p className="text-white text-lg leading-relaxed">
		        {leader.bio}
		      </p>
		    </div>

		    {/* Signature detail */}
		    <div className={`h-1 w-20 bg-[#D4AF37]/50 rounded-full mt-6 ${index % 2 !== 0 ? 'ml-auto' : 'mr-auto'}`} />
		  </div>
		</div>
	      ))}
	    </div>
	  </div>
	</section>

      {/* 5. COURSES SECTION */}
	<section id="courses" className="py-24 px-6 bg-[#F8F9FA] relative overflow-hidden">
	  {/* Abstract Background Decoration */}
	  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
	  <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-[#003153]/5 rounded-full blur-3xl" />

	  <div className="max-w-7xl mx-auto relative z-10 text-center">
	    <div className="mb-12"><span className="text-[#D4AF37] font-bold uppercase tracking-wider text-xs">Academic Programs</span><h2 className="text-3xl font-bold text-[#003153] mt-2">Targeted Learning</h2></div>

	    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
	      {data?.courses?.map((course: any) => (
		<div 
		  key={course.id} 
		  className="group relative bg-white rounded-[2.5rem] p-1 border border-slate-100 shadow-[0_20px_50px_rgba(0,49,83,0.05)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,49,83,0.15)] hover:-translate-y-3 flex flex-col h-full"
		>
		  {/* Top Design Element: Animated Gradient Bar */}
		  <div className="h-3 w-32 bg-gradient-to-r from-[#003153] to-[#D4AF37] rounded-full mx-auto mt-6 mb-2 transition-all duration-500 group-hover:w-48" />

		  <div className="p-8 flex-1 flex flex-col items-center text-center">
		    {/* Iconic Background Circle */}
		    <div className="relative mb-8">
		      <div className="absolute inset-0 bg-[#003153]/5 rounded-3xl rotate-6 transition-transform group-hover:rotate-12 duration-500" />
		      <div className="relative w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center text-[#003153] border border-slate-50">
		        <BookOpen size={32} strokeWidth={1.5} />
		      </div>
		    </div>

		    <h3 className="text-2xl font-black text-[#003153] mb-4 tracking-tighter uppercase font-mono">
		      {course.title}
		    </h3>
		    
		    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-4 font-medium">
		      {course.description}
		    </p>

		    {/* Footer Section */}
		    <div className="mt-auto w-full pt-6 border-t border-slate-50">
		      <a 
		        href={WA_LINK} 
		        target="_blank" 
		        className="relative inline-flex items-center justify-center gap-2 w-full py-4 bg-[#003153] text-white rounded-2xl font-bold text-sm overflow-hidden transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#003153] shadow-lg group/btn"
		      >
		        <span className="relative z-10">Secure Admission</span>
		        <ArrowRight size={18} className="relative z-10 transition-transform group-hover/btn:translate-x-1" />
		        {/* Button Gloss Effect */}
		        <div className="absolute inset-0 w-full h-full bg-white/25 -skew-x-15 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
		      </a>
		    </div>
		  </div>
		  
		  {/* Card Corner Accent */}
		  <div className="absolute top-2 right-2 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
		    <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
		  </div>
		</div>
	      ))}
	    </div>
	  </div>
	</section>

      {/* 6. FACULTY SECTION */}
	<section id="faculty" className="py-24 px-6 bg-[#FDFBF7]">
	  <div className="max-w-7xl mx-auto">
	    {/* Heading Design */}
	    <div className="text-center mb-16"><h2 className="text-3xl font-bold text-[#003153]">Meet Our Expert Faculty</h2><div className="h-1 w-20 bg-[#D4AF37] mx-auto rounded-full mt-3" /></div>

	    <div className="flex flex-wrap justify-center gap-10">
	      {data?.faculty?.map((f: any) => (
		<div 
		  key={f.id} 
		  // Set a width so they align like a grid (w-full on mobile, roughly 1/4th on desktop)
		  className="group relative bg-white rounded-[2rem] shadow-xl hover:shadow-[0_30px_60px_rgba(0,49,83,0.25)] transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-[#D4AF37]/30 hover:-translate-y-3 hover:scale-95 w-full sm:w-[calc(50%-2.5rem)] lg:w-[calc(25%-2.5rem)] min-w-[280px]"
		>
		  {/* 🖼️ PHOTO CONTAINER */}
		  <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
		    <img 
		      src={f.photo?.fileUrl} 
		      alt={f.name} 
		      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
		    />
		    <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37] translate-x-8 -translate-y-8 rotate-45 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500" />
		  </div>

		  {/* 📝 INFO AREA */}
		  <div className="p-6 text-center relative">
		    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#003153] text-[#D4AF37] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg border border-[#D4AF37]/50">
		      Expert Faculty
		    </div>

		    <div className="pt-4">
		      <h4 className="font-mono font-bold text-xl text-[#003153] uppercase tracking-tighter group-hover:text-[#D4AF37] transition-colors">
		        {f.name}
		      </h4>
		      <div className="h-0.5 w-12 bg-[#D4AF37]/30 mx-auto my-3 group-hover:w-20 transition-all" />
		      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
		        {f.designation}
		      </p>
		    </div>

		    <div className="mt-6 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
		       <div className="w-8 h-8 rounded-lg bg-[#003153] flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#003153] transition-colors cursor-pointer">
		          <span className="text-[10px] font-bold">IN</span>
		       </div>
		    </div>
		  </div>
		</div>
	      ))}
	    </div>
	  </div>
	</section>

      {/* 7. RESULTS CAROUSEL */}
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

      {/* 8. PROFESSIONAL FOOTER */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 mb-16">
               {/* Column 1: Brand & Desc */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-24 h-12 bg-white/10 rounded-lg p-1 flex items-center justify-center border border-white/10">
                        <img src="/logo.avif" alt="Logo" className="max-w-full max-h-full" />
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
                        title="ABHINNA Map"
                        width="100%" 
                        height="100%" 
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

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
               <p>© 2026 Abhinna Institute. All rights reserved.</p>
               <div className="flex gap-6">
                  <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
                  <Link href="#" className="hover:text-white transition">Terms of Service</Link>
               </div>
            </div>
         </div>
      </footer>

      {/* 🔹 MOBILE/TABLET FLOATING WHATSAPP BUTTON */}
      {/* Fixed position above bottom nav, hidden on Desktop (lg) */}
      <a
        href={WA_LINK}
        target="_blank"
        className="lg:hidden fixed bottom-24 right-8 z-50 bg-[#D4AF37] text-white rounded-full shadow-2xl animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon size={60} />
      </a>

      {/* 🔹 MOBILE BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}
