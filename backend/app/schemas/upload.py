from pydantic import BaseModel
from typing import List, Optional

class UploadedFileMeta(BaseModel):
    id: str
    name: str
    size: str
    type: str
    status: str = "uploaded"

class UploadResponseData(BaseModel):
    batchId: str
    uploadedFiles: List[UploadedFileMeta]
    message: str = "Files uploaded and temporarily stored in session repository."
