// --- Configuration ---
const URLS_TO_WAKE_UP = [
  { name: "Backend API", url: "https://handscribe-backend.onrender.com" },
  { name: "Model API", url: "https://handscribe.onrender.com" }
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
 * @param {object} server - The server object with name and url.
 * @param {function} onStatusChange - The callback to report status updates.
 */
async function wakeServer(server, onStatusChange) {
  const { name, url } = server;
  onStatusChange(name, 'waking'); // Initial status: "waking up"
  console.log(`☕ Waking up ${name} at ${url}...`);

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      onStatusChange(name, 'ready'); // Status: "ready"
      console.log(`✅ Success! ${name} is awake and responded with status ${response.status}.`);
      return;

    } catch (error) {
      const attempt = i + 1;
      console.log(`   ... ${name} still sleeping. Retrying in ${RETRY_INTERVAL / 1000}s (Attempt ${attempt}/${MAX_RETRIES})`);
      await sleep(RETRY_INTERVAL);
    }
  }

  onStatusChange(name, 'failed'); // Status: "failed"
  console.log(`❌ Error: ${name} did not wake up after ${MAX_RETRIES * RETRY_INTERVAL / 1000} seconds.`);
}

/**
 * The main function to start the wake-up process for all servers.
 * @param {function} onStatusChange - The callback function from React to update the UI.
 */
export function startWakeUpSequence(onStatusChange) {
  console.log("--- Starting Server Wake-Up Sequence ---");
  Promise.all(URLS_TO_WAKE_UP.map(server => wakeServer(server, onStatusChange))).then(() => {
    console.log("--- Wake-Up Sequence Complete ---");
  });
}
