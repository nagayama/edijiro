import React, { useEffect, useRef, useLayoutEffect } from 'react'
import * as monaco from 'monaco-editor'
import { usePersistedStore, useMemoryStore } from '../store/useStore'

// Monaco Editor requires some setup for proper operation
monaco.editor.defineTheme('custom-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {}
})

export const Editor: React.FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const copyHandlerRef = useRef<((e: ClipboardEvent) => void) | null>(null)

  const persistedState = usePersistedStore()
  const setPersistedState = usePersistedStore.setState
  const setMemoryState = useMemoryStore.setState

  // Initialize editor
  useLayoutEffect(() => {
    if (!editorContainerRef.current) return

    // Skip initialization if editor already exists (StrictMode re-mount)
    if (editorRef.current) return

    const editor = monaco.editor.create(editorContainerRef.current, {
      value: persistedState.text || '',
      language: persistedState.language,
      theme: persistedState.theme,
      lineNumbers: 'off',
      automaticLayout: true,
      autoIndent: 'full',
      fontSize: persistedState.fontSize,
      fontFamily: persistedState.fontFamily || 'Menlo, Monaco, "Courier New", monospace',
      wordWrap: 'on',
      lineDecorationsWidth: 0,
      minimap: {
        enabled: false,
      },
      quickSuggestions: persistedState.quickSuggestions,
      tabSize: persistedState.tabSize,
      scrollBeyondLastLine: false,
      renderWhitespace: 'none',
      contextmenu: true,
    })

    editorRef.current = editor

    // Handle content changes
    const model = editor.getModel()
    if (model) {
      const disposable = model.onDidChangeContent(() => {
        const value = model.getValue()
        setPersistedState({ text: value })
        setMemoryState({
          textLength: Array.from(value).length,
          lineCount: model.getLineCount(),
        })
      })

      // Set initial text metrics
      const initialText = model.getValue()
      setMemoryState({
        textLength: Array.from(initialText).length,
        lineCount: model.getLineCount(),
      })
    }

    // Handle copy event
    const copyHandler = (e: ClipboardEvent) => {
      if (!editor.hasTextFocus()) return
      
      const selection = editor.getSelection()
      if (selection && model) {
        const selectedText = model.getValueInRange(selection)
        if (selectedText) {
          window.ipcRenderer.send('copy', selectedText)
          e.preventDefault()
        }
      }
    }
    copyHandlerRef.current = copyHandler
    document.addEventListener('copy', copyHandler)

    // Focus the editor
    editor.focus()

    return () => {
      if (copyHandlerRef.current) {
        document.removeEventListener('copy', copyHandlerRef.current)
      }
      // Dispose editor and clean up reference
      if (editorRef.current) {
        editorRef.current.dispose()
        editorRef.current = null
      }
    }
  }, []) // Run only once on mount

  // Handle IPC events
  useEffect(() => {
    const handlers = {
      showPreferences: () => setMemoryState({ showPreferences: true }),
      increaseFontSize: () => setPersistedState({ fontSize: persistedState.fontSize + 1 }),
      decreaseFontSize: () => setPersistedState({ fontSize: persistedState.fontSize - 1 }),
      openCommandPalette: () => {
        if (editorRef.current) {
          editorRef.current.trigger('App', 'editor.action.quickCommand', null)
        }
      }
    }

    // Register all handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      window.ipcRenderer.on(event, handler)
    })

    // Cleanup
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        window.ipcRenderer.off(event, handler)
      })
    }
  }, [persistedState.fontSize])

  // Update editor options when they change
  useEffect(() => {
    if (!editorRef.current) return
    editorRef.current.updateOptions({ fontSize: persistedState.fontSize })
  }, [persistedState.fontSize])

  useEffect(() => {
    if (!editorRef.current) return
    editorRef.current.updateOptions({ 
      fontFamily: persistedState.fontFamily || 'Menlo, Monaco, "Courier New", monospace' 
    })
  }, [persistedState.fontFamily])

  useEffect(() => {
    if (!editorRef.current) return
    const model = editorRef.current.getModel()
    if (model) {
      model.updateOptions({ tabSize: persistedState.tabSize })
    }
  }, [persistedState.tabSize])

  useEffect(() => {
    if (!editorRef.current) return
    editorRef.current.updateOptions({ quickSuggestions: persistedState.quickSuggestions })
  }, [persistedState.quickSuggestions])

  useEffect(() => {
    if (!editorRef.current) return
    monaco.editor.setTheme(persistedState.theme)
  }, [persistedState.theme])

  useEffect(() => {
    if (!editorRef.current) return
    const model = editorRef.current.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, persistedState.language)
    }
  }, [persistedState.language])


  return (
    <div 
      ref={editorContainerRef} 
      id="editor" 
      style={{ 
        width: '100%', 
        height: '100%'
      }} 
    />
  )
}