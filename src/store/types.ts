export interface PersistedState {
  fontSize: number
  fontFamily: string
  tabSize: number
  language: string
  text: string
  theme: string
  quickSuggestions: boolean
}

export interface MemoryState {
  showPreferences: boolean
  textLength: number
  lineCount: number
  alwaysOnTop: boolean
}