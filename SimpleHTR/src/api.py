# SimpleHTR/src/api.py

import os
import uuid
import shutil
from fastapi import FastAPI, File, UploadFile
import cv2

# Import from the local model.py file (lowercase 'm')
from model import Model, preprocessor

# --- Load the model once when the server starts ---
print("Loading handwriting recognition model...")

# Define paths relative to the main project root
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
model_dir = os.path.join(project_root, 'model')
char_list_path = os.path.join(model_dir, 'charList.txt')
weights_path = os.path.join(model_dir, 'snapshot-13')

with open(char_list_path) as f:
    char_list = list(f.read())

# Initialize the model
model = Model(char_list, decoder_type=0)
model.load_weights(weights_path)
print("Model loaded successfully.")

# Initialize the FastAPI app
app = FastAPI(title="Hand Scribe API")

@app.get("/")
def read_root():
    return {"message": "Hand Scribe API is running!"}

@app.post("/predict/")
async def predict_image(image: UploadFile = File(...)):
    temp_dir = os.path.join(project_root, "temp_uploads")
    os.makedirs(temp_dir, exist_ok=True)
    
    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"_{uuid.uuid4().hex}{file_extension}"
    temp_image_path = os.path.join(temp_dir, unique_filename)

    try:
        with open(temp_image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        print(f"Recognizing text from: {temp_image_path}")
        img = cv2.imread(temp_image_path, cv2.IMREAD_GRAYSCALE)
        
        if img is None:
            return {"recognized_text": "ERROR: Image could not be read."}

        img = preprocessor(img, model.img_size, enhance=False)
        text, prob = model.predict(img)
        print(f"Recognized: '{text}' with probability {prob}")
        
        return {"recognized_text": text}
        
    except Exception as e:
        print(f"An error occurred during recognition: {e}")
        return {"recognized_text": "ERROR: An exception occurred during prediction."}
    finally:
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)