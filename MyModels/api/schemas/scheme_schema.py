from pydantic import BaseModel, Field


class SchemeEligibilityRequest(BaseModel):
    age: int = Field(..., ge=0, description="Age of the farmer")
    land_holding: float = Field(..., ge=0, description="Land holding in hectares")
    income: float = Field(..., ge=0, description="Annual income in INR")
    farmer_type: str = Field(..., description="small / marginal / any")
    state: str = Field(..., description="State name")
    crop_type: str = Field(..., description="Crop cultivated")
    category: str = Field(..., description="SC / ST / OBC / GENERAL")
    gender: str = Field(..., description="M / F")

    class Config:
        json_schema_extra = {
            "example": {
                "age": 35,
                "land_holding": 2.5,
                "income": 180000,
                "farmer_type": "small",
                "state": "Tamil Nadu",
                "crop_type": "rice",
                "category": "GENERAL",
                "gender": "M"
            }
        }