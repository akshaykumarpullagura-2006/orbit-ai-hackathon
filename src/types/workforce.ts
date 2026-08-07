export type MissionStage =
  | 'Uploaded'
  | 'Queued'
  | 'Planner'
  | 'Routing'
  | 'Document Analysis'
  | 'Decision'
  | 'Automation'
  | 'Validation'
  | 'Report Generation'
  | 'Completed'
  | 'Failed';

export type AgentId =
  | 'planner'
  | 'router'
  | 'document'
  | 'decision'
  | 'automation'
  | 'validation'
  | 'report';

export type AgentStatus = 'Idle' | 'Processing' | 'Completed' | 'Failed';

export interface WorkforceAgent {
  id: AgentId;
  name: string;
  description: string;
  status: AgentStatus;
  progress: number;
  executionTime: string;
  input?: Record<string, any>;
  output?: Record<string, any>;
  logs: string[];
}

export interface MissionStep {
  id: string;
  agentId: AgentId;
  agentName: string;
  stage: MissionStage;
  status: 'Pending' | 'In_Progress' | 'Completed' | 'Failed';
  startedAt?: string;
  completedAt?: string;
  duration?: string;
  output?: Record<string, any>;
  logs: string[];
}

export interface ExecutionLog {
  id: string;
  missionId: string;
  agentId: AgentId;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  timestamp: string;
}

export interface WorkforceMissionState {
  missionId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  stage: MissionStage;
  progressPercentage: number;
  totalDuration: string;
  currentAgent: WorkforceAgent | null;
  completedAgents: AgentId[];
  remainingAgents: AgentId[];
  steps: MissionStep[];
  logs: ExecutionLog[];
}
