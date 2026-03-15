@{%
const moo = require("moo");
const lexer = moo.compile({
    boundary: /\/\/ js/,
    comment: /[ \t]*#[^\n]*/,
    NL: { match: /\n/, lineBreaks: true },
    line: /[^\n]+/,
});
%}

@lexer lexer

main -> token:* {% (d) => d[0] %}
token -> %boundary %NL {% (d) => d[0] %}
       | %comment %NL {% (d) => d[0] %}
       | %line {% (d) => d[0] %}
       | %NL {% (d) => d[0] %}
