# model_api.py

import os
import shutil
from fastapi import FastAPI, File, UploadFile
from model_inference import recognize_text # This imports your other file

# Create a temporary folder for uploads if it doesn't exist
os.makedirs("temp_uploads", exist_ok=True)

app = FastAPI(title="Handwriting Recognition API")

@app.get("/")
def read_root():
    """ A simple endpoint to check if the server is running. """
    return {"message": "API is ready!"}


@app.post("/predict/")
async def predict_image(image: UploadFile = File(...)):
    """
    Receives an image, saves it, runs prediction, and returns the text.
    """
    temp_image_path = f"temp_uploads/{image.filename}"

    # Save the uploaded file
    with open(temp_image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Call your model's inference function from the other file
    recognized_text = recognize_text(temp_image_path)

    # Return the result in JSON format
    return {"recognized_text": recognized_text}