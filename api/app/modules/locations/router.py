from fastapi import APIRouter

from app.modules.locations.schemas import LocationOption
from app.modules.locations.service import search_locations

router = APIRouter(tags=["locations"])


@router.get("/locations")
async def list_location_options(query: str = "") -> list[LocationOption]:
    return await search_locations(query)
