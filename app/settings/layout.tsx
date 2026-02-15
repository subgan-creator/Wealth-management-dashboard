'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, FolderTree, GitBranch, Users, Clock, ArrowLeft, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const settingsNavItems = [
  {
    title: 'Business Events',
    href: '/settings/business-events',
    icon: FolderTree,
    description: 'Manage business events and sub-events',
  },
  {
    title: 'Routing Rules',
    href: '/settings/routing-rules',
    icon: GitBranch,
    description: 'Configure request routing logic',
  },
  {
    title: 'Team Management',
    href: '/settings/teams',
    icon: Users,
    description: 'Manage teams and members',
  },
  {
    title: 'SLA Configuration',
    href: '/settings/sla',
    icon: Clock,
    description: 'Set SLA thresholds per event type',
  },
  {
    title: 'User Preferences',
    href: '/settings/preferences',
    icon: UserCog,
    description: 'Manage your event access and notifications',
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Settings & Configuration</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {settingsNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        'flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className={cn('text-sm font-medium', isActive && 'text-foreground')}>
                          {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
