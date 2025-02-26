from fastapi import APIRouter, HTTPException, Request
from app.controllers import plotController

router = APIRouter()

@router.post('/dataPerMonth')
def formatDataPerMonth(request: Request):
    user_id = request.headers.get('user_id')
    print(user_id)
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    try:
        return plotController.formatDataPerMonth(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post('/dataPerYear')
def formatDataPerYear(request: Request):
    user_id = request.headers.get('user_id')
    
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    try:
        return plotController.formatDataPerYear(user_id)
    except Exception as e:
        raise HTTPException(status_code=402, detail=str(e))
