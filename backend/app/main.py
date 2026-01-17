from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.db import create_db_and_tables
from app.api import api_router

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
)


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()  # create tables if they don't exist [web:31][web:37]


app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(o) for o in settings.BACKEND_CORS_ORIGINS] or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


app.include_router(api_router, prefix="/api")
