# Importation des outils FastAPI
from fastapi import APIRouter, Depends, HTTPException, status

# Importation de Session pour communiquer avec la base de données
from sqlalchemy.orm import Session

# Importation de la connexion DB
from database import SessionLocal

# Importation du Model Vente (table SQL)
from .model import Vente

# Importation des Schémas Pydantic
from .schema import CreateVente, VenteUpdate, VenteResponse

from datetime import datetime# Importer datetime pour gérer les dates et heures (ex: date de suppression)
#استوردنا datetime كيما وقت التفصيخ وقت كي نحبّو نسجّلوا باش 
#👉 باش نتصرفوا في الوقت والتواريخ

# نزيدو الـ Model متاع الـ Produit  باش السيستيم يعرفو
from produit.model import Produit

from client.model import Client


#Création du router:
# APIRouter sert à organiser les routes
# prefix = /ventes → toutes les routes commencent par /ventes
router = APIRouter(prefix="/ventes", tags=["ventes"])

#Connexion à la base de données:
def get_db():
    # On ouvre une connexion avec la base
    db = SessionLocal()
    try:
        # On donne la connexion à la fonction
        yield db
    finally:
        # On ferme la connexion après la requête
        db.close()

#MÉTHODE POST=ajouter des données=crée une nouvelle vente:
@router.post("/create", response_model=VenteResponse)
def create_vente(
    vente_data: CreateVente,        # Données envoyées depuis Postman
    db: Session = Depends(get_db)   # Connexion DB
):
   #  نجيبو المنتج اللي باش يتباع
    produit = db.query(Produit).filter(Produit.id == vente_data.produit_id).first()
   # لو كانAdmin الـ يغلط ويدخل id متاع منتج مش موجود.
    if not produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")

    if vente_data.quantite <= 0:
        raise HTTPException(status_code=400, detail="La quantité doit être supérieure à zéro")    

    if not produit.is_active or produit.status != "DISPONIBLE":
        raise HTTPException(
        status_code=400,
        detail="Impossible de vendre un produit suspendu ou supprimé ou rupturé"
    )

    # Vérifier que le client existe et est actif
    client_obj = db.query(Client).filter(Client.id == vente_data.client_id, Client.is_active == True).first()
    if not client_obj:
        raise HTTPException(status_code=400, detail="Client invalide ou inactif")
 

     # 1. نعطو قيم أولية من جدول المنتج (باش نكونو في الأمان)
    final_prix_unitaire_ht = produit.prix_hors_tax
    tva_actuelle = produit.tva

    # 2. إذا المستخدم بعث HT بيده، نبدلو القيمة الأولية
    if vente_data.prix_unitaire_ht is not None:
        final_prix_unitaire_ht = vente_data.prix_unitaire_ht

    # 3. إذا المستخدم بعث TVA بيده، نبدلو القيمة الأولية
    if vente_data.tva_vente is not None:
        tva_actuelle = vente_data.tva_vente

    final_prix_unitaire_ttc = final_prix_unitaire_ht * (1 + tva_actuelle / 100)    
    
    #  تثبت هل الكمية كافية؟ (اختياري أما باهي)
    if produit.quantite_restant < vente_data.quantite:
        raise HTTPException(status_code=400, detail="Stock insuffisant !")
    # Calcul automatique du prix total
    prix_total = vente_data.quantite * final_prix_unitaire_ttc
    # Création de l'objet Vente (ligne dans la table)
    vente = Vente(
        client_id=vente_data.client_id,
        produit_id=vente_data.produit_id,
        quantite=vente_data.quantite,
        prix_unitaire_ht=final_prix_unitaire_ht,    # السعر الصافي
        tva_vente=tva_actuelle,                    # نسبة الأداء المسجلة
        prix_unitaire_ttc=final_prix_unitaire_ttc,  # السعر مع الأداء
        prix_total=prix_total,
        status="CONFIRMEE"
    )
    
    #  السطر السحري: نقص الكمية من الـ Produit
    produit.quantite_restant -= vente_data.quantite

    #ethaken ba3id mabi3it el stock kamil mta3 produit ya3ni bi3it eli fi stock elkol
    if produit.status == "DISPONIBLE" and produit.quantite_restant == 0:
        produit.status = "RUPTURE"
        produit.is_active = False

    # Ajouter dans la base
    db.add(vente)

    # Sauvegarder (commit)
    db.commit()

    # Rafraîchir pour récupérer l'id généré
    db.refresh(vente)

    # 🛡️ السطور السحرية اللي باش تنحي الـ Error 500 🛡️
    # نحولو الـ Object لـ Dictionary ونزيدو فيه الأسامي يدوياً
    vente_res = vente.__dict__.copy()
    vente_res["client_lastname"] = client_obj.lastname
    vente_res["client_firstname"] = client_obj.firstname
    vente_res["produit_title"] = produit.title # ثبت كان إسمه title_produit بدلها

    return vente_res

# MÉTHODE GET = récupérer des données = Get all ventes:
@router.get("/", response_model=list[VenteResponse])
def get_all_ventes(db: Session = Depends(get_db)):
    # نربطو الجداول ببعضهم باش ناخذو البيانات من الـ 3 بلايص
    results = db.query(Vente, Client, Produit).\
        join(Client, Vente.client_id == Client.id).\
        join(Produit, Vente.produit_id == Produit.id).all()

    final_ventes = []
    for vente, client, produit in results:
        vente_data = vente.__dict__ # نحولو الـ object لـ dictionary
        # نزيدو الأسامي يدوياً للـ dictionary
        vente_data["client_lastname"] = client.lastname
        vente_data["client_firstname"] = client.firstname
        vente_data["produit_title"] = produit.title
        final_ventes.append(vente_data)

    return final_ventes 

# MÉTHODE GET = Get vente by ID = نحب vente وحدة برك:
@router.get("/{vente_id}", response_model=VenteResponse)
def get_vente_by_id(vente_id: int, db: Session = Depends(get_db)):
    result = db.query(Vente, Client, Produit).\
        join(Client, Vente.client_id == Client.id).\
        join(Produit, Vente.produit_id == Produit.id).\
        filter(Vente.id == vente_id).first()

    if not result:
        raise HTTPException(status_code=404, detail="Vente non trouvée")

    vente, client, produit = result
    vente_data = vente.__dict__
    vente_data["client_lastname"] = client.lastname
    vente_data["client_firstname"] = client.firstname
    vente_data["produit_title"] = produit.title
    
    return vente_data

# MÉTHODE GET → Get ventes par client_id:
@router.get("/by-client/{client_id}", response_model=list[VenteResponse])
def get_ventes_by_client(
    client_id: int, 
    db: Session = Depends(get_db)
):
    # Récupérer toutes les ventes d’un client
    ventes = db.query(Vente).filter(Vente.client_id == client_id).all()

    # Si aucune vente trouvée
    if not ventes:
        raise HTTPException(
            status_code=404,
            detail="Aucune vente pour ce client"
        )

    return ventes

# MÉTHODE PATCH → Update vente
# 📌 Pourquoi PATCH ?→لأننا نعدّلو جزء فقط موش كل vente👉 PATCH = تعديل جزئي:
@router.patch("/{vente_id}", response_model=VenteResponse)
def update_vente(
    vente_id: int,
    vente_update: VenteUpdate,      # Données à modifier
    db: Session = Depends(get_db)
):
    # Recherche de la vente
    vente = db.query(Vente).filter(Vente.id == vente_id).first()

    if not vente:
        raise HTTPException(
            status_code=404,
            detail="Vente non trouvée"
        )
    if not vente.is_active or vente.status == "SUPPRIMEE":
        raise HTTPException(status_code=400, detail="Modification impossible : Cette vente est supprimée ou annulée. Pour corriger une information, veuillez effectuer une nouvelle opération de vente.")    
    # 🔹 خزن الكمية القديمة قبل أي تعديل 
    ancienne_quantite = vente.quantite   

    # Convertir les données envoyées en dictionnaire
    data = vente_update.dict(exclude_unset=True)

    # Si aucun champ envoyé
    if not data:
        raise HTTPException(
            status_code=400,
            detail="Aucun champ à modifier"
        )
    # ---------------------------------------------------------
    # 🛡️ الجزء الجديد: التثبت من الـ ID (المنتج والحريف)
    # نزيدوهم هنا قبل ما نبدلو أي حاجة في الـ Database
    # ---------------------------------------------------------
    
    # تثبت من المنتج الجديد لو الـ Admin حب يبدلو
    if "produit_id" in data:
        new_produit = db.query(Produit).filter(Produit.id == data["produit_id"]).first()
        if not new_produit or not new_produit.is_active:
            raise HTTPException(status_code=400, detail="Nouveau produit invalide ou inactif")

    # تثبت من الحريف الجديد لو الـ Admin حب يبدلو
    if "client_id" in data:
        new_client = db.query(Client).filter(Client.id == data["client_id"]).first()
        if not new_client or not new_client.is_active:
            raise HTTPException(status_code=400, detail="Nouveau client invalide ou inactif")    
    # ثبت هنا قبل ما تبدل أي حاجة في الـ vente
    if "quantite" in data and data["quantite"] <= 0:
        raise HTTPException(status_code=400, detail="La quantité doit être supérieure à zéro")    

    # Mise à jour des champs un par un
    for key, value in data.items():
        setattr(vente, key, value)

     # Recalcul TTC

    if "prix_unitaire_ht" in data or "tva_vente" in data:

        vente.prix_unitaire_ttc = vente.prix_unitaire_ht * (1 + vente.tva_vente / 100)    

    produit = db.query(Produit).filter(Produit.id == vente.produit_id).first()

    if produit:

         # الحالة 1: إلغاء العملية

        if "is_active" in data and data["is_active"] is False :

        # تثبت قبل لا ينقص الـ stock بالسالب

            produit.quantite_restant += ancienne_quantite

            vente.status = "ANNULEE"
            if produit.quantite_restant > 0:
                produit.status = "DISPONIBLE"
                produit.is_active = True

        # الحالة 2: تبديل الكمية فقط

        elif "quantite" in data:

            difference = ancienne_quantite - vente.quantite
            if produit.quantite_restant + difference < 0:
                raise HTTPException(
                    status_code=400,
                    detail=f"Stock insuffisant ! Il reste seulement {produit.quantite_restant} pièces."
                )

            produit.quantite_restant += difference
            if produit.quantite_restant > 0:
                produit.status = "DISPONIBLE"
                produit.is_active = True
            elif produit.quantite_restant == 0:
                produit.status = "RUPTURE"
                produit.is_active = False    

    # Recalcul du prix total si nécessaire

    if "quantite"  in data or "prix_unitaire_ht" in data or "tva_vente" in data:

        vente.prix_total = vente.quantite *  vente.prix_unitaire_ttc

    # Sauvegarde
    db.commit()
    db.refresh(vente)

    # قبل الـ return vente
    client_obj = db.query(Client).filter(Client.id == vente.client_id).first()
    produit_obj = db.query(Produit).filter(Produit.id == vente.produit_id).first()
    
    vente_data = vente.__dict__
    vente_data["client_lastname"] = client_obj.lastname
    vente_data["client_firstname"] = client_obj.firstname
    vente_data["produit_title"] = produit_obj.title # نحي _produit# ثبت من اسم الحقل في الـ Model
    
    return vente_data

# MÉTHODE DELETE → Soft delete=حذف غير نهائي 
# 📌 Pourquoi pas supprimer ?→باش نحافظو على historique
# 📌إلغاء عملية البيع
# وعدم حذفها من قاعدة البيانات
# بل تسجل كسجل:
@router.delete("/{vente_id}", status_code=status.HTTP_204_NO_CONTENT)   
def delete_vente(
    vente_id: int,
    db: Session = Depends(get_db)
):
    # Recherche de la vente
    vente = db.query(Vente).filter(Vente.id == vente_id).first()

    if not vente:
        raise HTTPException(
            status_code=404,
            detail="Vente non trouvée"
        )
    if not vente.is_active or vente.status == "SUPPRIMEE":
        raise HTTPException(
        status_code=400, 
        detail="Operation impossible: Cette vente est déjà supprimée ou annulée."
    )    
    #  جيب المنتج المرتبط
    produit = db.query(Produit).filter(Produit.id == vente.produit_id).first()
    if produit:
        produit.quantite_restant += vente.quantite 
        if produit.status == "RUPTURE" and produit.quantite_restant > 0:
            produit.status = "DISPONIBLE"
            produit.is_active = True   

    # Désactiver la vente (soft delete)
    vente.is_active = False
    vente.status = "SUPPRIMEE"
    vente.deleted_at = datetime.now()# Enregistrer la date de suppression avec l'heure locale de vente

    # Sauvegarde
    db.commit()   
#traji3li 1 fi postman ya3ni 3amaliyet ltifsi5 tamit bnaje7 ama raw fi bd matitfasi5ich 
#l'operation de vente ken tit8yer is_active=True(1fi db) bi is_active=False(0 fi db)



