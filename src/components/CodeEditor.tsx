"use client"

import { useState, useRef, useEffect } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { Type, Download, X, Sparkles, AlertTriangle } from "lucide-react"
import Editor, { type Monaco } from "@monaco-editor/react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import type { editor } from "monaco-editor"
import { toast } from "./ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

function NotesEditor() {
  const [fontSize, setFontSize] = useState(18)
  const [notepadContent, setNotepadContent] = useState(
    "// Use this space for notes, pseudocode, or planning your solution...",
  )

  // Editor options that allow editing
  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    fontSize: fontSize,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 16, bottom: 16 },
    wordWrap: "on",
    readOnly: false
  }

  // Define a custom theme for the notepad editor
  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("notepadTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1a1b26",
        "editor.foreground": "#d4d4d4",
        "editorLineNumber.foreground": "#6b7280",
        "editorLineNumber.activeForeground": "#d4d4d4",
        "editor.selectionBackground": "#264f78",
        "editor.lineHighlightBackground": "#2f3347",
      },
    })
  }

  // Handle notepad content changes
  const handleNotepadChange = (value: string | undefined) => {
    setNotepadContent(value || "")
  }

  return (
    <div className="h-full bg-[#0f111a] text-white p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <h2 className="text-xl font-semibold ml-2">Developer Notes</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">Font: {fontSize}px</span>
            <Slider
              className="w-32"
              min={12}
              max={24}
              step={1}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 rounded-md bg-[#1a1b26] border border-gray-800 overflow-hidden">
        {/* Use Monaco Editor for the notepad with minimal options */}
        <Editor
          height="100%"
          defaultLanguage="markdown"
          language="markdown"
          theme="vs-dark"
          value={notepadContent}
          onChange={handleNotepadChange}
          beforeMount={handleEditorWillMount}
          options={editorOptions}
        />
      </div>
    </div>
  )
}

export default NotesEditor