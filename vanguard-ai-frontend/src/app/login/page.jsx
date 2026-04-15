'use client';
import { auth } from '@/app/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Shield } from 'lucide-react';

export default function Login() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Authentication completed');
      router.push('/dashboard/');
    } catch (error) {
      console.error(error);
      toast.error(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0e1a] font-body relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="glass p-10 max-w-md w-full mx-4 text-center z-10 border border-white/5 shadow-2xl shadow-indigo-500/5">
        
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-8">
          <Shield className="w-8 h-8 text-white" />
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-black grad-text tracking-tight mb-2">
            VANGUARD AI
          </h1>
          <p className="text-[15px] font-medium text-slate-400">Identify. Secure. Optimize.</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold text-[15px] py-4 px-4 rounded-xl hover:bg-slate-100 transition-all shadow-xl active:scale-[0.98]"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>
        </div>
        
        <p className="mt-8 text-[13px] text-slate-500 font-medium">
          Secure, encrypted access to the enterprise dashboard.
        </p>
      </div>
    </div>
  );
}
