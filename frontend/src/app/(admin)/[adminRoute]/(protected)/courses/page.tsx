"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2, X, Save, AlertTriangle, BookOpen } from "lucide-react";

type Course = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  _count?: { batches: number };
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 🟢 UI STATES
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({ title: "", description: "" });

  // 1. Fetch Data
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchCourses(); }, []);

  // 2. Create Handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchCourses();
        setForm({ title: "", description: "" });
        setIsCreateOpen(false);
      }
    } catch (error) { alert("Failed to create"); } 
    finally { setLoading(false); }
  };

  // 3. Update Handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${editingCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editingCourse.title,
          description: editingCourse.description,
          isActive: editingCourse.isActive
        }),
      });
      if (res.ok) {
        setCourses(courses.map(c => c.id === editingCourse.id ? editingCourse : c));
        setEditingCourse(null);
      }
    } catch (error) { alert("Failed to update"); }
  };

  // 4. Delete Handler
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${deletingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== deletingId));
        setDeletingId(null);
      }
    } catch (error) { alert("Failed to delete"); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Courses Directory</h1>
          <p className="text-slate-500 text-sm">Manage academic programs and batches</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#003153] text-white px-5 py-2.5 rounded-lg hover:bg-[#002540] transition shadow-lg flex items-center gap-2 font-medium"
        >
          <BookOpen size={18} /> Add Course
        </button>
      </div>

      {/* CREATE FORM */}
      {isCreateOpen && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between mb-4">
             <h2 className="text-lg font-bold text-slate-700">New Course Details</h2>
             <button onClick={() => setIsCreateOpen(false)}><X className="text-slate-400 hover:text-red-500" /></button>
          </div>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Title</label>
              <input required type="text" placeholder="e.g. JEE Advanced 2026" className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-900/20" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
              <input required type="text" placeholder="Short summary..." className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-900/20" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            </div>
            <div className="col-span-2">
               <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-bold shadow-md transition-transform active:scale-95">
                 {loading ? "Creating..." : "Launch Course"}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* COURSES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div 
            key={course.id} 
            onClick={() => setViewingCourse(course)} // ✅ Entire card is clickable
            className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
          >
            
            {/* Status Badge */}
            <div className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${course.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {course.isActive ? 'Active' : 'Inactive'}
            </div>

            <div className="p-6 flex-1">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003153] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-900 transition-colors">{course.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{course.description}</p>
            </div>

            {/* Action Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                {course._count?.batches || 0} Batches
              </span>
              
              <div className="flex gap-2">
                 {/* ✅ STOP PROPAGATION: Clicking these won't open the card view */}
                 <button 
                   onClick={(e) => { e.stopPropagation(); setEditingCourse(course); }} 
                   className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded transition" 
                   title="Edit"
                 >
                   <Edit2 size={16} />
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); setDeletingId(course.id); }} 
                   className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition" 
                   title="Delete"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔵 EDIT MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Edit Course</h3>
              <button onClick={() => setEditingCourse(null)}><X className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                <input className="w-full border rounded-lg px-3 py-2" value={editingCourse.title} onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded-lg px-3 py-2" value={editingCourse.description} onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})} />
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={editingCourse.isActive} onChange={(e) => setEditingCourse({...editingCourse, isActive: e.target.checked})} />
                <span className="text-sm font-medium text-slate-700">Active Course (Visible to Public)</span>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-bold flex justify-center gap-2">
                <Save size={18} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 VIEW DETAILS MODAL */}
      {viewingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-[#003153] p-6 text-white flex justify-between items-start">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${viewingCourse.isActive ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                       {viewingCourse.isActive ? 'Active' : 'Archived'}
                     </span>
                  </div>
                  <h2 className="text-2xl font-bold">{viewingCourse.title}</h2>
               </div>
               <button onClick={() => setViewingCourse(null)} className="bg-white/10 hover:bg-white/20 p-1 rounded-full transition"><X size={20} /></button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8">
               <div className="mb-6">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Course</h4>
                 <p className="text-slate-700 leading-relaxed text-sm">{viewingCourse.description}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                     <h5 className="text-3xl font-bold text-[#003153]">{viewingCourse._count?.batches || 0}</h5>
                     <p className="text-xs text-slate-500 font-medium uppercase mt-1">Active Batches</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center">
                     <button className="text-sm font-bold text-blue-600 hover:underline">Manage Batches →</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 DELETE CONFIRM MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
             <div className="text-center">
               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-red-600" /></div>
               <h3 className="text-lg font-bold">Delete Course?</h3>
               <p className="text-sm text-slate-500 mt-2">This will remove the course and associated data permanently.</p>
               <div className="flex gap-3 mt-6">
                 <button onClick={() => setDeletingId(null)} className="flex-1 py-2 bg-slate-100 rounded-lg font-medium hover:bg-slate-200">Cancel</button>
                 <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Delete</button>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
