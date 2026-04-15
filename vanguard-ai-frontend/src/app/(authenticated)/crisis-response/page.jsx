'use client';
import { useState, useEffect } from 'react';
import { AlertCircle, ShieldAlert, Zap, Radio, Globe, Activity, Terminal, Lock, MapPin, Loader2, Signal } from 'lucide-react';
import { db } from '@/app/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export default function CrisisResponsePage() {
  const [activeCrises, setActiveCrises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrisis, setSelectedCrisis] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'crises'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActiveCrises(docs);
      setLoading(false);
      if (docs.length > 0 && !selectedCrisis) setSelectedCrisis(docs[0]);
    });
    return () => unsubscribe();
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-[2rem] bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/5 pulse-dot">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-main tracking-tight uppercase">Strategic Crisis Center</h1>
            <p className="text-dim text-sm mt-1 font-bold flex items-center gap-2">
              <Signal className="w-4 h-4 text-emerald-500" /> Vanguard Neural Link active · Monitoring 1.4M global nodes
            </p>
          </div>
        </div>
        <button onClick={handleScan} disabled={scanning} className="px-8 py-4 glass hover:bg-white/10 text-main font-black text-[10px] uppercase tracking-widest border-2 border-indigo-500/30 transition-all flex items-center gap-3 active:scale-95">
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4 text-indigo-500" />}
          {scanning ? 'Analyzing Frequencies...' : 'Force Global Scan'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-red-600 rounded-full" />
            <h2 className="text-sm font-black text-main uppercase tracking-widest">Active Anomalies</h2>
          </div>
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-4 scrollbar-hide">
            {activeCrises.length > 0 ? activeCrises.map(c => (
              <div key={c.id} onClick={() => setSelectedCrisis(c)} 
                className={`p-6 rounded-3xl border transition-all cursor-pointer group ${selectedCrisis?.id === c.id ? 'glass bg-red-500/[0.03] border-red-500/40 shadow-xl' : 'glass hover:bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${c.severity === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${c.severity === 'high' ? 'border-red-500/30 text-red-500' : 'border-amber-500/30 text-amber-500'}`}>{c.severity} RISK</span>
                </div>
                <h3 className="text-lg font-black text-main leading-tight mb-2">{c.type}</h3>
                <p className="text-[10px] text-dim font-bold uppercase tracking-widest flex items-center gap-2 mb-4 opacity-60">
                   <MapPin className="w-3 h-3" /> Sector 7G · Detected 2m ago
                </p>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className={`h-full transition-all duration-1000 ${c.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: '70%' }} />
                </div>
              </div>
            )) : <p className="text-dim text-center py-20 font-bold uppercase tracking-widest opacity-30 italic">No anomalies detected</p>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {selectedCrisis ? (
            <div className="glass p-10 shadow-2xl relative overflow-hidden group min-h-[600px] border-2">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                   <h2 className="text-4xl font-black text-main tracking-tighter mb-2">{selectedCrisis.type}</h2>
                   <p className="text-dim font-bold opacity-60 uppercase tracking-widest text-xs flex items-center gap-3">
                      Internal Signature: <span className="text-indigo-400 font-mono">#ANM-00{selectedCrisis.id.slice(-3)}</span>
                   </p>
                </div>
                <div className="flex gap-4">
                   <button className="p-4 rounded-2xl bg-white/5 border border-white/5 text-dim hover:text-indigo-500 transition-all"><Globe className="w-5 h-5" /></button>
                   <button className="p-4 rounded-2xl bg-white/5 border border-white/5 text-dim hover:text-indigo-500 transition-all"><Terminal className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-8">
                   <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Neural Analysis</p>
                      <p className="text-main font-bold leading-relaxed">{selectedCrisis.description || 'System scanning for deep-level diagnostics. Current telemetry indicates a localized disturbance with potential cascading edge effects.'}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-6 text-center">
                     <div className="glass p-6 border-indigo-500/10">
                        <p className="text-dim text-[9px] font-black uppercase tracking-widest mb-1">Impact Radius</p>
                        <p className="text-xl font-black text-main">14.2k Nodes</p>
                     </div>
                     <div className="glass p-6 border-indigo-500/10">
                        <p className="text-dim text-[9px] font-black uppercase tracking-widest mb-1">Recovery Est.</p>
                        <p className="text-xl font-black text-main">4.2 Hours</p>
                     </div>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-indigo-500" />
                      <p className="text-[10px] font-black text-main uppercase tracking-widest">Autonomous Counter-Measures</p>
                   </div>
                   <div className="space-y-4">
                      {['Network Sharding', 'Traffic Re-routing', 'Credential Rotation'].map((m) => (
                        <div key={m} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-emerald-500/20 transition-all">
                           <span className="text-sm font-bold text-dim group-hover:text-main">{m}</span>
                           <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Operational</span>
                        </div>
                      ))}
                   </div>
                   <button className="w-full py-6 rounded-3xl bg-red-600 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-red-500 transition-all shadow-2xl shadow-red-900/40 border border-red-400/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group">
                      <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      Initiate Omega Lockdown
                   </button>
                </div>
              </div>
              
              <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-red-600/[0.02] blur-[150px] rounded-full group-hover:bg-red-600/[0.05] transition-all duration-1000" />
            </div>
          ) : (
            <div className="glass h-full flex flex-col items-center justify-center p-20 opacity-40">
               <Zap className="w-20 h-20 text-indigo-500/20 mb-8 floating" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-dim text-center">Global Neural Link Initializing... Select anomaly</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}