"use client";

import { useState, useEffect } from "react";
import { Users, Calendar, BookOpen, Trash2, Edit2, X, Save, AlertTriangle } from "lucide-react";

type Batch = {
  id: string;
  name: string;
  courseId: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  course: { title: string }; // From the 'include' in backend
};

type Course = { id: string; title: string };

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // UI States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({ 
    name: "", 
    courseId: "", 
    startDate: "", 
    endDate: "" 
  });

  // 1. Fetch Data
  const fetchData = async () => {
    try {
      // Fetch Batches
      const batchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/batches`, { credentials: "include" });
      const batchData = await batchRes.json();
      if (batchData.success) setBatches(batchData.batches);

      // Fetch Courses (for the dropdown)
      const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, { credentials: "include" });
      const courseData = await courseRes.json();
      if (courseData.success) setCourses(courseData.courses);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. Create Handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courseId) return alert("Please select a course");
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        await fetchData();
        setForm({ name: "", courseId: "", startDate: "", endDate: "" });
        setIsCreateOpen(false);
      }
    } catch (error) { alert("Failed to create batch"); } 
    finally { setLoading(false); }
  };

  // 3. Update Handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/batches/${editingBatch.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editingBatch.name,
          startDate: editingBatch.startDate,
          endDate: editingBatch.endDate,
          isActive: editingBatch.isActive
        }),
      });

      if (res.ok) {
        // Optimistic Update
        const updatedBatch = await res.json();
        setBatches(batches.map(b => b.id === editingBatch.id ? updatedBatch.batch : b));
        setEditingBatch(null);
      }
    } catch (error) { alert("Failed to update"); }
  };

  // 4. Delete Handler
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/batches/${deletingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setBatches(batches.filter(b => b.id !== deletingId));
        setDeletingId(null);
      }
    } catch (error) { alert("Failed to delete"); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Batch Management</h1>
          <p className="text-slate-500 text-sm">Schedule and manage student groups</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#003153] text-white px-5 py-2.5 rounded-lg hover:bg-[#002540] transition shadow-lg flex items-center gap-2 font-medium"
        >
          <Users size={18} /> New Batch
        </button>
      </div>

      {/* CREATE FORM */}
      {isCreateOpen && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between mb-4">
             <h2 className="text-lg font-bold text-slate-700">Create New Batch</h2>
             <button onClick={() => setIsCreateOpen(false)}><X className="text-slate-400 hover:text-red-500" /></button>
          </div>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Batch Name</label>
              <input required type="text" placeholder="e.g. Batch A (Morning)" className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-900/20" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Course</label>
              <select 
                required 
                className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-900/20 bg-white"
                value={form.courseId}
                onChange={(e) => setForm({...form, courseId: e.target.value})}
              >
                <option value="">-- Choose Course --</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
              <input required type="date" className="w-full border rounded-lg px-3 py-2.5" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date (Optional)</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2.5" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} />
            </div>

            <div className="col-span-2">
               <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-bold shadow-md transition-transform active:scale-95">
                 {loading ? "Creating..." : "Launch Batch"}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* BATCHES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div key={batch.id} className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            
            <div className={`absolute top-0 left-0 w-1 h-full ${batch.isActive ? 'bg-green-500' : 'bg-red-400'}`} />

            <div className="p-5 pl-7">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-lg text-slate-800">{batch.name}</h3>
                 <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${batch.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {batch.isActive ? 'Active' : 'Closed'}
                 </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-blue-900 font-medium mb-4 bg-blue-50 w-fit px-2 py-1 rounded">
                <BookOpen size={14} />
                {batch.course?.title || "Unknown Course"}
              </div>

              <div className="space-y-1 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                   <Calendar size={14} />
                   <span>Starts: {new Date(batch.startDate).toLocaleDateString()}</span>
                </div>
                {batch.endDate && (
                   <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-3.5" />
                      <span>Ends: {new Date(batch.endDate).toLocaleDateString()}</span>
                   </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
               <button onClick={() => setEditingBatch(batch)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Edit">
                 <Edit2 size={16} />
               </button>
               <button onClick={() => setDeletingId(batch.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition" title="Delete">
                 <Trash2 size={16} />
               </button>
            </div>
          </div>
        ))}

        {batches.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No batches found. Create one to get started.
          </div>
        )}
      </div>

      {/* 🔵 EDIT MODAL */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Edit Batch</h3>
              <button onClick={() => setEditingBatch(null)}><X className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Batch Name</label>
                <input className="w-full border rounded-lg px-3 py-2" value={editingBatch.name} onChange={(e) => setEditingBatch({...editingBatch, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                    <input type="date" className="w-full border rounded-lg px-2 py-2 text-sm" value={editingBatch.startDate ? new Date(editingBatch.startDate).toISOString().split('T')[0] : ''} onChange={(e) => setEditingBatch({...editingBatch, startDate: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                    <input type="date" className="w-full border rounded-lg px-2 py-2 text-sm" value={editingBatch.endDate ? new Date(editingBatch.endDate).toISOString().split('T')[0] : ''} onChange={(e) => setEditingBatch({...editingBatch, endDate: e.target.value})} />
                 </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={editingBatch.isActive} onChange={(e) => setEditingBatch({...editingBatch, isActive: e.target.checked})} />
                <span className="text-sm font-medium text-slate-700">Batch is Active</span>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-bold flex justify-center gap-2">
                <Save size={18} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 DELETE MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-red-600" /></div>
             <h3 className="text-lg font-bold">Delete Batch?</h3>
             <p className="text-sm text-slate-500 mt-2">This will permanently remove the batch schedule.</p>
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