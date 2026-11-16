from fastapi import FastAPI, Depends, HTTPException,status,APIRouter
from sqlalchemy.orm import Session
from database import SessionLocal
from .model import Categorie
from .schema import Create_categorie,CategorieUpdate,CategorieResponse
from datetime import datetime
router = APIRouter(prefix="/categories", tags=["categories"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/create",response_model=CategorieResponse)
def CreateCategorie(categorie_data:Create_categorie, db: Session = Depends(get_db)):
    categorie = Categorie(title=categorie_data.title,description=categorie_data.description)
    db.add(categorie)
    db.commit()
    db.refresh(categorie)
    return categorie

@router.get("/list",response_model=list[CategorieResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Categorie).all()
@router.get("/id/{categorie_id}", response_model=CategorieResponse)
def get_categorie(categorie_id: int, db: Session = Depends(get_db)):
    categories = db.query(Categorie).filter(Categorie.id == categorie_id).first()
    if not categories:
        raise HTTPException(status_code=404, detail="catégorie non trouvé")
    return categories
@router.get("/title/{categorie_title}", response_model=CategorieResponse)
def get_categorietitle(categorie_title:str, db: Session = Depends(get_db)):
    categori = db.query(Categorie).filter(Categorie.title == categorie_title).first()
    if not categori:
        raise HTTPException(status_code=404, detail="catégorie non trouvé")
    return categori
#methode patch
@router.patch("/update/{categorie_id}", response_model=CategorieResponse)
def update_Categorie(categorie_id: int, categorie_update: CategorieUpdate, db: Session = Depends(get_db)):
    categoriie = db.query(Categorie).filter(Categorie.id == categorie_id).first()
    if not categoriie:
        raise HTTPException(status_code=404, detail="catégorie non trouvé")
    
    # ناخذ الداتا ونقصّ اللي ما تبعثوش
    data = categorie_update.dict(exclude_unset=True)

    # حماية: ما نخليوش PATCH فارغ
    if not data:
        raise HTTPException(
            status_code=400,
            detail="Vous devez envoyer au moins un champ à mettre à jour"
        )    

    # نبدّل الحقول اللي بعثهم فقط
    for key, value in data.items():
        setattr(categoriie, key, value)

    # --- التعديل اللي حاجتك بيه لهنا ---
    
    if "is_active" in data:
        if data["is_active"] is True:
            # إذا رجعناها True، السيستيم ينظف الحالة ويرجعها متوفرة
            categoriie.status = "DISPONIBLE"
            categoriie.deleted_at = None  # يفسخ تاريخ الحذف باش يتنحى اللون الأحمر من الـ Table
        else:
            # إذا رديناها False، يولي معلق
            categoriie.status = "SUSPENDU"

    # نحفظ التغييرات في DB
    db.commit()
    db.refresh(categoriie)
    return categoriie
# SOFT DELETE
@router.delete("/delete/{categorie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Categorie(categorie_id: int, db: Session = Depends(get_db)):
    Categorieees = db.query(Categorie).filter(Categorie.id == categorie_id).first()
    if not Categorieees:
        raise HTTPException(status_code=404, detail=" Catégorie non trouvé")

    Categorieees.is_active = False
    Categorieees.status = "ARRETE"
    Categorieees.deleted_at = datetime.now()# Enregistrer la date de suppression  de categorie avec l'heure locale
    db.commit() 