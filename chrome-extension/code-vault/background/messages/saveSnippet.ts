import type { PlasmoMessaging } from "@plasmohq/messaging"

type RequestBody = {
  code: string
  sourceUrl: string
  title: string
  language: string
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, void> = async (req, res) => {
  console.log("Background script received 'saveSnippet' message with payload:", req.body)

  try {
    const response = await fetch("http://localhost:3000/api/v1/snippets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
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

export default handler
