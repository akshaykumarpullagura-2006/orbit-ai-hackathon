import type {
  WorkforceMissionState,
  MissionStage,
  AgentId,
  MissionStep,
} from '@/types/workforce';
import { AgentService } from './agentService';

export class MissionService {
  static createMissionState(missionId: string, fileName: string, fileType: string, fileSize: string): WorkforceMissionState {
    const agentIds: AgentId[] = ['planner', 'router', 'document', 'decision', 'automation', 'validation', 'report'];
    
    const steps: MissionStep[] = agentIds.map((id) => {
      const agent = AgentService.getAgent(id);
      let stage: MissionStage = 'Queued';
      if (id === 'planner') stage = 'Planner';
      if (id === 'router') stage = 'Routing';
      if (id === 'document') stage = 'Document Analysis';
      if (id === 'decision') stage = 'Decision';
      if (id === 'automation') stage = 'Automation';
      if (id === 'validation') stage = 'Validation';
      if (id === 'report') stage = 'Report Generation';

      return {
        id: `step-${id}`,
        agentId: id,
        agentName: agent.name,
        stage,
        status: 'Pending',
        logs: [],
      };
    });

    return {
      missionId,
      fileName,
      fileType,
      fileSize,
      stage: 'Uploaded',
      progressPercentage: 0,
      totalDuration: '0.0s',
      currentAgent: null,
      completedAgents: [],
      remainingAgents: agentIds,
      steps,
      logs: [],
    };
  }
}
