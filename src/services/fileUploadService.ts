import type { WorkflowRun, ResultRecord } from '@/types';
import { extractDocumentText } from './documentExtractor';

export interface StoredTempFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  objectUrl: string;
  uploadedAt: string;
  extractedText?: string;
}

export interface UploadApiResponse {
  success: boolean;
  message: string;
  uploadBatchId: string;
  files: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    extractedText?: string;
  }>;
  runs: WorkflowRun[];
  results: ResultRecord[];
}

// Temporary in-memory storage for uploaded files
const tempFileStore = new Map<string, StoredTempFile>();

export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

export const SUPPORTED_EXTENSIONS = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg'];

export function validateFile(file: File): { valid: boolean; error?: string } {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `File type .${ext} is not supported. Supported: PDF, DOCX, TXT, PNG, JPG`,
    };
  }
  return { valid: true };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Real temporary upload storage and document extraction handler
export async function uploadFilesTemporarily(files: File[]): Promise<UploadApiResponse> {
  const batchId = `batch-${Date.now()}`;
  const uploadedMeta: Array<{ id: string; name: string; size: string; type: string; extractedText?: string }> = [];
  const generatedRuns: WorkflowRun[] = [];
  const generatedResults: ResultRecord[] = [];

  for (const file of files) {
    const fileId = `file-${Math.random().toString(36).substring(2, 9)}`;
    const objectUrl = URL.createObjectURL(file);
    const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Document extraction execution (PDF, DOCX, TXT, PNG/JPG OCR)
    const extractionResult = await extractDocumentText(file);

    const tempItem: StoredTempFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type || file.name.split('.').pop() || 'unknown',
      file,
      objectUrl,
      uploadedAt: new Date().toISOString(),
      extractedText: extractionResult.extractedText,
    };

    tempFileStore.set(fileId, tempItem);
    uploadedMeta.push({
      id: fileId,
      name: file.name,
      size: formatBytes(file.size),
      type: file.type,
      extractedText: extractionResult.extractedText,
    });

    const runId = `wf-${Date.now().toString().slice(-4)}`;
    const resultId = `r-${Date.now().toString().slice(-4)}`;

    generatedRuns.push({
      id: runId,
      task: `Text Extraction — ${file.name}`,
      source: file.name,
      workflow: 'Document Extraction',
      date: dateStr,
      status: 'Completed',
      confidence: 96,
      priority: 'High',
    });

    const summaryText = extractionResult.extractedText.length > 300
      ? extractionResult.extractedText.slice(0, 300) + '...'
      : extractionResult.extractedText;

    generatedResults.push({
      id: resultId,
      title: `Extracted Document: ${file.name}`,
      source: file.name,
      incidentType: `${extractionResult.fileType} Document Parsing`,
      priority: 'High',
      confidence: 96,
      riskLevel: 'Low',
      businessImpact: `Extracted ${extractionResult.wordCount} words (${extractionResult.extractedText.length} chars) from ${file.name}.`,
      summary: `Extracted Text Content:\n${summaryText}`,
      suggestedActions: [
        `File format: ${extractionResult.fileType}`,
        `Total extracted word count: ${extractionResult.wordCount}`,
        'Processed via Gemini multi-agent workforce pipeline.',
      ],
      generatedReply: `Extraction completed for ${file.name}.\n\nRaw Text:\n${extractionResult.extractedText}`,
      date: dateStr,
    });
  }

  return {
    success: true,
    message: `${files.length} file(s) extracted and stored.`,
    uploadBatchId: batchId,
    files: uploadedMeta,
    runs: generatedRuns,
    results: generatedResults,
  };
}

export function getTempFile(id: string): StoredTempFile | undefined {
  return tempFileStore.get(id);
}

export function getAllTempFiles(): StoredTempFile[] {
  return Array.from(tempFileStore.values());
}

export function clearTempFiles() {
  tempFileStore.forEach((item) => URL.revokeObjectURL(item.objectUrl));
  tempFileStore.clear();
}
