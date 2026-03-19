import { create } from 'zustand'
import { parse } from './parser/parse'

type Status = 'ready' | 'compiling' | 'error'

interface EditorStore {
    source: string
    output: string
    status: Status
    error: string | null
    setSource: (source: string) => void
}

const INITIAL_SOURCE = `# welcome to play
// js
document.body.style.background = '#221f1a'
document.body.style.color = '#c8c8c8'
document.body.style.fontFamily = "'IBM Plex Mono', monospace"
document.body.style.padding = '24px'
document.body.textContent = 'Hello, play!'
`

export const useEditorStore = create<EditorStore>((set) => ({
    source: INITIAL_SOURCE,
    output: parse(INITIAL_SOURCE),
    status: 'ready',
    error: null,
    setSource: (source) => {
        set({ status: 'compiling' })
        try {
            const output = parse(source)
            set({ source, output, status: 'ready', error: null })
        } catch (e) {
            set({ source, status: 'error', error: e instanceof Error ? e.message : String(e) })
        }
    },
}))
