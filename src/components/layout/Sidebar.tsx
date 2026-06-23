"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ScrollText, BellRing, Settings, Zap, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Event Logs', href: '/logs', icon: ScrollText },
  { name: 'Alert Rules', href: '/alerts', icon: BellRing },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-neutral-800">
        <Zap className="text-emerald-500 mr-2" size={20} aria-hidden="true" />
        <span className="text-lg font-bold tracking-tight text-neutral-50">MetricPulse</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Main Navigation">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-neutral-900 text-emerald-400' 
                  : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3 px-2 py-2 text-sm text-neutral-400">
          <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 font-bold">
            A
          </div>
          <span className="truncate font-medium">System Admin</span>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}