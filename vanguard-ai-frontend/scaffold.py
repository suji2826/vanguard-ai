import os

base_dir = r"c:\Users\prath\OneDrive\Desktop\VANGAURD Ai\vanguard-ai-frontend\app"

directories = [
    "login",
    "dashboard",
    "asset-protection",
    "supply-chain",
    "crisis-response",
    "resource-allocation",
    "ai-explanations",
    "components/layout",
    "components/dashboard",
    "components/asset-protection",
    "components/supply-chain",
    "components/crisis",
    "components/allocation",
    "components/ai",
    "lib",
    "hooks",
    "contexts",
    "styles"
]

files_with_content = {
    # Layout and pages
    "layout.jsx": """import { Inter } from 'next/font/google';
import { AuthProvider } from './contexts/AuthContext';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VANGUARD AI Dashboard',
  description: 'Autonomous Enterprise Protection Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-purple-900 via-blue-900 to-black min-h-screen text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
""",
    "page.jsx": """import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
""",
    "login/page.jsx": """export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">VANGUARD AI Login</h1>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
""",
    "dashboard/page.jsx": "export default function Dashboard() { return <div className='p-6'>Dashboard Overview</div>; }",
    "asset-protection/page.jsx": "export default function AssetProtection() { return <div className='p-6'>Asset Protection</div>; }",
    "supply-chain/page.jsx": "export default function SupplyChain() { return <div className='p-6'>Supply Chain Interface</div>; }",
    "crisis-response/page.jsx": "export default function CrisisResponse() { return <div className='p-6'>Crisis Response Management</div>; }",
    "resource-allocation/page.jsx": "export default function ResourceAllocation() { return <div className='p-6'>Resource Allocation Interface</div>; }",
    "ai-explanations/page.jsx": "export default function AIExplanations() { return <div className='p-6'>AI Explanations</div>; }",

    # AuthContext
    "contexts/AuthContext.jsx": """'use client';
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
""",

    # Global CSS
    "styles/globals.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .glassmorphism {
    @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg;
  }
}
""",
}

empty_files = [
    # Layout Components
    "components/layout/Sidebar.jsx",
    "components/layout/Header.jsx",
    "components/layout/MobileNav.jsx",
    # Dashboard Components
    "components/dashboard/StatsCards.jsx",
    "components/dashboard/ActivityFeed.jsx",
    "components/dashboard/Charts.jsx",
    "components/dashboard/CrisisAlert.jsx",
    # Asset Protection Components
    "components/asset-protection/EncryptForm.jsx",
    "components/asset-protection/DecryptForm.jsx",
    "components/asset-protection/AssetList.jsx",
    # Supply Chain Components
    "components/supply-chain/SupplierMap.jsx",
    "components/supply-chain/SupplierList.jsx",
    "components/supply-chain/AddSupplierModal.jsx",
    # Crisis Components
    "components/crisis/CrisisDetector.jsx",
    "components/crisis/ActiveCrisesList.jsx",
    "components/crisis/CrisisHistory.jsx",
    # Allocation Components
    "components/allocation/DemandForm.jsx",
    "components/allocation/OptimizationResults.jsx",
    "components/allocation/AllocationHistory.jsx",
    # AI Components
    "components/ai/AIChat.jsx",
    "components/ai/ExplanationCard.jsx",
    "components/ai/FairnessMetrics.jsx",
    # Lib and hooks
    "lib/firebase.js",
    "lib/firebase-admin.js",
    "lib/api.js",
    "lib/encryption.js",
    "hooks/useAuth.js",
    "hooks/useFirestore.js",
    "hooks/useRealTime.js"
]

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

for filepath, content in files_with_content.items():
    with open(os.path.join(base_dir, filepath), "w", encoding="utf-8") as f:
        f.write(content)

for filepath in empty_files:
    with open(os.path.join(base_dir, filepath), "w", encoding="utf-8") as f:
        comp_name = filepath.split('/')[-1].replace('.jsx', '').replace('.js', '')
        if '.jsx' in filepath:
            f.write(f"export default function {comp_name}() {{ return <div className='glassmorphism p-4'>{comp_name} Component</div>; }}\n")
        else:
            f.write(f"// {comp_name}.js\n")

# remove default next.js stuff that we are overwriting if it's there
default_page = os.path.join(base_dir, 'page.tsx')
if os.path.exists(default_page): os.remove(default_page)
default_layout = os.path.join(base_dir, 'layout.tsx')
if os.path.exists(default_layout): os.remove(default_layout)
default_css = os.path.join(base_dir, 'globals.css')
if os.path.exists(default_css): os.remove(default_css)
