import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

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

  const handleSave = () => {
    console.log("Selected Text:", selectedText)
    console.log("Page URL:", window.location.href)
    // Future logic to send this data to your backend will go here.
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
