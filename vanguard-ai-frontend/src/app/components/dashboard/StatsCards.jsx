'use client'

import { Shield, AlertTriangle, Activity, Package } from 'lucide-react'

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Current Assets',
      value: `${stats.totalAssets || 0}`,
      icon: Shield,
      bgClass: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500',
      iconClass: 'text-indigo-500',
      description: 'Encrypted items tracked'
    },
    {
      title: 'Active Crises',
      value: stats.activeCrises || 0,
      icon: AlertTriangle,
      bgClass: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
      iconClass: 'text-rose-500',
      description: 'Require immediate action'
    },
    {
      title: 'Network Health',
      value: `${stats.healthScore || 0}%`,
      icon: Activity,
      bgClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
      iconClass: 'text-emerald-500',
      description: 'Overall supply node reliability'
    },
    {
      title: 'Global Units',
      value: `${(stats.totalInventory || 0).toLocaleString()}`,
      icon: Package,
      bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
      iconClass: 'text-blue-500',
      description: 'Total capacity measured'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="glass p-5 rounded-[20px] transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[14px] font-semibold text-slate-400">{card.title}</h3>
            <div className={`p-2.5 rounded-xl border ${card.bgClass}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-main tracking-tight">{card.value}</div>
            <p className="text-[13px] font-medium text-slate-500 mt-1">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
