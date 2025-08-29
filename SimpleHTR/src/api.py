# SimpleHTR/src/api.py

import os
import uuid
import shutil
import subprocess
from fastapi import FastAPI, File, UploadFile

# --- Initialize the FastAPI app ---
app = FastAPI(title="Hand Scribe API")

@app.get("/")
def read_root():
    return {"message": "Hand Scribe API is running!"}

@app.post("/predict/")
async def predict_image(image: UploadFile = File(...)):
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    temp_dir = os.path.join(project_root, "temp_uploads")
    os.makedirs(temp_dir, exist_ok=True)
    
    # Save the uploaded image to a temporary file
    temp_image_path = os.path.join(temp_dir, f"_{uuid.uuid4().hex}.png")
    with open(temp_image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:
        # --- Run the command, just like you did ---
        main_script_path = os.path.join(project_root, 'src', 'main.py')
        command = [
            "python",             # Use the python in the server's own environment
            main_script_path,
            "--img_file",
            temp_image_path
        ]

        print(f"Running command: {' '.join(command)}")
        
        # Execute the command and capture the output
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        output = result.stdout
        print(f"Script output:\n{output}")

        # --- Parse the output to find the recognized text ---
        for line in output.splitlines():
            if line.startswith('Recognized:'):
                recognized_text = line.split('"')[1]
                return {"recognized_text": recognized_text}

        return {"recognized_text": "ERROR: Could not find 'Recognized:' in model output."}

    except subprocess.CalledProcessError as e:
        print(f"ERROR: The model script failed.")
        print(f"Stderr:\n{e.stderr}")
        return {"recognized_text": "ERROR: Model script failed."}
    finally:
        # Clean up the temporary image file
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)