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


async def create_website(website_dict: dict):
    db = MongoDB.get_db()
    try:
        if not isinstance(website_dict, dict):
            raise ValueError("website_dict must be a dictionary")

        sanitized_data = serialize_for_mongo(website_dict)

        result = await db["websites"].insert_one(sanitized_data)
        inserted_doc = await db["websites"].find_one({"_id": result.inserted_id})
        if not inserted_doc:
            raise ValueError("Failed to retrieve inserted document")

        inserted_doc["id"] = str(inserted_doc["_id"])
        del inserted_doc["_id"]
        return inserted_doc

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create website: {str(e)}")


async def get_websites():
    db = MongoDB.get_db()
    try:
        websites = []
        async for website in db["websites"].find():
            website["id"] = str(website["_id"])
            del website["_id"]
            websites.append(website)
        return websites
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch websites: {str(e)}")


async def get_website_by_id(website_id: str):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(website_id):
            raise HTTPException(status_code=400, detail="Invalid website ID format")

        website = await db["websites"].find_one({"_id": ObjectId(website_id)})
        if not website:
            raise HTTPException(status_code=404, detail="Website not found")

        website["id"] = str(website["_id"])
        del website["_id"]
        return website
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve website: {str(e)}")


async def update_website(website_id: str, update_data: dict):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(website_id):
            raise HTTPException(status_code=400, detail="Invalid website ID format")

        if not isinstance(update_data, dict):
            raise HTTPException(status_code=400, detail="Invalid update data")

        sanitized_data = update_data.copy()
        if "domain" in sanitized_data and isinstance(sanitized_data["domain"], HttpUrl):
            sanitized_data["domain"] = str(sanitized_data["domain"])

        result = await db["websites"].update_one(
            {"_id": ObjectId(website_id)},
            {"$set": sanitized_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Website not found")

        updated_website = await db["websites"].find_one({"_id": ObjectId(website_id)})
        updated_website["id"] = str(updated_website["_id"])
        del updated_website["_id"]
        return updated_website
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update website: {str(e)}")


async def delete_website(website_id: str):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(website_id):
            raise HTTPException(status_code=400, detail="Invalid website ID format")

        result = await db["websites"].delete_one({"_id": ObjectId(website_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Website not found")

        await db["projects"].delete_many({"website_id": website_id})

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete website: {str(e)}")