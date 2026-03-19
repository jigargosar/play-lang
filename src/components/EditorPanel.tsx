import Editor from '@monaco-editor/react'
import { useEditorStore } from '../store'

export function EditorPanel() {
    const source = useEditorStore((s) => s.source)
    const setSource = useEditorStore((s) => s.setSource)

    return (
        <div className="flex flex-col flex-1 min-w-20 overflow-hidden">
            <div className="h-7 border-b border-border bg-panel2 flex items-center px-3.5 gap-2.5 shrink-0">
                <div className="text-[9px] text-muted2 tracking-[0.14em] uppercase">editor</div>
                <div className="text-[10px] text-muted2 opacity-60">index.play</div>
                <div className="ml-auto w-1 h-1 rounded-full bg-accent-dim" />
            </div>
            <Editor
                defaultValue={source}
                onChange={(value) => setSource(value ?? '')}
                language="javascript"
                theme="vs-dark"
                options={{
                    fontSize: 13,
                    fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
                    lineHeight: 22,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    renderLineHighlight: 'line',
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    wordWrap: 'on',
                    glyphMargin: false,
                    folding: false,
                    renderWhitespace: 'none',
                    scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                    bracketPairColorization: { enabled: false },
                }}
            />
        </div>
    )
}
