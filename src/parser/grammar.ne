@{%
const moo = require("moo");
const lexer = moo.compile({
    boundary: /\/\/ js/,
    NL: { match: /\n/, lineBreaks: true },
    line: /[^\n]+/,
});
%}

@lexer lexer

main -> line:* {% (d) => d[0].join('') %}
line -> %boundary %NL {% () => '' %}
      | %line {% (d) => d[0].value %}
      | %NL {% (d) => d[0].value %}
