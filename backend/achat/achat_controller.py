from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from .model import Achat
from .schema import CreateAchat, AchatUpdate, AchatResponse
from datetime import datetime # Importer datetime pour gérer les dates et heures (ex: date de suppression)
#استوردنا datetime كيما وقت التفصيخ وقت كي نحبّو نسجّلوا باش 
#👉 باش نتصرفوا في الوقت والتواريخ
from produit.model import Produit
from Fournisseur.model import Fournisseur
router = APIRouter(prefix="/achats", tags=["achats"])

# =====================
# Connexion DB
# =====================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================
# POST → Créer un achat
# =====================
@router.post("/create", response_model=AchatResponse)
def create_achat(achat_data: CreateAchat, db: Session = Depends(get_db)):

    #  جيب المنتج
    produit = db.query(Produit).filter(Produit.id == achat_data.produit_id).first()
    # لو كانAdmin الـ يغلط ويدخل id متاع منتج مش موجود.
    if not produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    if achat_data.quantite <= 0:
        raise HTTPException(status_code=400, detail="La quantité doit être supérieure à zéro")     

   #  Vérifier que le fournisseur existe et est actif
    fournisseur_obj = db.query(Fournisseur).filter(
    Fournisseur.id == achat_data.fournisseur_id,
    Fournisseur.is_active == True
    ).first()
    if not fournisseur_obj:
        raise HTTPException(status_code=400, detail="Fournisseur invalide ou inactif")
    
    # 1. نعطو قيم أولية من جدول المنتج (باش نكونو في الأمان)
    final_prix_unitaire_ht = produit.prix_hors_tax
    tva_actuelle = produit.tva

    # 2. إذا المستخدم بعث HT بيده، نبدلو القيمة الأولية
    if achat_data.prix_unitaire_ht is not None:
        final_prix_unitaire_ht = achat_data.prix_unitaire_ht

    # 3. إذا المستخدم بعث TVA بيده، نبدلو القيمة الأولية
    if achat_data.tva_achat is not None:
        tva_actuelle = achat_data.tva_achat

    final_prix_unitaire_ttc = final_prix_unitaire_ht * (1 + tva_actuelle / 100)    
    # Calcul automatique du prix total
    prix_total = achat_data.quantite * final_prix_unitaire_ttc

    # Création de l'objet Achat
    achat = Achat(
        fournisseur_id=achat_data.fournisseur_id,
        produit_id=achat_data.produit_id,
        quantite=achat_data.quantite,
        prix_unitaire_ht=final_prix_unitaire_ht,    # السعر الصافي
        tva_achat=tva_actuelle,                    # نسبة الأداء المسجلة
        prix_unitaire_ttc=final_prix_unitaire_ttc,  # السعر مع الأداء
        prix_total=prix_total,
        status="CONFIRMEE"
    )

    # السطر السحري: زيد الكمية في الـ Produit
    produit.quantite_restant += achat_data.quantite
    #etha ken el produit m3adich minh w ana 3awidit chritt minh
    if produit.status == "RUPTURE" and produit.quantite_restant > 0:
        produit.status = "DISPONIBLE"
        produit.is_active = True

    db.add(achat)
    db.commit()
    db.refresh(achat)
    # 🛡️ السطور السحرية اللي باش تنحي الـ Error 500 🛡️
    # نحولو الـ Object لـ Dictionary ونزيدو فيه الأسامي يدوياً
    achat_res = achat.__dict__.copy()
    achat_res["fournisseur_lastname"] = fournisseur_obj.lastname
    achat_res["fournisseur_firstname"] = fournisseur_obj.firstname
    achat_res["produit_title"] = produit.title # ثبت كان إسمه title_produit بدلها

    return achat_res

    


# =====================
# GET → Tous les achats
# =====================
@router.get("/", response_model=list[AchatResponse])
def get_all_achats(db: Session = Depends(get_db)):
     # نربطو الجداول ببعضهم باش ناخذو البيانات من الـ 3 بلايص
    results = db.query(Achat, Fournisseur, Produit).\
        join(Fournisseur, Achat.fournisseur_id == Fournisseur.id).\
        join(Produit, Achat.produit_id == Produit.id).all()

    final_achats = []
    for achat, fournisseur, produit in results:
        achat_data = achat.__dict__ # نحولو الـ object لـ dictionary
        # نزيدو الأسامي يدوياً للـ dictionary
        achat_data["fournisseur_lastname"] = fournisseur.lastname
        achat_data["fournisseur_firstname"] = fournisseur.firstname
        achat_data["produit_title"] = produit.title
        final_achats.append(achat_data)

    return final_achats 



# =====================
# GET → Achat par ID
# =====================
@router.get("/{achat_id}", response_model=AchatResponse)
def get_achat_by_id(achat_id: int, db: Session = Depends(get_db)):

    result = db.query(Achat, Fournisseur, Produit).\
        join(Fournisseur, Achat.fournisseur_id == Fournisseur.id).\
        join(Produit, Achat.produit_id == Produit.id).\
        filter(Achat.id == achat_id).first()

    if not result:
        raise HTTPException(status_code=404, detail="Achat non trouvée")

    achat, fournisseur, produit = result
    achat_data = achat.__dict__
    achat_data["fournisseur_lastname"] = fournisseur.lastname
    achat_data["fournisseur_firstname"] = fournisseur.firstname
    achat_data["produit_title"] = produit.title
    
    return achat_data
# =============================================
# MÉTHODE GET → Get achats par fournisseur_id:
# =============================================   
@router.get("/by-fournisseur/{fournisseur_id}", response_model=list[AchatResponse])#👉 route  متع كل عمليات الشراء  تجيب fournisseur معيّن
def get_achats_by_fournisseur(
    fournisseur_id: int, 
    db: Session = Depends(get_db)
):
    # Récupérer toutes les achats d’un fournisseur
    achats = db.query(Achat).filter(Achat.fournisseur_id== fournisseur_id).all()

    # Si aucune achat trouvée
    if not achats:
        raise HTTPException(
            status_code=404,
            detail="Aucun achat pour ce fournisseur"
        )

    return achats

# =====================
# PATCH → Update achat
# =====================
@router.patch("/{achat_id}", response_model=AchatResponse)
def update_achat(
    achat_id: int,
    achat_update: AchatUpdate,
    db: Session = Depends(get_db)
):
    achat = db.query(Achat).filter(Achat.id == achat_id).first()

    if not achat:
        raise HTTPException(status_code=404, detail="Achat non trouvé")
    if not achat.is_active or achat.status == "SUPPRIMEE":
        raise HTTPException(status_code=400, detail="Modification impossible : Cet achat est supprimé ou annulé. Pour corriger une erreur de saisie, veuillez effectuer une nouvelle opération d'achat.")    

    # 🔹 خزن الكمية القديمة قبل أي تعديل
    ancienne_quantite = achat.quantite    

    data = achat_update.dict(exclude_unset=True)

    if not data:
        raise HTTPException(status_code=400, detail="Aucun champ à modifier")
    if "quantite" in data and data["quantite"] <= 0:
        raise HTTPException(status_code=400, detail="La quantité doit être supérieure à zéro")     

    for key, value in data.items():
        setattr(achat, key, value)

   # Recalcul TTC - زيد الـ "or 0" هذي باش تمنع الـ Crash
    if "prix_unitaire_ht" in data or "tva_achat" in data:
        ht = achat.prix_unitaire_ht or 0
        tva = achat.tva_achat or 0
        achat.prix_unitaire_ttc = ht * (1 + tva / 100)   

    produit = db.query(Produit).filter(Produit.id == achat.produit_id).first()
    if produit:
         # الحالة 1: إلغاء العملية
        if "is_active" in data and data["is_active"] is False :
        # تثبت قبل لا ينقص الـ stock بالسالب
        # نثبتوا قبل ما نلغيوا: هل الستوك يكفي باش ننقصوا منو السلعة اللي تملغات؟
            if produit.quantite_restant < ancienne_quantite:
                 raise HTTPException(
                    status_code=400,
                    detail=f"Annulation impossible: le stock actuel ({produit.quantite_restant}) est insuffisant."
                )
            produit.quantite_restant -= ancienne_quantite
            achat.status = "ANNULEE"
            if produit.quantite_restant == 0:
                produit.status = "RUPTURE"
                produit.is_active = False
        # الحالة 2: تبديل الكمية فقط
        elif "quantite" in data:
            difference = achat.quantite - ancienne_quantite
            # التعديل: تثبت لو النقصان (الفرق بالسالب) باش يفرغ الستوك
            if produit.quantite_restant + difference < 0:
                raise HTTPException(
                    status_code=400,
                    detail=f"Modification impossible: le stock actuel ({produit.quantite_restant}) ne permet pas de réduire la quantité de cet achat."
                )
            produit.quantite_restant += difference
            if produit.quantite_restant > 0:
                produit.status = "DISPONIBLE"
                produit.is_active = True
            elif produit.quantite_restant == 0:
                produit.status = "RUPTURE"
                produit.is_active = False 
    # Recalcul du prix total
    if any(k in data for k in ["quantite", "prix_unitaire_ht", "tva_achat"]):
        qte = achat.quantite or 0
        ttc = achat.prix_unitaire_ttc or 0
        achat.prix_total = qte * ttc

    db.commit()
    db.refresh(achat)

    fournisseur_obj = db.query(Fournisseur).filter(Fournisseur.id == achat.fournisseur_id).first()
    produit_obj = db.query(Produit).filter(Produit.id == achat.produit_id).first()
    
   # 2. حضّر الـ data بطريقة ما تعملش Error 500
    # نحولو لـ dict ونحيوا الحاجات الزايدة متاع SQLAlchemy
    res_data = vars(achat).copy()
    res_data.pop('_sa_instance_state', None)

    # 3. زيد المعلومات اللي تحب عليهم مع تثبيت إنهم موجودين (anti-crash)
    res_data["fournisseur_lastname"] = fournisseur_obj.lastname if fournisseur_obj else "Inconnu"
    res_data["fournisseur_firstname"] = fournisseur_obj.firstname if fournisseur_obj else ""
    res_data["produit_title"] = produit_obj.title if produit_obj else "Produit inconnu"
    
    # هكا الـ FastAPI يرجع JSON نظيف ومستحيل يخرجلك Error 500
    return res_data

# =====================
# DELETE → Soft delete
# =====================
@router.delete("/{achat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_achat(achat_id: int, db: Session = Depends(get_db)):
    # 1. التثبت من وجود عملية الشراء
    achat = db.query(Achat).filter(Achat.id == achat_id).first()
    if not achat:
        raise HTTPException(status_code=404, detail="Achat non trouvé")
    if not achat.is_active or achat.status == "SUPPRIMEE":
        raise HTTPException(
        status_code=400, 
        detail="Operation impossible: Cet achat est déjà supprimé  ou annulé."
    )     
   
    # 2. جيب المنتج المرتبط
    produit = db.query(Produit).filter(Produit.id == achat.produit_id).first()
    
    if produit:
        # المنطق متاعك: نثبتوا قبل ما ننقصوا
        # إذا كمية الشراء اللي باش نفسخوها أكبر من اللي موجود توة في الستوك
        if produit.quantite_restant < achat.quantite:
            raise HTTPException(
                status_code=400, 
                detail=f"Action impossible: Le stock actuel ({produit.quantite_restant}) est insuffisant pour  supprimer cet achat ({achat.quantite} pièces)."
            )
        
        # 3. إذا تعدينا الـ Validation، ننقصوا الستوك وحنا متهنيين
        produit.quantite_restant -= achat.quantite
        
        # 4. إذا الستوك وصل للصفر بالظبط، نحدثوا الحالة
        if produit.quantite_restant == 0:
            produit.status = "RUPTURE"
            produit.is_active = False

    # 5. تنفيذ الـ Soft Delete (تغيير الحالة فقط)
    achat.is_active = False
    achat.status = "SUPPRIMEE"
    achat.deleted_at = datetime.now()

    db.commit() 

 
