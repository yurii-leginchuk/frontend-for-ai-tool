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

async def create_gmb(gmb_dict: dict):
    db = MongoDB.get_db()
    try:
        if not isinstance(gmb_dict, dict):
            raise ValueError("gmb_dict must be a dictionary")

        sanitized_data = serialize_for_mongo(gmb_dict)

        result = await db["gmb"].insert_one(sanitized_data)
        inserted_doc = await db["gmb"].find_one({"_id": result.inserted_id})
        if not inserted_doc:
            raise ValueError("Failed to retrieve inserted document")

        inserted_doc["id"] = str(inserted_doc["_id"])
        del inserted_doc["_id"]
        return inserted_doc

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create client: {str(e)}")


async def get_gmb():
    db = MongoDB.get_db()
    try:
        gmbs = []
        async for gmb in db["gmb"].find():
            gmb["id"] = str(gmb["_id"])
            del gmb["_id"]
            gmbs.append(gmb)
        return gmbs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch gmbs: {str(e)}")


async def get_gmb_by_id(gmb_id: str):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(gmb_id):
            raise HTTPException(status_code=400, detail="Invalid gmb ID format")

        gmb = await db["gmb"].find_one({"_id": ObjectId(gmb_id)})
        if not gmb:
            raise HTTPException(status_code=404, detail="Gmb not found")

        gmb["id"] = str(gmb["_id"])
        del gmb["_id"]
        return gmb
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve gmb: {str(e)}")


async def update_gmb(gmb_id: str, update_data: dict):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(gmb_id):
            raise HTTPException(status_code=400, detail="Invalid gmb ID format")

        if not isinstance(update_data, dict):
            raise HTTPException(status_code=400, detail="Invalid update data")

        sanitized_data = update_data.copy()
        if "link" in sanitized_data and isinstance(sanitized_data["link"], HttpUrl):
            sanitized_data["link"] = str(sanitized_data["link"])

        result = await db["gmb"].update_one(
            {"_id": ObjectId(gmb_id)},
            {"$set": sanitized_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="gmb not found")

        updated_gmb = await db["gmb"].find_one({"_id": ObjectId(gmb_id)})
        updated_gmb["id"] = str(updated_gmb["_id"])
        del updated_gmb["_id"]
        return updated_gmb
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update gmb: {str(e)}")


async def delete_gmb(gmb_id: str):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(gmb_id):
            raise HTTPException(status_code=400, detail="Invalid gmb ID format")

        result = await db["gmb"].delete_one({"_id": ObjectId(gmb_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="gmb not found")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete gmb: {str(e)}")
