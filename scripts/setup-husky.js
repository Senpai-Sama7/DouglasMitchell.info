#!/usr/bin/env node

const { execSync } = require('node:child_process')

try {
  execSync('git config core.hooksPath .husky', { stdio: 'inherit' })
} catch (error) {
  console.warn('Failed to configure git hooks path for husky:', error.message)
}
