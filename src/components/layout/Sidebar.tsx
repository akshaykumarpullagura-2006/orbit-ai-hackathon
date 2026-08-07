import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  FileBarChart,
  Bot,
  History,
  Settings,
  Orbit,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useApp } from '@/context/AppContext';

const nav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/upload', label: 'Upload', icon: UploadCloud },
  { to: '/app/results', label: 'Results', icon: FileBarChart },
  { to: '/app/agents', label: 'AI Agents', icon: Bot },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { agents, history } = useApp();
  const completedCount = history.filter((h) => h.status === 'Completed').length;

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 shadow-glow">
            <Orbit className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="font-display text-base font-semibold tracking-tight">Orbit AI</span>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Work Orchestrator</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-gradient-to-r from-primary/10 to-violet-500/5 text-primary shadow-soft'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-[18px] w-[18px]" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-xl border border-border bg-gradient-to-br from-secondary/50 to-card p-3 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium">All systems operational</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {agents.length} agents · {completedCount.toLocaleString()} tasks completed
          </p>
        </div>
      </div>
    </aside>
  );
}

