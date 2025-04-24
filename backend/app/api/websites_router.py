from fastapi import APIRouter, HTTPException
from app.models.website import WebsiteIn, WebsiteOut
from app.crud.websites import (
    create_website,
    get_websites,
    get_website_by_id,
    update_website,
    delete_website,
)
from typing import List

router = APIRouter()

@router.post("/create", response_model=WebsiteOut)
async def create(website: WebsiteIn):
    try:
        website_dict = website.model_dump()
        inserted_doc = await create_website(website_dict)
        return WebsiteOut(**inserted_doc)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create website: {str(e)}")


@router.get("/", response_model=List[WebsiteOut])
async def get_all():
    websites = await get_websites()
    return [WebsiteOut(**website) for website in websites]


@router.get("/{website_id}", response_model=WebsiteOut)
async def get_one(website_id: str):
    try:
        website = await get_website_by_id(website_id)
        return WebsiteOut(**website)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get website: {str(e)}")


@router.put("/{website_id}", response_model=WebsiteOut)
async def update_one(website_id: str, update_data: WebsiteIn):
    try:
        updated = await update_website(website_id, update_data.model_dump())
        return WebsiteOut(**updated)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update website: {str(e)}")


@router.delete("/{website_id}")
async def delete_one(website_id: str):
    try:
        await delete_website(website_id)
        return {"detail": "Website deleted"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete website: {str(e)}")
