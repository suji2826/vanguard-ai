'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Brain, Shield, Zap, Loader2, Command, Cpu, Terminal } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { aiChat } from '@/lib/api'

export default function AIExplanationsPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Neural Link established. I am VANGUARD AI Prime. I can explain complex system anomalies, optimize resource vectors, or analyze sector security diagnostics. How shall we proceed?", timestamp: new Date() }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMsg = { role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const response = await aiChat(input);
      const aiContent = response.response || response.message;

      const assistantMsg = { role: 'assistant', content: aiContent, timestamp: new Date() }
      setMessages(prev => [...prev, assistantMsg])
    } catch (error) {
      console.error("Neural Link Error:", error)
      toast.error(`Neural link interrupted: ${error.message || "Unknown error"}`)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Diagnostic Error: ${error.message || "Connection failed to AI backend"}. Please ensure the Hugging Face backend is reachable.`, 
        timestamp: new Date() 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto h-[calc(100vh-120px)] flex flex-col gap-6 fade-in pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
           <div className="p-3.5 rounded-[18px] bg-indigo-500/10 border border-indigo-500/20 shadow-sm shadow-indigo-500/10">
             <Brain className="w-7 h-7 text-indigo-500" />
           </div>
            <div>
              <h1 className="text-2xl font-bold text-main tracking-tight">AI Neural Explanations</h1>
              <p className="text-muted text-[13px] mt-1 font-medium flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Powered by Vanguard LPU Core
              </p>
            </div>
        </div>
        <div className="hidden md:flex gap-2">
           {['Defense Ops', 'Logistics Node', 'Balancer'].map(tag => (
             <span key={tag} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-[12px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">{tag}</span>
           ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 surface flex flex-col overflow-hidden rounded-[24px]">
        {/* Messages Buffer */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} slide-up`}>
              <div className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#0f1629] border border-slate-200 dark:border-white/10 text-indigo-500'}`}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`space-y-1.5 ${m.role === 'user' ? 'text-right' : 'text-left'} flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 shadow-sm inline-block ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-[20px] rounded-tr-sm' : 'bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/10 text-main rounded-[20px] rounded-tl-sm'}`}>
                    <p className="text-[14px] leading-[1.6] whitespace-pre-wrap">{m.content}</p>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 px-2">{m.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start slide-up">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0f1629] border border-slate-200 dark:border-white/10 flex items-center justify-center text-indigo-500"><Bot className="w-5 h-5" /></div>
                <div className="p-4 rounded-[20px] rounded-tl-sm bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-white/10 flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0f1629]/50 border-t border-slate-200 dark:border-white/5">
          <form onSubmit={handleSend} className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
              <Terminal className="w-5 h-5 text-indigo-500" />
            </div>
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full bg-white dark:bg-[#0f1629] border border-slate-300 dark:border-white/10 rounded-2xl pl-12 pr-[120px] py-4 text-[15px] font-medium text-main outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm placeholder:text-slate-400"
              placeholder="Query the Vanguard network..."
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-[14px] flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-indigo-600/20"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">{isTyping ? 'Syncing' : 'Transmit'}</span>
            </button>
          </form>
          
          <div className="flex justify-center sm:justify-start mt-4 gap-4 overflow-x-auto scrollbar-hide">
             {[
               { icon: Shield, label: 'Audit Security Logs' },
               { icon: Cpu, label: 'Run System Diagnostics' },
               { icon: Command, label: 'Optimize Resources' }
             ].map((opt, i) => (
               <button key={i} onClick={() => setInput(opt.label)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap bg-white/50 dark:bg-white/[0.02] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 hover:border-indigo-500/30">
                 <opt.icon className="w-3.5 h-3.5" />
                 <span className="text-[12px] font-medium">{opt.label}</span>
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}