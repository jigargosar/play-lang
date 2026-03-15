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

function parseGrammarSource(grammarSource: string) {
    const grammarParser = new nearley.Parser(nearleyGrammar)
    grammarParser.feed(grammarSource)
    return getOnly(grammarParser.results, 'Grammar parse: expected exactly 1 result')
}

function evalGrammarJs(grammarJs: string, _lexer: moo.Lexer) {
    const module = { exports: {} as Record<string, unknown> }
    eval(grammarJs)
    return module.exports
}

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

function compileGrammar(grammarSource: string, lexer: moo.Lexer) {
    return pipe(
        grammarSource,
        parseGrammarSource,
        (ast) => {
            const info = compile(ast, {})
            info.lexer = lexer
            return info
        },
        (info) => generate(info, 'playGrammar'),
        (js) => evalGrammarJs(js, lexer),
        nearley.Grammar.fromCompiled,
    )
}

const grammar = compileGrammar(grammarSource, playLexer)

export function parse(source: string): string {
    const parser = new nearley.Parser(grammar)
    parser.feed(source)
    return getOnly(parser.results, 'Parse: expected exactly 1 result')
}
