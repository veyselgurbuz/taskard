---
name: ship
description: Taskard quality gate (Definition of Done). Run at the end of every Phase plan step to test, review, document and commit the step in one go. Use when Veysel types /ship or asks to finish/ship a plan step.
---

# /ship: quality gate for a plan step

A step is done only with **review approval + passing tests + up-to-date docs** (CLAUDE.md, Brief Section 9.4). Talk to Veysel in Turkish. Keep the task list updated for each stage below.

Optional argument: a short summary of the step. If missing, write one yourself from the diff and the plan step.

## 0. Prepare

- Check the branch: work must be on a feature branch, not `main` (exception: commits explicitly agreed to go to `main`). If on `main`, ask Veysel before continuing.
- Determine the diff scope: `git status` and `git diff main...HEAD` plus uncommitted changes. Write a 2-4 sentence step summary (goal, what changed).

## 1. Tests: `unit-test-writer`

Run the `unit-test-writer` agent with: the list of changed source files, the step goal. If it reports bugs in application code, fix them in the main session (not via the agent) and re-run it.

## 2. Deterministic checks

Run, and fix until all pass:

```bash
npm run lint
npm run typecheck
npm run test:coverage   # all tests + 80% threshold for src/domain and src/data
```

## 3. Review: `code-reviewer` (at most 3 rounds)

Run the `code-reviewer` agent with only: the diff scope and the step goal. Do NOT give it your reasoning (independent view).

When the diff contains error handling, catch blocks or fallbacks, also run `pr-review-toolkit:silent-failure-hunter`; when it introduces new types, also run `pr-review-toolkit:type-design-analyzer`. Run them in parallel with `code-reviewer` and merge their findings into the same Kritik / Önemli / Öneri scale.

- Kritik or Önemli findings: fix them, re-run step 2, then review again.
- After the 3rd round still `DÜZELTME GEREKLİ`: stop and ask Veysel, show the open findings.
- Unfixed "Öneri" findings are passed to doc-keeper as known issues.

## 4. Docs: `doc-keeper`

Run the `doc-keeper` agent with: the diff scope, the step summary, the final code-reviewer result (findings + decision), the unit-test-writer result (tests + coverage). Review what it changed. Pass on any CLAUDE.md suggestions to Veysel; do not apply them silently.

## 5. Commit

- Stage code + tests + docs together. One commit, Conventional Commits message in English (`feat: ...`, `fix: ...`, `test: ...`, `docs: ...`, `chore: ...`), with the Co-Authored-By line from the session's attribution rules.
- The husky pre-commit hook runs lint-staged (ESLint + Prettier + related Jest tests) and typecheck. Never use `--no-verify`. If the hook fails, fix the cause and commit again (new commit attempt, not amend).
- Ask Veysel before pushing or opening the Pull Request.

## 6. Report to Veysel

Short Turkish summary: what was done, test and coverage result, review rounds and decision, updated docs, known issues, next step.
