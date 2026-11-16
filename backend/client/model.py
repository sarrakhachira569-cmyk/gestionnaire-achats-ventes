from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String(100), nullable=False)
    lastname= Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    tel=Column(String(255), nullable=False)
    adresse=Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    status = Column(String(20), default="ACTIF")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime, nullable=True)  
    
