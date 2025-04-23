from fastapi import APIRouter, HTTPException
from app.models.gmb import GmbIn, GmbOut, GmbUpdateOut, GmbUpdateIn
from app.crud.gmb import  create_gmb, get_gmb, get_gmb_by_id, update_gmb, delete_gmb
from typing import List

router = APIRouter()

@router.post("/create", response_model=GmbOut)
async def create(client: GmbIn):
    try:
        gmb_dict = client.model_dump()
        inserted_doc = await create_gmb(gmb_dict)
        return  GmbOut(**inserted_doc)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Gmb: {str(e)}")

@router.get("/", response_model=List[dict])
async def get_all():
    return await get_gmb()

@router.get("/{gmb_id}", response_model=GmbOut)
async def get_one(gmb_id: str):
    try:
        gmb = await get_gmb_by_id(gmb_id)
        return GmbOut(**gmb)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get Gmb: {str(e)}")

@router.put("/{gmb_id}", response_model=GmbUpdateOut)
async def update_one(gmb_id: str, update_data: GmbUpdateIn):
    try:
        updated = await update_gmb(gmb_id, update_data.model_dump())
        return GmbUpdateOut(**updated)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update Gmb: {str(e)}")

@router.delete("/{gmb_id}")
async def delete_one(gmb_id: str):
    try:
        await delete_gmb(gmb_id)
        return {"detail": "✅ Gmb deleted"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete Gmb: {str(e)}")