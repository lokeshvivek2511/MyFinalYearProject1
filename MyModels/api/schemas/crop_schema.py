from pydantic import BaseModel

class CropPredictionRequest(BaseModel):
    Nitrogen: float
    Phosphorus: float
    Potassium: float
    Temperature: float
    Humidity: float
    pH: float
    Rainfall: float
