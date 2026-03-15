import { execSync } from 'node:child_process'
import { existsSync, writeFileSync } from 'node:fs'
import { Plugin } from 'vite'

const DTS_FILE = 'src/nearley.d.ts'
const DTS_CONTENT = `declare module '*.ne' {
    import nearley from 'nearley'
    const grammar: nearley.CompiledRules
    export default grammar
}
`

export default function nearleyPlugin(): Plugin {
    return {
        name: 'vite-plugin-nearley',
        buildStart() {
            if (!existsSync(DTS_FILE)) {
                writeFileSync(DTS_FILE, DTS_CONTENT)
            }
        },
        transform(_code, id) {
            if (!id.endsWith('.ne')) return null
            return {
                code: execSync(`npx nearleyc "${id}"`, { encoding: 'utf-8' }),
                map: null,
            }
        },
    }
}
