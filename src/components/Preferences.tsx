import React, { useState, useEffect } from 'react'
import { usePersistedStore, useMemoryStore } from '../store/useStore'
import { themes } from '../lib/theme/themes'
import { languages } from '../lib/languages'

interface FontFamily {
  path: string
  postscriptName: string
  family: string
  style: string
  weight: number
  width: number
  italic: boolean
  monospace: boolean
}

export const Preferences: React.FC = () => {
  const persistedState = usePersistedStore()
  const { showPreferences } = useMemoryStore()
  const setMemoryState = useMemoryStore.setState
  const setPersistedState = usePersistedStore.setState
  
  const [appVersion] = useState(() => '1.7.1') // TODO: Get from Electron
  const [fontFamilies] = useState<FontFamily[]>([]) // TODO: Get from font-manager
  
  const fontSizes = Array.from({ length: 91 }, (_, i) => i + 10)
  const tabSizes = Array.from({ length: 10 }, (_, i) => i + 1)
  

  const close = () => {
    setMemoryState({ showPreferences: false })
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!showPreferences) return null

  return (
    <div className="preferences" style={{ display: 'block' }}>
      <div className="preferences-inner">
        <div className="header">
          <h1>Preferences</h1>
          <a href="#" className="close" onClick={(e) => { e.preventDefault(); close() }}></a>
        </div>
        
        <div className="form-group select-group">
          <label>Theme:</label>
          <select 
            value={persistedState.theme} 
            onChange={(e) => setPersistedState({ theme: e.target.value })}
          >
            {themes.map(theme => (
              <option key={theme.value} value={theme.value}>
                {theme.text}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group select-group">
          <label>Font Size:</label>
          <select 
            value={persistedState.fontSize} 
            onChange={(e) => setPersistedState({ fontSize: parseInt(e.target.value) })}
          >
            {fontSizes.map(size => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group select-group">
          <label>Font Family:</label>
          <select 
            value={persistedState.fontFamily} 
            onChange={(e) => setPersistedState({ fontFamily: e.target.value })}
          >
            <optgroup label="等幅">
              {fontFamilies.filter(f => f.monospace).map(font => (
                <option 
                  key={`${font.postscriptName}-${font.path}`} 
                  value={font.postscriptName}
                >
                  {font.postscriptName}
                </option>
              ))}
            </optgroup>
            <optgroup label="標準">
              {fontFamilies.filter(f => !f.monospace).map(font => (
                <option 
                  key={`${font.postscriptName}-${font.path}`} 
                  value={font.postscriptName}
                >
                  {font.postscriptName}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        
        <div className="form-group select-group">
          <label>Tab Size:</label>
          <select 
            value={persistedState.tabSize} 
            onChange={(e) => setPersistedState({ tabSize: parseInt(e.target.value) })}
          >
            {tabSizes.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group select-group">
          <label>Quick Suggestions:</label>
          <input
            type="checkbox"
            id="checkbox"
            checked={persistedState.quickSuggestions}
            onChange={(e) => setPersistedState({ quickSuggestions: e.target.checked })}
          />
        </div>
        
        <div className="app-version">エディ太郎: {appVersion}</div>
      </div>
    </div>
  )
}