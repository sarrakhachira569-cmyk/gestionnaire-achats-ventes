from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Create_categorie(BaseModel):
    title:str
    description:str

class CategorieUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

# Response (GET / PATCH / POST response)
class CategorieResponse(BaseModel):
    id:int
    title: str
    description: str
    is_active: bool
    status: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]
    class Config:
        from_attributes = True

    