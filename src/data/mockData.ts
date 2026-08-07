import type {
  TaskStat,
  ActivityItem,
  WorkflowRun,
  Agent,
  PipelineStep,
  ResultRecord,
  ChartPoint,
  ConfidencePoint,
  WorkflowDistribution,
} from '@/types';

export const stats: TaskStat[] = [
  { label: 'Total Tasks', value: '1,284', delta: '+12.4%', trend: 'up', icon: 'Layers' },
  { label: 'Completed', value: '1,097', delta: '+8.1%', trend: 'up', icon: 'CheckCircle2' },
  { label: 'Pending', value: '187', delta: '-3.2%', trend: 'down', icon: 'Clock' },
  { label: 'Avg AI Confidence', value: '94.2%', delta: '+1.8%', trend: 'up', icon: 'Gauge' },
];

export const recentActivity: ActivityItem[] = [
  { id: 'a1', agent: 'Planner Agent', action: 'routed complaint to', target: 'Customer Resolution Workflow', time: '2m ago', status: 'Completed' },
  { id: 'a2', agent: 'Decision Agent', action: 'flagged risk on', target: 'Vendor Contract #VC-2290', time: '9m ago', status: 'Processing' },
  { id: 'a3', agent: 'Document Agent', action: 'extracted clauses from', target: 'MSA — Northwind Trading', time: '21m ago', status: 'Completed' },
  { id: 'a4', agent: 'Report Agent', action: 'generated summary for', target: 'Q3 Operations Review', time: '38m ago', status: 'Completed' },
  { id: 'a5', agent: 'Automation Agent', action: 'dispatched action on', target: 'Incident #INC-4821', time: '52m ago', status: 'Pending' },
  { id: 'a6', agent: 'Planner Agent', action: 'queued task', target: 'Meeting Notes — Board Sync', time: '1h ago', status: 'Completed' },
];

export const tasksTrend: ChartPoint[] = [
  { name: 'Mon', tasks: 142, completed: 128 },
  { name: 'Tue', tasks: 178, completed: 161 },
  { name: 'Wed', tasks: 165, completed: 150 },
  { name: 'Thu', tasks: 198, completed: 176 },
  { name: 'Fri', tasks: 212, completed: 195 },
  { name: 'Sat', tasks: 96, completed: 88 },
  { name: 'Sun', tasks: 73, completed: 67 },
];

export const confidenceTrend: ConfidencePoint[] = [
  { name: 'W1', confidence: 88 },
  { name: 'W2', confidence: 90 },
  { name: 'W3', confidence: 89 },
  { name: 'W4', confidence: 92 },
  { name: 'W5', confidence: 93 },
  { name: 'W6', confidence: 94 },
  { name: 'W7', confidence: 94 },
  { name: 'W8', confidence: 95 },
];

export const workflowDistribution: WorkflowDistribution[] = [
  { name: 'Complaint Resolution', value: 38, color: 'hsl(248 82% 66%)' },
  { name: 'Contract Analysis', value: 27, color: 'hsl(198 83% 60%)' },
  { name: 'Report Generation', value: 19, color: 'hsl(152 60% 50%)' },
  { name: 'Meeting Synthesis', value: 16, color: 'hsl(38 92% 55%)' },
];

export const agents: Agent[] = [
  {
    id: 'planner',
    name: 'Planner Agent',
    role: 'Orchestration',
    status: 'Active',
    progress: 78,
    currentTask: 'Analyzing document intent and task structure',
    executionTime: '1.2s',
    tasksCompleted: 412,
    description: 'Analyzes incoming documents, classifies intent, and constructs the execution plan.',
  },
  {
    id: 'router',
    name: 'Router Agent',
    role: 'Routing',
    status: 'Active',
    progress: 85,
    currentTask: 'Routing payload to extraction & decision workflows',
    executionTime: '0.8s',
    tasksCompleted: 389,
    description: 'Directs payloads to target workflows based on classification tags and priority.',
  },
  {
    id: 'analyzer',
    name: 'Analyzer Agent',
    role: 'Analysis & Extraction',
    status: 'Processing',
    progress: 54,
    currentTask: 'Extracting text and structured entities from file stream',
    executionTime: '3.8s',
    tasksCompleted: 289,
    description: 'Parses structured and unstructured documents into normalized entities and extracted text.',
  },
  {
    id: 'decision',
    name: 'Decision Agent',
    role: 'Reasoning',
    status: 'Active',
    progress: 91,
    currentTask: 'Evaluating risk exposure and business rules',
    executionTime: '2.1s',
    tasksCompleted: 356,
    description: 'Applies business rules and risk models to recommend decisions.',
  },
  {
    id: 'automation',
    name: 'Automation Agent',
    role: 'Execution',
    status: 'Idle',
    progress: 100,
    currentTask: 'Dispatching actions to connected systems',
    executionTime: '0.4s',
    tasksCompleted: 198,
    description: 'Executes approved actions across connected enterprise systems.',
  },
  {
    id: 'reporter',
    name: 'Reporter Agent',
    role: 'Synthesis & Reporting',
    status: 'Active',
    progress: 67,
    currentTask: 'Compiling final analysis into business report',
    executionTime: '5.2s',
    tasksCompleted: 231,
    description: 'Compiles analysis into business-ready reports and replies.',
  },
];

export const pipelineSteps: PipelineStep[] = [
  { id: 'planner', label: 'Planner', description: 'Analyzing intent and planning execution' },
  { id: 'router', label: 'Router', description: 'Routing payload to optimal workflow' },
  { id: 'analyzer', label: 'Analyzer', description: 'Parsing document & extracting text' },
  { id: 'decision', label: 'Decision', description: 'Evaluating business rules & risk models' },
  { id: 'automation', label: 'Automation', description: 'Executing automated system dispatches' },
  { id: 'reporter', label: 'Reporter', description: 'Generating business-ready final output' },
  { id: 'completed', label: 'Completed', description: 'Pipeline execution ready for review' },
];

// Workflow history starts empty — populated by real uploads
export const workflowHistory: WorkflowRun[] = [];

// Results start empty — populated by real uploads
export const results: ResultRecord[] = [];

export const apiKeys = [
  { id: 'k1', name: 'Production API Key', key: 'sk-orbit-prod-••••••••••••4f2a', created: '2026-07-12', lastUsed: '2m ago' },
  { id: 'k2', name: 'Staging API Key', key: 'sk-orbit-stg-••••••••••••9c1d', created: '2026-06-30', lastUsed: '3h ago' },
  { id: 'k3', name: 'Analytics Webhook', key: 'sk-orbit-wh-••••••••••••a7b3', created: '2026-05-18', lastUsed: '1d ago' },
];
