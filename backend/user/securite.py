from datetime import datetime, timedelta  # Gestion temps expiration
from jose import jwt, JWTError  # Gestion JWT
from fastapi import Depends, HTTPException, status  # Outils FastAPI
from fastapi.security import OAuth2PasswordBearer  # Lire token
from sqlalchemy.orm import Session  # Session DB
from database import SessionLocal  # Connexion DB
from user.model import User  # Import modèle User


SECRET_KEY = "sarra_stage_project_2026_super_secret_key" # Clé secrète (à changer)
ALGORITHM = "HS256"  # Algorithme JWT
ACCESS_TOKEN_EXPIRE_MINUTES = 10080 # Durée validité token (7 jours) 
# Durée validité token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")  # URL login


def get_db():  # Fonction connexion DB
    db = SessionLocal()  # Ouvrir session
    try:
        yield db  # Retourner session
    finally:
        db.close()  # Fermer session


def create_access_token(data: dict):  # Créer token
    to_encode = data.copy()  # Copier données
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)  # Date expiration
    to_encode.update({"exp": expire})  # Ajouter expiration
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # Encoder token
    return encoded_jwt  # Retourner token


def get_current_user(  # Fonction récupérer user connecté
    token: str = Depends(oauth2_scheme),  # Lire token du header
    db: Session = Depends(get_db)  # Connexion DB
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  # Décoder token
        user_id: int = payload.get("user_id")  # Récupérer ID

        if user_id is None:  # Si ID inexistant
            raise HTTPException(status_code=401, detail="Token invalide")  # Erreur 401

    except JWTError:  # Si token incorrect
        raise HTTPException(status_code=401, detail="Token invalide")  # Erreur 401

    user = db.query(User).filter(User.id == user_id).first()  # Chercher user

    if not user:  # Si user non trouvé
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")  # Erreur 401

    return user  # Retourner user connecté
