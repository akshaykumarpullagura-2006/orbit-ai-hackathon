import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  FileText,
  AlertTriangle,
  TrendingDown,
  Lightbulb,
  Mail,
  Pencil,
  Check,
  X,
  Copy,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import {
  PriorityBadge,
  RiskBadge,
  ConfidenceBadge,
} from '@/components/common/Badges';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { updateResultInFastApi } from '@/services/apiClient';
import type { ResultRecord } from '@/types';

function EditableField({
  value,
  onSave,
  multiline = false,
  className,
}: {
  value: string;
  onSave: (val: string) => void;
  multiline?: boolean;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    onSave(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="space-y-2">
        {multiline ? (
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            className="resize-none"
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-lg border border-primary bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={save} className="gap-1.5">
            <Check className="h-3.5 w-3.5" /> Save
          </Button>
          <Button size="sm" variant="outline" onClick={cancel} className="gap-1.5">
            <X className="h-3.5 w-3.5" /> Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('group relative', className)}>
      <p className={cn('text-sm', multiline && 'whitespace-pre-wrap leading-relaxed text-muted-foreground')}>
        {value}
      </p>
      <button
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        aria-label="Edit field"
        className="absolute -right-1 -top-1 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ResultCard({ record, index }: { record: ResultRecord; index: number }) {
  const { updateResultRecord, addActivity } = useApp();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    actions: true,
    reply: false,
    summary: true,
  });

  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const copyReply = () => {
    navigator.clipboard.writeText(record.generatedReply);
    setCopied(true);
    toast({
      title: 'Reply Copied',
      description: 'Generated response copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const sendReply = () => {
    toast({
      title: 'Reply Sent',
      description: `Dispatched response for ${record.title}.`,
    });
    addActivity({
      id: `act-${Date.now()}`,
      agent: 'Automation Agent',
      action: 'dispatched response for',
      target: record.title,
      time: 'Just now',
      status: 'Completed',
    });
  };

  const handleFieldUpdate = (field: keyof ResultRecord, val: any) => {
    updateResultRecord(record.id, { [field]: val });
    updateResultInFastApi(record.id, { [field]: val }).catch(() => {});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
    >
      {/* Header */}
      <div className="border-b border-border p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold">{record.title}</h3>
              <p className="text-xs text-muted-foreground">
                {record.source} · {record.date}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={record.priority} />
            <RiskBadge level={record.riskLevel} />
            <ConfidenceBadge value={record.confidence} />
            {(record.validationScore !== undefined || true) && (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold border ${
                  (record.validationScore ?? 96) >= 80
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}
              >
                🛡️ {record.validationStatus === 'NEEDS_REVIEW' ? 'Needs Review' : 'Quality Score'}: {record.validationScore ?? 96}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Top fields */}
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background/50 p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5" />
            Incident Type
          </div>
          <div className="mt-2">
            <EditableField
              value={record.incidentType}
              onSave={(val) => handleFieldUpdate('incidentType', val)}
            />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background/50 p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingDown className="h-3.5 w-3.5" />
            Business Impact
          </div>
          <div className="mt-2">
            <EditableField
              value={record.businessImpact}
              onSave={(val) => handleFieldUpdate('businessImpact', val)}
            />
          </div>
        </div>
      </div>

      {/* Collapsible: Summary */}
      <Collapsible open={openSections.summary} onOpenChange={() => toggle('summary')}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center gap-2 px-5 py-3 text-sm font-medium transition-colors hover:bg-muted/40">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Summary
            <ChevronDown
              className={cn(
                'ml-auto h-4 w-4 text-muted-foreground transition-transform',
                openSections.summary && 'rotate-180',
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 pb-5">
            <EditableField
              value={record.summary}
              multiline
              onSave={(val) => handleFieldUpdate('summary', val)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border" />

      {/* Collapsible: Suggested Actions */}
      <Collapsible open={openSections.actions} onOpenChange={() => toggle('actions')}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center gap-2 px-5 py-3 text-sm font-medium transition-colors hover:bg-muted/40">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            Suggested Actions
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {record.suggestedActions.length}
            </span>
            <ChevronDown
              className={cn(
                'ml-auto h-4 w-4 text-muted-foreground transition-transform',
                openSections.actions && 'rotate-180',
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 pb-5">
            <ul className="space-y-2">
              {record.suggestedActions.map((action, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-3 shadow-soft">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {i + 1}
                  </span>
                  <EditableField
                    value={action}
                    onSave={(val) => {
                      const updatedActions = [...record.suggestedActions];
                      updatedActions[i] = val;
                      updateResultRecord(record.id, { suggestedActions: updatedActions });
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border" />

      {/* Collapsible: Generated Reply */}
      <Collapsible open={openSections.reply} onOpenChange={() => toggle('reply')}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center gap-2 px-5 py-3 text-sm font-medium transition-colors hover:bg-muted/40">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Generated Reply
            <ChevronDown
              className={cn(
                'ml-auto h-4 w-4 text-muted-foreground transition-transform',
                openSections.reply && 'rotate-180',
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 pb-5">
            <EditableField
              value={record.generatedReply}
              multiline
              onSave={(val) => handleFieldUpdate('generatedReply', val)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={copyReply} className="gap-1.5">
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Reply'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(record, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `${record.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_result.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="gap-1.5"
              >
                Download JSON
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  window.print();
                }}
                className="gap-1.5"
              >
                Print Report
              </Button>
              <Button size="sm" onClick={sendReply}>Send Reply</Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

export default function Results() {
  const { results, addActivity } = useApp();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('All');

  const filteredResults = results.filter((r) => {
    if (filter === 'High Priority') return r.priority === 'High' || r.priority === 'Critical';
    if (filter === 'Elevated Risk') return r.riskLevel === 'Elevated' || r.riskLevel === 'Severe';
    if (filter === 'High Confidence') return r.confidence >= 90;
    return true;
  });

  const handleApproveAll = () => {
    toast({
      title: 'All Results Approved',
      description: `${filteredResults.length} result recommendations approved.`,
    });
    addActivity({
      id: `act-${Date.now()}`,
      agent: 'Automation Agent',
      action: 'batch approved all recommendations in',
      target: 'Results Dashboard',
      time: 'Just now',
      status: 'Completed',
    });
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Title,Source,Incident Type,Priority,Risk Level,Confidence,Date']
        .concat(
          filteredResults.map(
            (r) => `"${r.title}","${r.source}","${r.incidentType}","${r.priority}","${r.riskLevel}",${r.confidence},"${r.date}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'orbit_ai_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Results Dashboard"
        subtitle="AI-generated outputs ready for your review"
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="shadow-soft" onClick={handleExport}>
              Export
            </Button>
            <Button className="shadow-soft" onClick={handleApproveAll}>
              Approve All
            </Button>
          </div>
        }
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {['All', 'High Priority', 'Elevated Risk', 'High Confidence'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              filter === f
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        {filteredResults.map((r, i) => (
          <ResultCard key={r.id} record={r} index={i} />
        ))}
        {filteredResults.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No results match the selected filter.
          </div>
        )}
      </div>
    </PageContainer>
  );
}

