import type { PlasmoMessaging } from "@plasmohq/messaging"
// 1. Import Plasmo's built-in Storage helper
import { Storage } from "@plasmohq/storage"

type RequestBody = {
  code: string
  sourceUrl: string
  title: string
  language: string
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, void> = async (req, res) => {
  console.log("Background script received 'saveSnippet' message with payload:", req.body)

  try {
    // 2. Create an instance of the Plasmo Storage class
    const storage = new Storage()

    // 3. Use the Plasmo storage.get() method to retrieve the token
    const token = await storage.get("firebaseIdToken")

    // 4. Check if the token exists. If not, the user is not logged in.
    if (!token) {
      throw new Error("Authentication error: User is not logged in.")
    }

    const response = await fetch("http://localhost:3000/snippets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(req.body)
    })

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`)
    }

    const result = await response.json()
    console.log("Successfully saved snippet to backend:", result)
  } catch (error) {
    console.error("Failed to save snippet:", error)
  }
}

export default handler