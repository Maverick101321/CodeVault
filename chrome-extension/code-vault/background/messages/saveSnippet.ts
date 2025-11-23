import type { PlasmoMessaging } from "@plasmohq/messaging"

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
    const storage = new Storage()
    const token = await storage.get("firebaseIdToken")

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