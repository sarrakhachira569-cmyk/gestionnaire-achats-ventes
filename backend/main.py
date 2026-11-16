from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import Base, engine
import os
from user.user_controller import router as user_router
from client.client_controller import router as client_router
from categorie.categorie_controller import router as categorie_router
from produit.produit_controller import router as produit_router
from Fournisseur.Fournisseur_controller import router as Fournisseur_router
from vente.vente_controller import router as vente_router
from achat.achat_controller import router as achat_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:.*", # يقبل أي Port يجي من localhost    
    allow_credentials=True,
    allow_methods=["*"], # يسمح بـ GET, POST, PUT, DELETE
    allow_headers=["*"], # يسمح بكل الـ Headers بما فيهم الـ Authorization (Token)
)
# -----------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_path = os.path.join(BASE_DIR, "images")
app.mount("/images", StaticFiles(directory=static_path), name="images")
# -------------------------------------------------------------------
Base.metadata.create_all(bind=engine)

app.include_router(user_router)
app.include_router(client_router)
app.include_router(categorie_router)
app.include_router(produit_router)
app.include_router(Fournisseur_router)
app.include_router(vente_router)
app.include_router(achat_router)

