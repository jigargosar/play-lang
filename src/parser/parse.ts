import nearley from 'nearley'
import grammar from './grammar.ne'

function getOnly<T>(arr: T[], errMsg: string): T {
    if (arr.length !== 1) {
        console.error(errMsg, JSON.stringify(arr, null, 2))
        throw new Error(errMsg)
    }
    return arr[0]
}

const compiledGrammar = nearley.Grammar.fromCompiled(grammar)

export function parse(source: string): string {
    const parser = new nearley.Parser(compiledGrammar)
    parser.feed(source)
    return getOnly(parser.results, 'Parse: expected exactly 1 result')
}
