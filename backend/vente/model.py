from sqlalchemy import Column, Integer, Float, Boolean, DateTime, ForeignKey, String 
from sqlalchemy.sql import func
from database import Base

class Vente(Base):
    __tablename__ = "ventes"

    id = Column(Integer, primary_key=True, index=True)
    date_vente = Column(DateTime, server_default=func.now()) #on met automatiquement la date et l'heure actuelles
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    produit_id = Column(Integer, ForeignKey("produits.id"), nullable=False)
    quantite = Column(Integer, nullable=False)
    prix_unitaire_ht = Column(Float, nullable=False)
    tva_vente = Column(Float, nullable=False)
    prix_unitaire_ttc = Column(Float, nullable=False)
    # سوم القطعة الواحدة شامل الأداء (TTC)
    # اللي هو: HT + (HT * TVA / 100)
    prix_total = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    status = Column(String(20), default="CONFIRMEE")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime, nullable=True)