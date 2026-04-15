'use client';
import { useState, useEffect } from 'react';
import { Layers, Zap, TrendingUp, Box, Activity, ChevronRight, BarChart3, Database, Globe, RefreshCcw, Loader2 } from 'lucide-react';
import { db } from '@/app/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function ResourceAllocationPage() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ resource: 'Compute Unit', amount: '', priority: 'Standard' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'allocations'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllocations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ resource: 'Compute Unit', amount: '', priority: 'Standard' });
    }, 1500);
  };

  const resources = [
    { name: 'Neural Compute', available: '14.2 PFLOPS', usage: 65, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Satellite Bandwidth', available: '8.4 Gbps', usage: 42, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Quantum Memory', available: '256 QB', usage: 89, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 floating">
            <Layers className="w-10 h-10 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-main tracking-tight uppercase">Dynamic Resource Allocation</h1>
            <p className="text-dim text-sm mt-1 font-bold">Autonomous load balancing across global edge clusters</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {resources.map((r, i) => (
          <div key={i} className="glass p-8 hover:scale-[1.02] transition-all border border-white/5 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-3 rounded-2xl ${r.bg} ${r.color}`}><Box className="w-6 h-6" /></div>
                 <BarChart3 className="w-5 h-5 text-dim opacity-40" />
              </div>
              <p className="text-[10px] font-black text-dim uppercase tracking-[0.2em] mb-1 opacity-60">Resource Tier</p>
              <h3 className="text-xl font-black text-main mb-6">{r.name}</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-dim">Availability</span>
                    <span className="text-main">{r.available}</span>
                 </div>
                 <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full transition-all duration-1000 ${r.usage > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${r.usage}%` }} />
                 </div>
                 <p className="text-right text-[9px] font-black text-dim opacity-60 italic">{r.usage}% Peak Utilization</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Reallocation Form */}
        <div className="glass p-10 relative overflow-hidden border-2">
           <div className="relative z-10">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                <h2 className="text-xl font-black text-main uppercase tracking-tight">Initiate Reallocation</h2>
             </div>
             <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid md:grid-cols-2 gap-8">
                 <div className="group">
                    <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">Resource Vector</label>
                    <select value={form.resource} onChange={e => setForm({...form, resource: e.target.value})}
                      className="w-full rounded-2xl px-6 py-5 text-sm font-bold text-main bg-black/20 border border-white/10 outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer">
                      <option>Compute Unit</option>
                      <option>Bandwidth Node</option>
                      <option>Storage Sector</option>
                    </select>
                 </div>
                 <div className="group">
                    <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">Allocation Magnitude</label>
                    <input type="text" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                      className="w-full rounded-2xl px-6 py-5 text-sm font-bold text-main bg-black/20 border border-white/10 outline-none focus:border-indigo-500/50 transition-all"
                      placeholder="e.g. 500.00 UNITS" />
                 </div>
               </div>
               <div className="group">
                  <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">Priority Protocol</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Standard', 'Expedited', 'Critical'].map(p => (
                      <button key={p} type="button" onClick={() => setForm({...form, priority: p})}
                        className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.priority === p ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-white/5 border border-white/5 text-dim hover:bg-white/10'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
               </div>
               <button type="submit" disabled={submitting || !form.amount}
                 className="w-full py-6 rounded-3xl bg-indigo-600 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-900/40 border border-indigo-400/20 flex items-center justify-center gap-4">
                 {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                 {submitting ? 'Calibrating Vector...' : 'Execute Reallocation Cycle'}
               </button>
             </form>
           </div>
        </div>

        {/* Recent Events */}
        <div className="glass p-10 relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                <h2 className="text-xl font-black text-main uppercase tracking-tight">Transmission Log</h2>
             </div>
             <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4 scrollbar-hide">
               {allocations.length > 0 ? allocations.map((a, i) => (
                 <div key={i} className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 transition-all group">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform"><Zap className="w-5 h-5" /></div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <p className="text-sm font-black text-main">{a.resourceType}</p>
                          <span className="text-[10px] font-black text-dim opacity-50 font-mono">+{a.amount} Units</span>
                       </div>
                       <div className="flex items-center justify-between mt-2">
                         <p className="text-[10px] text-dim font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Activity className="w-3 h-3 text-emerald-500" /> Cycle Complete
                         </p>
                         <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest">{a.timestamp?.toDate ? a.timestamp.toDate().toLocaleTimeString() : 'Verified'}</span>
                       </div>
                    </div>
                 </div>
               )) : <div className="py-20 text-center opacity-30 italic text-dim font-black uppercase tracking-widest">Awaiting telemetry synchronization</div>}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}