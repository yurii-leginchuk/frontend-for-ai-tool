from pydantic import BaseModel, HttpUrl
from typing import Optional, List

class ProjectIn(BaseModel):
    name: str
    client_id: str
    project_type: str
    focus: str
    about: str
    length: int
    keywords: List[str]
    # article: Optional[str]

    # Hidden fields
    date: Optional[str] = None
    last_update_date: Optional[str] = None
    status: Optional[str] = None

class ProjectOut(ProjectIn):
    id: str

class ProjectUpdateIn(BaseModel):
    name: Optional[str] = None
    client_id: Optional[str] = None
    project_type: Optional[str] = None
    focus: Optional[str] = None
    about: Optional[str] = None
    length: Optional[int] = None
    keywords: Optional[List[str]] = None
    status: Optional[str] = None
    date: Optional[str] = None
    last_update_date: Optional[str] = None


class ProjectUpdateOut(ProjectUpdateIn):
    id: str