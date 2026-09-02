from pydantic import BaseModel


class DiscoverySettingsRequest(BaseModel):
    ageFrom: str
    ageTo: str
    location: str
    locationLatitude: float | None = None
    locationLongitude: float | None = None
    radiusKm: str = "50"


class DiscoverySettingsResponse(BaseModel):
    ageFrom: str
    ageTo: str
    location: str
    locationLatitude: float | None = None
    locationLongitude: float | None = None
    radiusKm: str


class InterestTag(BaseModel):
    id: str
    name: str


class PersonPreview(BaseModel):
    id: str
    age: str
    bio: str
    meta: list[str]
    name: str
    photo: str
    photos: list[str]
    tags: list[InterestTag]
