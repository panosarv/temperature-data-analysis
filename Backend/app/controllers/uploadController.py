import os
import uuid
from fastapi import UploadFile
import pandas as pd
import numpy as np
import json

def process_file(file: UploadFile):
    try:
        # Define months and create unique user ID
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Annual']
        user_id = str(uuid.uuid4())  # Generate unique ID

        # Create user-specific directory
        user_folder = os.path.join("user_data", user_id)
        os.makedirs(user_folder, exist_ok=True)

        # Save the uploaded file
        uploaded_file_path = os.path.join(user_folder, file.filename)
        with open(uploaded_file_path, "wb") as f:
            f.write(file.file.read())

        # Load the CSV and let Python engine infer separator
        df = pd.read_csv(uploaded_file_path, sep=None, engine="python") 

        # Ensure we process numerical data for std calculation
        numeric_df = df[months].replace('-', np.nan).astype(float)

        
        for col in df.columns:
           if col in months:
            mean_value = numeric_df[col].mean()  
            print(mean_value)
            df[col] = df[col].fillna(mean_value)


        temperature_dict = {}
        for index, row in df.iterrows():
            year = row['Year']
            year_data = row[months].to_dict()
            year_temps = numeric_df.loc[index, months].dropna()  # Remove NaNs for calculations
            
            if not year_temps.empty:
                mean_temp = year_temps.mean()
                std_temp = year_temps.std()
                year_data["mean"] = round(mean_temp, 2)
                year_data["std"] = round(std_temp, 2)
            else:
                year_data["mean"] = None
                year_data["std"] = None

            temperature_dict[year] = year_data

        # Save JSON to user-specific directory
        json_file_path = os.path.join(user_folder, "temperature_data.json")
        with open(json_file_path, "w") as json_file:
            json.dump(temperature_dict, json_file, indent=4)

        return {
            "message": "File processed successfully",
            "user_id": user_id,  # Return user ID to frontend
            "record_count": len(temperature_dict)
        }

    except pd.errors.EmptyDataError as e:
        return {"message": "File is empty"}
    
    except Exception as e:
        return {"message": str(e)}
