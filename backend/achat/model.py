from sqlalchemy import Column, Integer, Float, Boolean, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from database import Base

class Achat(Base):
    __tablename__ = "achats"  # Nom de la table dans la base de données

    id = Column(Integer, primary_key=True, index=True)
    # ID unique de l'achat (clé primaire)

    date_achat = Column(DateTime, server_default=func.now())
    # Date et heure de l'achat
    # Le système l'enregistre automatiquement

    fournisseur_id = Column(Integer, ForeignKey("fournisseurs.id"), nullable=False)
    # ID du fournisseur (clé étrangère)

    produit_id = Column(Integer, ForeignKey("produits.id"), nullable=False)
    # ID du produit acheté (clé étrangère)

    quantite = Column(Integer, nullable=False)
    # Quantité achetée
    
    prix_unitaire_ht = Column(Float, nullable=False)
    # سوم القطعة الواحدة من غير أداء (Hors Taxe)

    tva_achat = Column(Float, nullable=False)
    # نسبة الأداء اللي طبقت وقت الشراء (مثلا 19.0)
    # سجلناها هنا باش تبقى أرشيف حتى لو تبدلت في جدول المنتج

    prix_unitaire_ttc = Column(Float, nullable=False)
    # سوم القطعة الواحدة شامل الأداء (TTC)
    # اللي هو: HT + (HT * TVA / 100)

    prix_total = Column(Float, nullable=False)
    # المجموع النهائي للعملية = quantite * prix_unitaire_ttc

    is_active = Column(Boolean, default=True)
    # True = achat actif(par defaut)
    # False = achat annulé(update) ou supprimé (soft delete)

    status = Column(String(20), default="CONFIRMEE")
    # Etat de l'achat : CONFIRMEE / ANNULEE / SUPPRIMEE

    created_at = Column(DateTime, server_default=func.now())
    # Date de création de l'enregistrement

    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    # Date de la dernière modification

    deleted_at = Column(DateTime, nullable=True)
    # Date de suppression logique (soft delete)
