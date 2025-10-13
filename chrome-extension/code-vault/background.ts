import "@plasmohq/messaging/background"
import { Storage } from "@plasmohq/storage"

console.log(
  "Hello from the background script! Message listeners are handled by files in `background/messages`."
)

chrome.runtime.onMessageExternal.addListener(
  async (request, sender, sendResponse) => {
    console.log("Received message from external source:", request)
    if (request.token) {
      console.log("Received token:", request.token)
      const storage = new Storage()
      await storage.set("firebaseIdToken", request.token)
      console.log("Token saved to storage.")
    }
  }
)
