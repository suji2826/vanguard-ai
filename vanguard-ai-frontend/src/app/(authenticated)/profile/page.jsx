'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/components/providers/AuthProvider'
import { db, auth } from '@/app/lib/firebase'
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, setDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { toast } from 'react-hot-toast'
import {
  User, Mail, Calendar, Shield, Key, Bell, CreditCard, 
  Activity, Database, Trash2, Download, Edit2, Save, 
  X, Copy, Check, LogOut, Smartphone, Globe, Clock, AlertCircle
} from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({ assets: 0, crises: 0, allocations: 0, aiQueries: 103 })
  const [activities, setActivities] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ displayName: '', phone: '', company: '', jobTitle: '' })
  const [apiKeys, setApiKeys] = useState([])

  useEffect(() => {
    if (user) {
      handleInitialLoad();
    }
  }, [user])

  const handleInitialLoad = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Initializing Profile for UID:", user.uid);
      await ensureUserDocument();
      
      // Parallel fetch with individual error catching to prevent total failure
      await Promise.allSettled([
        fetchUserData(),
        fetchUserStats(),
        fetchUserActivities(),
        fetchApiKeys()
      ]);
    } catch (err) {
      console.error("Global profile error:", err);
      setError(err.message);
      toast.error(`Neural Link Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const ensureUserDocument = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.log("Creating new user record...");
        const defaultData = {
          displayName: user.displayName || 'Vanguard Operator',
          email: user.email,
          jobTitle: 'Prime Operator',
          company: 'Vanguard Network',
          phone: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(userRef, defaultData);
        setUserData(defaultData);
      } else {
        setUserData(userSnap.data());
      }
    } catch (err) {
      console.error("Ensure User Doc failed:", err);
      throw new Error("Unable to establish user identity record. Check Firestore permissions.");
    }
  }

  const fetchUserData = async () => {
    if (!user) return
    const userSnap = await getDoc(doc(db, 'users', user.uid))
    if (userSnap.exists()) {
      const data = userSnap.data()
      setUserData(data)
      setEditForm({
        displayName: data.displayName || user.displayName || '',
        phone: data.phone || '',
        company: data.company || '',
        jobTitle: data.jobTitle || ''
      })
    }
  }

  const fetchUserStats = async () => {
    if (!user) return;
    const [assets, crises, allocs] = await Promise.all([
      getDocs(query(collection(db, 'assets'), where('userId', '==', user.uid))).catch(() => ({ size: 0 })),
      getDocs(query(collection(db, 'crises'), limit(1))).catch(() => ({ size: 0 })),
      getDocs(query(collection(db, 'allocations'), limit(1))).catch(() => ({ size: 0 }))
    ]);
    setStats({ 
      assets: assets.size || 0, 
      crises: crises.size || 0, 
      allocations: allocs.size || 0, 
      aiQueries: 103 
    });
  }

  const fetchUserActivities = async () => {
    const q = query(collection(db, 'crises'), limit(5));
    const snap = await getDocs(q).catch(() => ({ docs: [] }));
    setActivities(snap.docs.map(doc => ({ 
      id: doc.id, 
      description: `Protocol: ${doc.data().type || 'Telemetry'}`, 
      timestamp: doc.data().timestamp 
    })));
  }

  const fetchApiKeys = async () => {
    if (!user) return;
    const q = query(collection(db, 'apiKeys'), where('userId', '==', user.uid));
    const snap = await getDocs(q).catch(() => ({ docs: [] }));
    setApiKeys(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  const handleUpdateProfile = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), { 
        ...editForm, 
        updatedAt: serverTimestamp() 
      })
      if (editForm.displayName !== user.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: editForm.displayName })
      }
      setUserData({ ...userData, ...editForm }); 
      setIsEditing(false); 
      toast.success('Neural profile synchronized!');
    } catch (e) { 
      toast.error('Synchronization failed');
      console.error(e);
    }
  }

  const generateApiKey = async () => {
    const newKey = `vai_${Math.random().toString(36).substr(2, 24)}`
    await addDoc(collection(db, 'apiKeys'), { 
      userId: user.uid, 
      key: newKey, 
      name: `Global Uplink ${apiKeys.length + 1}`, 
      createdAt: new Date().toISOString() 
    })
    fetchApiKeys(); 
    toast.success('Uplink key generated');
  }

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      <p className="text-dim font-black uppercase tracking-widest text-[10px] animate-pulse">Establishing Secure Neural Link...</p>
    </div>
  )

  if (error) return (
    <div className="max-w-xl mx-auto mt-20 p-10 glass border-red-500/20 text-center space-y-6">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
      <h2 className="text-2xl font-black text-main uppercase">Telemetry Connection Failed</h2>
      <p className="text-dim text-sm font-bold">{error}</p>
      <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 text-xs text-red-400 font-mono text-left">
        Ensure Firestore is enabled in Firebase Console for project 'vanguard-ai-12bac' and rules allow read/write for authenticated users.
      </div>
      <button onClick={handleInitialLoad} className="w-full py-4 bg-indigo-600 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">Retry Link</button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 fade-in">
      {/* Profile Header */}
      <div className="glass p-8 md:p-12 relative overflow-hidden group">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-indigo-600 p-1 floating shadow-2xl">
              <div className="w-full h-full rounded-3xl bg-black/20 flex items-center justify-center overflow-hidden border border-white/20">
                {user?.photoURL ? <img src={user.photoURL} className="object-cover w-full h-full" /> : <User className="w-12 h-12 text-indigo-500/50" />}
              </div>
            </div>
            <button onClick={() => setIsEditing(true)} className="absolute -bottom-2 -right-2 bg-indigo-600 p-2.5 rounded-2xl shadow-xl hover:bg-indigo-500 transition-all border border-white/20"><Edit2 className="w-4 h-4 text-white" /></button>
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4 max-w-sm">
                <input value={editForm.displayName} onChange={e => setEditForm({...editForm, displayName: e.target.value})} className="w-full rounded-xl px-4 py-3 text-main font-bold outline-none border border-indigo-500/30 bg-black/20" placeholder="Display Name" />
                <div className="flex gap-2">
                  <button onClick={handleUpdateProfile} className="flex-1 bg-indigo-600 py-3 rounded-xl font-bold text-white hover:bg-indigo-500 transition-all">Save Changes</button>
                  <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-main font-bold">Discard</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-black text-main tracking-tighter">{userData?.displayName || user?.displayName || 'Vanguard Operator'}</h1>
                  <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-indigo-500/10 rounded-xl transition-all text-indigo-500"><Edit2 className="w-5 h-5" /></button>
                </div>
                <div className="flex flex-wrap gap-6 text-dim font-bold text-sm">
                  <span className="flex items-center gap-2 bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10"><Mail className="w-4 h-4 text-indigo-500" /> {user?.email}</span>
                  <span className="flex items-center gap-2 bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10"><Calendar className="w-4 h-4 text-indigo-500" /> Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
               { l: 'Assets', v: stats.assets, c: 'text-blue-500', bc: 'border-blue-500/20' }, 
               { l: 'Crises', v: stats.crises, c: 'text-red-500', bc: 'border-red-500/20' }, 
               { l: 'Allocs', v: stats.allocations, c: 'text-emerald-500', bc: 'border-emerald-500/20' }, 
               { l: 'Queries', v: stats.aiQueries, c: 'text-purple-500', bc: 'border-purple-500/20' }
            ].map((s, i) => (
              <div key={i} className={`glass p-5 text-center min-w-[110px] hover:scale-105 transition-transform border ${s.bc}`}>
                <p className={`text-2xl font-black ${s.c}`}>{s.v}</p>
                <p className="text-[9px] uppercase font-black text-dim tracking-widest mt-1 opacity-60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { id: 'profile', label: 'Identity', icon: User },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'api', label: 'API Uplinks', icon: Key },
          { id: 'notifications', label: 'Alerts', icon: Bell },
          { id: 'billing', label: 'Ledger', icon: CreditCard }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${activeTab === t.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20' : 'bg-white/5 border-transparent text-dim hover:bg-white/10 hover:border-white/10'}`}>
            <span className="flex items-center gap-3">
              <t.icon className={`w-4 h-4 ${activeTab === t.id ? 'text-white' : 'text-indigo-500'}`} />
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <div className="glass p-10 min-h-[500px] border shadow-2xl relative overflow-hidden">
        {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-2 gap-16 relative z-10">
            <div className="space-y-12">
              <SectionHeader title="Operator Intelligence" />
              <div className="grid sm:grid-cols-2 gap-12">
                <DataField label="Primary Designation" value={userData?.jobTitle || 'Platform Operator'} />
                <DataField label="Authorized Organization" value={userData?.company || 'Vanguard AI Network'} />
                <DataField label="Secure Line" value={userData?.phone || 'Encrypted Tunnel'} />
                <DataField label="Activation Timestamp" value={user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : 'Recent'} />
              </div>
            </div>
            <div className="space-y-12">
              <SectionHeader title="Operational Log" />
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all group">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform"><Activity className="w-5 h-5" /></div>
                    <div>
                      <p className="text-sm font-black text-main">{a.description}</p>
                      <p className="text-[10px] text-dim font-black uppercase tracking-widest mt-1 opacity-60">Status: Verified · {a.timestamp?.toDate ? a.timestamp.toDate().toLocaleDateString() : 'Recent'}</p>
                    </div>
                  </div>
                )) : (
                  <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="text-dim text-sm font-bold opacity-40 uppercase tracking-widest">No recent operational data recorded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'security' && <SecuritySection />}
        {activeTab === 'api' && <ApiKeysSection keys={apiKeys} generate={generateApiKey} />}
        {activeTab === 'notifications' && <div className="flex items-center justify-center h-full"><p className="text-dim font-black uppercase tracking-widest italic opacity-40">Notification Dispatcher Standby...</p></div>}
        {activeTab === 'billing' && <div className="flex items-center justify-center h-full"><p className="text-dim font-black uppercase tracking-widest italic opacity-40">Financial Ledger Synchronizing...</p></div>}
        
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/[0.03] blur-[150px] rounded-full pointer-events-none" />
      </div>

      <div className="p-10 rounded-[2.5rem] bg-red-600/5 border border-red-500/20 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black text-red-500 tracking-tight leading-none mb-3">Critical Termination Protocol</h2>
          <p className="text-sm text-dim font-bold">This action will permanently purge all operator data and neural link associations.</p>
        </div>
        <button onClick={() => toast.error('Purge request denied: Requires Level 5 Neural Clearance')} className="px-10 py-5 rounded-2xl bg-red-600 text-white font-black hover:bg-red-500 transition-all shadow-2xl shadow-red-900/40 uppercase text-xs tracking-[0.2em] border border-red-400/20">Authorize Purge</button>
      </div>
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <div className="inline-flex items-center gap-4">
      <div className="w-1.5 h-8 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
      <h2 className="text-2xl font-black text-main tracking-tight uppercase">{title}</h2>
    </div>
  )
}

function DataField({ label, value }) {
  return (
    <div className="space-y-3 group">
      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] opacity-80 group-hover:opacity-100 transition-opacity">{label}</p>
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-main font-bold text-lg tracking-tight group-hover:border-indigo-500/20 transition-all">
        {value}
      </div>
    </div>
  )
}

function SecuritySection() {
  return (
    <div className="space-y-12 max-w-2xl relative z-10">
      <SectionHeader title="Protocol Security" />
      <div className="space-y-6">
        {[ 
          { t: 'Multi-Factor Neural Link', d: 'Biometric hardware-level secondary authentication', s: 'Operational' }, 
          { t: 'Quantum Encryption Keys', d: 'Cycle your master site decryption passphrase', s: 'Secured' } 
        ].map((s, i) => (
          <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 bg-white/[0.03] rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all gap-6">
            <div>
              <p className="font-black text-main text-lg tracking-tight">{s.t}</p>
              <p className="text-xs text-dim font-bold mt-1 opacity-60">{s.d}</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{s.s}</span>
               <button className="flex-1 sm:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-main hover:bg-white/10 uppercase tracking-widest transition-all">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApiKeysSection({ keys, generate }) {
  return (
    <div className="space-y-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <SectionHeader title="External Node Access" />
        <button onClick={generate} className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] transition-all">Generate New Uplink</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {keys.length > 0 ? keys.map(k => (
          <div key={k.id} className="p-8 bg-black/20 rounded-3xl border border-white/5 flex justify-between items-center group hover:border-indigo-500/40 transition-all">
            <div className="space-y-3">
              <p className="font-black text-main text-sm uppercase tracking-widest">{k.name}</p>
              <code className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">********************{k.key?.slice(-4)}</code>
            </div>
            <button className="p-3 text-dim hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
          </div>
        )) : (
          <div className="col-span-2 p-16 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
             <Key className="w-12 h-12 text-indigo-500/20 mx-auto mb-6" />
             <p className="text-dim font-black uppercase tracking-widest opacity-40">No active API nodes initialized</p>
          </div>
        )}
      </div>
    </div>
  )
}
