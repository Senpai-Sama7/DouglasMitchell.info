#!/usr/bin/env node
import { build } from 'esbuild'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

const projectRoot = process.cwd()
const testGlobRoot = path.join(projectRoot, 'tests', 'unit')
const outDir = path.join(projectRoot, '.tmp', 'tests', 'unit')

async function collectTests(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const tests = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      tests.push(...await collectTests(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      tests.push(fullPath)
    }
  }
  return tests
}

async function main() {
  const entryPoints = await collectTests(testGlobRoot)
  if (entryPoints.length === 0) {
    console.warn('[unit-tests] No test files found under tests/unit')
    return
  }

  await fs.rm(outDir, { recursive: true, force: true })
  await fs.mkdir(outDir, { recursive: true })

  await build({
    entryPoints,
    outdir: outDir,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node20',
    sourcemap: false,
    logLevel: 'warning',
    tsconfig: path.join(projectRoot, 'tsconfig.json'),
    external: ['node:*'],
  })

  const compiledFiles = entryPoints.map(testPath => {
    const relative = path.relative(testGlobRoot, testPath)
    const jsName = relative.replace(/\.ts$/, '.js')
    return path.join(outDir, jsName)
  })

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--test', ...compiledFiles], {
      cwd: projectRoot,
      stdio: 'inherit'
    })
    child.on('exit', code => {
      if (code === 0) resolve()
      else reject(new Error(`node --test exited with code ${code}`))
    })
    child.on('error', reject)
  })
}

main().catch(error => {
  console.error('[unit-tests] Failed to run', error)
  process.exitCode = 1
})
