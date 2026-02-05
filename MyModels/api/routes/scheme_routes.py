from fastapi import APIRouter
from api.schemas.scheme_schema import SchemeEligibilityRequest
from src.schemes.filter_schemes import get_eligible_schemes

router = APIRouter()

@router.post("/predict/scheme")
def predict_scheme(data: SchemeEligibilityRequest):
    """
    API endpoint to get eligible government schemes
    based on farmer details.
    """
    result = get_eligible_schemes(data.dict())
    return result