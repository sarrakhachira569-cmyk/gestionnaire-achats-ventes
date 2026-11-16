from fastapi import APIRouter, Depends, HTTPException, status,File, UploadFile, Form
from sqlalchemy.orm import Session
from database import SessionLocal
from .model import Produit
from .schema import Create_produit, ProduitUpdate, ProduitResponse
from datetime import datetime
from categorie.model import Categorie
import os
from typing import Optional

router = APIRouter(prefix="/produits", tags=["produits"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# POST → Create Produit (بإستعمال Form و UploadFile مثل الـ User)
@router.post("/createproduit", response_model=ProduitResponse)
async def CreateProduit(
    title: str = Form(...),
    description: str = Form(...),
    quantite_initial: int = Form(...),
    quantite_restant: Optional[int] = Form(None),  # ✅ تصلحت
    prix_hors_tax: float = Form(...),
    tva: float = Form(...),
    categorie_id: int = Form(...),
    image: Optional[UploadFile] = File(None),  # التغيير هنا: أصبحت Optional و Default None
    db: Session = Depends(get_db)
):

    # Vérifier catégorie
    categorie = db.query(Categorie).filter(Categorie.id == categorie_id).first()
    if not categorie:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    
    if not categorie.is_active or categorie.status != "DISPONIBLE":
        raise HTTPException(status_code=400, detail="Impossible d'ajouter un produit dans une catégorie suspendue ou arrêtée")

    # Vérifier que prix et tva exist
    if prix_hors_tax is None or tva is None:
        raise HTTPException(status_code=400, detail="Prix ou TVA manquant")

    # Créer produit
    produit = Produit(
        title=title,
        description=description,
        quantite_initial=quantite_initial,
        quantite_restant=quantite_restant if quantite_restant is not None else quantite_initial,  # ✅ تصلحت
        image=None,
        prix_hors_tax=prix_hors_tax,
        tva=tva,
        categorie_id=categorie_id
    )

    produit.prix_ttc = produit.prix_hors_tax * (1 + produit.tva / 100)

    db.add(produit)
    db.commit()
    db.refresh(produit)

    # Upload image
    if image:
        upload_dir = "images"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_extension = image.filename.split(".")[-1] if image.filename else "jpg"  # ✅ protection
        file_name = f"prod_{produit.id}.{file_extension}"
        file_location = os.path.join(upload_dir, file_name)

        content = await image.read()
        with open(file_location, "wb") as f:
            f.write(content)
        
        produit.image = file_name
        db.commit()
        db.refresh(produit)

    return produit

# GET → All produits
@router.get("/", response_model=list[ProduitResponse])
def get_produits(db: Session = Depends(get_db)):
    return db.query(Produit).all()


# GET → Produit by ID
@router.get("/{produit_id}", response_model=ProduitResponse)
def get_produit(produit_id: int, db: Session = Depends(get_db)):
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return produit


# GET → Produit by title
@router.get("/by-title/{produit_title}", response_model=ProduitResponse)
def get_produit_title(produit_title: str, db: Session = Depends(get_db)):
    produit = db.query(Produit).filter(Produit.title == produit_title).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return produit


# PATCH → Update produit
@router.patch("/{produit_id}", response_model=ProduitResponse)
async def update_Produit(
    produit_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    quantite_initial: Optional[int] = Form(None),
    quantite_restant: Optional[int] = Form(None),
    prix_hors_tax: Optional[float] = Form(None),
    tva: Optional[float] = Form(None),
    is_active: Optional[bool] = Form(None),
    categorie_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    # --- نفس الـ Principe متاعك: التخزين المؤقت للكمية القديمة ---
    ancienne_initial = produit.quantite_initial 

    # --- تحديث البيانات النصية والأساسية ---
    if title is not None: produit.title = title
    if description is not None: produit.description = description
    if categorie_id is not None: produit.categorie_id = categorie_id
    if prix_hors_tax is not None: produit.prix_hors_tax = prix_hors_tax
    if tva is not None: produit.tva = tva
    
    # --- نفس الـ Condition متاعك بالضبط للكمية ---
    if quantite_initial is not None and quantite_restant is None:
        diff = quantite_initial - ancienne_initial
        produit.quantite_initial = quantite_initial
        produit.quantite_restant += diff
    
    elif quantite_restant is not None:
        produit.quantite_restant = quantite_restant
        if quantite_initial is not None:
            produit.quantite_initial = quantite_initial

    # --- تحديث الحالة (الـ Logic اللي زدناه) ---
    if is_active is not None:
        produit.is_active = is_active
        # الفازة اللي تفاهمنا فيها:
        if is_active is True:
            if produit.status in ["ARRETE", "SUSPENDU"]:
                produit.status = "DISPONIBLE"
                produit.deleted_at = None  # تفسخ تاريخ الحذف

    # --- معالجة الصورة ---
    if image:
        upload_dir = "images"
        os.makedirs(upload_dir, exist_ok=True)
        file_name = f"prod_{produit_id}.{image.filename.split('.')[-1]}"
        file_location = os.path.join(upload_dir, file_name)
        content = await image.read()
        with open(file_location, "wb") as f:
            f.write(content)
        produit.image = file_name

    # --- Recalcul TTC ---
    produit.prix_ttc = produit.prix_hors_tax * (1 + produit.tva / 100)

    # --- نفس الـ Conditions متاعك للـ Status قعدوا كيف ما هما ---
    # 1. Suspension admin
    if produit.is_active is False:
        produit.status = "SUSPENDU"

    # 2. Rupture stock
    if produit.quantite_restant is not None and produit.quantite_restant == 0:
        produit.status = "RUPTURE"
        produit.is_active = False
    elif produit.quantite_restant is not None and produit.quantite_restant > 0:
        if produit.status == "RUPTURE": 
            produit.status = "DISPONIBLE"
            produit.is_active = True

    db.commit()
    db.refresh(produit)
    return produit


# DELETE → Soft delete
@router.delete("/{produit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Produit(produit_id: int, db: Session = Depends(get_db)):
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    produit.is_active = False
    produit.status = "ARRETE"
    produit.deleted_at = datetime.now()
    db.commit()