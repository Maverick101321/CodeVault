import { sendToBackground } from "@plasmohq/messaging"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

type RequestBody = {
  code: string
  sourceUrl: string
  title: string
  language: string
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const ContentScriptUI = () => {
  const [selectedText, setSelectedText] = useState("")

  useEffect(() => {
    const handleMouseUp = () => {
      const text = window.getSelection().toString().trim()
      setSelectedText(text)
    }

    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleSave = async () => {
    const body: RequestBody = {
      code: selectedText,
      sourceUrl: window.location.href,
      title: document.title,
      language: "plaintext"
    }

    // ====================================================================
    // START: ADDED ERROR HANDLING
    // ====================================================================

    try {
      console.log("Sending 'saveSnippet' to background script...")
      await sendToBackground({
        name: "saveSnippet",
        body
      })
      console.log("Message sent successfully.")
    } catch (error) {
      // This will now catch the "channel closed" error and prevent it
      // from appearing as an unchecked error in the console.
      if (error instanceof Error && error.message.includes("Could not establish connection")) {
        console.log("Message channel closed, as expected after processing.");
      } else {
        console.error("Error sending message to background:", error);
      }
    } finally {
      setSelectedText("") // Hide button after sending, regardless of outcome
    }
    
    // ====================================================================
    // END: ADDED ERROR HANDLING
    // ====================================================================
  }

  if (!selectedText) {
    return null
  }

  return (
    <div className="save-to-vault-container">
      <button onClick={handleSave}>Save to Vault</button>
    </div>
  )
}

export default ContentScriptUI