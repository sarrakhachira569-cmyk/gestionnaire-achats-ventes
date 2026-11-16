from fastapi import FastAPI, Depends, HTTPException,status,APIRouter
from sqlalchemy.orm import Session
from database import  SessionLocal
from .model import Fournisseur
from .schema import Create_Fournisseur,FournisseurUpdate,FournisseurResponse
from datetime import datetime
router = APIRouter(prefix="/fournisseurs", tags=["fournisseurs"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# methode post        
@router.post("/",response_model=FournisseurResponse)
def Create_fournisseur(fournisseur_data:Create_Fournisseur, db: Session = Depends(get_db)):
    fournisseur = Fournisseur(firstname=fournisseur_data.firstname,lastname=fournisseur_data.lastname,email=fournisseur_data.email,tel=fournisseur_data.tel,adresse=fournisseur_data.adresse)
    db.add(fournisseur)
    db.commit()
    db.refresh(fournisseur)
    return fournisseur
# methode get all
@router.get("/",response_model=list[FournisseurResponse])
def get_fournisseurs(db: Session = Depends(get_db)):
    return db.query(Fournisseur).all()
# methode get by firstname    
@router.get("/by-firstname/{fournisseur_firstname}", response_model=FournisseurResponse)
def get_fournisseurname(fournisseur_firstname: str, db: Session = Depends(get_db)):
    fournisseuree = db.query(Fournisseur).filter(Fournisseur.firstname == fournisseur_firstname).first()
    if not fournisseuree:
        raise HTTPException(status_code=404, detail="fournisseur non trouvé")
    return fournisseuree
# methode get by id   
@router.get("/{fournisseur_id}",response_model=FournisseurResponse)
def get_fournisseurid(fournisseur_id: int, db: Session = Depends(get_db)):
    fournisseure = db.query(Fournisseur).filter(Fournisseur.id == fournisseur_id).first()
    if not fournisseure:
        raise HTTPException(status_code=404, detail="fournisseur non trouvé")
    return fournisseure
#methode patch
@router.patch("/{fournisseur_id}", response_model=FournisseurResponse)
def update_fournisseur(fournisseur_id: int, fournisseur_update: FournisseurUpdate, db: Session = Depends(get_db)):
    # نجيب العميل اللي باش نبدلو 
    fournisseureeee = db.query( Fournisseur).filter(Fournisseur.id== fournisseur_id).first()
    if not fournisseureeee:
        raise HTTPException(status_code=404, detail=" fournisseur non trouvé")

    # ناخذ الداتا ونقصّ اللي ما تبعثوش
    data = fournisseur_update.dict(exclude_unset=True)

    # حماية: ما نخليوش PATCH فارغ
    if not data:
        raise HTTPException(
            status_code=400,
            detail="Vous devez envoyer au moins un champ à mettre à jour"
            # "لازم تبعث على الأقل حقل واحد للتحديث" lazim au moin n8ayer 7aja
        )    

    # نبدّل الحقول اللي بعثهم فقط
    for key, value in data.items():
        setattr(fournisseureeee, key, value)    
    # --- التعديل اللي حاجتك بيه لهنا ---
    
    if "is_active" in data:
        if data["is_active"] is True:
            # إذا رجعناها True، السيستيم ينظف الحالة ويرجعها متوفرة
            fournisseureeee.status = "ACTIF"
            fournisseureeee.deleted_at = None  # يفسخ تاريخ الحذف باش يتنحى اللون الأحمر من الـ Table
        else:
            # blocage administratif  
            fournisseureeee.status = "BLOQUE" 
    # نحفظ التغييرات في DB
    db.commit()
    db.refresh(fournisseureeee)  # نجيب object محدث
    return fournisseureeee  
# SOFT DELETE
@router.delete("/{fournisseur_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_fournisseur(fournisseur_id: int, db: Session = Depends(get_db)):
    Fournisseursexx = db.query(Fournisseur).filter(Fournisseur.id ==  fournisseur_id).first()
    if not Fournisseursexx:
        raise HTTPException(status_code=404, detail=" fournisseur non trouvé")

    Fournisseursexx.is_active = False
    Fournisseursexx.status = "SUPPRIMEE"
    Fournisseursexx.deleted_at = datetime.now()# Enregistrer la date de suppression  de fournisseur avec l'heure locale
    db.commit()  