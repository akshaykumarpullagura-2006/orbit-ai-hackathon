from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Query
from typing import List, Optional, Any
import uuid
import datetime

from backend.app.core.response import APIResponse, success_response
from backend.app.schemas.upload import UploadResponseData, UploadedFileMeta
from backend.app.schemas.analyze import AnalyzeRequest, AnalyzeResponseData
from backend.app.schemas.history import WorkflowHistoryItem, DeleteHistoryResponse
from backend.app.api.deps import get_db
from backend.app.core.logging import logger

router = APIRouter()

from backend.app.schemas.mission import MissionResponseSchema
from backend.app.services.mission_upload_service import process_mission_upload

# 1. POST /upload (Real Mission Upload System)
@router.post("/upload", response_model=MissionResponseSchema)
async def upload_mission_file(file: UploadFile = File(...), db=Depends(get_db)):
    logger.info(f"POST /upload called for file: {file.filename}")
    mission_data = await process_mission_upload(file, db)
    return mission_data

from backend.app.schemas.workforce import MissionStateSchema
from backend.app.services.workforce_engine import workforce_engine

# 2. POST /analyze (Workforce Engine Execution)
@router.post("/analyze", response_model=MissionStateSchema)
async def analyze_mission_workforce(request: AnalyzeRequest):
    logger.info(f"POST /analyze called for mission/file: {request.fileName}")
    mission_id = request.fileId if request.fileId.startswith("ORB-") else f"ORB-2026-{uuid.uuid4().hex[:6]}"
    state = workforce_engine.simulate_mission_execution(
        mission_id=mission_id,
        filename=request.fileName,
        file_type=request.fileName.split(".")[-1].upper(),
        file_size="2.4 MB"
    )
    return state

# 3. GET /history (Real SQLite Query)
@router.get("/history", response_model=APIResponse[List[WorkflowHistoryItem]])
async def get_history_real(
    query: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db=Depends(get_db)
):
    logger.info(f"GET /history called with query='{query}', status='{status}'.")

    cursor = db.cursor()
    sql = "SELECT id, task, source, workflow, date, status, confidence, priority FROM workflows WHERE 1=1"
    params: List[Any] = []

    if status and status != "All":
        sql += " AND status = ?"
        params.append(status)

    if query:
        q_wild = f"%{query}%"
        sql += " AND (task LIKE ? OR source LIKE ? OR workflow LIKE ?)"
        params.extend([q_wild, q_wild, q_wild])

    sql += " ORDER BY created_at DESC"
    cursor.execute(sql, params)
    rows = cursor.fetchall()

    history_items: List[WorkflowHistoryItem] = [
        WorkflowHistoryItem(
            id=row["id"],
            task=row["task"],
            source=row["source"],
            workflow=row["workflow"],
            date=row["date"],
            status=row["status"],
            confidence=row["confidence"],
            priority=row["priority"]
        ) for row in rows
    ]

    return success_response(data=history_items, message="Workflow history retrieved successfully.")

# 4. DELETE /history/{id} (Real SQLite Delete)
@router.delete("/history/{id}", response_model=APIResponse[DeleteHistoryResponse])
async def delete_history_real(id: str, db=Depends(get_db)):
    logger.info(f"DELETE /history/{id} called.")

    cursor = db.cursor()
    cursor.execute("DELETE FROM workflows WHERE id = ?", (id,))
    db.commit()

    data = DeleteHistoryResponse(
        id=id,
        status="deleted",
        message=f"Workflow history entry {id} deleted successfully."
    )

    return success_response(data=data, message=f"History record {id} removed.")
