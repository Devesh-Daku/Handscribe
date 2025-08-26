import os
import json
import numpy as np
from PIL import Image

# Configuration
INPUT_FOLDER = "saved_matrices"
OUTPUT_FOLDER = "processed_slices"
TARGET_HEIGHT = 32  # model required input height
TOP_SKIP_RATIO = 0.3  # skip 30% from top when checking empty
BOTTOM_SKIP_RATIO = 0.2  # skip 20% from bottom

# Ensure output folder exists
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Loop through all JSON files
for filename in os.listdir(INPUT_FOLDER):
    if not filename.endswith(".json"):
        continue

    filepath = os.path.join(INPUT_FOLDER, filename)
    with open(filepath, "r") as f:
        data = json.load(f)

    for line_key, matrix in data.items():
        matrix_np = np.array(matrix, dtype=np.uint8)
        h, w = matrix_np.shape

        # Check if slice is empty (considering middle region only)
        top_idx = int(h * TOP_SKIP_RATIO)
        bottom_idx = int(h * (1 - BOTTOM_SKIP_RATIO))
        middle_slice = matrix_np[top_idx:bottom_idx, :]
        if np.sum(middle_slice) < 100:  # threshold for empty
            continue  # skip this slice

        # Crop whitespace from left and right
        cols_with_content = np.where(np.max(matrix_np, axis=0) > 0)[0]
        if len(cols_with_content) == 0:
            continue
        x_min, x_max = cols_with_content[0], cols_with_content[-1] + 1
        cropped_array = matrix_np[:, x_min:x_max]

        # Convert to image (0=black background, 255=white text)
        img_array = np.zeros_like(cropped_array, dtype=np.uint8)
        img_array[cropped_array > 0] = 255
        img = Image.fromarray(img_array)

        # Resize while keeping aspect ratio
        aspect_ratio = img.width / img.height
        target_width = max(1, int(TARGET_HEIGHT * aspect_ratio))
        resized_img = img.resize((target_width, TARGET_HEIGHT), Image.Resampling.LANCZOS)

        # Save image
        base_name = os.path.splitext(filename)[0]  # temp1
        output_name = f"temp_{line_key}.png"
        output_path = os.path.join(OUTPUT_FOLDER, output_name)
        resized_img.save(output_path)

        print(f"Saved: {output_path}")

print("Processing complete!")
