# backend/operations.py

import sys
import json
import numpy as np
from PIL import Image # No change here
import os

# --- Configuration ---
TARGET_HEIGHT = 32
EMPTY_THRESHOLD = 200

def process_matrix_to_image(input_json_path, output_image_path):
    try:
        with open(input_json_path, 'r') as f:
            matrix = json.load(f)

        matrix_np = np.array(matrix, dtype=np.uint8)

        if np.sum(matrix_np) < EMPTY_THRESHOLD:
            return

        rows = np.where(np.max(matrix_np, axis=1) > 0)[0]
        cols = np.where(np.max(matrix_np, axis=0) > 0)[0]
        if len(rows) == 0 or len(cols) == 0:
            return

        cropped_array = matrix_np[rows[0]:rows[-1]+1, cols[0]:cols[-1]+1]
        img_array = np.full_like(cropped_array, 255, dtype=np.uint8)
        img_array[cropped_array > 0] = 0
        img = Image.fromarray(img_array)

        aspect_ratio = img.width / img.height
        target_width = max(1, int(TARGET_HEIGHT * aspect_ratio))
        
        # --- THIS IS THE CORRECTED LINE ---
        resized_img = img.resize((target_width, TARGET_HEIGHT), Image.LANCZOS)

        resized_img.save(output_image_path)
        
    except Exception as e:
        print(f"Error in Python script: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python operations.py <input_json_path> <output_image_path>", file=sys.stderr)
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    process_matrix_to_image(input_path, output_path)