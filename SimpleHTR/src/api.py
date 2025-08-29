# SimpleHTR/src/api.py (Temporary Debugging Version)

import os
from fastapi import FastAPI, UploadFile, File

app = FastAPI(title="Debug API")

@app.get("/")
def read_root():
    return {"message": "Debugging API is running."}

@app.post("/predict/")
async def debug_file_system(image: UploadFile = File(...)):
    # This function will now print the file structure instead of running the model.
    
    print("\n\n--- DEBUGGING FILE STRUCTURE ---")
    
    try:
        # Get the path of the current script (api.py)
        script_dir = os.path.dirname(os.path.abspath(__file__))
        print(f"Current Script Directory (src): {script_dir}")
        print(f"Contents of '{script_dir}': {os.listdir(script_dir)}")

        # Go up one level to the project root
        project_root = os.path.dirname(script_dir)
        print(f"\nProject Root Directory: {project_root}")
        print(f"Contents of Project Root: {os.listdir(project_root)}")

        # Specifically check for the 'model' folder
        model_dir_path = os.path.join(project_root, 'model')
        print(f"\nChecking for model directory at: {model_dir_path}")
        
        if os.path.exists(model_dir_path):
            print(f"✅ SUCCESS: 'model' directory found!")
            print(f"Contents of 'model' directory: {os.listdir(model_dir_path)}")
        else:
            print(f"❌ ERROR: 'model' directory NOT FOUND at that path!")

    except Exception as e:
        print(f"An error occurred during debugging: {e}")

    print("--- END DEBUGGING ---\n\n")

    return {"recognized_text": "DEBUG: Check Render logs for file structure."}