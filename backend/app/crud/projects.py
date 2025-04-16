from fastapi import HTTPException
from app.db.mongo import MongoDB
from bson import ObjectId

async def create_project(project_dict: dict):
    db = MongoDB.get_db()
    try:
        # Validate input type
        if not isinstance(project_dict, dict):
            raise ValueError("project_dict must be a dictionary")
        # Insert the document
        result = await db["projects"].insert_one(project_dict)
        # Fetch the inserted document
        inserted_doc = await db["projects"].find_one({"_id": result.inserted_id})
        if not inserted_doc:
            raise ValueError("Failed to retrieve inserted document")
        # Convert ObjectId to string
        inserted_doc["id"] = str(inserted_doc["_id"])
        # Remove _id to avoid duplication in ProjectOut
        del inserted_doc["_id"]
        return inserted_doc
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")


async def get_projects():
    db = MongoDB.get_db()
    try:
        clients = []
        async for client in db["projects"].find():
            client["id"] = str(client["_id"])
            del client["_id"]
            clients.append(client)
        return clients
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")


async def get_project_by_id(project_id: str):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(project_id):
            raise HTTPException(status_code=400, detail="Invalid project ID format")

        project = await db["projects"].find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        project["id"] = str(project["_id"])
        del project["_id"]
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve project: {str(e)}")


async def update_project(project_id: str, update_data: dict):
    db = MongoDB.get_db()
    try:
        if not ObjectId.is_valid(project_id):
            raise HTTPException(status_code=400, detail="Invalid project ID format")
        if not isinstance(update_data, dict):
            raise HTTPException(status_code=400, detail="Invalid update data")

        result = await db["projects"].update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")

        updated_project = await db["projects"].find_one({"_id": ObjectId(project_id)})
        updated_project["id"] = str(updated_project["_id"])
        del updated_project["_id"]
        return updated_project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update project: {str(e)}")

async def delete_project(project_id: str):
    db = MongoDB.get_db()
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID format")
    result = await db["projects"].delete_one({"_id": ObjectId(project_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")