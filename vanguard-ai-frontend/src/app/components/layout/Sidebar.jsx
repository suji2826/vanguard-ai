'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import Image from 'next/image';
import { 
  HomeIcon, 
  ShieldCheckIcon, 
  TruckIcon, 
  ExclamationTriangleIcon, 
  CpuChipIcon, 
  ChatBubbleBottomCenterTextIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { auth } from '@/app/lib/firebase';
import { signOut } from 'firebase/auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard/', icon: HomeIcon },
  { name: 'Profile', href: '/profile/', icon: UserIcon },
  { name: 'Asset Protection', href: '/asset-protection/', icon: ShieldCheckIcon },
  { name: 'Supply Chain', href: '/supply-chain/', icon: TruckIcon },
  { name: 'Crisis Response', href: '/crisis-response/', icon: ExclamationTriangleIcon },
  { name: 'Resource Allocation', href: '/resource-allocation/', icon: CpuChipIcon },
  { name: 'AI Explanations', href: '/ai-explanations/', icon: ChatBubbleBottomCenterTextIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white/5 backdrop-blur-xl border-r border-white/10">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center border-b border-white/10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          VANGUARD AI
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section at Bottom */}
      <div className="border-t border-white/10 p-4">
        <Link 
          href="/profile/"
          className="flex items-center group p-2 rounded-xl transition-all hover:bg-white/5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-[1px] overflow-hidden">
            <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <Image src={user.photoURL} alt="Profile" width={40} height={40} className="object-cover" />
              ) : (
                <UserIcon className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
              {user?.displayName || 'Operator'}
            </p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>
        </Link>
        <button 
          onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all border border-red-500/20"
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
