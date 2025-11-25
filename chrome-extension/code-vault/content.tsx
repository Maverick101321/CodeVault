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
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  useEffect(() => {
    const handleMouseUp = () => {
      const text = window.getSelection().toString().trim()
      if (text) {
        setSelectedText(text)
        setStatus("idle")
      }
    }

    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleSave = async () => {
    setStatus("saving")
    const body: RequestBody = {
      code: selectedText,
      sourceUrl: window.location.href,
      title: document.title,
      language: "plaintext"
    }

    try {
      await sendToBackground({
        name: "saveSnippet",
        body
      })
      setStatus("saved")
      setTimeout(() => {
        setSelectedText("")
        setStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("Error sending message to background:", error)
      setStatus("error")
      setTimeout(() => {
        setStatus("idle")
      }, 3000)
    }
  }

  if (!selectedText) {
    return null
  }

  return (
    <div className="save-to-vault-container">
      <button
        onClick={handleSave}
        disabled={status === "saving" || status === "saved"}
        style={{
          backgroundColor: status === "error" ? "#ff4444" : status === "saved" ? "#4CAF50" : undefined,
          color: "white",
          cursor: status === "saving" ? "wait" : "pointer"
        }}
      >
        {status === "idle" && "Save to Vault"}
        {status === "saving" && "Saving..."}
        {status === "saved" && "Saved to Vault"}
        {status === "error" && "Error"}
      </button>
    </div>
  )
}

export default ContentScriptUI