
import subprocess
import os

PYTHON_FOR_MODEL = os.path.abspath('../.venv/Scripts/python.exe')
MODEL_SCRIPT_PATH = os.path.abspath('../src/main.py')

def recognize_text(image_path: str) -> str:
    """
    Runs the original main.py script as a separate process and captures its output.
    """
    # Make sure the paths exist before we try to run anything
    if not os.path.exists(PYTHON_FOR_MODEL):
        return f"ERROR: Python interpreter not found at {PYTHON_FOR_MODEL}"
    if not os.path.exists(MODEL_SCRIPT_PATH):
        return f"ERROR: Model script not found at {MODEL_SCRIPT_PATH}"

    # Construct the command to run, just like in the terminal
    command = [
        PYTHON_FOR_MODEL,
        MODEL_SCRIPT_PATH,
        '--img_file',
        os.path.abspath(image_path) # Use absolute path for the image
    ]

    print(f"Running command: {' '.join(command)}")

    try:
        # Execute the command
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True,  # This will raise an error if the script fails
            encoding='utf-8'
        )

        # The script's output is now in result.stdout
        output = result.stdout
        print(f"Script output:\n{output}")

        # --- Parse the output to find the recognized text ---
        # We look for a line that starts with "Recognized:"
        for line in output.splitlines():
            if line.startswith('Recognized:'):
                # Extract the text, which is usually in quotes
                # e.g., Recognized: "hello world"
                recognized_text = line.split('"')[1]
                return recognized_text

        # If the line wasn't found, return an error message
        return "ERROR: Could not find 'Recognized:' in model output."

    except subprocess.CalledProcessError as e:
        # If the script returns an error, we capture it here
        print(f"ERROR: The model script failed with exit code {e.returncode}.")
        print(f"Stderr:\n{e.stderr}")
        return f"ERROR: Model script failed. See API server logs for details."
    except Exception as e:
        return f"An unexpected error occurred: {str(e)}"
