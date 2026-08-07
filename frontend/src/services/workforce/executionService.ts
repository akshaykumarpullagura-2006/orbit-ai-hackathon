import type { ExecutionLog, AgentId } from '@/types/workforce';

export class ExecutionService {
  private static logsStore: ExecutionLog[] = [];

  static createLog(
    missionId: string,
    agentId: AgentId,
    message: string,
    level: 'INFO' | 'WARN' | 'ERROR' = 'INFO'
  ): ExecutionLog {
    const log: ExecutionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      missionId,
      agentId,
      level,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    this.logsStore.push(log);
    return log;
  }

  static getLogsForMission(missionId: string): ExecutionLog[] {
    return this.logsStore.filter((l) => l.missionId === missionId);
  }

  static clearLogs() {
    this.logsStore = [];
  }
}
