from pydantic import BaseModel
from datetime import datetime
from typing import Optional 
class Create_client(BaseModel):
    firstname: str
    lastname:str
    email: str
    tel:str
    adresse: Optional[str] = None
class ClientUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: Optional[str] = None
    tel: Optional[str] = None
    adresse: Optional[str] = None
    is_active: Optional[bool] = None
# Response (GET / PATCH / POST response)
class ClientResponse(BaseModel):
    id:int
    firstname: str
    lastname: str
    email: str
    tel: str
    adresse: Optional[str]
    is_active: bool
    status: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]
    class Config:
        from_attributes=True  
  
