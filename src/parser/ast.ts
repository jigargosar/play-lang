import { Literal, Node, Position } from 'unist'

export interface LineNode extends Literal {
    type: 'line'
    value: string
}

export interface CommentNode extends Literal {
    type: 'comment'
    value: string
}

export interface BoundaryNode extends Node {
    type: 'boundary'
}

export interface NewlineNode extends Literal {
    type: 'newline'
    value: string
}

export type PlayNode = LineNode | CommentNode | BoundaryNode | NewlineNode

export interface ProgramNode extends Node {
    type: 'program'
    children: PlayNode[]
}

export function makeNode(type: string, token: { line: number; col: number; value: string }): PlayNode {
    const position: Position = {
        start: { line: token.line, column: token.col },
        end: { line: token.line, column: token.col + token.value.length },
    }

    switch (type) {
        case 'line':
            return { type: 'line', value: token.value, position }
        case 'comment':
            return { type: 'comment', value: token.value, position }
        case 'boundary':
            return { type: 'boundary', position }
        case 'NL':
            return { type: 'newline', value: token.value, position }
        default:
            throw new Error(`Unknown node type: ${type}`)
    }
}
