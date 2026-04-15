'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, Copy, Trash2, CheckCircle2, Loader2, Share2, Database, Shield, Download } from 'lucide-react';
import { auth } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { encryptAsset, decryptAsset } from '@/lib/api';

export default function AssetProtectionPage() {
  const [user, setUser] = useState(null);
  const [assetName, setAssetName] = useState('');
  const [assetData, setAssetData] = useState('');
  const [encrypting, setEncrypting] = useState(false);
  const [created, setCreated] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [decrypting, setDecrypting] = useState(false);
  const [decrypted, setDecrypted] = useState(null);
  const [copyDone, setCopyDone] = useState(false);
  const [assets, setAssets] = useState([
    { id: 'AST-FF72A1', name: 'Q3 Financial Ledgers', date: '2026-04-08' },
    { id: 'AST-B9C341', name: 'Project Alpha Blueprints', date: '2026-04-05' },
    { id: 'AST-K8L922', name: 'Neural Link Protocols', date: '2026-04-02' },
  ]);

  useEffect(() => { const u = onAuthStateChanged(auth, setUser); return u; }, []);

  const handleEncrypt = async () => {
    if (!assetName || !assetData) return;
    setEncrypting(true);
    try {
      const response = await encryptAsset(assetName, user?.email || 'unknown', assetData);
      setCreated({ 
        id: response.asset_id, 
        data: response.ciphertext_preview || "Encryption processing completed successfully." 
      });
      
      // Save it to the local frontend ledger for testability
      setAssets(prev => [
        { id: response.asset_id, name: assetName, date: new Date().toISOString().split('T')[0] },
        ...prev
      ]);
      
      setAssetName(''); 
      setAssetData('');
    } catch (err) {
      console.error('Encryption error:', err);
      alert('Encryption Engine currently unavailable');
    } finally {
      setEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!searchId) return;
    setDecrypting(true);
    try {
      const response = await decryptAsset(searchId);
      setDecrypted({ 
        name: response.asset_name || 'Decrypted Asset', 
        owner: response.owner_id || 'Authorized Operator', 
        decrypted_data: response.decrypted_payload 
      });
    } catch (err) {
      console.error('Decryption error:', err);
      alert('Invalid Asset ID or Engine unavailable');
    } finally {
      setDecrypting(false);
    }
  };

  const copyText = (t) => { navigator.clipboard.writeText(t); setCopyDone(true); setTimeout(() => setCopyDone(false), 1500); };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-[18px] bg-indigo-500/10 border border-indigo-500/20 shadow-sm shadow-indigo-500/10">
            <ShieldCheck className="w-7 h-7 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-main tracking-tight">Digital Asset Vault</h1>
            <p className="text-muted text-[13px] mt-1 font-medium">AES-256 Fernet decentralized encryption</p>
          </div>
        </div>
        <div className="surface px-4 py-2.5 flex items-center gap-3">
          <Database className="w-4 h-4 text-indigo-500" />
          <div className="text-[13px] font-medium text-slate-500">
            Storage: <span className="font-semibold text-main ml-1">1.2 TB / 5 TB</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Encrypt Section */}
        <div className="surface p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10"><Lock className="w-4 h-4 text-blue-500" /></div>
              <h2 className="text-[15px] font-semibold text-main">Encrypt Data</h2>
            </div>
            <span className="badge bg-indigo-500/10 text-indigo-500 border border-indigo-500/10">V4.1</span>
          </div>

          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-2">Asset Name</label>
              <input 
                className="w-full"
                value={assetName} 
                onChange={e => setAssetName(e.target.value)} 
                placeholder="e.g. Q4 Financial Strategy" 
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-2">Sensitive Content</label>
              <textarea 
                className="w-full min-h-[140px] resize-none"
                value={assetData} 
                onChange={e => setAssetData(e.target.value)}
                placeholder="Enter intelligence to be secured..." 
              />
            </div>
          </div>

          <button 
            onClick={handleEncrypt} 
            disabled={encrypting || !assetName || !assetData}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[14px] transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            {encrypting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {encrypting ? 'Encrypting Payload...' : 'Protect Asset'}
          </button>
          
          {created && (
            <div className="mt-2 p-5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 slide-up group/item relative z-10">
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-[13px] flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" /> Asset Successfully Encrypted
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <span className="text-[12px] font-medium text-slate-500">Retrieval ID</span>
                   <span className="text-[13px] font-mono font-semibold bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-md px-2 py-1 select-all">{created.id}</span>
                </div>
                <div className="p-3 bg-white dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/10">
                  <p className="text-[12px] text-slate-400 font-mono truncate">{created.data}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Decrypt Section */}
        <div className="surface p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10"><Unlock className="w-4 h-4 text-purple-500" /></div>
              <h2 className="text-[15px] font-semibold text-main">Retrieve Data</h2>
            </div>
          </div>

          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-[13px] font-semibold text-slate-600 dark:text-slate-400 mb-2">Asset Identifier (ID)</label>
              <div className="flex gap-3">
                <input 
                  className="w-full"
                  value={searchId} 
                  onChange={e => setSearchId(e.target.value)} 
                  placeholder="AST-XXXXXXXX" 
                />
                <button 
                  onClick={handleDecrypt} 
                  disabled={decrypting || !searchId}
                  className="px-6 rounded-xl font-semibold text-[14px] flex-shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-main hover:bg-slate-200 dark:hover:bg-white/10 active:scale-[0.98]"
                >
                  {decrypting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Decrypt'}
                </button>
              </div>
            </div>
          </div>

          {decrypted ? (
            <div className="flex-1 p-6 rounded-xl relative bg-slate-50 dark:bg-[#0f1629] border border-slate-200 dark:border-white/5 slide-up mt-2">
              <button onClick={() => copyText(decrypted.decrypted_data)} className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-white/5 shadow-sm hover:bg-slate-100 dark:hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-500 transition-colors">
                {copyDone ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              
              <div className="flex items-center gap-2 mb-6">
                <Unlock className="w-4 h-4 text-emerald-500" />
                <p className="text-[13px] font-semibold text-main">Payload Extracted</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">Asset Name</p>
                  <p className="text-[14px] font-semibold text-main">{decrypted.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1">Auth Entity</p>
                  <p className="text-[14px] font-semibold text-main truncate">{decrypted.owner}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5">
                <pre className="text-[13px] text-slate-700 dark:text-indigo-300 font-mono whitespace-pre-wrap leading-relaxed">{decrypted.decrypted_data}</pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-[180px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-transparent mt-2">
               <Shield className="w-10 h-10 text-slate-300 dark:text-indigo-500/20 mb-4" />
               <p className="text-[13px] font-medium text-slate-400 text-center">Awaiting secure key injection for buffer access</p>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="surface p-6 sm:p-8 mt-4 rounded-[24px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
           <h2 className="text-[18px] font-bold text-main tracking-tight flex items-center gap-3">
              <div className="w-2 h-6 bg-indigo-500 rounded-full" />
              Asset Ledger
           </h2>
           <div className="flex gap-2">
              <button className="p-2 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                <Download className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-[12px] font-semibold text-slate-500">
                <th className="pb-4 px-4 font-medium">Asset ID</th>
                <th className="pb-4 px-4 font-medium">Classification</th>
                <th className="pb-4 px-4 font-medium">Mint Date</th>
                <th className="pb-4 px-4 font-medium">Status</th>
                <th className="pb-4 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {assets.map(a => (
                <tr key={a.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono text-indigo-500 dark:text-indigo-400 text-[13px] font-medium">{a.id}</td>
                  <td className="py-4 px-4 text-[14px] font-semibold text-main">{a.name}</td>
                  <td className="py-4 px-4 text-[13px] text-slate-500">{a.date}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> Sealed
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSearchId(a.id)} className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all shadow-sm">
                        <Unlock className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-500/30 transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}