import { sendToContentScript } from "@plasmohq/messaging"

console.log(
  "Hello from the background script! I am ready to listen for snippets."
)

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.name === "saveSnippet") {
    console.log("Background script received 'saveSnippet' message with payload:", request.body)

    try {
      const response = await fetch("http://localhost:3000/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request.body)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Successfully saved snippet to backend:", result)
    } catch (error) {
      console.error("Failed to save snippet:", error)
    }
  }
})