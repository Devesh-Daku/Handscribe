# Save this code as wake_up.py

import requests
import time

# --- Configuration ---
# Add all the URLs of the services you need to wake up
URLS_TO_WAKE_UP = [
    "https://handscribe-backend.onrender.com", # Your backend service
    "https://handscribe.onrender.com"           # Your model API service
]
MAX_RETRIES = 20  # Max number of times to try (e.g., 20 retries * 10s = 200s max wait)
RETRY_INTERVAL = 10 # Seconds to wait between retries

# --- Script Logic ---
def wake_server(url):
    """Pings a server URL until it gets a successful response or times out."""
    print(f"☕ Waking up {url}...")
    
    for i in range(MAX_RETRIES):
        try:
            # Send a GET request with a 15-second timeout
            response = requests.get(url, timeout=15)
            
            # Check for a successful status code (like 200 OK)
            if 200 <= response.status_code < 300:
                print(f"✅ Success! {url} is awake and responded with status {response.status_code}.")
                return True
            # Handle cases where the server is up but the root path is an error (like 404)
            else:
                print(f"✅ Success! {url} is awake but responded with status {response.status_code}.")
                return True

        except requests.exceptions.RequestException as e:
            # This happens when the server is still sleeping (e.g., timeout, connection error)
            print(f"   ... Still sleeping. Retrying in {RETRY_INTERVAL} seconds (Attempt {i+1}/{MAX_RETRIES})")
            time.sleep(RETRY_INTERVAL)
            
    print(f"❌ Error: {url} did not wake up after {MAX_RETRIES * RETRY_INTERVAL} seconds.")
    return False

if __name__ == "__main__":
    print("--- Starting Server Wake-Up Sequence ---")
    for service_url in URLS_TO_WAKE_UP:
        wake_server(service_url)
        print("-" * 20)
    print("--- Wake-Up Sequence Complete ---")