from fastapi import HTTPException
from pydantic import HttpUrl

from app.db.mongo import MongoDB
from bson import ObjectId


def serialize_for_mongo(data: dict) -> dict:
    serialized = {}
    for key, value in data.items():
        if isinstance(value, HttpUrl):
            serialized[key] = str(value)
        else:
            serialized[key] = value
    return serialized

async def create_client(client_dict: dict):
    db = MongoDB.get_db()
    try:
        if not isinstance(client_dict, dict):
            raise ValueError("client_dict must be a dictionary")

        sanitized_data = serialize_for_mongo(client_dict)

        result = await db["clients"].insert_one(sanitized_data)
        inserted_doc = await db["clients"].find_one({"_id": result.inserted_id})
        if not inserted_doc:
            raise ValueError("Failed to retrieve inserted document")

        inserted_doc["id"] = str(inserted_doc["_id"])
        del inserted_doc["_id"]
        return inserted_doc

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create client: {str(e)}")


async def get_clients():
    db = MongoDB.get_db()
    try:
        clients = []
        async for client in db["clients"].find():
            client["id"] = str(client["_id"])
            del client["_id"]
            clients.append(client)
        return clients
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch clients: {str(e)}")


async def get_client_by_id(client_id: str):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(client_id):
            raise HTTPException(status_code=400, detail="Invalid client ID format")

        client = await db["clients"].find_one({"_id": ObjectId(client_id)})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        client["id"] = str(client["_id"])
        del client["_id"]
        return client
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve client: {str(e)}")


async def update_client(client_id: str, update_data: dict):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(client_id):
            raise HTTPException(status_code=400, detail="Invalid client ID format")

        if not isinstance(update_data, dict):
            raise HTTPException(status_code=400, detail="Invalid update data")

        sanitized_data = update_data.copy()
        if "link" in sanitized_data and isinstance(sanitized_data["link"], HttpUrl):
            sanitized_data["link"] = str(sanitized_data["link"])

        result = await db["clients"].update_one(
            {"_id": ObjectId(client_id)},
            {"$set": sanitized_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")

        updated_client = await db["clients"].find_one({"_id": ObjectId(client_id)})
        updated_client["id"] = str(updated_client["_id"])
        del updated_client["_id"]
        return updated_client
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update client: {str(e)}")


async def delete_client(client_id: str):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(client_id):
            raise HTTPException(status_code=400, detail="Invalid client ID format")

        result = await db["clients"].delete_one({"_id": ObjectId(client_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")

        await db["projects"].delete_many({"client_id": client_id})

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete client: {str(e)}")
