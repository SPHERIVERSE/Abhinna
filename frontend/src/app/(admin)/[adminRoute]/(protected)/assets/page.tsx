"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import { Trash2, Edit2, X, Save, AlertTriangle, MoreVertical } from "lucide-react";

// ... (Keep your Asset type and ASSET_TYPES array exactly as they are) ...
type Asset = {
  id: string;
  title: string;
  type: "GALLERY" | "RESULT" | "FACULTY" | "BANNER" | "POSTER" | "IMAGE";
  fileUrl: string;
};

const ASSET_TYPES = [
  { label: "Gallery Photos", value: "GALLERY" },
  { label: "Exam Results", value: "RESULT" },
  { label: "Faculty Profiles", value: "FACULTY" },
  { label: "Website Banners", value: "BANNER" },
  { label: "Popups / Posters", value: "POSTER" },
  { label: "Misc Images", value: "IMAGE" },
];

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  
  // ... (Keep your form, editingAsset, deletingId states) ...
  const [form, setForm] = useState({ title: "", type: "GALLERY", url: "" });
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ... (Keep your fetchAssets, handleSubmit, handleDelete, handleUpdate logic exactly the same) ...
  const fetchAssets = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/assets`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => { if (data.success) setAssets(data.assets); });
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
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAssets([data.asset, ...assets]);
      setForm((prev) => ({ ...prev, title: "", url: "" }));
    } catch (error) { alert("Error saving asset"); } 
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/assets/${deletingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setAssets(assets.filter((a) => a.id !== deletingId));
        setDeletingId(null);
      }
    } catch (error) { alert("Failed to delete"); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/assets/${editingAsset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: editingAsset.title, type: editingAsset.type }),
      });
      if (res.ok) {
        setAssets(assets.map((a) => (a.id === editingAsset.id ? editingAsset : a)));
        setEditingAsset(null);
      }
    } catch (error) { alert("Failed to update"); }
  };

  const filteredAssets = activeTab === "ALL" ? assets : assets.filter((asset) => asset.type === activeTab);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto relative">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Asset Manager</h1>

      {/* Tabs (Scrollable on Mobile) */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-6 border-b hide-scrollbar">
        <button onClick={() => setActiveTab("ALL")} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "ALL" ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600"}`}>All Assets</button>
        {ASSET_TYPES.map((type) => (
          <button key={type.value} onClick={() => setActiveTab(type.value)} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === type.value ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600"}`}>{type.label}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Upload Form (Sticky on Desktop, Normal on Mobile) */}
        <div className="md:col-span-1 order-first md:order-last">
          <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-6">
            <h2 className="font-semibold text-gray-800 mb-4">Add New Asset</h2>
            <div className="mb-4"><ImageUpload onUploadComplete={(url) => setForm({ ...form, url })} /></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">Title</label>
                <input type="text" required placeholder="e.g. Annual Fest" className="w-full border rounded-lg px-3 py-2 mt-1" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">Category</label>
                <select className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-50" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
                  {ASSET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <button type="submit" disabled={loading || !form.url} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium shadow-md">
                {loading ? "Saving..." : "Save to Library"}
              </button>
            </form>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="md:col-span-2">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                
                {/* 🖼️ IMAGE AREA */}
                <div className="aspect-video sm:aspect-square relative overflow-hidden bg-gray-100">
                  <img src={asset.fileUrl} alt={asset.title} className="w-full h-full object-cover md:group-hover:scale-110 transition duration-500" />
                  
                  {/* 💻 DESKTOP: Hover Actions (Hidden on Mobile) */}
                  <div className="hidden md:flex absolute top-2 right-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <button onClick={() => setEditingAsset(asset)} className="p-2 bg-white/90 text-blue-600 rounded-full shadow-lg hover:bg-blue-50 transition" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeletingId(asset.id)} className="p-2 bg-white/90 text-red-600 rounded-full shadow-lg hover:bg-red-50 transition" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* 📝 CONTENT & MOBILE ACTIONS */}
                <div className="p-3 bg-white border-t border-slate-50">
                  <div className="flex justify-between items-start mb-2">
                     <div className="min-w-0">
                        <p className="text-gray-800 text-sm font-bold truncate">{asset.title}</p>
                        <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase">{asset.type}</span>
                     </div>
                  </div>

                  {/* 📱 MOBILE: Always Visible Action Bar (Hidden on Desktop) */}
                  <div className="flex md:hidden items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                     <button 
                        onClick={() => setEditingAsset(asset)} 
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg active:bg-blue-100"
                     >
                        <Edit2 size={14} /> Edit
                     </button>
                     <button 
                        onClick={() => setDeletingId(asset.id)} 
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-700 bg-red-50 rounded-lg active:bg-red-100"
                     >
                        <Trash2 size={14} /> Delete
                     </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS (Keep exactly as they were) */}
      {/* ... Delete & Edit Modals Code ... */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="text-red-600" size={24} /></div>
              <h3 className="text-lg font-bold text-gray-900">Delete Asset?</h3>
              <p className="text-gray-500 text-sm mt-2">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3 w-full mt-6">
                <button onClick={() => setDeletingId(null)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">Cancel</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Edit Details</h3>
              <button onClick={() => setEditingAsset(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 border">
                 <img src={editingAsset.fileUrl} alt="Preview" className="w-full h-full object-contain" />
              </div>
              <input className="w-full border rounded-lg px-3 py-2" value={editingAsset.title} onChange={(e) => setEditingAsset({...editingAsset, title: e.target.value})} />
              <select className="w-full border rounded-lg px-3 py-2" value={editingAsset.type} onChange={(e) => setEditingAsset({...editingAsset, type: e.target.value as any})}>
                  {ASSET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2"><Save size={18} /> Update Asset</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
