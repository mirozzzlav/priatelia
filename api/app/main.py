from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.auth.router import router as auth_router
from app.modules.chats.router import router as chats_router
from app.modules.discovery.router import router as discovery_router
from app.modules.locations.router import router as locations_router
from app.modules.matching.router import router as matching_router
from app.modules.media.router import router as media_router
from app.modules.profiles.router import router as profiles_router
from app.shared.config.settings import get_settings
from app.shared.database.connection import close_database_pool, open_database_pool


@asynccontextmanager
async def lifespan(app: FastAPI):
    await open_database_pool()
    yield
    await close_database_pool()


settings = get_settings()

app = FastAPI(
    title="Priatelia API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profiles_router)
app.include_router(locations_router)
app.include_router(discovery_router)
app.include_router(matching_router)
app.include_router(media_router)
app.include_router(chats_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
