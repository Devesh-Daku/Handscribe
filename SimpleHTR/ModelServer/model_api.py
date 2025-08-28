# model_api.py

import os
import shutil
import uuid # Import the library for generating unique IDs
from fastapi import FastAPI, File, UploadFile
from model_inference import recognize_text

# Create a folder for temporary uploads if it doesn't exist
os.makedirs("temp_uploads", exist_ok=True)

app = FastAPI(title="Handwriting Recognition API")

@app.get("/")
def read_root():
    """ A simple endpoint to check if the server is running. """
    return {"message": "API is ready!"}


@app.post("/predict/")
async def predict_image(image: UploadFile = File(...)):
    """
    Receives an image, saves it with a unique name, runs prediction,
    cleans up the file, and returns the text.
    """
    # --- NEW: Generate a unique filename to prevent collisions ---
    # Get the file extension (e.g., .png)
    file_extension = os.path.splitext(image.filename)[1]
    # Create a unique name like '_random_characters_.png'
    unique_filename = f"_{uuid.uuid4().hex}{file_extension}"
    temp_image_path = os.path.join("temp_uploads", unique_filename)

    try:
        # Save the uploaded file
        with open(temp_image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Call your model's inference function
        recognized_text = recognize_text(temp_image_path)

        # Return the result
        return {"recognized_text": recognized_text}
        
    finally:
        # --- NEW: Cleanup block ---
        # This code will run whether the prediction succeeds or fails,
        # ensuring the temporary file is always deleted.
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)