@{%
const moo = require("moo");
const lexer = moo.compile({
    NL: { match: /\n/, lineBreaks: true },
    line: /[^\n]+/,
});
%}

@lexer lexer

main -> line:* {% (d) => d[0].join('') %}
line -> %line {% (d) => d[0].value %}
      | %NL {% (d) => d[0].value %}
