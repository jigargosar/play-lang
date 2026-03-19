const items = [
    ['lang', 'play'],
    ['boundary', '// js'],
    ['parser', 'nearley + moo'],
]

export function Footer() {
    return (
        <div className="h-5 border-t border-border bg-panel flex items-center px-3.5 gap-4.5 shrink-0">
            {items.map(([key, value]) => (
                <div key={key} className="text-[9px] text-muted tracking-[0.06em]">
                    {key}: <span className="text-muted2 font-normal">{value}</span>
                </div>
            ))}
            <div className="ml-auto text-[9px] text-[#3a3830] tracking-[0.06em]">playground-06</div>
        </div>
    )
}
