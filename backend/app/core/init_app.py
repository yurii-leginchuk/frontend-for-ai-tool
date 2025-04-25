from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.clients_router import router as clients_router
from app.api.projects_router import router as projects_router
from app.api.websites_router import router as websites_router
from app.api.gmb_router import router as gmb_router
from app.db.mongo import MongoDB
from app.core.logging import setup_logging

def create_app() -> FastAPI:
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def add_cors_headers(request: Request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"

        response.headers["Content-Security-Policy"] = "upgrade-insecure-requests"

        return response

    app.include_router(clients_router, prefix="/clients", tags=["Clients"])
    app.include_router(projects_router, prefix="/projects", tags=["Projects"])
    app.include_router(gmb_router, prefix="/gmb", tags=["Gmb"])
    app.include_router(websites_router, prefix="/websites", tags=["Websites"])




    @app.on_event("startup")
    async def startup_db():
        try:
            await MongoDB.connect()
            print("MongoDB connection established successfully.")
        except Exception as e:
            print(f"Critical error during MongoDB connection: {e}")
            raise

    @app.on_event("shutdown")
    async def shutdown_db():
        try:
            await MongoDB.close()
            print("MongoDB connection closed.")
        except Exception as e:
            print(f"Error during MongoDB shutdown: {e}")

    setup_logging()

    return app