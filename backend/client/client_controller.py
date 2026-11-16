from fastapi import FastAPI, Depends, HTTPException,status,APIRouter
from sqlalchemy.orm import Session
from database import SessionLocal
from .model import Client
from .schema import Create_client,ClientUpdate,ClientResponse
from datetime import datetime
router = APIRouter(prefix="/clients", tags=["clients"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/",response_model=ClientResponse)
def CreateClient(client_data:Create_client, db: Session = Depends(get_db)):
    client = Client(firstname=client_data.firstname,lastname=client_data.lastname,email=client_data.email,tel=client_data.tel,adresse=client_data.adresse)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@router.get("/",response_model=list[ClientResponse])
def get_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()
@router.get("/by-firstname/{client_firstname}", response_model=ClientResponse)
def get_clientname(client_firstname:str, db: Session = Depends(get_db)):
    cliente = db.query(Client).filter(Client.firstname == client_firstname).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="client non trouvé")
    return cliente
@router.get("/{client_id}", response_model=ClientResponse)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="client non trouvé")
    return client
#methode patch
@router.patch("/{client_id}", response_model=ClientResponse)
def update_Client(client_id: int, client_update: ClientUpdate, db: Session = Depends(get_db)):
    # نجيب العميل اللي باش نبدلو 
    clientee = db.query(Client).filter(Client.id == client_id).first()
    if not clientee:
        raise HTTPException(status_code=404, detail="client non trouvé")

    # ناخذ الداتا ونقصّ اللي ما تبعثوش
    data = client_update.dict(exclude_unset=True)

    # حماية: ما نخليوش PATCH فارغ
    if not data:
        raise HTTPException(
            status_code=400,
            detail="Vous devez envoyer au moins un champ à mettre à jour"
            # "لازم تبعث على الأقل حقل واحد للتحديث" lazim au moin n8ayer 7aja
        )    

    # نبدّل الحقول اللي بعثهم فقط
    for key, value in data.items():
        setattr(clientee, key, value)
     # --- التعديل اللي حاجتك بيه لهنا ---
    
    if "is_active" in data:
        if data["is_active"] is True:
            # إذا رجعناها True، السيستيم ينظف الحالة ويرجعها متوفرة
            clientee.status = "ACTIF"
            clientee.deleted_at = None  # يفسخ تاريخ الحذف باش يتنحى اللون الأحمر من الـ Table
        else:
            # blocage administratif  
            clientee.status = "BLOQUE"    

    # نحفظ التغييرات في DB
    db.commit()
    db.refresh(clientee)  # نجيب object محدث
    return clientee  # نرجع للعميل  
# SOFT DELETE
@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Client(client_id: int, db: Session = Depends(get_db)):
    Clientes = db.query(Client).filter(Client.id == client_id).first()
    if not Clientes:
        raise HTTPException(status_code=404, detail="client non trouvé")

    Clientes.is_active = False
    Clientes.status = "SUPPRIMEE"
    Clientes.deleted_at = datetime.now()# Enregistrer la date de suppression  de client avec l'heure locale
    db.commit()  
