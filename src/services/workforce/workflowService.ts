import type {
  WorkforceMissionState,
  MissionStage,
  AgentId,
  WorkforceAgent,
} from '@/types/workforce';
import { AgentService } from './agentService';
import { ExecutionService } from './executionService';
import { MissionService } from './missionService';

export type WorkflowProgressCallback = (state: WorkforceMissionState) => void;

export class WorkflowService {
  static async executeMissionWorkflow(
    missionId: string,
    fileName: string,
    fileType: string,
    fileSize: string,
    onProgress: WorkflowProgressCallback
  ): Promise<WorkforceMissionState> {
    const state = MissionService.createMissionState(missionId, fileName, fileType, fileSize);
    const startTime = Date.now();

    // Stage 1: Uploaded -> Queued
    state.stage = 'Queued';
    state.progressPercentage = 5;
    ExecutionService.createLog(missionId, 'planner', `Mission ${missionId} initialized for file '${fileName}'`, 'INFO');
    state.logs = ExecutionService.getLogsForMission(missionId);
    onProgress({ ...state });
    await new Promise((r) => setTimeout(r, 400));

    const agentPipelineSequence: Array<{ id: AgentId; stage: MissionStage; progress: number }> = [
      { id: 'planner', stage: 'Planner', progress: 18 },
      { id: 'router', stage: 'Routing', progress: 32 },
      { id: 'document', stage: 'Document Analysis', progress: 50 },
      { id: 'decision', stage: 'Decision', progress: 68 },
      { id: 'automation', stage: 'Automation', progress: 82 },
      { id: 'validation', stage: 'Validation', progress: 92 },
      { id: 'report', stage: 'Report Generation', progress: 100 },
    ];

    for (let i = 0; i < agentPipelineSequence.length; i++) {
      const item = agentPipelineSequence[i];
      const agentId = item.id;
      const stage = item.stage;

      // Update state for starting current agent
      state.stage = stage;
      state.remainingAgents = agentPipelineSequence.slice(i).map((a) => a.id);
      
      const currentAgent: WorkforceAgent = {
        ...AgentService.getAgent(agentId),
        status: 'Processing',
        progress: 50,
      };
      state.currentAgent = currentAgent;

      // Update step status
      const stepIndex = state.steps.findIndex((s) => s.agentId === agentId);
      if (stepIndex !== -1) {
        state.steps[stepIndex].status = 'In_Progress';
        state.steps[stepIndex].startedAt = new Date().toLocaleTimeString();
      }

      ExecutionService.createLog(missionId, agentId, `Starting ${currentAgent.name}...`, 'INFO');
      state.logs = ExecutionService.getLogsForMission(missionId);
      onProgress({ ...state });

      // Simulated agent execution
      await new Promise((r) => setTimeout(r, 650));
      const agentResult = AgentService.executeAgentSimulated(agentId, fileName);

      // Agent completed
      const durationSec = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
      currentAgent.status = 'Completed';
      currentAgent.progress = 100;
      currentAgent.executionTime = durationSec;
      currentAgent.output = agentResult.output;
      currentAgent.logs = agentResult.logs;

      agentResult.logs.forEach((logMsg) => {
        ExecutionService.createLog(missionId, agentId, logMsg, 'INFO');
      });

      if (stepIndex !== -1) {
        state.steps[stepIndex].status = 'Completed';
        state.steps[stepIndex].completedAt = new Date().toLocaleTimeString();
        state.steps[stepIndex].duration = '0.6s';
        state.steps[stepIndex].output = agentResult.output;
        state.steps[stepIndex].logs = agentResult.logs;
      }

      state.completedAgents.push(agentId);
      state.progressPercentage = item.progress;
      state.totalDuration = durationSec;
      state.logs = ExecutionService.getLogsForMission(missionId);

      onProgress({ ...state });
      await new Promise((r) => setTimeout(r, 300));
    }

    // Stage Final: Completed
    state.stage = 'Completed';
    state.currentAgent = null;
    state.remainingAgents = [];
    state.progressPercentage = 100;
    ExecutionService.createLog(missionId, 'report', `Mission ${missionId} completed successfully across all 7 agents.`, 'INFO');
    state.logs = ExecutionService.getLogsForMission(missionId);

    onProgress({ ...state });
    return state;
  }
}
