'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/components/providers/AuthProvider'
import { db } from '@/app/lib/firebase'
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'
import StatsCards from '@/app/components/dashboard/StatsCards'
import ActivityFeed from '@/app/components/dashboard/ActivityFeed'
import Charts from '@/app/components/dashboard/Charts'
import { healthCheck, detectCrisis } from '@/lib/api'
import { Loader2, Activity } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeCrises: 0,
    healthScore: 0,
    totalInventory: 0
  })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [crisisResult, setCrisisResult] = useState(null)
  const [isTestingCrisis, setIsTestingCrisis] = useState(false)

  useEffect(() => {
    // Check backend connection
    healthCheck()
      .then(data => {
        console.log('Backend connected:', data)
        setBackendStatus('connected')
      })
      .catch(err => {
        console.error('Backend error:', err)
        setBackendStatus('error')
      })

    if (!user) return

    // REAL-TIME LISTENERS FOR EACH COLLECTION
    
    // 1. Assets count
    const assetsQuery = query(collection(db, 'assets'), where('userId', '==', user.uid))
    const unsubscribeAssets = onSnapshot(assetsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, totalAssets: snapshot.size }))
    })

    // 2. Active crises
    const crisesQuery = query(
      collection(db, 'crises'), 
      where('status', '==', 'active'),
      orderBy('timestamp', 'desc')
    )
    const unsubscribeCrises = onSnapshot(crisesQuery, (snapshot) => {
      const activeCrises = snapshot.docs.map(doc => ({ id: doc.id, type: 'crisis', ...doc.data() }))
      setStats(prev => ({ ...prev, activeCrises: snapshot.size }))
      setActivities(prev => {
        const otherActivities = prev.filter(a => a.type !== 'crisis')
        return [...activeCrises.slice(0, 5), ...otherActivities].sort((a, b) => 
          (b.timestamp?.toDate?.() || 0) - (a.timestamp?.toDate?.() || 0)
        )
      })
    })

    // 3. Suppliers data for health score & inventory
    const suppliersQuery = query(collection(db, 'suppliers'))
    const unsubscribeSuppliers = onSnapshot(suppliersQuery, (snapshot) => {
      const suppliers = snapshot.docs.map(doc => doc.data())
      const avgHealth = suppliers.reduce((sum, s) => sum + (s.reliability || 0), 0) / (suppliers.length || 1)
      const totalInv = suppliers.reduce((sum, s) => sum + (s.capacity || 0), 0)
      setStats(prev => ({ 
        ...prev, 
        healthScore: (avgHealth * 100).toFixed(0),
        totalInventory: totalInv 
      }))
    })

    // 4. Recent Allocations (for Activity Feed)
    const allocationsQuery = query(collection(db, 'allocations'), orderBy('timestamp', 'desc'))
    const unsubscribeAllocations = onSnapshot(allocationsQuery, (snapshot) => {
      const recentAllocations = snapshot.docs.map(doc => ({ id: doc.id, type: 'allocation', ...doc.data() }))
      setActivities(prev => {
        const otherActivities = prev.filter(a => a.type !== 'allocation')
        return [...recentAllocations.slice(0, 5), ...otherActivities].sort((a, b) => 
          (b.timestamp?.toDate?.() || 0) - (a.timestamp?.toDate?.() || 0)
        )
      })
    })

    setLoading(false)

    return () => {
      unsubscribeAssets()
      unsubscribeCrises()
      unsubscribeSuppliers()
      unsubscribeAllocations()
    }
  }, [user])

  const seedData = async () => {
    if (!user) return
    try {
      const suppliers = [
        { name: "TechSupply Co", location: "USA", reliability: 0.92, capacity: 5000 },
        { name: "Global Logistics", location: "China", reliability: 0.88, capacity: 8000 },
        { name: "Quality Parts Ltd", location: "Germany", reliability: 0.95, capacity: 3500 },
        { name: "FastShip Inc", location: "Japan", reliability: 0.85, capacity: 4200 },
        { name: "EcoMaterials", location: "India", reliability: 0.78, capacity: 3000 }
      ];

      for (const s of suppliers) {
        await addDoc(collection(db, 'suppliers'), { ...s, timestamp: serverTimestamp() });
      }

      await addDoc(collection(db, 'assets'), {
        name: "Main Production Cluster",
        userId: user.uid,
        status: "protected",
        timestamp: serverTimestamp()
      });

      await addDoc(collection(db, 'crises'), {
        type: "Cyber Attack",
        status: "active",
        severity: "high",
        description: "Anomalous traffic detected on node 4",
        timestamp: serverTimestamp()
      });

      await addDoc(collection(db, 'allocations'), {
        resourceType: "Compute Power",
        amount: 2500,
        status: "completed",
        timestamp: serverTimestamp()
      });

      alert("✅ System data successfully synchronized!");
    } catch (err) {
      console.error(err)
      alert("❌ Failed to seed data. Check console for details.")
    }
  }

  const testCrisisDetection = async () => {
    setIsTestingCrisis(true)
    try {
      const result = await detectCrisis('SUP001', 0.85, 0.65, 25);
      setCrisisResult(result);
    } catch (err) {
      console.error('Crisis detection error:', err)
      alert('Failed to connect to AI backend')
    } finally {
      setIsTestingCrisis(false)
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vanguard Dashboard</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-[14px] text-slate-500 font-medium">Real-time enterprise monitoring</p>
            <div className={`badge ${
              backendStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 
              backendStatus === 'checking' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 
              'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}>
              <span className={`status-dot ${
                backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 
                backendStatus === 'checking' ? 'bg-amber-500 animate-pulse' : 
                'bg-rose-500'
              }`} />
              AI Engine: {backendStatus}
            </div>
          </div>
        </div>
        <button 
          onClick={seedData}
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-indigo-600 dark:text-indigo-400 text-[13px] font-semibold rounded-xl border border-indigo-500/20 transition-all flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Initialize Network
        </button>
      </div>

      {/* API Test Section */}
      <div className="surface p-5 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-main">AI Engine Diagnostics</h3>
            <p className="text-[13px] text-slate-500 mt-1">Verify real-time crisis detection connection with Hugging Face backend</p>
          </div>
          <button 
            onClick={testCrisisDetection}
            disabled={isTestingCrisis || backendStatus !== 'connected'}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-[13px] font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isTestingCrisis ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Run Simulation
          </button>
        </div>
        
        {crisisResult && (
          <div className="mt-4 bg-slate-50 dark:bg-[#0f1629] rounded-xl p-4 border border-slate-200 dark:border-white/5 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-3">
              <span className="label-sm text-indigo-500">Backend Response</span>
              <button onClick={() => setCrisisResult(null)} className="text-[12px] text-slate-400 hover:text-slate-600 dark:hover:text-white font-medium transition-colors">Dismiss</button>
            </div>
            <pre className="text-[13px] font-mono text-slate-700 dark:text-indigo-300 overflow-auto max-h-[160px] scrollbar-thin">
              {JSON.stringify(crisisResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <StatsCards stats={stats} />
      
      {user && <Charts userId={user.uid} />}
      
      <ActivityFeed activities={activities} />
    </div>
  )
}