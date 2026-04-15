import os

base_dir = r"c:\Users\prath\OneDrive\Desktop\VANGAURD Ai\vanguard-ai-frontend"
src_app = os.path.join(base_dir, "src", "app")

# 1. .env.local
env_content = """NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDummyExample123456
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vanguard-ai-12bac.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vanguard-ai-12bac
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vanguard-ai-12bac.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=975164635046
NEXT_PUBLIC_FIREBASE_APP_ID=1:975164635046:web:867c48c1-ad79-7a4326d7c364
"""
with open(os.path.join(base_dir, ".env.local"), "w") as f:
    f.write(env_content)

# 2. firebase.js
firebase_path = os.path.join(src_app, "lib", "firebase.js")
os.makedirs(os.path.dirname(firebase_path), exist_ok=True)
with open(firebase_path, "w") as f:
    f.write("""import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
""")

# 3. next.config.mjs
with open(os.path.join(base_dir, "next.config.mjs"), "w") as f:
    f.write("""/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  distDir: 'out',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
""")

# 4. firebase.json
with open(os.path.join(base_dir, "firebase.json"), "w") as f:
    f.write("""{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|woff|woff2|ttf|otf)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
""")

# 5. AuthProvider
provider_path = os.path.join(src_app, "components", "providers", "AuthProvider.jsx")
os.makedirs(os.path.dirname(provider_path), exist_ok=True)
with open(provider_path, "w") as f:
    f.write("""'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/app/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter, usePathname } from 'next/navigation'

const AuthContext = createContext({ user: null, loading: true })

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      
      // Set cookie for middleware (though not used in static export)
      if (user) {
        user.getIdToken().then((token) => {
          document.cookie = `__session=${token}; path=/`
        })
      } else {
        document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!loading && !user && pathname !== '/login/' && pathname !== '/') {
      router.push('/login/')
    }
  }, [user, loading, pathname, router])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
""")

# 6. layout.jsx
with open(os.path.join(src_app, "layout.jsx"), "w") as f:
    f.write("""import { Inter } from 'next/font/google'
import './styles/globals.css'
import AuthProvider from '@/app/components/providers/AuthProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VANGUARD AI - Autonomous Enterprise Protection',
  description: 'AI-powered protection for digital assets, crisis response, and supply chain optimization',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-black min-h-screen text-white">
            {children}
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
""")

# 7. firestore.rules
with open(os.path.join(base_dir, "firestore.rules"), "w") as f:
    f.write("""rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
""")
