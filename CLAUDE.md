# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

play is a small, opinionated programming language for frontend web development that transpiles to JavaScript. It is designed to be written inside its own live editor — "the editor and the language are built together" (HANDOFF.md).

## Repository structure

Everything lives under `docs/references/handoff/`:

1. `HANDOFF.md` — large context document, self-described as "the complete context for the play programming language project, written for an AI assistant picking up this project fresh." Contains settled decisions with reasoning, rejected approaches, open questions, key insights, and notes for AI.
2. `SPEC.md`, `SPEC_{1-8}.md` — spec iterations. Some content in these files differs from HANDOFF.md on the same topics (comments, booleans, function keywords). SPEC_8.md marks part of itself as "Old reference — not yet resettled."
3. `playground-{01-05}.html` — sequentially numbered playground versions. Each is a self-contained HTML file (Monaco editor + iframe preview). Each version builds on the previous; previous versions are not overwritten.
4. Imba reference material (HTML + assets folder) — design inspiration.

## Current state

As documented in HANDOFF.md: the project is at playground-05. A `// js` boundary splits source into a play section (parser handles) and a raw JS section (passthrough). The parser currently strips `#` comments above the boundary. HANDOFF.md describes the next step as playground-06 — a recursive descent parser scoped to `#` comments only.

## Manifesto (from HANDOFF.md)

1. Opinionated
2. One way of doing things
3. Minimum syntax, minimum concepts
4. Break these rules only with an explicit thesis
