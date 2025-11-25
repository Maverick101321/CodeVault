import { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"

interface Snippet {
  id: string
  code: string
  language: string
  title: string
  sourceUrl: string
  createdAt: string
}

function IndexPopup() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const storage = new Storage()
        const token = await storage.get("firebaseIdToken")

        if (!token) {
          setError("Please login via the Auth Portal first.")
          setLoading(false)
          return
        }

        const response = await fetch("http://localhost:3000/snippets", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch snippets")
        }

        const data = await response.json()
        setSnippets(data)
      } catch (err) {
        setError("Failed to load snippets. Make sure the server is running.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSnippets()
  }, [])

  return (
    <div
      style={{
        padding: 16,
        width: 300,
        fontFamily: "Inter, sans-serif"
      }}>
      <h2 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600 }}>
        Saved Snippets
      </h2>

      {loading && <p>Loading...</p>}

      {error && (
        <div style={{ color: "red", fontSize: "14px", marginBottom: "12px" }}>
          {error}
        </div>
      )}

      {!loading && !error && snippets.length === 0 && (
        <p style={{ color: "#666", fontSize: "14px" }}>No snippets saved yet.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {snippets.map((snippet) => (
          <div
            key={snippet.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "12px",
              backgroundColor: "#f9f9f9"
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "180px" }}>
                {snippet.title || "Untitled Snippet"}
              </h3>
              <span style={{ fontSize: "10px", backgroundColor: "#eee", padding: "2px 6px", borderRadius: "4px" }}>
                {snippet.language}
              </span>
            </div>
            <pre
              style={{
                margin: 0,
                fontSize: "12px",
                backgroundColor: "#fff",
                padding: "8px",
                borderRadius: "4px",
                overflowX: "auto",
                border: "1px solid #eee",
                maxHeight: "100px"
              }}>
              <code>{snippet.code}</code>
            </pre>
            <div style={{ marginTop: "8px", fontSize: "10px", color: "#888" }}>
              <a href={snippet.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#646cff", textDecoration: "none" }}>
                View Source
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IndexPopup
