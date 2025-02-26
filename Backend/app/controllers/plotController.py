import os
import json
from fastapi import HTTPException

def formatDataPerMonth(user_id):
    try:
        file_path = os.path.join("user_data", user_id, "temperature_data.json")
        if not os.path.exists(file_path):
            raise FileNotFoundError("No data file found for the given user ID.")

        data = json.load(open(file_path))
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    formatted_data = {}
    for year, values in data.items():
        for month, temperature in values.items():
            if month not in formatted_data and month not in ["mean", "std"]:
                formatted_data[month] = {}
            if month not in ["mean", "std"]:
                formatted_data[month][year] = temperature

    return formatted_data

def formatDataPerYear(user_id):
    try:
        file_path = os.path.join("user_data", user_id, "temperature_data.json")
        if not os.path.exists(file_path):
            raise FileNotFoundError("No data file found for the given user ID.")

        data = json.load(open(file_path))
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    return data
