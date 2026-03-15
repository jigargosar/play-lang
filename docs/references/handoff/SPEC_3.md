# play
*A small language for frontend web development.*

---

## Manifesto

- Opinionated
- One way of doing things
- Minimum syntax, minimum concepts
- Break these rules only with an explicit thesis

Built alongside its editor, each shaping the other — the language informs the editor experience, the editor reveals what the language needs.

---

## Syntax (draft)

### Assignment
```ruby
name = "play"
count = 0
active = yes
double = fn(x) x * 2
```

Rules:
- Plain `=` only
- All identifiers start with a lowercase letter
- Every statement starts with a lowercase letter or spaces (indented)

Excluded without ceremony:
- `const`, `let`, `var`
- `:=`, `<-`

---

## Syntax
> Old reference — not yet resettled

### Indentation
- 2 spaces mandatory
- Enforced by parser and editor
- Mixing indentation is a hard error
- Indent level = col / 2 — parser stays trivial

### Comments
- `#` only
- Full line and inline (after space)
- `#` inside strings is preserved

```ruby
# full line comment
x = 1 # inline comment
color = '#ff0000' # safe — inside string
```

### Booleans
- `yes` → `true`
- `no` → `false`

```ruby
active = yes
hidden = no
```

### Variables
- No `const`, `let`, or `var`
- Everything mutable
- Plain assignment

```ruby
name = "play"
count = 0
```

### Functions
Single keyword `fn`. No `function`, no `=>`, no `do`, no `def`.

```ruby
# named multi-line — implicit return
fn greet(name)
  "Hello " + name

# named one-line
fn double(x) x * 2

# anonymous assigned
double = fn(x) x * 2

# anonymous multi-line
double = fn(x)
  x * 2

# inline callback
items.forEach fn(item) render(item)

# inline callback multi-line
items.forEach fn(item)
  render(item)
```

Rules:
- Parens mandatory for args — eliminates ambiguity
- Something after `fn(args)` on same line → one-line body
- Nothing after `fn(args)` → indented block below
- Last expression in body is returned implicitly
- No-arg syntax — TBD (`fn init()` vs `fn init`)

---

## Roadmap

### Done
- playground-01 — Monaco + iframe + resizable split + debounced eval + status indicator
- playground-02 — void + warm dark theme, dark preview default
- playground-03 — custom `play` Monaco language, `#` comments, `yes`/`no`/`do`/`def` transforms, transpiler skips strings and hex colors
- playground-04 — warm dark tone (off pure black)

### In progress
- Settling language spec point by point

### Open questions
- No-arg functions — `fn init()` or `fn init`?
- String interpolation — `"Hello {name}"` or `"Hello ${name}"`?
- `if`/`elif`/`else`/`unless` syntax
- Loops
- Classes or alternative
- DOM / component layer
- CSS shorthands
- Pipe operator `|>`
- Import/export syntax

### Next
- Phase 3 — `fn` keyword, indentation blocks, implicit return, editor behaviors

---

## Appendix — Editor

The playground is a single HTML file. No build tooling. Monaco editor left, live iframe preview right, resizable divider. Code runs on every keystroke, debounced 300ms.

**Current transpiler** — regex pipeline, no AST:
1. Split source into code vs template literal segments
2. Strip `#` comments (preserves `#` inside strings)
3. `do(args)` → `(args) =>` (interim, being replaced by `fn`)
4. `yes`/`no` → `true`/`false`
5. Output injected into iframe as `<script>`

**Why single file?** Fastest iteration, zero tooling friction, opens in any browser. Migrate to Vite when outgrown.

**Why regex first?** Ship something working, understand the problem, then build the real parser. CoffeeScript started the same way.
