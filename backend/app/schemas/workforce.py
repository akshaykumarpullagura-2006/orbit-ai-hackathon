from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AgentSchema(BaseModel):
    id: str
    name: str
    description: str
    status: str
    progress: int
    executionTime: str
    output: Optional[Dict[str, Any]] = None
    logs: List[str] = []

class MissionStepSchema(BaseModel):
    id: str
    agentId: str
    agentName: str
    stage: str
    status: str
    duration: Optional[str] = None
    output: Optional[Dict[str, Any]] = None
    logs: List[str] = []

class MissionStateSchema(BaseModel):
    missionId: str
    fileName: str
    fileType: str
    fileSize: str
    stage: str
    progressPercentage: int
    totalDuration: str
    currentAgent: Optional[AgentSchema] = None
    completedAgents: List[str]
    remainingAgents: List[str]
    steps: List[MissionStepSchema]
    logs: List[Dict[str, Any]] = []
