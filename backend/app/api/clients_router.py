from fastapi import APIRouter, HTTPException
from app.models.client import ClientIn, ClientOut
from app.crud.clients import (
    create_client,
    get_clients,
    get_client_by_id,
    update_client,
    delete_client,
)
from typing import List

router = APIRouter()

@router.post("/create", response_model=ClientOut)
async def create(client: ClientIn):
    try:
        client_dict = client.model_dump()
        inserted_doc = await create_client(client_dict)
        return ClientOut(**inserted_doc)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create client: {str(e)}")


@router.get("/", response_model=List[dict])
async def get_all():
    return await get_clients()


@router.get("/{client_id}", response_model=ClientOut)
async def get_one(client_id: str):
    try:
        client = await get_client_by_id(client_id)
        return ClientOut(**client)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get client: {str(e)}")


@router.put("/{client_id}", response_model=ClientOut)
async def update_one(client_id: str, update_data: ClientIn):
    try:
        updated = await update_client(client_id, update_data.model_dump())
        return ClientOut(**updated)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update client: {str(e)}")


@router.delete("/{client_id}")
async def delete_one(client_id: str):
    try:
        await delete_client(client_id)
        return {"detail": "Client deleted"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete client: {str(e)}")
