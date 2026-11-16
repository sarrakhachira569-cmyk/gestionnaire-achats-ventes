from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# CREATE
class CreateVente(BaseModel):
    client_id: int
    produit_id: int
    quantite: int
    prix_unitaire_ht: Optional[float] = None  # اختياري
    tva_vente: Optional[float] = None
    
# UPDATE
class VenteUpdate(BaseModel):
    quantite: Optional[int] = None
    prix_unitaire_ht: Optional[float] = None
    tva_vente: Optional[float] = None
    # Nouveau tva
    is_active: Optional[bool] = None
    client_id: Optional[int] = None   # لو تحب تبدل الحريف
    produit_id: Optional[int] = None  # لو تحب تبدل المنتج
# RESPONSE
class VenteResponse(BaseModel):
    id: int
    date_vente: datetime
    client_id: int
    client_lastname:str
    client_firstname:str
    produit_id: int
    produit_title:str
    quantite: int
    prix_unitaire_ht: float
    tva_vente:float
    prix_unitaire_ttc:float
    prix_total: float
    is_active: bool
    status: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    class Config:
        from_attributes = True