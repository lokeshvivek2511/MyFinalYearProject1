from fastapi import APIRouter
from api.schemas.crop_schema import CropPredictionRequest
from src.inference.predict_crop import predict_top_3_crops

router = APIRouter()

@router.post("/predict/crop")
def predict_crop(data: CropPredictionRequest):
    result = predict_top_3_crops(data.dict())
    return result
