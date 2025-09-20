#!/usr/bin/env node

const { execSync } = require('node:child_process')

function run(command) {
  return execSync(command, { encoding: 'utf8' }).trim()
}

function canResolve(ref) {
  try {
    run(`git rev-parse --verify ${ref}`)
    return true
  } catch (error) {
    return false
  }
}

function resolveBaseRef() {
  const envBase = process.env.GITHUB_BASE_REF
  if (envBase && canResolve(envBase)) {
    return envBase
  }

  if (canResolve('origin/main')) {
    return 'origin/main'
  }

  const initialCommit = run('git rev-list --max-parents=0 HEAD')
  return initialCommit
}

function main() {
  const baseRef = resolveBaseRef()
  const mergeBase = canResolve(`${baseRef}`) ? run(`git merge-base ${baseRef} HEAD`) : baseRef
  const changed = run(`git diff --name-only ${mergeBase} HEAD`)
    .split('\n')
    .filter(Boolean)

  const hasAdr = changed.some(filepath => filepath.startsWith('docs/adr/') && filepath.endsWith('.md'))

  if (!hasAdr) {
    console.error('ADR verification failed: update at least one docs/adr/ADR-*.md file for this change set.')
    process.exit(1)
  }

  console.log('ADR verification passed.')
}

main()
