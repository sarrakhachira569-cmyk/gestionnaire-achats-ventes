from pydantic import BaseModel, EmailStr
# Importation des classes Pydantic

from typing import Optional
# Pour les champs optionnels

from datetime import datetime

# ================= CREATE User =================
class CreateUser(BaseModel):
    first_name: str
    # Prénom de l'utilisateur

    last_name: str
    # Nom de famille

    email: EmailStr
    # Email valide et unique

    password: str
    # Mot de passe (sera hashé)
    avatar: Optional[str] = None




# ================= LOGIN USER =================
class UserLogin(BaseModel):
    email: EmailStr
    # Email pour se connecter

    password: str
    # Mot de passe pour login


# ================= UPDATE USER =================
class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    # Modifier prénom

    last_name: Optional[str] = None
    # Modifier nom

    email: Optional[EmailStr] = None
    # Modifier email

    password: Optional[str] = None
    # Modifier mot de passe
    avatar: Optional[str] = None
    
    is_active: Optional[bool] = None


# ================= RESPONSE USER =================
class UserResponse(BaseModel):
    id: int
    # ID utilisateur

    first_name: str
    # Prénom

    last_name: str
    # Nom

    email: EmailStr
    # Email

    role: str
    # Rôle utilisateur
    avatar: Optional[str]
    
    is_active: bool
    # Etat du compte
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        # Permet de convertir un objet SQLAlchemy en réponse JSON

	
	
	
	
	
	

	
 
    
 