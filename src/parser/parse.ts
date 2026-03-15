import nearley from 'nearley'
import grammar from './grammar.ne'
import { ProgramNode, PlayNode, makeNode } from './ast'

function getOnly<T>(arr: T[], errMsg: string): T {
    if (arr.length !== 1) {
        console.error(errMsg, JSON.stringify(arr, null, 2))
        throw new Error(errMsg)
    }
    return arr[0]
}

const compiledGrammar = nearley.Grammar.fromCompiled(grammar)

function tokenize(source: string): any[] {
    const parser = new nearley.Parser(compiledGrammar)
    parser.feed(source)
    return getOnly(parser.results, 'Parse: expected exactly 1 result')
}

function toAst(tokens: any[]): ProgramNode {
    const children: PlayNode[] = tokens.map((token) => makeNode(token.type, token))
    return { type: 'program', children }
}

function codegen(ast: ProgramNode): string {
    return ast.children
        .filter((node) => node.type !== 'comment' && node.type !== 'boundary')
        .map((node) => {
            if (node.type === 'line' || node.type === 'newline') return node.value
            return ''
        })
        .join('')
}

export function parse(source: string): string {
    const tokens = tokenize(source)
    const ast = toAst(tokens)
    return codegen(ast)
}
