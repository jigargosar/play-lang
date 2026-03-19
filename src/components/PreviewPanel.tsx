import { useRef, useEffect } from 'react'
import { useEditorStore } from '../store'

const PREVIEW_TEMPLATE = `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #f5f4f0; color: #1a1a1a; font-family: 'IBM Plex Mono', monospace; font-size: 13px; min-height: 100vh; }
</style></head><body>
<script>
window.onerror = function(msg, _s, line) {
  document.body.style.cssText = 'margin:0;padding:24px;background:#f5f4f0;font-family:monospace';
  document.body.innerHTML = '<pre style="color:#c0392b;font-size:12px;line-height:1.8">\\u2716 ' + msg + '\\nline ' + line + '</pre>';
  return true;
};
</script>
<script>CODE</script>
</body></html>`

export function PreviewPanel() {
    const output = useEditorStore((s) => s.output)
    const error = useEditorStore((s) => s.error)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        if (!iframeRef.current || error) return
        const escaped = output.replace(/<\/script>/gi, '<\\/script>')
        iframeRef.current.srcdoc = PREVIEW_TEMPLATE.replace('CODE', escaped)
    }, [output, error])

    return (
        <div className="flex flex-col flex-1 min-w-20 overflow-hidden">
            <div className="h-7 border-b border-border bg-panel2 flex items-center px-3.5 shrink-0">
                <div className="text-[9px] text-muted2 tracking-[0.14em] uppercase">preview</div>
            </div>
            {error ? (
                <div className="flex-1 bg-bg p-6">
                    <pre className="text-error text-xs leading-7">{error}</pre>
                </div>
            ) : (
                <iframe ref={iframeRef} className="flex-1 w-full border-none bg-black" sandbox="allow-scripts" />
            )}
        </div>
    )
}
