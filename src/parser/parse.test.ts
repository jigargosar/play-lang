import { describe, it, expect } from 'vitest'
import dedent from 'dedent'
import { parse } from './parse'

function clean(s: string) {
    return dedent(s).trim()
}

function expectParse(input: string) {
    const result = parse(clean(input))
    return {
        toBe(expected: string) {
            expect(result).toBe(clean(expected))
        },
    }
}

describe('parse', () => {
    it('passes through all input unchanged', () => {
        expectParse(`
            x = 1
            y = 2
            z = x + y
        `).toBe(`
            x = 1
            y = 2
            z = x + y
        `)
    })

    it('strips the // js boundary line', () => {
        expectParse(`
            // js
            x = 1
        `).toBe(`
            x = 1
        `)
    })

    it.skip('strips # comment lines', () => {
        expectParse(`
            # this is a comment
            x = 1
        `).toBe(`
            x = 1
        `)
    })
})
