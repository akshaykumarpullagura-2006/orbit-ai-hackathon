export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type RiskLevel = 'Severe' | 'Elevated' | 'Moderate' | 'Low';
export type Status = 'Completed' | 'Processing' | 'Pending' | 'Failed';
export type AgentStatus = 'Active' | 'Idle' | 'Processing' | 'Error';
export type Confidence = 'High' | 'Medium' | 'Low';

export interface TaskStat {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  icon: string;
}

export interface ActivityItem {
  id: string;
  agent: string;
  action: string;
  target: string;
  time: string;
  status: Status;
}

export interface WorkflowRun {
  id: string;
  task: string;
  source: string;
  workflow: string;
  date: string;
  status: Status;
  confidence: number;
  priority: Priority;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  progress: number;
  currentTask: string;
  executionTime: string;
  tasksCompleted: number;
  description: string;
}

export interface PipelineStep {
  id: string;
  label: string;
  description: string;
}

export interface ResultRecord {
  id: string;
  title: string;
  source: string;
  incidentType: string;
  priority: Priority;
  confidence: number;
  riskLevel: RiskLevel;
  businessImpact: string;
  summary: string;
  suggestedActions: string[];
  generatedReply: string;
  date: string;
  validationScore?: number;
  validationStatus?: string;
}

export interface ChartPoint {
  name: string;
  tasks: number;
  completed: number;
}

export interface ConfidencePoint {
  name: string;
  confidence: number;
}

export interface WorkflowDistribution {
  name: string;
  value: number;
  color: string;
}
