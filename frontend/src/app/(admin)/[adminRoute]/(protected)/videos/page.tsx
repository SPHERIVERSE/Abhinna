"use client";

import { useState, useEffect } from "react";
import { 
  Play, Trash2, Pencil, Plus, X, Save, 
  Smartphone, Film, Link as LinkIcon, Loader2, MonitorPlay
} from "lucide-react";

type Video = {
  id: string;
  title: string;
  videoUrl: string;
  externalId?: string;
  description?: string;
  category: "STUDENT_STORY" | "ACHIEVEMENT" | "ALUMNI" | "INSTITUTE" | "FACULTY";
  type: "LONG_FORM" | "SHORT";
  platform: string;
};

const CATEGORIES = ["STUDENT_STORY", "ACHIEVEMENT", "ALUMNI", "INSTITUTE", "FACULTY"];

export default function VideoAdminPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"LONG_FORM" | "SHORT">("LONG_FORM");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [activeMobileId, setActiveMobileId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: "", videoUrl: "", description: "", 
    category: "INSTITUTE" as any, type: "LONG_FORM" as any
  });

  const fetchVideos = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/videos`, { credentials: "include" });
    const data = await res.json();
    if (data.success) setVideos(data.videos);
  };

  useEffect(() => { fetchVideos(); }, []);

  // ✅ Helper to extract YouTube ID for real-time preview
  const getPreviewId = (url: string) => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
  };

const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/videos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const result = await res.json();

    if (result.success) {
      // Optimistically remove from UI
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } else {
      alert(result.message || "Failed to delete video");
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("An error occurred while deleting.");
  }
};

 // Inside VideoAdminPage component
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Determine if we are editing or creating
  const isEditing = Boolean(editingVideo);
  const dataToSubmit = isEditing ? editingVideo : form;

  // Validation
  if (!dataToSubmit?.title || !dataToSubmit?.videoUrl) {
    return alert("Please provide both a title and a valid video URL.");
  }

  setLoading(true);

  try {
    const url = isEditing 
      ? `${process.env.NEXT_PUBLIC_API_URL}/admin/videos/${editingVideo?.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/admin/videos`;
    
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dataToSubmit),
    });

    const result = await res.json();

    if (result.success) {
      // Refresh the list with the updated data
      await fetchVideos(); 
      
      // Reset all states
      setIsFormOpen(false);
      setEditingVideo(null);
      setForm({
        title: "",
        videoUrl: "",
        description: "",
        category: "INSTITUTE",
        type: "LONG_FORM"
      });
      
      console.log("Video record finalized successfully");
    } else {
      throw new Error(result.message || "Failed to save video");
    }
  } catch (err) {
    console.error("Submission error:", err);
    alert(err instanceof Error ? err.message : "An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

  const filteredVideos = videos.filter(v => v.type === activeTab);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* 🟢 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-100 pb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <MonitorPlay className="text-[#003153]" /> Media Library
          </h1>
          <p className="text-slate-500 font-medium">Manage institutional videos, shorts, and testimonials</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-[#003153] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-[#002540] transition-all active:scale-95"
        >
          <Plus size={20} /> Add Video
        </button>
      </div>

      {/* 🟢 TABS */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto md:mx-0 shadow-inner">
        <button 
          onClick={() => setActiveTab("LONG_FORM")}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "LONG_FORM" ? 'bg-white text-[#003153] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Film size={16} /> Landscape (16:9)
        </button>
        <button 
          onClick={() => setActiveTab("SHORT")}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "SHORT" ? 'bg-white text-[#003153] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Smartphone size={16} /> Portrait (9:16)
        </button>
      </div>

      {/* 🟢 VIDEO GRID */}
      <div className={`grid gap-6 ${activeTab === 'SHORT' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredVideos.map((video) => (
          <div 
            key={video.id} 
            onClick={() => {
                if (window.matchMedia("(pointer: coarse)").matches) {
                    setActiveMobileId(activeMobileId === video.id ? null : video.id);
                }
            }}
            className="group bg-white rounded-3xl border-2 border-slate-100 hover:border-[#D4AF37] transition-all duration-500 overflow-hidden relative shadow-sm hover:shadow-2xl"
          >
            <div className={`relative bg-slate-900 ${video.type === 'SHORT' ? 'aspect-[9/16]' : 'aspect-video'}`}>
               <img 
                 src={video.platform === 'YOUTUBE' ? `https://img.youtube.com/vi/${video.externalId}/mqdefault.jpg` : '/video-placeholder.jpg'} 
                 className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" 
               />
               
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-all">
                     <Play fill="currentColor" size={20} />
                  </div>
               </div>

               <div className={`
                 absolute inset-0 bg-black/60 transition-all duration-300 flex items-center justify-center gap-3
                 ${activeMobileId === video.id ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'} 
                 lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:pointer-events-auto
               `}>
                  <button onClick={(e) => { e.stopPropagation(); setEditingVideo(video); }} className="p-3 bg-white rounded-xl text-blue-600 shadow-xl hover:scale-110 transition-all"><Pencil size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(video.id); }}className="p-3 bg-white rounded-xl text-red-600 shadow-xl hover:scale-110 transition-all"><Trash2 size={18} /></button>
               </div>
            </div>

            <div className="p-5 bg-white">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{video.category}</span>
               <h3 className="font-bold text-slate-800 mt-1 line-clamp-2 leading-tight">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🟢 FORM MODAL (Real-time Preview Integrated) */}
      {(isFormOpen || editingVideo) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full sm:w-[95%] lg:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#003153] p-6 text-white flex justify-between items-center shrink-0">
               <h2 className="text-xl font-bold tracking-tight">{editingVideo ? 'Edit Video Content' : 'Add Video to Archive'}</h2>
               <button onClick={() => { setIsFormOpen(false); setEditingVideo(null); }} className="hover:rotate-90 transition-transform"><X /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-slate-200">
              <div className="grid lg:grid-cols-2 gap-10">
                 {/* PREVIEW SECTION */}
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Instant Preview</label>
                    <div className={`w-full rounded-2xl bg-slate-900 overflow-hidden shadow-2xl flex items-center justify-center ${ (editingVideo?.type || form.type) === 'SHORT' ? 'aspect-[9/16] max-w-[240px] mx-auto' : 'aspect-video'}`}>
                       {getPreviewId(editingVideo?.videoUrl || form.videoUrl) ? (
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${getPreviewId(editingVideo?.videoUrl || form.videoUrl)}`}
                            allowFullScreen
                          ></iframe>
                       ) : (
                          <div className="text-center p-8 space-y-4">
                             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto"><Play className="text-white/20" /></div>
                             <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Waiting for valid link...</p>
                          </div>
                       )}
                    </div>
                 </div>

                 {/* DATA SECTION */}
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layout Type</label>
                          <div className="flex bg-slate-50 p-1 rounded-xl border-2 border-slate-100">
                             {['LONG_FORM', 'SHORT'].map(t => (
                                <button key={t} type="button" 
                                  onClick={() => editingVideo ? setEditingVideo({...editingVideo, type: t as any}) : setForm({...form, type: t as any})}
                                  className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${ (editingVideo?.type || form.type) === t ? 'bg-[#003153] text-white shadow-lg' : 'text-slate-400'}`}
                                >
                                   {t === 'SHORT' ? 'REEL' : 'VIDEO'}
                                </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                          <select 
                             className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 font-bold text-xs bg-white focus:border-[#003153] outline-none"
                             value={editingVideo?.category || form.category}
                             onChange={(e) => editingVideo ? setEditingVideo({...editingVideo, category: e.target.value as any}) : setForm({...form, category: e.target.value as any})}
                          >
                             {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Video Link</label>
                       <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={16} />
                          <input 
                            className="w-full border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 font-bold text-sm outline-none focus:border-[#003153]" 
                            placeholder="Paste link here..." 
                            value={editingVideo?.videoUrl || form.videoUrl}
                            onChange={(e) => editingVideo ? setEditingVideo({...editingVideo, videoUrl: e.target.value}) : setForm({...form, videoUrl: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Title</label>
                       <input 
                         className="w-full border-2 border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-800 outline-none focus:border-[#003153]" 
                         placeholder="Title for the gallery..." 
                         value={editingVideo?.title || form.title}
                         onChange={(e) => editingVideo ? setEditingVideo({...editingVideo, title: e.target.value}) : setForm({...form, title: e.target.value})}
                       />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 bg-[#003153] text-white rounded-2xl font-bold shadow-2xl hover:bg-[#002540] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} className="text-[#D4AF37]" /> Finalize Video</>}
                    </button>
                 </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}