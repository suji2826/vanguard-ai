'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  LayoutDashboard, Shield, Truck, AlertTriangle,
  GitBranch, BrainCircuit, Bell, LogOut, ChevronLeft, Menu, X,
  Sun, Moon, Cpu, Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard',           icon: LayoutDashboard, href: '/dashboard/',           color: '#818cf8' },
  { label: 'Profile',             icon: Shield,          href: '/profile/',             color: '#a78bfa' },
  { label: 'Asset Protection',    icon: Shield,          href: '/asset-protection/',    color: '#c084fc' },
  { label: 'Supply Chain',        icon: Truck,           href: '/supply-chain/',        color: '#60a5fa' },
  { label: 'Crisis Response',     icon: AlertTriangle,   href: '/crisis-response/',     color: '#f87171' },
  { label: 'Resource Allocation', icon: GitBranch,       href: '/resource-allocation/', color: '#34d399' },
  { label: 'AI Explanations',     icon: BrainCircuit,    href: '/ai-explanations/',     color: '#fbbf24' },
];

function Sidebar({ collapsed, setCollapsed, isDark }) {
  const pathname = usePathname();

  return (
    <aside className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out border-r ${
      isDark ? 'bg-[#0f1629] border-white/[0.06]' : 'bg-white border-slate-200'
    }`}
      style={{ width: collapsed ? 72 : 260 }}>
      
      {/* Logo */}
      <div className={`flex items-center gap-3 h-16 flex-shrink-0 border-b ${
        isDark ? 'border-white/[0.06]' : 'border-slate-100'
      } ${collapsed ? 'px-4 justify-center' : 'px-5'}`}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
          <Shield className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold tracking-tight grad-text whitespace-nowrap">VANGUARD AI</span>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-4 space-y-1 overflow-y-auto scrollbar-hide ${collapsed ? 'px-2' : 'px-3'}`}>
        {navItems.map(({ label, icon: Icon, href, color }) => {
          const active = pathname === href || pathname === href.replace(/\/$/, "");
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 rounded-xl transition-all duration-200 group relative ${
                collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5'
              } ${active 
                ? isDark ? 'bg-indigo-500/12 text-white' : 'bg-indigo-50 text-indigo-700'
                : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              title={collapsed ? label : undefined}>
              <Icon className={`flex-shrink-0 w-[18px] h-[18px] transition-colors ${
                active ? '' : 'opacity-70 group-hover:opacity-100'
              }`} style={{ color: active ? color : undefined }} />
              {!collapsed && (
                <span className={`text-[13px] font-medium whitespace-nowrap ${
                  active ? 'font-semibold' : ''
                }`}>
                  {label}
                </span>
              )}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className={`pb-4 flex-shrink-0 ${collapsed ? 'px-2' : 'px-3'}`}>
        <button onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center justify-center w-full py-2.5 rounded-xl transition-all ${
            isDark ? 'hover:bg-white/[0.04] text-slate-500' : 'hover:bg-slate-50 text-slate-400'
          }`}>
          <ChevronLeft className="w-4 h-4" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
          {!collapsed && <span className="ml-2 text-xs font-medium">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

function TopBar({ onMenuClick, user, isDark, toggleTheme }) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => { 
    toast.promise(signOut(auth), {
      loading: 'Signing out...',
      success: 'Signed out successfully',
      error: 'Sign out failed'
    });
    router.push('/login'); 
  };

  return (
    <header className={`h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-40 border-b ${
      isDark ? 'bg-[#0f1629]/90 border-white/[0.06]' : 'bg-white/90 border-slate-200'
    }`} style={{ backdropFilter: 'blur(16px)' }}>
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Menu className="w-5 h-5 text-slate-400" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
          <span className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>System Active</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${
          isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-slate-100'
        }`}>
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} 
            className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-slate-100'}`}>
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>
          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 rounded-2xl p-5 slide-up z-[100] shadow-2xl border ${
              isDark ? 'bg-[#1a2236] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold">Notifications</h4>
                <span className="text-[11px] px-2 py-0.5 bg-indigo-500/15 text-indigo-400 rounded-md font-medium">3 New</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Critical Latency', text: 'APAC Node 7 experiencing 400ms delay', time: '2m ago', color: 'text-rose-400' },
                  { title: 'New Prediction', text: 'AI detected Suez Canal bottleneck risk', time: '14m ago', color: 'text-indigo-400' }
                ].map((n, i) => (
                  <div key={i} className={`p-3 rounded-xl transition-colors ${
                    isDark ? 'bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.04]' : 'bg-slate-50 hover:bg-slate-100'
                  }`}>
                    <p className={`text-xs font-semibold mb-1 ${n.color}`}>{n.title}</p>
                    <p className="text-xs text-sub">{n.text}</p>
                    <p className="text-[11px] text-dim mt-1.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        {user && (
          <div className={`flex items-center gap-3 ml-2 pl-3 border-l ${
            isDark ? 'border-white/[0.06]' : 'border-slate-200'
          }`}>
            <Link href="/profile/" className="group flex items-center gap-3">
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName||'User')}&background=6366f1&color=fff&bold=true`}
                alt="avatar" className="w-8 h-8 rounded-lg transition-all group-hover:ring-2 ring-indigo-500/30 shadow-sm" />
              <div className="hidden lg:block">
                <p className="text-sm font-semibold leading-none group-hover:text-indigo-400 transition-colors">{user.displayName?.split(' ')[0] || 'User'}</p>
                <p className="text-[11px] text-dim mt-0.5">Operator</p>
              </div>
            </Link>
            <button onClick={handleLogout} className={`p-2 rounded-lg transition-all group ${
              isDark ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'
            }`}>
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') setIsDark(false);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    toast.success(`${next ? 'Dark' : 'Light'} mode enabled`, {
      icon: next ? '🌙' : '☀️',
      style: {
        background: next ? '#1a2236' : '#fff',
        color: next ? '#f1f5f9' : '#0f172a',
        borderRadius: '12px',
        fontWeight: 600,
      }
    });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.push('/login'); } else { setUser(u); }
      setLoading(false);
    });
    return unsub;
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0a0e1a' }}>
      <div className="relative">
        <div className="w-12 h-12 border-3 border-indigo-500/20 rounded-xl animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-t-3 border-indigo-400 rounded-xl animate-spin" style={{ animationDuration: '0.8s' }} />
      </div>
      <p className="text-sm text-indigo-400 font-medium animate-pulse">Loading Vanguard...</p>
    </div>
  );

  if (!user) return null;

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'dark-theme' : 'light-theme'}`}
      style={{ background: isDark ? '#0a0e1a' : '#f8fafc' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isDark={isDark} />
      
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopBar onMenuClick={() => setMobileOpen(true)} user={user} isDark={isDark} toggleTheme={toggleTheme} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8"
          style={{ 
            background: isDark 
              ? 'radial-gradient(ellipse at 70% 0%, rgba(99,102,241,0.06) 0%, transparent 50%)' 
              : 'radial-gradient(ellipse at 70% 0%, rgba(99,102,241,0.03) 0%, transparent 50%)'
          }}>
          <div className="max-w-[1440px] mx-auto fade-in">
            {children}
          </div>
        </main>
      </div>

      <MobileDrawer open={mobileOpen} setOpen={setMobileOpen} isDark={isDark} />
    </div>
  );
}

function MobileDrawer({ open, setOpen, isDark }) {
  const pathname = usePathname();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className={`absolute top-0 left-0 h-full w-[280px] p-5 shadow-2xl ${isDark ? 'bg-[#0f1629]' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-8">
          <span className="text-base font-bold grad-text">VANGUARD AI</span>
          <button onClick={() => setOpen(false)} className="p-1"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon, href, color }) => {
            const active = pathname === href || pathname === href.replace(/\/$/, "");
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-[13px] font-medium transition-all ${
                  active 
                    ? isDark ? 'bg-indigo-500/12 text-white' : 'bg-indigo-50 text-indigo-700'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}>
                <Icon className="w-[18px] h-[18px]" style={{ color: active ? color : undefined }} /> {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
