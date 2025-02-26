from fastapi import APIRouter, UploadFile, HTTPException
import pandas as pd
from app.controllers import uploadController
router = APIRouter()

@router.post('/')
async def upload_file(file: UploadFile):
    if file.content_type != 'text/csv':
        raise HTTPException(status_code=400, detail='File must be a CSV file')
    try:
        return uploadController.process_file(file)
    
    except pd.errors.EmptyDataError as e:
        raise HTTPException(status_code=400, detail='File is empty')
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

