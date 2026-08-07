import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  File,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/common/PageContainer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { pipelineSteps } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { uploadMissionFile, validateUploadFile, type MissionResponse } from '@/services/missionUploadService';
import { WorkflowService } from '@/services/workforce/workflowService';
import { uploadFilesTemporarily, clearTempFiles } from '@/services/fileUploadService';
import { uploadFilesToFastApi, triggerDemoMode } from '@/services/apiClient';
import { validateAndStandardizeDeliverable } from '@/services/validationEngine';
import { toast } from 'sonner';

interface UploadedFileItem {
  file?: File;
  name: string;
  size: string;
  type: string;
  missionId?: string;
  nextStep?: string;
}

const fileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg'].includes(ext || '')) return ImageIcon;
  return File;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Upload() {
  const { addWorkflowRun, addResultRecord, addActivity, updateAgent } = useApp();
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList) return;
    const fileArray = Array.from(fileList);
    for (const f of fileArray) {
      const validation = validateUploadFile(f);
      if (validation.valid) {
        const formattedSize =
          f.size < 1024 * 1024
            ? `${(f.size / 1024).toFixed(1)} KB`
            : `${(f.size / (1024 * 1024)).toFixed(1)} MB`;
        const ext = f.name.split('.').pop()?.toUpperCase() || 'DOCUMENT';

        setFiles((prev) => [
          ...prev,
          {
            file: f,
            name: f.name,
            size: formattedSize,
            type: ext,
          },
        ]);

        addActivity({
          id: `act-${Date.now()}`,
          agent: 'Planner Agent',
          action: 'queued payload for mission',
          target: f.name,
          time: 'Just now',
          status: 'Pending',
        });
      } else {
        toast.error('Upload Error', { description: validation.error });
      }
    }
  }, [addActivity]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const startProcessing = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setCompleted(false);
    setCurrentStep(0);

    try {
      const actualFileObjects: File[] = files
        .map((f) => f.file)
        .filter((f): f is File => f !== undefined);

      // Start step animation timer
      let stepIdx = 0;
      const stepInterval = setInterval(() => {
        stepIdx = Math.min(stepIdx + 1, pipelineSteps.length - 2);
        setCurrentStep(stepIdx);

        const agentKeys = ['planner', 'router', 'analyzer', 'decision', 'automation', 'reporter'];
        if (agentKeys[stepIdx]) {
          updateAgent(agentKeys[stepIdx], { status: 'Processing', progress: Math.min(100, (stepIdx + 1) * 16) });
        }
      }, 700);

      // Execute real 7-agent pipeline on FastAPI backend
      let runs: import('@/types').WorkflowRun[] = [];
      let results: import('@/types').ResultRecord[] = [];

      const backendResponse = await uploadFilesToFastApi(actualFileObjects);
      clearInterval(stepInterval);

      if (backendResponse) {
        runs = backendResponse.runs;
        results = backendResponse.results;
      } else {
        // Fallback: local extraction + agents
        const localResponse = await uploadFilesTemporarily(actualFileObjects);
        runs = localResponse.runs;
        results = localResponse.results;
      }

      runs.forEach((r) => addWorkflowRun(r));
      results.forEach((res) => {
        const { validatedResult } = validateAndStandardizeDeliverable(res);
        addResultRecord(validatedResult);
      });

      // Complete all steps
      setCurrentStep(pipelineSteps.length - 1);
      ['planner', 'router', 'analyzer', 'decision', 'automation', 'reporter'].forEach((aId) => {
        updateAgent(aId, { status: 'Active', progress: 100 });
      });

      addActivity({
        id: `act-${Date.now() + 1}`,
        agent: 'Validation Engine',
        action: 'checked, validated & standardized business deliverable for',
        target: files.map((f) => f.name).join(', '),
        time: 'Just now',
        status: 'Completed',
      });

      setCompleted(true);
      toast.success('Mission Complete', {
        description: `Successfully executed 7-agent pipeline for ${files.length} document(s).`,
      });
    } catch (err: any) {
      console.error('Processing pipeline error:', err);
      toast.error('Processing Failed', {
        description: err.message || 'An error occurred while processing your document. Please try again.',
      });
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    clearTempFiles();
    setFiles([]);
    setCompleted(false);
    setCurrentStep(-1);
  };

  const runDemo = async (type: 'complaint' | 'contract' | 'meeting' | 'all') => {
    setProcessing(true);
    setCompleted(false);
    setCurrentStep(0);

    const demoFileMap = {
      complaint: [{ name: 'customer_complaint_shipment_sla.txt', size: '14.2 KB', type: 'TXT' }],
      contract: [{ name: 'northwind_msa_contract_audit.docx', size: '42.8 KB', type: 'DOCX' }],
      meeting: [{ name: 'executive_board_sync_notes.txt', size: '18.6 KB', type: 'TXT' }],
      all: [
        { name: 'customer_complaint_shipment_sla.txt', size: '14.2 KB', type: 'TXT' },
        { name: 'northwind_msa_contract_audit.docx', size: '42.8 KB', type: 'DOCX' },
        { name: 'executive_board_sync_notes.txt', size: '18.6 KB', type: 'TXT' },
      ],
    };

    setFiles(demoFileMap[type]);

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, pipelineSteps.length - 2);
      setCurrentStep(stepIdx);

      const agentKeys = ['planner', 'router', 'analyzer', 'decision', 'automation', 'reporter'];
      if (agentKeys[stepIdx]) {
        updateAgent(agentKeys[stepIdx], { status: 'Processing', progress: Math.min(100, (stepIdx + 1) * 16) });
      }
    }, 600);

    try {
      const response = await triggerDemoMode(type);
      clearInterval(stepInterval);

      if (response && response.runs && response.results) {
        response.runs.forEach((r) => addWorkflowRun(r));
        response.results.forEach((res) => {
          const { validatedResult } = validateAndStandardizeDeliverable(res);
          addResultRecord(validatedResult);
        });
      }

      setCurrentStep(pipelineSteps.length - 1);
      ['planner', 'router', 'analyzer', 'decision', 'automation', 'reporter'].forEach((aId) => {
        updateAgent(aId, { status: 'Active', progress: 100 });
      });

      addActivity({
        id: `act-${Date.now()}`,
        agent: 'Demo Workforce Engine',
        action: 'completed 7-agent showcase mission for',
        target: type === 'all' ? '3 Demo Showcase Documents' : demoFileMap[type][0].name,
        time: 'Just now',
        status: 'Completed',
      });

      setCompleted(true);
      toast.success('Demo Mission Complete', {
        description: 'All 7 AI agents executed cleanly in ~10 seconds. Results ready for review!',
      });
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Demo execution error:', err);
      toast.error('Demo Execution Error', { description: err.message || 'Demo run failed.' });
    } finally {
      setProcessing(false);
    }
  };


  return (
    <PageContainer>
      <PageHeader
        title="Upload Workspace"
        subtitle="Drop documents and let the agent pipeline handle the rest"
      />

      {/* Demo Mode Showcase Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-violet-500/10 to-transparent p-5 shadow-soft"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground">✨ Demo Mode — One-Click Showcase</h3>
              <p className="text-xs text-muted-foreground">Select a sample mission to run all 7 AI agents in fast mode (~10s execution time).</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={processing}
              onClick={() => runDemo('complaint')}
              className="text-xs gap-1.5"
            >
              🚨 Customer Complaint
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={processing}
              onClick={() => runDemo('contract')}
              className="text-xs gap-1.5"
            >
              📜 Contract Review
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={processing}
              onClick={() => runDemo('meeting')}
              className="text-xs gap-1.5"
            >
              📝 Meeting Notes
            </Button>
            <Button
              size="sm"
              disabled={processing}
              onClick={() => runDemo('all')}
              className="text-xs gap-1.5 shadow-soft"
            >
              ⚡ Run All 3 Missions
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Upload area */}
        <div className="lg:col-span-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !processing && inputRef.current?.click()}
            className={cn(
              'relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all',
              dragging
                ? 'border-primary bg-primary/5 shadow-glow'
                : 'border-border bg-card shadow-soft hover:border-primary/40 hover:shadow-premium',
            )}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <motion.div
              animate={dragging ? { scale: 1.1 } : { scale: 1 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            >
              <UploadCloud className="h-8 w-8" />
            </motion.div>
            <p className="mt-4 font-display text-lg font-medium">
              {dragging ? 'Drop to upload' : 'Drag & drop documents here'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse — PDF, DOCX, TXT, PNG, JPG
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {['PDF', 'DOCX', 'TXT', 'PNG', 'JPG'].map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <AnimatePresence>
                {files.map((f, i) => {
                  const Icon = fileIcon(f.name);
                  return (
                    <motion.div
                      key={`${f.name}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -8 }}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-soft"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{f.name}</p>
                          {f.missionId && (
                            <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary">
                              {f.missionId}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {f.size} {f.nextStep ? `• ${f.nextStep}` : ''}
                        </p>
                      </div>
                      {!processing && !completed && (
                        <button
                          onClick={() => removeFile(i)}
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      {completed && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {files.length > 0 && !processing && !completed && (
            <div className="mt-4 flex gap-3">
              <Button onClick={startProcessing} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Process {files.length} file{files.length > 1 ? 's' : ''}
              </Button>
              <Button variant="outline" onClick={reset}>
                Clear
              </Button>
            </div>
          )}

          {completed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 p-4"
            >
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div className="flex-1">
                <p className="text-sm font-medium">Processing complete</p>
                <p className="text-xs text-muted-foreground">
                  Your results are ready for review.
                </p>
              </div>
              <Button size="sm" asChild>
                <Link to="/app/results">View Results</Link>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Processing pipeline */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="font-display text-base font-semibold">Processing Pipeline</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {processing
                ? 'Agents are collaborating on your document…'
                : completed
                  ? 'All steps completed successfully.'
                  : 'Upload a document to begin.'}
            </p>

            <div className="mt-6 space-y-1">
              {pipelineSteps.map((step, i) => {
                const isActive = processing && currentStep === i;
                const isDone = (completed && i === pipelineSteps.length - 1) || (processing && i < currentStep) || (completed && i < pipelineSteps.length - 1);
                const isPending = !processing && !completed;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="relative flex gap-3 pb-5"
                  >
                    {/* Connector */}
                    {i < pipelineSteps.length - 1 && (
                      <div className="absolute left-[15px] top-8 h-full w-px bg-border" />
                    )}
                    <div
                      className={cn(
                        'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                        isDone
                          ? 'border-success bg-success/15 text-success'
                          : isActive
                            ? 'border-primary bg-primary/15 text-primary'
                            : 'border-border bg-background text-muted-foreground',
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="text-xs font-medium">{i + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          isPending && 'text-muted-foreground',
                          (isActive || isDone) && 'text-foreground',
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                      {isActive && (
                        <motion.div
                          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="h-full rounded-full bg-primary"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1, ease: 'linear' }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
