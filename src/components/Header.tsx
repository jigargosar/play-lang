import { useEditorStore } from '../store'

const statusColors: Record<string, string> = {
    ready: 'bg-success',
    compiling: 'bg-pending',
    error: 'bg-error',
}

export function Header() {
    const status = useEditorStore((s) => s.status)

    return (
        <div className="h-10 border-b border-border bg-panel flex items-center px-4 gap-2.5 shrink-0">
            <div className="font-sans font-semibold text-xs text-accent tracking-[0.18em] uppercase flex items-center gap-2">
                <div className="w-4 h-4 border-[1.5px] border-accent flex items-center justify-center text-[9px] text-accent shrink-0">
                    ▸
                </div>
                play
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${statusColors[status]}`} />
                <div className="text-[10px] text-muted2 tracking-[0.06em] min-w-[54px]">{status}</div>
            </div>
        </div>
    )
}
