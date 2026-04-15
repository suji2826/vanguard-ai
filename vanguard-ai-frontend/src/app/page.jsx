'use client';
import { Shield, Zap, Globe, Lock, Cpu, BarChart3, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    { title: 'Asset Protection', desc: 'Securely store and query your digital assets with enterprise-grade encryption mapping.', icon: Shield },
    { title: 'Crisis Response', desc: 'Real-time AI-driven detection of anomalies within supply chain nodes.', icon: Zap },
    { title: 'Supply Chain Sync', desc: 'Global monitoring of your infrastructure with health scoring capabilities.', icon: Globe },
    { title: 'Resource Management', desc: 'Intelligent allocation modeling using linear programming to optimize timelines.', icon: BarChart3 },
    { title: 'AI Explanations', desc: 'Every decision the autonomous engines make is logged and explained transparently.', icon: Cpu },
    { title: 'Enterprise Access', desc: 'Military-grade IAM combined with seamless OAuth Google integration.', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white selection:bg-indigo-500/30 overflow-x-hidden font-body">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between glass border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter grad-text">VANGUARD AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
        </div>
        <Link href="/login/" className="px-5 py-2.5 rounded-xl text-[14px] font-bold bg-white text-black hover:bg-slate-200 transition-all shadow-xl">
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold tracking-widest text-indigo-400 uppercase mb-8 fade-in">
          System v2.4 Online
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-[88px] font-black tracking-tight mb-8 leading-[1.05] fade-in">
          The Autonomous <br className="hidden md:block"/>
          <span className="grad-text">Protection Node.</span>
        </h1>
        <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed mb-12 fade-in font-medium">
          Vanguard integrates real-time node monitoring, advanced resource allocation, and encrypted asset management into a singular platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in">
          <Link href="/login/" className="group px-8 py-4 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold flex items-center gap-2 transition-all shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40">
            Access Dashboard <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-sm font-bold hover:bg-white/10 transition-all">
            View Architecture
          </button>
        </div>

        {/* Hero Visual */}
        <div className="mt-24 relative px-4 fade-in max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent z-10" />
          <div className="glass p-3 shadow-2xl shadow-indigo-500/10 overflow-hidden bg-white/[0.02]">
             <div className="bg-[#0f1629] rounded-[20px] p-8 aspect-[16/9] flex items-center justify-center border border-white/[0.05] relative overflow-hidden">
                {/* Simulated Data Points */}
                <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <div className="absolute bottom-20 right-1/4 w-2 h-2 rounded-full bg-indigo-400 animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/3 right-10 w-2 h-2 rounded-full bg-rose-400 animate-ping" style={{ animationDelay: '0.5s' }} />
                
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                    <Cpu className="w-10 h-10 text-indigo-400" />
                  </div>
                  <p className="text-sm font-mono text-indigo-300">Awaiting user authentication...</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Core Infrastructure Protocols</h2>
          <p className="text-slate-400 text-lg">Platform architecture optimized for resiliency.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass p-8 group hover:bg-white/[0.04] transition-all border border-white/5 hover:border-indigo-500/30">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                <f.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-400 text-[15px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 mt-12 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
            <span className="text-lg font-black tracking-tighter text-slate-300">VANGUARD AI</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Autonomous Protocols. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
