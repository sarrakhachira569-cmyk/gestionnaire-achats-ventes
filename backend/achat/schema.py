from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# =====================
# CREATE ACHAT
# =====================
class CreateAchat(BaseModel):
    fournisseur_id: int
    # ID du fournisseur

    produit_id: int
    # ID du produit

    quantite: int
    # Quantité achetée

    prix_unitaire_ht: Optional[float] = None # اختياري
    # Prix d'achat unitaire hors tax

    tva_achat: Optional[float] = None


# =====================
# UPDATE ACHAT
# =====================
class AchatUpdate(BaseModel):
    quantite: Optional[int] = None
    # Nouvelle quantité (optionnelle)

    prix_unitaire_ht: Optional[float] = None
    # Nouveau prix unitaire hors tax (optionnel)
    tva_achat: Optional[float] = None
    # Nouveau tva
    is_active: Optional[bool] = None
    # Activer / désactiver l'achat
    fournisseur_id: Optional[int] = None   # لو تحب تبدل الحريف
    produit_id: Optional[int] = None  # لو تحب تبدل المنتج



# =====================
# RESPONSE ACHAT
# =====================
class AchatResponse(BaseModel):
    id: int
    date_achat: datetime
    fournisseur_id: int
    fournisseur_lastname:str
    fournisseur_firstname:str
    produit_id: int
    produit_title:str
    quantite: int
    prix_unitaire_ht: float
    tva_achat: float
    prix_unitaire_ttc:float 
    prix_total: float
    is_active: bool
    status: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    class Config:
        from_attributes = True
        # Permet de convertir un objet SQLAlchemy en réponse JSON
