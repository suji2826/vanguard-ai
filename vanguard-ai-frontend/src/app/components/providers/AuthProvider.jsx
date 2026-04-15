'use client'

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
