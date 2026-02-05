from fastapi import FastAPI
from api.routes.crop_routes import router as crop_router
from api.routes.scheme_routes import router as scheme_router
app = FastAPI(
    title="Smart Agriculture API",
    description="Crop Recommendation System",
    version="1.0"
)
 
@app.get("/")
def root():
    return {"message": "Crop Recommendation API is running"}

app.include_router(crop_router, prefix="/api")
app.include_router(scheme_router, prefix="/api")
