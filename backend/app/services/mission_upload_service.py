import os
import datetime
import sqlite3
from typing import Dict, Any, List
from fastapi import UploadFile, HTTPException

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB limit
ALLOWED_EXTENSIONS = {"pdf", "docx", "txt", "png", "jpg", "jpeg"}

STORAGE_PATH = "./storage/missions"
os.makedirs(STORAGE_PATH, exist_ok=True)

def format_file_size(size_bytes: int) -> str:
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"

def generate_mission_id(conn: sqlite3.Connection) -> str:
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM missions")
    count = cursor.fetchone()[0] + 1
    year = datetime.datetime.now().year
    return f"ORB-{year}-{count:06d}"

async def process_mission_upload(file: UploadFile, conn: sqlite3.Connection) -> Dict[str, Any]:
    # 1. Empty upload check
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="Empty upload. Please select a valid document.")

    filename = file.filename
    ext = filename.split(".")[-1].lower() if "." in filename else ""

    # 2. File type validation
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '.{ext}'. Supported formats: PDF, DOCX, TXT, PNG, JPG."
        )

    # 3. Read file content & validate size
    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size == 0:
        raise HTTPException(status_code=400, detail="File is empty (0 bytes). Upload failed.")

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of 25MB (Uploaded: {format_file_size(file_size)})."
        )

    # 4. Generate Mission ID & Storage Path
    mission_id = generate_mission_id(conn)
    now_iso = datetime.datetime.utcnow().isoformat() + "Z"
    date_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    
    file_storage_name = f"{mission_id}_{filename}"
    file_storage_path = os.path.join(STORAGE_PATH, file_storage_name)

    with open(file_storage_path, "wb") as f:
        f.write(file_bytes)

    formatted_size = format_file_size(file_size)
    file_type_upper = ext.upper()

    # 5. Insert Mission Record into SQLite Database
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO missions (
            mission_id, original_filename, file_type, file_size,
            status, upload_time, storage_path, current_stage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            mission_id,
            filename,
            file_type_upper,
            formatted_size,
            "Uploaded",
            now_iso,
            file_storage_path,
            "Planner Agent queued."
        )
    )

    # Also log workflow entry for UI history compatibility
    cursor.execute(
        """
        INSERT INTO workflows (id, task, source, workflow, date, status, confidence, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            mission_id,
            f"Mission {mission_id}: {filename}",
            filename,
            "Document Extraction",
            date_str,
            "Uploaded",
            95,
            "High"
        )
    )

    conn.commit()

    return {
        "missionId": mission_id,
        "fileName": filename,
        "fileType": file_type_upper,
        "fileSize": formatted_size,
        "status": "Uploaded",
        "createdAt": now_iso,
        "nextStep": "Planner Agent queued."
    }
