from pydantic import BaseModel
from typing import List

class WorkflowHistoryItem(BaseModel):
    id: str
    task: str
    source: str
    workflow: str
    date: str
    status: str
    confidence: int
    priority: str

class DeleteHistoryResponse(BaseModel):
    id: str
    status: str = "deleted"
    message: str = "Workflow log successfully deleted."
