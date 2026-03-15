declare module '*.ne' {
    import nearley from 'nearley'
    const grammar: nearley.CompiledRules
    export default grammar
}
