import { motion } from 'framer-motion';
import {
  Bot,
  Clock,
  CheckCircle2,
  Cpu,
  Zap,
  Activity,
  Brain,
  Network,
  FileSearch,
  Gavel,
  Workflow,
  FileBarChart,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AgentStatusBadge } from '@/components/common/Badges';
import { Progress, CircularProgress } from '@/components/common/Progress';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const agentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  planner: Brain,
  router: Network,
  analyzer: FileSearch,
  decision: Gavel,
  automation: Workflow,
  reporter: FileBarChart,
};

const statusColor: Record<string, string> = {
  Active: 'bg-success',
  Idle: 'bg-muted-foreground',
  Processing: 'bg-primary',
  Error: 'bg-destructive',
};

export default function Agents() {
  const { agents } = useApp();
  const activeCount = agents.filter((a) => a.status === 'Active' || a.status === 'Processing').length;
  const avgProgress = Math.round(
    agents.reduce((sum, a) => sum + a.progress, 0) / (agents.length || 1),
  );

  return (
    <PageContainer>
      <PageHeader
        title="AI Agent Monitor"
        subtitle="Real-time visibility into your autonomous agent network"
      />

      {/* Summary strip */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Agents', value: agents.length, icon: Bot, color: 'text-primary' },
          { label: 'Active Now', value: activeCount, icon: Activity, color: 'text-success' },
          { label: 'Avg Progress', value: `${avgProgress}%`, icon: Cpu, color: 'text-chart-4' },
          { label: 'Tasks Completed', value: agents.reduce((s, a) => s + a.tasksCompleted, 0), icon: CheckCircle2, color: 'text-warning' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft shadow-card-hover"
          >
            <div className="flex items-center justify-between">
              <s.icon className={cn('h-5 w-5', s.color)} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Agent cards */}
      <div className="mt-6">
        <SectionHeader title="Agent Network" subtitle="Live status of all collaborating agents" />
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {agents.map((agent, i) => {
            const Icon = agentIcons[agent.id] ?? Bot;
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft shadow-card-hover"
              >
                {/* Glow */}
                <div
                  className={cn(
                    'absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition-opacity',
                    agent.status === 'Active' ? 'bg-primary/10' : 'bg-transparent',
                  )}
                />

                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-display text-base font-semibold">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground">{agent.role}</p>
                      </div>
                      <AgentStatusBadge status={agent.status} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{agent.description}</p>
                  </div>
                </div>

                {/* Current task */}
                <div className="relative mt-5 rounded-xl border border-border bg-background/50 p-4 shadow-soft">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Zap className="h-3.5 w-3.5" />
                    Current Task
                  </p>
                  <p className="mt-1.5 text-sm font-medium">{agent.currentTask}</p>
                </div>

                {/* Metrics */}
                <div className="relative mt-4 flex items-center gap-6">
                  <CircularProgress value={agent.progress} size={72} stroke={6} label="progress" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> Execution Time
                        </span>
                        <span className="font-medium">{agent.executionTime}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Tasks Completed
                        </span>
                        <span className="font-medium">{agent.tasksCompleted}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Activity className="h-3.5 w-3.5" /> Status
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className={cn('h-2 w-2 rounded-full', statusColor[agent.status])} />
                          {agent.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative mt-4">
                  <Progress value={agent.progress} size="sm" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
