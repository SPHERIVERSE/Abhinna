"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import { 
  Pencil, 
  Trash2, 
  UserPlus, 
  X, 
  Save, 
  GraduationCap, 
  Award,
  AlertTriangle 
} from "lucide-react";

type Faculty = {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  category: "TEACHING" | "LEADERSHIP";
  photo?: { fileUrl: string };
};

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 🟢 UI STATES (Modal Pattern)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({ 
    name: "", 
    designation: "", 
    bio: "", 
    photoUrl: "",
    category: "TEACHING" 
  });

  // 1. Fetch Data
  const fetchFaculty = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/faculty`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setFacultyList(data.facultyList);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchFaculty(); }, []);

  // 2. Open Create Modal
  const openCreateModal = () => {
    setEditingId(null);
    setForm({ name: "", designation: "", bio: "", photoUrl: "", category: "TEACHING" });
    setIsFormOpen(true);
  };

  // 3. Open Edit Modal
  const openEditModal = (faculty: Faculty) => {
    setEditingId(faculty.id);
    setForm({
      name: faculty.name,
      designation: faculty.designation,
      bio: faculty.bio || "",
      photoUrl: faculty.photo?.fileUrl || "",
      category: faculty.category as any
    });
    setIsFormOpen(true);
  };

  // 4. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.photoUrl) return alert("Please upload a photo first");
    
    setLoading(true);
    try {
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/faculty/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/faculty`;
      
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        await fetchFaculty();
        setIsFormOpen(false); // Close Modal
      }
    } catch (error) { alert("Failed to save profile"); } 
    finally { setLoading(false); }
  };

  // 5. Handle Delete
  const handleDelete = async () => {
    if(!deletingId) return;
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/faculty/${deletingId}`, {
            method: "DELETE",
            credentials: "include"
        });
        setFacultyList(prev => prev.filter(f => f.id !== deletingId));
        setDeletingId(null);
    } catch(err) { alert("Delete failed"); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Faculty & Leadership</h1>
          <p className="text-slate-500 text-sm">Manage team profiles and designations</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-[#003153] text-white px-5 py-2.5 rounded-lg hover:bg-[#002540] transition shadow-lg flex items-center gap-2 font-medium"
        >
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facultyList.map((faculty) => (
          <div key={faculty.id} className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden">
            
            {/* Category Badge */}
            <div className={`absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1
              ${faculty.category === 'LEADERSHIP' ? 'bg-amber-50 text-amber-700 border-b border-l border-amber-100' : 'bg-blue-50 text-blue-700 border-b border-l border-blue-100'}`}>
              {faculty.category === 'LEADERSHIP' ? <Award size={12} /> : <GraduationCap size={12} />}
              {faculty.category}
            </div>

            <div className="p-6 flex items-start gap-5">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-white shadow-md flex-shrink-0 bg-slate-100 group-hover:scale-105 transition-transform duration-500">
                    <img 
                        src={faculty.photo?.fileUrl || "https://via.placeholder.com/150"} 
                        alt={faculty.name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Info */}
                <div className="pt-2">
                    <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-blue-800 transition-colors">{faculty.name}</h3>
                    <p className="text-blue-600 text-xs font-bold uppercase tracking-wide mt-1">{faculty.designation}</p>
                </div>
            </div>
            
            {/* Bio Preview */}
            <div className="px-6 pb-6 flex-grow">
                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    "{faculty.bio || "No biography available."}"
                </p>
            </div>

            {/* Action Footer */}
            <div className="px-5 py-3 bg-white border-t border-slate-100 flex justify-between items-center group-hover:bg-slate-50 transition-colors">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Profile Actions</span>
                <div className="flex gap-2">
                  <button 
                      onClick={() => openEditModal(faculty)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-md transition"
                      title="Edit Profile"
                  >
                      <Pencil size={16} />
                  </button>
                  <button 
                      onClick={() => setDeletingId(faculty.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-md transition"
                      title="Remove Profile"
                  >
                      <Trash2 size={16} />
                  </button>
                </div>
            </div>
          </div>
        ))}

        {facultyList.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <UserPlus size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-600">No faculty members yet</h3>
            <p className="text-slate-400 text-sm mt-1">Add your first teaching or leadership member.</p>
          </div>
        )}
      </div>

      {/* 🔵 CREATE / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
               <h2 className="text-lg font-bold text-slate-800">{editingId ? "Edit Profile" : "New Team Member"}</h2>
               <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
            </div>

            <div className="p-6 grid md:grid-cols-3 gap-8">
               {/* Left: Photo Upload */}
               <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner bg-slate-50 relative group mb-4">
                      {form.photoUrl ? (
                        <img src={form.photoUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><UserPlus size={40} /></div>
                      )}
                      
                      {/* Overlay for upload */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition">
                           <ImageUpload onUploadComplete={(url) => setForm(prev => ({ ...prev, photoUrl: url }))} />
                        </div>
                      </div>
                  </div>
                  <p className="text-xs text-slate-400 text-center px-4">
                     Click image to upload. Use a square photo for best results.
                  </p>
               </div>

               {/* Right: Fields */}
               <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role Category</label>
                    <div className="grid grid-cols-2 gap-2">
                       <button
                         type="button"
                         onClick={() => setForm({...form, category: "TEACHING"})}
                         className={`px-3 py-2 text-sm font-medium rounded-lg border transition ${form.category === "TEACHING" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                       >
                         Teaching Faculty
                       </button>
                       <button
                         type="button"
                         onClick={() => setForm({...form, category: "LEADERSHIP"})}
                         className={`px-3 py-2 text-sm font-medium rounded-lg border transition ${form.category === "LEADERSHIP" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                       >
                         Leadership
                       </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <input required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Dr. John Doe" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation</label>
                        <input required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Senior Physics Faculty" value={form.designation} onChange={(e) => setForm({...form, designation: e.target.value})} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Biography</label>
                    <textarea rows={3} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Brief introduction..." value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} />
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={loading || !form.photoUrl} className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-bold shadow-md transition-transform active:scale-95 disabled:opacity-50 flex justify-center gap-2">
                        {loading ? "Saving..." : <><Save size={18}/> Save Profile</>}
                    </button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 DELETE MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center animate-in fade-in zoom-in duration-200">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-red-600" /></div>
             <h3 className="text-lg font-bold">Remove Member?</h3>
             <p className="text-sm text-slate-500 mt-2">Are you sure you want to delete this profile? This cannot be undone.</p>
             <div className="flex gap-3 mt-6">
               <button onClick={() => setDeletingId(null)} className="flex-1 py-2 bg-slate-100 rounded-lg font-medium hover:bg-slate-200">Cancel</button>
               <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Delete</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
