import nearley from 'nearley'
import compile from 'nearley/lib/compile'
import generate from 'nearley/lib/generate'
import nearleyGrammar from 'nearley/lib/nearley-language-bootstrapped'
import moo from 'moo'
import { pipe } from 'remeda'


function getOnly<T>(arr: T[], errMsg: string): T {
    if (arr.length !== 1) {
        console.error(errMsg, JSON.stringify(arr, null, 2))
        throw new Error(errMsg)
    }
    return arr[0]
}

// The grammar directive `@lexer _lexer` tells Nearley to reference
// a variable named `_lexer` at parse time. The generated JS code
// from `generate()` contains `var grammar = { Lexer: _lexer, ... }`.
// `evalGrammarJs` receives the lexer as a parameter named `_lexer`
// so eval can resolve that reference.

const playLexer = moo.compile({
    NL: { match: /\n/, lineBreaks: true },
    line: /[^\n]+/,
})

const grammarSource = `
@lexer _lexer

main -> line:* {% (d) => d[0].join('') %}
line -> %line {% (d) => d[0].value %}
      | %NL {% (d) => d[0].value %}
`.trim()

const grammar = pipe(
    grammarSource,
    (src) => {
        const p = new nearley.Parser(nearleyGrammar)
        p.feed(src)
        return getOnly(p.results, 'Grammar parse: expected exactly 1 result')
    },
    (ast) => {
        const info = compile(ast, {})
        info.lexer = playLexer
        return info
    },
    (info) => generate(info, 'playGrammar'),
    (js) => {
        // eval expects `_lexer` variable to match `@lexer _lexer` directive
        // noinspection JSUnusedLocalSymbols
        const _lexer = playLexer
        const module = { exports: {} as Record<string, unknown> }
        eval(js)
        return module.exports
    },
    nearley.Grammar.fromCompiled,
)

export function parse(source: string): string {
    const parser = new nearley.Parser(grammar)
    parser.feed(source)
    return getOnly(parser.results, 'Parse: expected exactly 1 result')
}
