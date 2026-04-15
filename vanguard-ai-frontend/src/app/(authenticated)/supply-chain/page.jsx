'use client';
import { useState } from 'react';
import { Truck, Search, MapPin, Plus, Shield, Globe, Activity } from 'lucide-react';

const NODES = [
  { id: 'S1', name: 'Global Tech Supplies', location: 'Taiwan', status: 'warning', health: 0.72 },
  { id: 'S2', name: 'EuroParts Assembly', location: 'Germany', status: 'healthy', health: 0.95 },
  { id: 'S3', name: 'Silicon Valley Forge', location: 'USA', status: 'crisis', health: 0.12 },
  { id: 'S4', name: 'Tokyo Micro', location: 'Japan', status: 'healthy', health: 0.88 },
  { id: 'S5', name: 'Mumbai Logistics', location: 'India', status: 'warning', health: 0.65 },
];

const STATUS_STYLE = {
  healthy: { color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Healthy Node' },
  warning: { color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Unstable Node' },
  crisis:  { color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Breached Node' },
};

export default function SupplyChainPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const filtered = NODES.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 floating">
            <Truck className="w-10 h-10 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-main tracking-tight">Smart Logistics Network</h1>
            <p className="text-dim text-sm mt-1">Autonomous Supply Chain Intelligence Node</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.05] bg-indigo-600 text-white shadow-xl shadow-indigo-900/40">
          <Plus className="w-4 h-4" /> Initialize New Sector
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Node Manifest */}
        <div className="lg:col-span-4 glass flex flex-col shadow-2xl overflow-hidden max-h-[700px]">
          <div className="p-6 bg-white/[0.02] border-b border-white/5">
            <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">Active Node Manifest</h2>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dim group-focus-within:text-indigo-500 transition-colors" />
              <input className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-main outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                placeholder="Locate sector ID or name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {filtered.map(node => {
              const st = STATUS_STYLE[node.status];
              const isSelected = selected?.id === node.id;
              return (
                <div key={node.id} onClick={() => setSelected(node)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border group ${isSelected ? 'bg-indigo-600/10 border-indigo-500/40' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-black text-main truncate pr-2 group-hover:text-indigo-400 transition-colors">{node.name}</h3>
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg flex-shrink-0 uppercase tracking-widest border ${st.bg} ${st.border}`} style={{ color: st.color }}>{st.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-dim uppercase tracking-widest mb-6">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {node.location}
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span className="text-dim opacity-60">System Health</span>
                      <span className="font-bold tracking-tighter" style={{ color: st.color }}>{(node.health * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full transition-all duration-1000 ease-out rounded-full" style={{ width: `${node.health * 100}%`, background: st.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Topology Map */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="glass p-8 shadow-2xl relative overflow-hidden flex-1 min-h-[400px]">
             <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-[10px] font-black text-main uppercase tracking-[0.2em] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500" /> Planetary Topology Matrix
                </h3>
                <div className="flex gap-4">
                  {Object.entries(STATUS_STYLE).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ background: v.color, boxShadow: `0 0 10px ${v.color}` }} />
                       <span className="text-[9px] font-black text-dim uppercase tracking-widest">{k}</span>
                    </div>
                  ))}
                </div>
             </div>

            <div className="absolute inset-x-8 bottom-8 top-24 rounded-3xl overflow-hidden bg-black/20 border border-white/5">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/40 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-[10px] font-black text-dim uppercase tracking-[0.5em] opacity-30 select-none">Vanguard Geospatial Node Network v9.0</p>
              </div>
              
              {NODES.map((node, idx) => {
                const pos = [
                  { top: '45%', left: '82%' }, { top: '28%', left: '52%' },
                  { top: '38%', left: '15%' }, { top: '40%', left: '85%' }, { top: '50%', left: '70%' },
                ][idx];
                const st = STATUS_STYLE[node.status];
                const isSelected = selected?.id === node.id;
                return (
                  <div key={node.id} className="absolute cursor-pointer transition-all hover:scale-125 z-20 group" style={pos} onClick={() => setSelected(node)}>
                    <div className={`w-4 h-4 rounded-full relative ${isSelected ? 'scale-150' : ''}`}
                      style={{ background: st.color, boxShadow: `0 0 25px ${st.color}` }}>
                       <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: st.color }} />
                    </div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                       <div className="bg-black/90 text-[9px] font-black text-white px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-widest whitespace-nowrap shadow-2xl">
                        {node.name}
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/5 blur-[120px] pointer-events-none rounded-full" />
          </div>

          {/* Detailed Sector Intel */}
          {selected ? (
            <div className={`glass p-8 shadow-2xl slide-up border-l-4 ${STATUS_STYLE[selected.status].border}`} style={{ borderLeftColor: STATUS_STYLE[selected.status].color }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-2xl font-black text-main tracking-tight uppercase">{selected.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black text-dim uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {selected.location} Domain
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="text-[10px] font-black text-dim uppercase tracking-widest">Protocol {selected.id}</span>
                  </div>
                </div>
                <div className={`px-5 py-2.5 rounded-2xl border ${STATUS_STYLE[selected.status].bg} ${STATUS_STYLE[selected.status].border}`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: STATUS_STYLE[selected.status].color }}>{STATUS_STYLE[selected.status].label}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {[
                  { label: 'Sync Velocity', val: `${(selected.health * 100).toFixed(0)}%`, i: Activity, c: 'text-indigo-500' },
                  { label: 'Security Layer', val: selected.status === 'crisis' ? 'COMPROMISED' : 'ENCRYPTED', i: Shield, c: selected.status === 'crisis' ? 'text-red-500' : 'text-emerald-500' },
                  { label: 'Network Priority', val: 'Level A-1', i: Globe, c: 'text-main' },
                ].map(({ label, val, i: Icon, c }) => (
                  <div key={label} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-indigo-500/30 transition-all">
                    <Icon className="w-5 h-5 text-indigo-500 mx-auto mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[9px] font-black text-dim uppercase tracking-widest mb-2">{label}</p>
                    <p className={`text-sm font-black uppercase tracking-tighter ${c}`}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass p-16 text-center shadow-2xl border-dashed relative overflow-hidden group">
               <div className="absolute inset-0 bg-indigo-600/[0.02] group-hover:bg-indigo-600/[0.04] transition-all" />
              <Search className="w-16 h-16 text-indigo-500/10 mx-auto mb-6 floating relative z-10" />
              <p className="text-xl font-black text-main/50 uppercase tracking-[0.2em] relative z-10">Pending Intelligence Feed</p>
              <p className="text-xs text-dim mt-3 font-bold uppercase tracking-tight relative z-10 italic">Awaiting node selection for deep-sector packet analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}