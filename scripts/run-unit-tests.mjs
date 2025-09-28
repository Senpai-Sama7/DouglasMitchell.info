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
  const filters = process.argv.slice(2)
  let entryPoints = await collectTests(testGlobRoot)

  if (filters.length > 0) {
    entryPoints = entryPoints.filter(testPath =>
      filters.some(filter => testPath.includes(filter))
    )
  }

  if (entryPoints.length === 0) {
    const scope = filters.length > 0 ? ` matching filters: ${filters.join(', ')}` : ''
    console.warn(`[unit-tests] No test files found under tests/unit${scope}`)
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

  // Check if coverage is requested
  const enableCoverage = process.env.COVERAGE === 'true' || process.argv.includes('--coverage')

  await new Promise((resolve, reject) => {
    let child
    if (enableCoverage) {
      // Use c8 for coverage
      child = spawn('npx', [
        'c8',
        '--reporter=text',
        '--reporter=html',
        '--reporter=json',
        '--reports-dir=coverage',
        '--exclude=.tmp/**',
        '--exclude=tests/**',
        '--exclude=scripts/**',
        '--exclude=*.config.*',
        '--exclude=coverage/**',
        '--include=lib/**',
        '--include=app/**',
        process.execPath,
        '--test',
        ...compiledFiles
      ], {
        cwd: projectRoot,
        stdio: 'inherit'
      })
    } else {
      // Run tests without coverage
      child = spawn(process.execPath, ['--test', ...compiledFiles], {
        cwd: projectRoot,
        stdio: 'inherit'
      })
    }

    child.on('exit', code => {
      if (code === 0) resolve()
      else reject(new Error(`${enableCoverage ? 'c8 node' : 'node'} --test exited with code ${code}`))
    })
    child.on('error', reject)
  })
}

main().catch(error => {
  console.error('[unit-tests] Failed to run', error)
  process.exitCode = 1
})
