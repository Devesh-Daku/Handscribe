//  Frontend/src/utils/serverwakeup.jsx
// These are the URLs of the services that need to be woken up.
const URLS_TO_WAKE_UP = [
  "https://handscribe-backend.onrender.com", // Your backend service
  "https://handscribe.onrender.com"           // Your model API service
];
const MAX_RETRIES = 12;      // Max number of times to try (12 retries * 5s = 60s max wait)
const RETRY_INTERVAL = 5000; // 5 seconds (in milliseconds)

/**
 * A helper function to create a delay.
 * @param {number} ms - The number of milliseconds to wait.
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Pings a single server URL until it gets a response or times out.
 * @param {string} url - The URL to wake up.
 */
async function wakeServer(url) {
  console.log(`☕ Waking up ${url}...`);
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      // We use an AbortController to create a timeout for the fetch request.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId); // Clear the timeout if the request succeeds

      // We consider ANY response (even a 404 or 502) a success because it means
      // the server is running and not "asleep".
      console.log(`✅ Success! ${url} is awake and responded with status ${response.status}.`);
      return; // Exit the function on success

    } catch (error) {
      // This block runs if the server is sleeping (e.g., timeout or connection error)
      const attempt = i + 1;
      console.log(`   ... Still sleeping. Retrying in ${RETRY_INTERVAL / 1000}s (Attempt ${attempt}/${MAX_RETRIES})`);
      await sleep(RETRY_INTERVAL);
    }
  }

  console.log(`❌ Error: ${url} did not wake up after ${MAX_RETRIES * RETRY_INTERVAL / 1000} seconds.`);
}

/**
 * The main function to start the wake-up process for all servers.
 * This should be called once when the application loads.
 */
export function startWakeUpSequence() {
  console.log("--- Starting Server Wake-Up Sequence ---");
  // We run the wake-up calls for each URL. They will run in parallel.
  Promise.all(URLS_TO_WAKE_UP.map(wakeServer)).then(() => {
    console.log("--- Wake-Up Sequence Complete ---");
  });
}
