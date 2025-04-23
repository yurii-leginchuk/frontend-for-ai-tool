from fastapi import APIRouter, HTTPException
from app.models.project import ProjectIn, ProjectOut, ProjectUpdateIn, ProjectUpdateOut
from app.crud.projects import create_project, get_projects, get_project_by_id, update_project, delete_project
from typing import List

router = APIRouter()

@router.post("/create", response_model=ProjectOut)
async def create(client: ProjectIn):
    try:
        project_dict = client.model_dump()
        inserted_doc = await create_project(project_dict)
        return  ProjectOut(**inserted_doc)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@router.get("/", response_model=List[dict])
async def get_all():
    return await get_projects()

@router.get("/{project_id}", response_model=ProjectOut)
async def get_one(project_id: str):
    try:
        project = await get_project_by_id(project_id)
        return ProjectOut(**project)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get project: {str(e)}")

@router.put("/{project_id}", response_model=ProjectUpdateOut)
async def update_one(project_id: str, update_data: ProjectUpdateIn):
    try:
        updated = await update_project(project_id, update_data.model_dump())
        return ProjectUpdateOut(**updated)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update project: {str(e)}")

@router.delete("/{project_id}")
async def delete_one(project_id: str):
    try:
        await delete_project(project_id)
        return {"detail": "✅ Project deleted"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")