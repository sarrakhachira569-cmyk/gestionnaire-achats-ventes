from sqlalchemy import Column, Integer, String, Boolean, DateTime
# Importation les types des clonnes SQLAlchemy

from sqlalchemy.sql import func
# Pour la date automatique (now)

from database import Base
# Base de données

class User(Base):
    __tablename__ = "users"
    # Nom de la table dans la base de données

    id = Column(Integer, primary_key=True, index=True)
    # Identifiant unique de l'utilisateur

    first_name = Column(String(100), nullable=False)
    # Prénom de l'utilisateur (ex: Ali)

    last_name = Column(String(100), nullable=False)
    # Nom de famille (ex: Ben Salah)

    email = Column(String(150), unique=True, nullable=False, index=True)
    # Email unique pour connexion

    password = Column(String(255), nullable=False)
    # Mot de passe crypté (hash)

    role = Column(String(50), default="admin")
    # Rôle de l'utilisateur 
    avatar = Column(String(255), nullable=True, default="default.jpg")

    is_active = Column(Boolean, default=True)
    # Compte actif ou bloqué

    last_login = Column(DateTime, nullable=True)
    # Dernière connexion de l'utilisateur

    created_at = Column(DateTime, server_default=func.now())
    # Date de création du compte

    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    # Date de modification automatique


