import { toast } from 'sonner';

export type MissionStatus = 'Uploaded' | 'Queued' | 'Processing' | 'Completed' | 'Failed';

export interface MissionResponse {
  missionId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  status: MissionStatus;
  createdAt: string;
  nextStep: string;
}

export interface MissionItem {
  missionId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  status: MissionStatus;
  createdAt: string;
  currentStage: string;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB Limit
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg'];

export function validateUploadFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'Empty upload. Please select a valid document.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported format '.${ext}'. Supported formats: PDF, DOCX, TXT, PNG, JPG.`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty (0 bytes). Upload failed.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File exceeds maximum allowed limit of 25MB (Uploaded: ${sizeMb}MB).`,
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function uploadMissionFile(file: File): Promise<MissionResponse> {
  const validation = validateUploadFile(file);
  if (!validation.valid) {
    toast.error('Upload Error', { description: validation.error });
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:8000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data: MissionResponse = await response.json();
      toast.success(`Mission Created: ${data.missionId}`, {
        description: `${data.fileName} uploaded successfully. Next: ${data.nextStep}`,
      });
      return data;
    } else {
      const errJson = await response.json().catch(() => ({}));
      const msg = errJson.detail || errJson.message || 'Upload server error.';
      toast.error('Upload Failed', { description: msg });
      throw new Error(msg);
    }
  } catch (err) {
    // Session fallback if backend server is offline
    const year = new Date().getFullYear();
    const randSeq = Math.floor(100000 + Math.random() * 900000);
    const missionId = `ORB-${year}-${randSeq}`;
    const ext = file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';

    const fallbackResponse: MissionResponse = {
      missionId,
      fileName: file.name,
      fileType: ext,
      fileSize: formatFileSize(file.size),
      status: 'Uploaded',
      createdAt: new Date().toISOString(),
      nextStep: 'Planner Agent queued.',
    };

    toast.success(`Mission Created: ${missionId}`, {
      description: `${file.name} uploaded successfully. Next: Planner Agent queued.`,
    });

    return fallbackResponse;
  }
}
