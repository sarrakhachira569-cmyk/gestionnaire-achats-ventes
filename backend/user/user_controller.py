from fastapi import APIRouter, Depends, HTTPException, status
# Importer FastAPI tools

from sqlalchemy.orm import Session
# Pour gérer la DB

from database import SessionLocal
# Session DB

from .model import User
# Modèle User

from .schema import CreateUser, UserLogin,  UserUpdate, UserResponse
# Schémas Pydantic

from passlib.context import CryptContext
# Pour hasher les mots de passe

from .securite import create_access_token
# Création du token JWT

from datetime import datetime, timedelta

from .securite import get_current_user
from fastapi import Form, File, UploadFile
import os # باش تتعامل مع المجلدات
from typing import Optional


router = APIRouter(prefix="/users", tags=["Users"])
# Définir le router users


def get_db():
    db = SessionLocal()
    # Ouvrir la session DB
    try:
        yield db
    finally:
        db.close()
        # Fermer la session DB


pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
# Définir l'algorithme de hash


def hash_password(password: str):
    return pwd_context.hash(password)
    # Crypter le mot de passe


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)
    # Vérifier le mot de passe

#création  de l'utlisateur(admin)
# إنشاء مستخدم جديد (Admin)
@router.post("/create", response_model=UserResponse)
async def create_user(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form("admin"),
    avatar: Optional[UploadFile] = File(None), # الـ Avatar اختياري هنا
    db: Session = Depends(get_db)
):
    # 1. التثبت من الإيميل
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    # 2. إنشاء الكائن
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=hash_password(password),
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3. معالجة الـ Avatar إذا كان موجود
    if avatar:
        upload_dir = "images"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_extension = avatar.filename.split(".")[-1]
        file_name = f"user_{new_user.id}.{file_extension}"
        file_location = os.path.join(upload_dir, file_name)

        content = await avatar.read()
        with open(file_location, "wb") as f:
            f.write(content)
        
        # تحيين إسم التصويرة بعد ما عرفنا الـ ID
        new_user.avatar = file_name
        db.commit()
        db.refresh(new_user)

    return new_user
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Login utilisateur

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()
    # Chercher user actif

    if not db_user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Mot de passe incorrect")
    db_user.last_login = datetime.now()
    db.commit()
# هكا
#  وقت
#  يعمل 
#  login
# يتسجل
#  آخر
#  .دخول   

    token = create_access_token({
        "user_id": db_user.id,
        "role": db_user.role
    })
    # Créer token

    return {"access_token": token, "token_type": "bearer"}
    # Retourner token

# Voir profil connecté
@router.get("/me", response_model=UserResponse)  
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Voir liste users
@router.get("/", response_model=list[UserResponse])  
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(User).all()
#🟢 User يعدّل روحو (profile)

@router.patch("/me", response_model=UserResponse)
async def update_my_profile(
    first_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
    is_active: Optional[bool] = Form(None),
    # استعملنا "avatar" كيف ما قتلي أنت
    avatar: Optional[UploadFile] = File(None), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. تحديث البيانات النصية
    if first_name is not None: current_user.first_name = first_name
    if last_name is not None: current_user.last_name = last_name
    if email is not None: current_user.email = email
    if is_active is not None: current_user.is_active = is_active
    
    # ثبت إنو الـ password مش None ومش String فارغة
    if password and password.strip(): 
        current_user.password = hash_password(password)

    # 2. معالجة الـ Avatar (الملف)
    if avatar:
        upload_dir = "images"
        os.makedirs(upload_dir, exist_ok=True)
            
        # صنع إسم الملف
        file_extension = avatar.filename.split(".")[-1]
        file_name = f"user_{current_user.id}.{file_extension}"
        file_location = os.path.join(upload_dir, file_name)

        # حفظ الملف
        content = await avatar.read()
        with open(file_location, "wb") as f:
            f.write(content)
        
        # تحيين حقل الـ avatar في قاعدة البيانات بإسم الملف الجديد
        current_user.avatar = file_name

    current_user.updated_at = datetime.now()
    # 🟢 الحل هنا: ندمج الكائن في الجلسة الحالية قبل الـ commit
    current_user = db.merge(current_user) 
    
    db.commit()
    db.refresh(current_user) # الآن الـ refresh ستعمل بدون خطأ
    
    return current_user
