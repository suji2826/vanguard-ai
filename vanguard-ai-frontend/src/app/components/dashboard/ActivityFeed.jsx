'use client'

import { Clock, AlertCircle, CheckCircle, Shield } from 'lucide-react'

export default function ActivityFeed({ activities }) {
  const getIcon = (type) => {
    switch(type) {
      case 'crisis': return <AlertCircle className="w-5 h-5 text-rose-500" />
      case 'allocation': return <CheckCircle className="w-5 h-5 text-emerald-500" />
      default: return <Shield className="w-5 h-5 text-indigo-500" />
    }
  }

  return (
    <div className="glass p-6 md:p-8 rounded-[24px]">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-main tracking-tight">
        <Clock className="w-5 h-5 flex-shrink-0 text-slate-400" />
        Vanguard Intelligence Stream
      </h2>
      
      {activities.length === 0 ? (
        <div className="text-center py-12 rounded-[16px] border border-dashed border-white/10">
          <p className="text-slate-400 font-medium">No real-time telemetry detected. Your network is currently stable.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 10).map((activity, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 py-3 px-4 hover:bg-white/[0.04] rounded-[16px] transition-all border border-white/5 bg-transparent group">
              <div className="flex-shrink-0 w-10 h-10 bg-white/[0.04] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-white/[0.02]">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-main truncate leading-snug">{activity.description || `${activity.type} Protocol Initiated`}</p>
                <p className="text-[12px] text-slate-500 font-medium mt-1">
                  {activity.timestamp?.toDate ? activity.timestamp.toDate().toLocaleString() : 'Just now'}
                </p>
              </div>
              {activity.severity && (
                <div className="flex-shrink-0 mt-2 sm:mt-0">
                  <span className={`inline-flex items-center text-[11px] font-bold uppercase px-3 py-1 rounded-[8px] tracking-wide ${
                    activity.severity === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    activity.severity === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {activity.severity}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
