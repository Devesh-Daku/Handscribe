# test_model.py

import requests
import os
import glob

# --- Configuration ---
# The URL of your running Model API server
# MODEL_API_URL = "http://127.0.0.1:8000/predict/"
MODEL_API_URL = 'https://handscribe.onrender.com/predict'
# The folder where your test images are stored
TEST_IMAGES_FOLDER = "test_images"


def run_test():
    """Finds all images in the test folder and sends them to the API."""

    # 1. Check if the folder exists
    if not os.path.isdir(TEST_IMAGES_FOLDER):
        print(f"ERROR: Folder '{TEST_IMAGES_FOLDER}' not found.")
        print("Please create it and add your test images.")
        return

    # 2. Find all PNG and JPG images in the folder
    image_paths = glob.glob(os.path.join(TEST_IMAGES_FOLDER, '*.png')) + \
                  glob.glob(os.path.join(TEST_IMAGES_FOLDER, '*.jpg'))

    if not image_paths:
        print(f"No .png or .jpg images found in '{TEST_IMAGES_FOLDER}'.")
        return

    print(f"Found {len(image_paths)} images to test.")

    # 3. Loop through each image and send it to the API
    for image_path in image_paths:
        filename = os.path.basename(image_path)
        print(f"\n--- Testing image: {filename} ---")

        try:
            with open(image_path, "rb") as image_file:
                # Prepare the file for the POST request
                files = {"image": (filename, image_file, "image/png")}

                # Send the request
                response = requests.post(MODEL_API_URL, files=files)
                response.raise_for_status()  # Raise an error for bad responses

                # Print the result
                result = response.json()
                text = result.get("recognized_text", "[No text found]")
                print(f"✅ Success! Model recognized: '{text}'")

        except requests.exceptions.RequestException as e:
            print(f"❌ ERROR: Could not connect to the API. Is the server running?")
            print(f"   Details: {e}")
            break # Stop the test if the server is down
        except Exception as e:
            print(f"❌ An unexpected error occurred: {e}")


if __name__ == "__main__":
    run_test()