import * as monaco from 'monaco-editor'

// Define themes
monaco.editor.defineTheme('editaro', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editorGutter.background': '#333',
  },
})

monaco.editor.defineTheme('editaro-wave', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editorGutter.background': '#333',
  },
})

monaco.editor.defineTheme('dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editorGutter.background': '#333',
  },
})

monaco.editor.defineTheme('dark-grad', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editorGutter.background': '#333',
  },
})

monaco.editor.defineTheme('light', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editorGutter.background': '#ddd',
  },
})

monaco.editor.defineTheme('light-grad', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editorGutter.background': '#ddd',
  },
})

monaco.editor.defineTheme('vscode', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editorGutter.background': '#333',
  },
})

monaco.editor.defineTheme('aesthetic', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editorGutter.background': '#333',
  },
})

monaco.editor.defineTheme('aesthetic-wave', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editorGutter.background': '#333',
  },
})

export const themes = [
  { text: 'VSCode', value: 'vscode' },
  { text: 'Dark Gradient', value: 'dark-grad' },
  { text: 'Light Gradient', value: 'light-grad' },
  { text: 'Dark', value: 'dark' },
  { text: 'Light', value: 'light' },
  { text: 'Editaro', value: 'editaro' },
  { text: 'Editaro Wave', value: 'editaro-wave' },
  { text: 'Aesthetic', value: 'aesthetic' },
  { text: 'Aesthetic Wave', value: 'aesthetic-wave' },
]