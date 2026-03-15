# play — Project Handoff

This document is the complete context for the play programming language project. It is written for an AI assistant picking up this project fresh. Read every section before making any decisions. Do not fill gaps with assumptions — if something is unclear, ask. Every decision here was made deliberately and the reasoning is documented. Respect it.

---

## What is play

play is a small, opinionated programming language for frontend web development that transpiles to JavaScript. It is designed to be written, run, and learned inside its own live editor. The editor and the language are built together — each shapes the other. The editor enforces the language rules, the language informs what the editor needs to do. You write play in play's editor. The feedback loop is the product.

play is not trying to be a general purpose language. It is not trying to replace JavaScript. It is trying to be a better surface for writing frontend web code — less ceremony, one way of doing things, opinionated defaults that you don't configure away.

The language is in early design and implementation. The playground editor is the primary artifact. The language spec is being settled point by point in conversation.

---

## Manifesto

These four points govern every decision. When in doubt, apply them:

- Opinionated
- One way of doing things
- Minimum syntax, minimum concepts
- Break these rules only with an explicit thesis

---

## Playground Versions

The playground is a single HTML file. No build tooling. No npm. No bundler. Opens in any browser. Monaco editor on the left, live iframe preview on the right, resizable divider between them. Code runs on every keystroke, debounced at 300ms. A status indicator shows ready/compiling/error.

Each version is numbered sequentially. Never overwrite a previous version. Each builds on the last.

- **playground-01** — Monaco editor + iframe preview + resizable split divider + debounced eval + status indicator. Transpiler is a stub passthrough. Theme: warm dark.
- **playground-02** — Switched to void + neon theme (true black, acid green accent). Fixed iframe height bug (flex:1). Dark preview default so eyes aren't blasted on load.
- **playground-03** — Registered `play` as a custom Monaco language with Monarch tokenizer. `#` comment highlighting works. First real transforms: `yes`/`no` → `true`/`false`, `do(args)` → `(args) =>`, `def` → `function`. Transpiler splits source at backtick boundaries to avoid transforming template literal contents. Comment stripper skips `#` inside quoted strings so hex colors like `#ff0000` survive.
- **playground-04** — Shifted editor from pure black `#000000` to warm dark `#131210`. Pure black was too harsh and felt cheap. Warm near-black has personality and the acid green accent reads better against it.
- **playground-05** — Introduced `// js` boundary. Everything above the boundary is play (parser handles it). Everything below is raw JS passthrough, untouched. Parser v1 just strips `#` comments above the boundary. This is the foundation for incremental real parser development. Regex transpiler retired.

---

## Current State

We are at playground-05. The `// js` boundary is established. The parser above the boundary currently only strips `#` comments — everything else is passthrough. The regex transpiler from earlier versions has been retired.

The language spec is being settled point by point in conversation. Several syntax items are settled (see Decisions section). Several are still open (see Open Questions section).

The immediate next task is playground-06: implement `#` comment parsing properly using a real recursive descent parser — not regex. Just comments. One thing at a time, incremental.

---

## Next Immediate Step

**playground-06** — real parser, scope limited to `#` comments only.

The parser should:
1. Split source at `// js` boundary
2. Walk the play section line by line
3. If a line starts with `#` as first non-space character → drop it
4. Everything else → pass through untouched
5. Concatenate play output + JS section → run in iframe

This is trivially simple but the point is to establish the real parser architecture — a proper line/token walker, not regex — so subsequent constructs (`fn`, `do`, indentation blocks) slot in cleanly.

Do NOT use regex in the new parser. Write a character/token walker.

---

## Key Insights

These are the important realizations from the design process. They are not obvious and cost time to arrive at. Respect them.

**1. The editor IS the product, not a tool for the language.**
The playground is not a demo tool. It is the primary interface for play. The language being strict (2 spaces mandatory, lowercase identifiers, etc.) is only acceptable because the editor enforces it invisibly. Without the editor, the strictness would be hostile. Together, they are a coherent product.

**2. `fn` and `do` serve different semantic purposes and must stay separate.**
We spent significant time trying to collapse `fn` and `do` into a single keyword. It looked clean on paper. The no-arg case broke it — `fn render` is ambiguous (is `render` the function name or an expression?). Keeping them separate eliminates all ambiguity: `fn` always has a name, `do` is always anonymous. This maps to how Imba uses `def` and `do` — the separation is proven.

**3. The `// js` boundary is the key to incremental parser development.**
Rather than writing a parser that handles all of JavaScript, we draw a hard line. Everything above `// js` is play — the parser only needs to handle our small language. Everything below is raw JS, handed directly to the JS engine. As the parser grows, the boundary moves down. This makes the parser tractable and lets us ship something working at every step.

**4. Regex on code is fundamentally fragile.**
The regex transpiler worked until it didn't. `#` in hex colors. `do` inside template literals. `yes` inside strings. Every edge case required another special case. A real parser with proper token awareness eliminates this entire class of bugs. The regex approach was correct as a prototype but had to be retired.

**5. Examples in the playground must not use features not yet implemented.**
Twice we wrote demo code that used language features the transpiler couldn't handle yet, causing runtime errors. The demo code must stay strictly within what the current parser supports. When a new feature lands, the demo updates to showcase it.

**6. Pure black (#000000) looks cheap.**
The editor theme uses warm dark `#131210` not pure black. Pure black has no personality and creates maximum contrast which is tiring. Warm near-black reads as intentional design.

**7. Preview is completely independent of editor theme.**
The right panel (iframe preview) is user-controlled rendering. It has nothing to do with the editor aesthetic. The base srcdoc template provides a neutral light background. Users style it however they want. Do not conflate the two.

**8. One way of doing things applies to the spec process too.**
When we tried to have multiple forms of the same concept (named fn, anonymous fn, inline fn all as separate cases), the complexity multiplied. Every time we found ourselves with two ways to do one thing, we picked one and dropped the other. This produced a cleaner language and a simpler parser.

---

## Decisions

Every decision below was made deliberately. The reasoning is included so future decisions stay consistent. Do not reverse these without an explicit thesis.

### Assignment

Plain `=` for all assignment. No `const`, `let`, or `var`. Everything mutable. No `:=` or `<-`.

All identifiers start with a lowercase letter. Every statement starts with a lowercase letter or spaces (indented lines). Uppercase identifiers are never valid — not for constants, not for types, not for anything. This was a deliberate choice to simplify the parser (line starting with uppercase is always an error) and enforce the one-way principle (no ALL_CAPS constants, no PascalCase types at this stage).

Reasoning: `const`/`let`/`var` distinctions add cognitive overhead and parser complexity for minimal benefit in a language this small. Mutability-by-default is simpler. We can add immutability hints later if there's a thesis for it.

### Comments

`#` as first non-space character of a line only. No inline comments. `#` anywhere else in a line is just a character with no special meaning — this makes hex colors like `#ff0000` safe without any string tracking in the parser.

Reasoning: Inline comments require the parser to track string boundaries on every line to distinguish `x = '#ff0000'` from `x = 1 # comment`. Restricting `#` to line-start eliminates this entirely. The cost is you put comments on their own line above the code. This forces a slightly more verbose commenting style but actually produces better code — you describe intent before the line, not alongside it. Python developers do this naturally.

Excluded: `//`, `/* */`, `###` multiline blocks, inline comments.

### Booleans

`true` and `false` only. We initially had `yes`/`no` from Imba but reversed this decision after examining real usage examples. `btn.disabled = false` vs `btn.disabled = no` — the readability difference is marginal. `true`/`false` are universally understood, require no transpilation, and JS interop is natural. The real argument for `yes`/`no` was manifesto consistency, not readability. `true`/`false` won on pragmatism.

### Indentation

2 spaces mandatory. Not 4. Not tabs. Not configurable. Hard error if mixed or wrong.

Reasoning: With 2 spaces hardcoded, indent level = col / 2 — integer division, parser stays trivial. No need to detect what indentation style the file uses. No tabs vs spaces debate. The editor enforces it invisibly (Tab key inserts exactly 2 spaces, paste normalizes incoming indentation). The cost is copy-pasting 4-space JS code breaks — but that's handled by a single reformat button, not a language concern.

### Functions — fn and do

Two keywords, clean separation:

`fn` — named function declaration. Always has a name. Always has parens. Always a declaration. Never a value on its own.

```
fn greet(name)
  "Hello " + name

fn double(x) x * 2
```

`do` — anonymous function value. Never has a name. Parens optional (required if has args, omitted if no args). Always a value — passed around, assigned, returned.

```
items.forEach do(item) render(item)
double = do(x) x * 2
btn.onClick do render()
btn.onClick do
  setup()
  render()
```

Both support one-line and multi-line (indented block) body. Last expression in body is returned implicitly.

Reasoning: We spent significant time trying to collapse these into one keyword `fn`. The no-arg case was the breaking point — `fn render` is ambiguous. With two keywords, the parser has zero ambiguity: `fn` → always followed by name + parens, `do` → always anonymous. This mirrors Imba's `def`/`do` separation which is proven in practice. The two keywords also map to how developers think — `fn` is something you define and name, `do` is something you pass around.

Excluded: `function`, `=>`, `def`, single-keyword approaches.

### // js Boundary

`// js` on its own line splits the source into two sections. Everything above is play — the parser handles it. Everything below is raw JavaScript — passed directly to the JS engine untouched.

This is not a permanent language feature. It is a development escape hatch that exists because the parser is incomplete. As the parser grows, the `// js` line moves down. Eventually it disappears when the parser handles everything. Users can always drop to raw JS for anything not yet supported.

Reasoning: Writing a parser that handles all of JavaScript from day one is intractable. The boundary makes the parser tractable — it only needs to handle our small language above the line. This lets us ship a working playground at every step of parser development.

### Parser Architecture

Regex transpiler is retired. The new parser is a proper recursive descent parser — a character/token walker, not regex substitution. It is built incrementally: one construct at a time, one playground version at a time.

Reasoning: The regex approach was correct as a prototype. It proved the pipeline works. It broke down on edge cases (hex colors, template literals, strings containing keywords) in ways that required ever more special cases. A proper parser with token awareness eliminates this entire class of bugs cleanly.

---

## Rejected Approaches

### Collapsing fn and do into one keyword

Tried: Single `fn` keyword for both named and anonymous functions.
Problem: No-arg anonymous function is ambiguous — `fn render` looks like a named function declaration. Introducing context-sensitivity to resolve this made the parser more complex than just having two keywords.
Decision: Keep `fn` and `do` as separate keywords with clear semantic roles.

### Named one-line fn with no parens — `fn foo x y`

Tried: Space-separated args with no parens to reduce punctuation.
Problem: Parser can't distinguish `fn foo x y` (name=foo, args=x,y) from `fn foo` (name=foo, no args, body=x y). Requires lookahead and context sensitivity.
Decision: Parens mandatory for args. Small ceremony, eliminates ambiguity entirely.

### yes/no booleans

Tried: `yes` → `true`, `no` → `false` as Imba-style boolean aliases.
Problem: Examining real usage (`btn.disabled = no` vs `btn.disabled = false`) showed marginal readability benefit. `true`/`false` are universal, require no transpilation, natural JS interop.
Decision: `true` and `false` only.

### Inline # comments

Tried: `x = 1 # this is a comment` — hash after a space is a comment.
Problem: Parser must track string boundaries on every line to distinguish `'#ff0000'` from `# comment`. Character-level tracking on every line for every file.
Decision: `#` only valid at line start. Simpler parser, forces cleaner commenting style.

### Regex transpiler

Used in playground-01 through playground-04. Split source at backtick boundaries, ran regex substitutions for each transform. Worked for simple cases.
Problems: `#` in hex colors eaten by comment stripper. `do` inside template literals transformed incorrectly. `yes` inside strings replaced. Each edge case required another special case. Fundamentally fragile.
Decision: Retired in playground-05. Replaced with proper parser architecture.

### Single HTML file becoming unwieldy

Considered splitting playground into multiple files with a build step.
Decision: Stay single file. No build tooling until there is a concrete reason. The simplicity of opening one file in a browser is worth the awkwardness of a long file. Monaco, iframe, parser, initial code — all in one file.

---

## Open Questions

These syntax items have not been settled yet. Do not assume defaults — discuss with the user before implementing.

- **No-arg fn** — `fn init()` or `fn init`? Parens mandatory elsewhere but empty parens feel like ceremony.
- **No-arg do** — `do` with no parens, no args. How does parser distinguish `do render()` (no-arg do with inline body) from `do` (no-arg do with indented body)?
- **String interpolation** — `"Hello {name}"` like Imba or `"Hello ${name}"` like JS template literals?
- **if/elif/else/unless** — syntax not yet designed.
- **Loops** — syntax not yet designed.
- **Classes** — do we have them? Alternative? Not yet discussed.
- **Import/export** — syntax not yet designed. Likely close to JS.
- **Pipe operator** — `value |> transform` — mentioned, not settled.
- **DOM / element syntax** — `<div.panel>` style inline elements. Not yet designed. Major feature.
- **CSS shorthands** — `d:flex c:red` style. Inspired by Imba. Not yet designed.
- **Two-way binding** — `bind=` style. Inspired by Imba. Not yet designed.

---

## Future Direction

This section is exploratory. Nothing here is settled. It represents the direction the project is heading but details are not decided.

### Language

The scripting layer (what we're building now) is the foundation. Once `fn`, `do`, indentation blocks, and basic control flow work, the next layer is the DOM/component system. This is where play becomes genuinely interesting:

- Native web components — play tags compile to Custom Elements
- Inline element syntax — `<div.panel @click=handler>` style
- CSS shorthands — `d:flex c:red bgc:amber` inline styles
- Scoped CSS — styles scoped to component by default
- Two-way binding — `bind=` eliminates onChange boilerplate
- morphdom for DOM reconciliation — surgical updates without virtual DOM

The server side is just syntactic sugar over Node/Express. No reinventing HTTP. Just cleaner syntax for existing libraries.

### Editor

The playground will grow into a proper editor with:
- Tab key → always inserts 2 spaces
- Enter after block-opening line → auto-indents 2 spaces
- Shift+Tab → removes exactly 2 spaces
- Paste normalization → incoming code normalized to 2-space indentation automatically
- Indentation inference — editor knows when a block is expected and auto-indents

### Recording (Scrimba-style)

Eventually the playground will support Scrimba-style interactive recordings:
- Record editor state changes + audio instead of video pixels
- Playback replays diffs into live Monaco editor synced to audio
- Viewer can pause, edit code, run it, resume
- The "video" is a JSON array of `{timestamp, code}` + audio file
- This is a separate product-level feature, not near-term

### Dogfooding

Eventually the playground itself gets rewritten in play. The editor is built using the language it runs. This is the long-term goal and a strong product story.

---

## Important Notes for AI

1. Never mutate SPEC.md or any project file without explicit user approval. Always show a draft first and wait for explicit approval ("yes", "go", "agreed") before writing to disk.

2. Playground files are numbered sequentially. Never overwrite a previous version. New version = new number.

3. The user is very deliberate about decisions. Do not assume, do not skip ahead, do not generate content that hasn't been discussed. If unsure, ask.

4. Incremental is the principle. One feature per playground version. One syntax item at a time. Do not bundle multiple changes.

5. The spec is a living document. Update it only after explicit approval of each item.

6. Parser development is incremental. playground-06 handles only `#` comments. `fn` comes after. `do` after that. Indentation blocks after that. One per version.

7. The user catches everything. Do not be lazy. Read back what you wrote before presenting it.
