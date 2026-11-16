from pydantic import BaseModel
from datetime import datetime
from typing import Optional
class Create_produit(BaseModel):
    title:str
    description :str
    quantite_initial :int#quantité eli 3indi min lawil
    quantite_restant:int#quantité eli fouthltli ba3id el vente wla ken chrite 7aja zada min el fournisseur ttsajil hni
    image: Optional[str] = None
    prix_hors_tax:float
    tva:float
    categorie_id: int
class ProduitUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    quantite_initial: Optional[int] = None
    quantite_restant: Optional[int] = None
    image: Optional[str] = None
    prix_hors_tax: Optional[float] = None
    tva: Optional[float] = None
    is_active: Optional[bool] = None
    categorie_id: Optional[int] = None
# Response (GET / PATCH / POST response)
class ProduitResponse(BaseModel):
    id:int
    title: str
    description: str
    quantite_initial: int
    quantite_restant: int
    image:Optional[str]
    prix_hors_tax:float
    prix_ttc: Optional[float]
    tva:float
    categorie_id: int
    status: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None
    class Config:
        from_attributes=True
      



