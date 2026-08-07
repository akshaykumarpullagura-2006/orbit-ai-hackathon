import type { ResultRecord, WorkflowRun } from '@/types';
import { extractDocumentText } from './documentExtractor';
import { runFullGeminiMultiAgentPipeline } from './geminiAgents';

export interface ProcessingFile {
  file: File;
  name: string;
  size: string;
  type: string;
}

export interface PipelineProgressCallback {
  (stepIndex: number, currentStepName: string, agentName: string, progress: number): void;
}

// Multi-agent Gemini AI engine that analyzes documents with strict JSON schemas
export async function executeMultiAgentPipeline(
  processingFiles: ProcessingFile[],
  onProgress: PipelineProgressCallback
): Promise<{ runs: WorkflowRun[]; results: ResultRecord[] }> {
  const steps = [
    { name: 'Planning Intent', agent: 'Planner' },
    { name: 'Routing Payload', agent: 'Router' },
    { name: 'Analyzing Document', agent: 'Analyzer' },
    { name: 'Evaluating Rules', agent: 'Decision' },
    { name: 'Executing Dispatch', agent: 'Automation' },
    { name: 'Generating Report', agent: 'Reporter' },
    { name: 'Completed', agent: 'Reporter' },
  ];

  const generatedRuns: WorkflowRun[] = [];
  const generatedResults: ResultRecord[] = [];

  for (const fileObj of processingFiles) {
    const fileName = fileObj.name;
    const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const idSuffix = Math.floor(1000 + Math.random() * 9000);

    // Extract text from uploaded document
    const extractedData = await extractDocumentText(fileObj.file);

    // Step 0: Planner
    onProgress(0, steps[0].name, steps[0].agent, 15);
    await new Promise((res) => setTimeout(res, 400));

    // Execute Gemini multi-agent pipeline with system prompts & strict JSON schemas
    const agentResults = await runFullGeminiMultiAgentPipeline(fileName, extractedData.extractedText);

    // Stream step progress
    onProgress(1, steps[1].name, steps[1].agent, 30);
    await new Promise((res) => setTimeout(res, 350));

    onProgress(2, steps[2].name, steps[2].agent, 50);
    await new Promise((res) => setTimeout(res, 350));

    onProgress(3, steps[3].name, steps[3].agent, 70);
    await new Promise((res) => setTimeout(res, 350));

    onProgress(4, steps[4].name, steps[4].agent, 85);
    await new Promise((res) => setTimeout(res, 350));

    onProgress(5, steps[5].name, steps[5].agent, 95);
    await new Promise((res) => setTimeout(res, 350));

    onProgress(6, steps[6].name, steps[6].agent, 100);

    const runId = `wf-${idSuffix}`;
    const resultId = `r-${idSuffix}`;

    const runItem: WorkflowRun = {
      id: runId,
      task: agentResults.reporter.finalReportTitle || `Analysis of ${fileName}`,
      source: fileName,
      workflow: agentResults.router.targetWorkflow || 'Document Analysis',
      date: dateStr,
      status: 'Completed',
      confidence: agentResults.planner.confidence || 95,
      priority: agentResults.router.priority || 'High',
    };

    const resultItem: ResultRecord = {
      id: resultId,
      title: agentResults.reporter.finalReportTitle || `Extracted Analysis — ${fileName}`,
      source: fileName,
      incidentType: agentResults.reporter.incidentType || agentResults.router.targetWorkflow,
      priority: agentResults.router.priority || 'High',
      confidence: agentResults.planner.confidence || 95,
      riskLevel: agentResults.decision.riskLevel || 'Moderate',
      businessImpact: agentResults.reporter.businessImpact || 'Automated multi-agent synthesis completed.',
      summary: agentResults.reporter.executiveSummary || agentResults.analyzer.extractedSummary,
      suggestedActions: agentResults.reporter.suggestedActions || agentResults.decision.recommendedActions,
      generatedReply: agentResults.reporter.generatedReply,
      date: dateStr,
    };

    generatedRuns.push(runItem);
    generatedResults.push(resultItem);
  }

  return { runs: generatedRuns, results: generatedResults };
}
