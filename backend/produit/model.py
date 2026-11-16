from sqlalchemy import Column, Integer, String, Float,Boolean,DateTime
from sqlalchemy.sql import func
from database import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
class Produit(Base):
    __tablename__ = "produits"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    quantite_initial = Column(Integer, nullable=False)
    quantite_restant = Column(Integer, nullable=False)
    image = Column(String(255), nullable=True)
    prix_hors_tax = Column(Float, nullable=False)
    prix_ttc = Column(Float, nullable=True)
    tva = Column(Float, nullable=False)
    categorie_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    status = Column(String(20), default="DISPONIBLE")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime, nullable=True)
