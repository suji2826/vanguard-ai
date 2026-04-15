import './styles/globals.css'
import AuthProvider from '@/app/components/providers/AuthProvider'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'VANGUARD AI — Autonomous Enterprise Protection',
  description: 'AI-powered protection for digital assets, crisis response, and supply chain optimization.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '12px',
                padding: '12px 18px',
              },
              duration: 3000,
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
