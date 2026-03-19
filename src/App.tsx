import { Header } from './components/Header'
import { EditorPanel } from './components/EditorPanel'
import { PreviewPanel } from './components/PreviewPanel'
import { Footer } from './components/Footer'

export function App() {
    return (
        <div className="h-screen bg-bg text-text font-mono flex flex-col overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden min-h-0">
                <EditorPanel />
                <div className="w-px bg-border shrink-0" />
                <PreviewPanel />
            </div>
            <Footer />
        </div>
    )
}
