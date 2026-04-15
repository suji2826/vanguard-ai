'use client'

import { useState, useEffect } from 'react'
import { db } from '@/app/lib/firebase'
import { collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore'
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts'

export default function Charts({ userId }) {
  const [healthTrend, setHealthTrend] = useState([])
  const [crisisDist, setCrisisDist] = useState([])
  const [allocations, setAllocations] = useState([])

  useEffect(() => {
    const suppliersQuery = query(collection(db, 'suppliers'))
    const unsubscribeSuppliers = onSnapshot(suppliersQuery, (snapshot) => {
      const suppliers = snapshot.docs.map(doc => doc.data())
      const avg = suppliers.reduce((sum, s) => sum + (s.reliability || 0), 0) / (suppliers.length || 1)
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const trend = days.map((day, i) => ({
        name: day,
        score: Math.min(100, Math.max(0, (avg * 100) + (Math.random() * 10 - 5)))
      }))
      setHealthTrend(trend)
    })

    const crisesQuery = query(collection(db, 'crises'))
    const unsubscribeCrises = onSnapshot(crisesQuery, (snapshot) => {
      const types = {}
      snapshot.docs.forEach(doc => {
        const type = doc.data().type || 'Other'
        types[type] = (types[type] || 0) + 1
      })
      const data = Object.keys(types).map(key => ({ name: key, value: types[key] }))
      setCrisisDist(data)
    })

    const allocQuery = query(collection(db, 'allocations'), orderBy('timestamp', 'desc'), limit(5))
    const unsubscribeAllocations = onSnapshot(allocQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        name: doc.data().resourceType || 'Resource',
        amount: doc.data().amount || 0
      }))
      setAllocations(data)
    })

    return () => {
      unsubscribeSuppliers()
      unsubscribeCrises()
      unsubscribeAllocations()
    }
  }, [userId])

  const COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-2">
      {/* Network Health Trend */}
      <div className="glass p-6 md:p-8 rounded-[24px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="text-lg font-bold text-main tracking-tight">Neural Health Matrix</h3>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={healthTrend}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff' }}
                itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crisis Distribution */}
      <div className="glass p-6 md:p-8 rounded-[24px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-lg font-bold text-main tracking-tight">Threat Vector Origins</h3>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={crisisDist}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                stroke="transparent"
              >
                {crisisDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff' }}
                itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: '500', color: '#cbd5e1' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resource Allocation */}
      <div className="glass p-6 md:p-8 rounded-[24px] lg:col-span-2">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <h3 className="text-lg font-bold text-main tracking-tight">Autonomous Dispatch Volume</h3>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={allocations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
