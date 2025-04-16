from pydantic import BaseModel, HttpUrl
from typing import Optional

class ClientIn(BaseModel):
    name: str
    link: HttpUrl
    about_descriptions: str
    services: str
    google_my_business_ids: str
    client_related_information: str
    tone_for_blogs: str
    tone_for_articles: str

    # Hidden fields
    date: Optional[str] = None
    last_update_date: Optional[str] = None
    amazon_about_id: Optional[str] = None
    amazon_services_id: Optional[str] = None
    amazon_google_my_business_descriptions: Optional[str] = None
    amazon_google_my_business_id: Optional[str] = None
    amazon_tone_for_blogs: Optional[str] = None
    amazon_tone_for_articles: Optional[str] = None
    amazon_project_id: Optional[str] = None
    status: Optional[str] = None
    errors: Optional[str] = None

class ClientOut(ClientIn):
    id: str