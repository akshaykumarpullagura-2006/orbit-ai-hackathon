from pydantic import BaseModel
from typing import List, Optional

class MissionResponseSchema(BaseModel):
    missionId: str
    fileName: str
    fileType: str
    fileSize: str
    status: str = "Uploaded"
    createdAt: str
    nextStep: str = "Planner Agent queued."

class MissionItemSchema(BaseModel):
    missionId: str
    fileName: str
    fileType: str
    fileSize: str
    status: str
    createdAt: str
    currentStage: str
