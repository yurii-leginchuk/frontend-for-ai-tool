from pydantic import BaseModel, HttpUrl
from typing import Optional

class WebsiteIn(BaseModel):
    domain: HttpUrl

    # Hidden fields
    date: Optional[str] = None
    last_update_date: Optional[str] = None
    status: Optional[str] = None

class WebsiteOut(WebsiteIn):
    id: str

