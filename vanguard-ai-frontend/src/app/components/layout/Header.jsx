'use client';
import { UserCircleIcon, BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/app/components/providers/AuthProvider';
import Image from 'next/image';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between px-8 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center space-x-4">
        <h2 className="text-gray-400 font-medium">Vanguard AI / <span className="text-white font-bold">Secure Dashboard</span></h2>
      </div>
      <div className="flex items-center space-x-6">
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-gray-900"></span>
        </button>
        
        <Link href="/profile/" className="flex items-center space-x-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
            {user?.displayName || 'Operator'}
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden border border-white/10">
            {user?.photoURL ? (
              <Image src={user.photoURL} alt="Profile" width={32} height={32} />
            ) : (
              <UserCircleIcon className="h-6 w-6 text-gray-400" />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
