"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import { Trash2, Edit2, X, Save, AlertTriangle, Image as ImageIcon, Filter, Trophy, ArrowRight, Loader2 } from "lucide-react";

// Updated Type to match professional schema
type Asset = {
  id: string;
  title: string;
  type: "GALLERY" | "RESULT" | "BANNER" | "POSTER" | "IMAGE";
  fileUrl: string;
  categoryGroup?: string;
  subCategory?: string;
  rank?: string;
  size?: number;
  width?: number;
  height?: number;
};

const ASSET_TYPES = [
  { label: "Gallery Photos", value: "GALLERY" },
  { label: "Exam Results", value: "RESULT" },
  { label: "Website Banners", value: "BANNER" },
  { label: "Popups / Posters", value: "POSTER" },
  { label: "Misc Images", value: "IMAGE" },
];

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMobileId, setActiveMobileId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ 
    title: "", 
    type: "GALLERY", 
    url: "",
    categoryGroup: "ENTRANCE",
    subCategory: "",
    rank: "",
    size: 0,
    width: 0,
    height: 0
  });

  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const fetchAssets = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/assets`, { credentials: "include" });
    const data = await res.json();
    if (data.success) setAssets(data.assets);
  };

  useEffect(() => { fetchAssets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url) return alert("Please upload an image first");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchAssets();
        setResetKey(prev => prev + 1); // Reset upload component
        setForm({ title: "", type: "GALLERY", url: "", categoryGroup: "ENTRANCE", subCategory: "", rank: "", size: 0, width: 0, height: 0 });
      }
    } catch (error) { alert("Error saving asset"); } 
    finally { setLoading(false); }
  };

   // ✅ PROFESSIONAL DELETE HANDLER
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/assets/${deletingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (res.ok) {
        // Remove from local state immediately for snappy UX
        setAssets(prev => prev.filter((a) => a.id !== deletingId));
        setDeletingId(null);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) { 
      alert("Failed to purge asset from database"); 
    }
  };

   // ✅ PROFESSIONAL UPDATE HANDLER
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/assets/${editingAsset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // Send all modular fields for results/gallery synchronization
        body: JSON.stringify({ 
          title: editingAsset.title, 
          type: editingAsset.type,
          categoryGroup: editingAsset.categoryGroup,
          subCategory: editingAsset.subCategory,
          rank: editingAsset.rank
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update the specific asset in the list without a full refresh
        setAssets(prev => prev.map((a) => (a.id === editingAsset.id ? data.asset : a)));
        setEditingAsset(null);
      } else {
        alert("Update failed at database level");
      }
    } catch (error) { 
      alert("Failed to update institutional record"); 
    } finally { 
      setLoading(false); 
    }
  };

  const filteredAssets = activeTab === "ALL" ? assets : assets.filter((a) => a.type === activeTab);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* 🟢 HEADER */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Media Library</h1>
          <p className="text-slate-500 font-medium">Manage institutional assets and achievement records</p>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
        
        {/* 🟢 UPLOAD PANEL (PROFESSIONAL FORM) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 sticky top-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <ImageIcon size={18} className="text-[#003153]" /> New Asset
            </h2>
            
            <ImageUpload
              key={resetKey}
              onUploadStart={() => setIsUploading(true)}
              onUploadComplete={(data: any) => {
                const fileUrl =
                  typeof data === "string"
                    ? data
                    : data.secure_url || data.fileUrl || data.url;

                setForm(prev => ({
                  ...prev,
                  url: fileUrl,
                  size: typeof data === "object" ? data.size ?? prev.size : prev.size,
                  width: typeof data === "object" ? data.width ?? prev.width : prev.width,
                  height: typeof data === "object" ? data.height ?? prev.height : prev.height,
                }));

                setIsUploading(false);
              }}
            />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                <select className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 font-bold text-sm outline-none focus:border-[#003153]" value={form.type} onChange={(e) => setForm({...form, type: e.target.value as any})}>
                  {ASSET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                <input required className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 font-medium outline-none focus:border-[#003153]" placeholder="e.g. Annual Fest 2026" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
              </div>

              {form.type === "RESULT" && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-300">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-[#003153] uppercase tracking-widest">Broad Filter</label>
                      <select className="w-full border-2 border-white rounded-lg px-2 py-1.5 text-xs font-bold shadow-sm" value={form.categoryGroup} onChange={(e) => setForm({...form, categoryGroup: e.target.value})}>
                        <option value="ENTRANCE">Entrance</option>
                        <option value="ACADEMIC">Academic</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-[#003153] uppercase tracking-widest">Exam Name</label>
                      <input placeholder="e.g. UGC-NET" className="w-full border-2 border-white rounded-lg px-2 py-1.5 text-xs font-bold shadow-sm" value={form.subCategory} onChange={(e) => setForm({...form, subCategory: e.target.value})} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-[#003153] uppercase tracking-widest">Rank/Marks</label>
                      <input placeholder="e.g. Rank 05" className="w-full border-2 border-white rounded-lg px-2 py-1.5 text-xs font-bold shadow-sm" value={form.rank} onChange={(e) => setForm({...form, rank: e.target.value})} />
                   </div>
                </div>
              )}

              <button type="submit" disabled={loading || !form.url || isUploading} className="w-full h-12 bg-[#003153] text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg hover:bg-[#002540] cursor-pointer transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Save to Library <ArrowRight size={14} /></>}
              </button>
            </form>
          </div>
        </div>

        {/* 🟢 GALLERY GRID */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar border-b border-slate-100">
            <button onClick={() => setActiveTab("ALL")} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${activeTab === "ALL" ? "bg-[#003153] text-white border-[#003153]" : "bg-white text-slate-400 border-slate-200"}`}>All</button>
            {ASSET_TYPES.map((t) => (
              <button key={t.value} onClick={() => setActiveTab(t.value)} className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${activeTab === t.value ? "bg-[#003153] text-white border-[#003153]" : "bg-white text-slate-400 border-slate-200"}`}>{t.label}</button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div 
                key={asset.id} 
                // 🟢 MOBILE TAP LOGIC: Only toggles if a touch device is detected
                onClick={() => {
                  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
                  if (isTouchDevice) {
                    setActiveMobileId(activeMobileId === asset.id ? null : asset.id);
                  }
                }}
                className="group bg-white rounded-2xl border-2 border-slate-100 hover:border-[#D4AF37] transition-all duration-500 overflow-hidden relative shadow-sm hover:shadow-2xl"
              >
                <div className="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                  <img 
                    src={asset.fileUrl} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  
                  {/* 🏆 Result Badge (Top Left) */}
                  {asset.type === "RESULT" && asset.rank && (
                    <div className="absolute top-3 left-3 bg-[#D4AF37] text-[#003153] px-2 py-1 rounded-lg font-black text-[9px] uppercase shadow-lg border border-white/50 z-10">
                      {asset.rank}
                    </div>
                  )}

                  {/* 🟢 HYBRID OVERLAY (Consistent with Video Library) */}
                  <div className={`
                    absolute inset-0 bg-black/40 transition-all duration-300 flex items-center justify-center gap-3
                    
                    /* State for Mobile Tap */
                    ${activeMobileId === asset.id 
                        ? 'opacity-100 visible pointer-events-auto' 
                        : 'opacity-0 invisible pointer-events-none'} 
                    
                    /* Hover Override for Desktop */
                    lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:pointer-events-auto
                    z-20
                  `}>
                    <button 
                        type="button"
                        onClick={(e) => { 
                          e.stopPropagation(); // Prevents card toggle from firing
                          setEditingAsset(asset); 
                        }} 
                        className="p-3 bg-white rounded-xl text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all shadow-xl active:scale-90"
                    >
                        <Edit2 size={18}/>
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setDeletingId(asset.id); 
                        }} 
                        className="p-3 bg-white rounded-xl text-red-600 hover:bg-red-50 hover:scale-110 transition-all shadow-xl active:scale-90"
                    >
                        <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
                
                {/* Card Metadata Section */}
                <div className="p-4 bg-white border-t border-slate-50">
                  <p className="font-bold text-slate-800 text-sm truncate">{asset.title}</p>
                  <div className="flex justify-between items-center mt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{asset.type}</span>
                      {asset.subCategory && (
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest truncate max-w-[80px]">
                            {asset.subCategory}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 🔵 EDIT DETAILS MODAL */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#003153] p-6 text-white relative shrink-0">
               <div className="relative z-10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white/10 rounded-lg">
                        <Edit2 size={20} className="text-[#D4AF37]" />
                     </div>
                     <h3 className="text-lg font-bold tracking-tight">Modify Asset Details</h3>
                  </div>
                  <button 
                     onClick={() => setEditingAsset(null)} 
                     className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-transform hover:rotate-90"
                  >
                     <X size={20} />
                  </button>
               </div>
            </div>
            
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
              {/* Media Preview */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-50 shadow-inner group">
                 <img 
                    src={editingAsset.fileUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                 />
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Title</label>
                  <input 
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-[#003153] transition-all" 
                    value={editingAsset.title} 
                    onChange={(e) => setEditingAsset({...editingAsset, title: e.target.value})} 
                  />
                </div>

                {/* Type Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Type</label>
                  <select 
                    className="w-full border-2 border-slate-100 rounded-xl px-3 py-3 font-bold text-slate-700 text-sm outline-none bg-white focus:border-[#003153]" 
                    value={editingAsset.type} 
                    onChange={(e) => setEditingAsset({...editingAsset, type: e.target.value as any})}
                  >
                      {ASSET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* Dynamic Result Fields (Only if Result Type) */}
                {editingAsset.type === "RESULT" && (
                  <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-[#003153] uppercase tracking-widest">Filter Category</label>
                      <select 
                        className="w-full border-2 border-white rounded-lg px-2 py-1.5 text-xs font-bold shadow-sm"
                        value={editingAsset.categoryGroup || "ENTRANCE"}
                        onChange={(e) => setEditingAsset({...editingAsset, categoryGroup: e.target.value})}
                      >
                        <option value="ENTRANCE">Entrance</option>
                        <option value="ACADEMIC">Academic</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-[#003153] uppercase tracking-widest">Rank / Mark</label>
                      <input 
                        className="w-full border-2 border-white rounded-lg px-2 py-1.5 text-xs font-bold shadow-sm"
                        placeholder="e.g. Rank 10"
                        value={editingAsset.rank || ""}
                        onChange={(e) => setEditingAsset({...editingAsset, rank: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-[#003153] uppercase tracking-widest">Exam Name (Custom Text)</label>
                      <input 
                        className="w-full border-2 border-white rounded-lg px-2 py-1.5 text-xs font-bold shadow-sm"
                        placeholder="e.g. NTA UGC-NET 2026"
                        value={editingAsset.subCategory || ""}
                        onChange={(e) => setEditingAsset({...editingAsset, subCategory: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
               <button 
                  onClick={handleUpdate}
                  className="w-full bg-[#003153] text-white py-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:bg-[#002540] transition-all active:scale-[0.98]"
                >
                  <Save size={18} className="text-[#D4AF37]" />
                  Update Institutional Record
               </button>
            </div>
          </div>
        </div>
      )}
      {/* 🔴 DELETE ASSET MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center border border-slate-100 animate-in fade-in zoom-in duration-200">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                <AlertTriangle className="text-red-600" size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 tracking-tight">Purge Asset?</h3>
             <p className="text-sm text-slate-500 mt-2 font-medium">
                This will permanently delete the file and its metadata from the institutional library.
             </p>
             <div className="flex gap-4 mt-8">
               <button 
                  onClick={() => setDeletingId(null)} 
                  className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
               >
                  Keep
               </button>
               <button 
                  onClick={handleDelete} 
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
               >
                  Confirm Delete
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}