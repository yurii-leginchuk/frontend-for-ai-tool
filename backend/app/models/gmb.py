from pydantic import BaseModel, HttpUrl
from typing import Optional

class GmbIn(BaseModel):
    name: str
    client_id: str

    # Hidden fields
    date: Optional[str] = None
    last_update_date: Optional[str] = None
    status: Optional[str] = None

class GmbOut(GmbIn):
    id: str