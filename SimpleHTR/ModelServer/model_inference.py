
# import subprocess
# import os

# PYTHON_FOR_MODEL = os.path.abspath('../.venv/Scripts/python.exe')
# MODEL_SCRIPT_PATH = os.path.abspath('../src/main.py')

# def recognize_text(image_path: str) -> str:
#     """
#     Runs the original main.py script as a separate process and captures its output.
#     """
#     # Make sure the paths exist before we try to run anything
#     if not os.path.exists(PYTHON_FOR_MODEL):
#         return f"ERROR: Python interpreter not found at {PYTHON_FOR_MODEL}"
#     if not os.path.exists(MODEL_SCRIPT_PATH):
#         return f"ERROR: Model script not found at {MODEL_SCRIPT_PATH}"

#     # Construct the command to run, just like in the terminal
#     command = [
#         PYTHON_FOR_MODEL,
#         MODEL_SCRIPT_PATH,
#         '--img_file',
#         os.path.abspath(image_path) # Use absolute path for the image
#     ]

#     print(f"Running command: {' '.join(command)}")

#     try:
#         # Execute the command
#         result = subprocess.run(
#             command,
#             capture_output=True,
#             text=True,
#             check=True,  # This will raise an error if the script fails
#             encoding='utf-8'
#         )

#         # The script's output is now in result.stdout
#         output = result.stdout
#         print(f"Script output:\n{output}")

#         # --- Parse the output to find the recognized text ---
#         # We look for a line that starts with "Recognized:"
#         for line in output.splitlines():
#             if line.startswith('Recognized:'):
#                 # Extract the text, which is usually in quotes
#                 # e.g., Recognized: "hello world"
#                 recognized_text = line.split('"')[1]
#                 return recognized_text

#         # If the line wasn't found, return an error message
#         return "ERROR: Could not find 'Recognized:' in model output."

#     except subprocess.CalledProcessError as e:
#         # If the script returns an error, we capture it here
#         print(f"ERROR: The model script failed with exit code {e.returncode}.")
#         print(f"Stderr:\n{e.stderr}")
#         return f"ERROR: Model script failed. See API server logs for details."
#     except Exception as e:
#         return f"An unexpected error occurred: {str(e)}"

## for deployement 
# ModelServer/model_inference.py

import sys
import os
import cv2
import numpy as np

# Add the 'src' directory to Python's path so we can import the model's code
# This assumes your folder structure is SimpleHTR/ModelServer and SimpleHTR/src
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

# Now we can import the model code directly
from Model import Model, preprocessor

# --- Load the model once when the server starts ---
print("Loading handwriting recognition model...")

# Define paths relative to this script's location
base_dir = os.path.dirname(__file__)
model_dir = os.path.abspath(os.path.join(base_dir, '..', 'model'))
char_list_path = os.path.join(model_dir, 'charList.txt')
weights_path = os.path.join(model_dir, 'snapshot-13') # Or your specific model weights file

with open(char_list_path) as f:
    char_list = list(f.read())

# Initialize the model with the best path decoder
# The original code used integer codes for decoder_type. 0 is usually BestPath.
model = Model(char_list, decoder_type=0) 
model.load_weights(weights_path)
print("Model loaded successfully.")


def recognize_text(image_path: str) -> str:
    """
    Reads an image, pre-processes it, and uses the loaded model to predict text.
    """
    print(f"Recognizing text from: {image_path}")
    try:
        # Read image
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        
        # Make sure the image is not None
        if img is None:
            return "ERROR: Image could not be read."

        # Preprocess image for the model
        img = preprocessor(img, model.img_size, enhance=False)

        # Predict
        text, prob = model.predict(img)
        print(f"Recognized: '{text}' with probability {prob}")
        return text

    except Exception as e:
        print(f"An error occurred during recognition: {e}")
        return "ERROR: An exception occurred during prediction."