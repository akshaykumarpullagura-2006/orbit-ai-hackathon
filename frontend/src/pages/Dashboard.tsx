import { motion } from 'framer-motion';
import {
  Layers,
  CheckCircle2,
  Clock,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Activity as ActivityIcon,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { Timeline } from '@/components/common/Timeline';
import {
  TasksAreaChart,
  ConfidenceLineChart,
  WorkflowPieChart,
} from '@/components/common/Charts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layers,
  CheckCircle2,
  Clock,
  Gauge,
};

export default function Dashboard() {
  const { stats, activity, tasksTrend, confidenceTrend, workflowDistribution, agents } = useApp();

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your AI orchestration workspace"
        action={
          <Button asChild className="shadow-soft">
            <Link to="/app/upload">New Task</Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = iconMap[s.icon] ?? Layers;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary shadow-soft">
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    s.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {s.trend === 'up' ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {s.delta}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
                <AnimatedCounter
                  value={parseFloat(s.value.replace(/[^0-9.]/g, ''))}
                  suffix={s.value.includes('%') ? '%' : ''}
                  decimals={s.value.includes('.') ? 1 : 0}
                />
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2"
        >
          <SectionHeader
            title="Task Throughput"
            subtitle="Total tasks vs. completed this week"
          />
          <div className="mt-6">
            <TasksAreaChart data={tasksTrend} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <SectionHeader title="Workflow Mix" subtitle="Distribution by type" />
          <div className="mt-4">
            <WorkflowPieChart data={workflowDistribution} />
          </div>
          <div className="mt-2 space-y-2">
            {workflowDistribution.map((w) => (
              <div key={w.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: w.color }} />
                <span className="flex-1 text-muted-foreground">{w.name}</span>
                <span className="font-medium">{w.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <SectionHeader title="AI Confidence" subtitle="8-week trend" />
          <div className="mt-6">
            <ConfidenceLineChart data={confidenceTrend} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <SectionHeader
            title="Recent Activity"
            action={<ActivityIcon className="h-4 w-4 text-muted-foreground" />}
          />
          <div className="mt-6">
            <Timeline items={activity.slice(0, 5)} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <SectionHeader
            title="Agent Status"
            action={
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/agents">View all</Link>
              </Button>
            }
          />
          <div className="mt-6 space-y-4">
            {agents.map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <span className="text-xs text-muted-foreground">{a.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${a.progress}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}

