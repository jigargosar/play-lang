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

function toESM(cjs: string): string {
    return cjs
        .replace('(function () {', '')
        .replace(/\}\)\(\);?\s*$/, '')
        .replace(/if \(typeof module.*\n.*\n.*\n.*\n.*/, 'export default grammar;')
        .replace("const moo = require(\"moo\");", "import moo from 'moo';")
}

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
            const cjs = execSync(`pnpm exec nearleyc "${id}"`, { encoding: 'utf-8' })
            return { code: toESM(cjs), map: null }
        },
    }
}
