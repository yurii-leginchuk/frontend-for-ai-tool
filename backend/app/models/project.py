from pydantic import BaseModel, HttpUrl
from typing import Optional

class ProjectIn(BaseModel):
    name: str
    client_id: str
    project_type: str

    # Hidden fields
    date: Optional[str] = None
    last_update_date: Optional[str] = None
    status: Optional[str] = None

class ProjectOut(ProjectIn):
    id: str