import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Download,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/common/PageContainer';
import { StatusBadge, PriorityBadge, ConfidenceBadge } from '@/components/common/Badges';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import type { Status } from '@/types';

const statusFilters: (Status | 'All')[] = ['All', 'Completed', 'Processing', 'Pending', 'Failed'];

const statusIcon: Record<Status, React.ComponentType<{ className?: string }>> = {
  Completed: CheckCircle2,
  Processing: Loader2,
  Pending: Clock,
  Failed: XCircle,
};

export default function History() {
  const { history, deleteWorkflowRun, rerunWorkflow } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [sortField, setSortField] = useState<'task' | 'confidence' | 'date'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSort = (field: 'task' | 'confidence' | 'date') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filtered = useMemo(() => {
    const list = history.filter((r) => {
      const matchesQuery =
        r.task.toLowerCase().includes(query.toLowerCase()) ||
        r.workflow.toLowerCase().includes(query.toLowerCase()) ||
        r.source.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    return list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [history, query, statusFilter, sortField, sortAsc]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Task,Source,Workflow,Date,Status,Confidence,Priority']
        .concat(
          filtered.map(
            (r) => `"${r.id}","${r.task}","${r.source}","${r.workflow}","${r.date}","${r.status}",${r.confidence},"${r.priority}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'orbit_ai_workflow_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: 'Exported CSV',
      description: `Downloaded ${filtered.length} workflow log entries.`,
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Workflow History"
        subtitle="Complete log of every orchestrated task"
        action={
          <Button variant="outline" className="gap-2 shadow-soft" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, workflows, files…"
            className="h-9 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                statusFilter === f
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('task')}>
                    Task <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Workflow</th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('date')}>
                    Date <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Priority</th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('confidence')}>
                    Confidence <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const SIcon = statusIcon[row.status];
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <SIcon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            row.status === 'Completed' && 'text-success',
                            row.status === 'Processing' && 'animate-spin text-primary',
                            row.status === 'Pending' && 'text-warning',
                            row.status === 'Failed' && 'text-destructive',
                          )}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{row.task}</p>
                          <p className="truncate text-xs text-muted-foreground">{row.source}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">{row.workflow}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap text-sm text-muted-foreground">{row.date}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-4">
                      <PriorityBadge priority={row.priority} />
                    </td>
                    <td className="px-5 py-4">
                      <ConfidenceBadge value={row.confidence} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View details" onClick={() => navigate('/app/results')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate('/app/results')}>View details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => rerunWorkflow(row.id)}>Re-run workflow</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportCSV}>Export result</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteWorkflowRun(row.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">No workflows match your search.</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {history.length} workflows
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

