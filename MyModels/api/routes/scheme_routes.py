from fastapi import APIRouter

router = APIRouter()


@router.get("/predict/scheme")
def scheme_placeholder():
    return {
        "status": "info",
        "message": "Scheme eligibility module under development"
    }
