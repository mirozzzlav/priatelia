from pydantic import BaseModel


class LocationOption(BaseModel):
    id: str
    label: str
    latitude: float
    longitude: float
