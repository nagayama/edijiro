import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PersistedState, MemoryState } from './types'

const initialPersistedState: PersistedState = {
  fontSize: 13,
  fontFamily: '',
  tabSize: 4,
  language: 'markdown',
  text: '',
  theme: 'dark-grad',
  quickSuggestions: true,
}

const initialMemoryState: MemoryState = {
  showPreferences: false,
  textLength: 0,
  lineCount: 1,
  alwaysOnTop: false,
}

export const usePersistedStore = create<PersistedState>()(
  persist(
    (set) => ({
      ...initialPersistedState,
    }),
    {
      name: 'editaro-state',
    }
  )
)

export const useMemoryStore = create<MemoryState>((set) => ({
  ...initialMemoryState,
}))