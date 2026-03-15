import nearley from 'nearley'
import compile from 'nearley/lib/compile'
import generate from 'nearley/lib/generate'
import nearleyGrammar from 'nearley/lib/nearley-language-bootstrapped'
import moo from 'moo'

const lexer = moo.compile({
    NL: { match: /\n/, lineBreaks: true },
    line: /[^\n]+/,
})

const grammarSource = `
@lexer lexer

main -> line:* {% (d) => d[0].join('') %}
line -> %line {% (d) => d[0].value %}
      | %NL {% (d) => d[0].value %}
`

function compileGrammar(sourceCode: string) {
    const grammarParser = new nearley.Parser(nearleyGrammar)
    grammarParser.feed(sourceCode)
    const grammarAst = grammarParser.results[0]
    const grammarInfoObject = compile(grammarAst, {})
    grammarInfoObject.lexer = lexer
    const grammarJs = generate(grammarInfoObject, 'grammar')
    const module = { exports: {} as Record<string, unknown> }
    eval(grammarJs)
    return module.exports
}

const compiledGrammar = compileGrammar(grammarSource)

export function parse(source: string): string {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(compiledGrammar))
    parser.feed(source)
    return parser.results[0]
}
