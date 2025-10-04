#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import 'dotenv/config'

const root = process.cwd()
const evidenceDir = path.join(root, 'evidence')
await fs.mkdir(evidenceDir, { recursive: true })

const tasks = [
  { name: 'build', cmd: 'npm', args: ['run', 'build'], log: 'build.log' },
  { name: 'lint', cmd: 'npm', args: ['run', 'lint'], log: 'lint.log' },
  { name: 'unit', cmd: 'node', args: ['scripts/run-unit-tests.mjs', '--coverage'], log: 'unit-tests.log' }
]

function runTask({ cmd, args }) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], env: process.env })
    let out = ''
    let err = ''
    child.stdout.on('data', (d) => {
      out += d.toString()
    })
    child.stderr.on('data', (d) => {
      err += d.toString()
    })
    child.on('close', (code) => {
      resolve({ code, out, err })
    })
  })
}

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex')
}

const checksums = []

let hasFailed = false
for (const t of tasks) {
  console.log(`==> Running ${t.name}`)
  const res = await runTask(t)
  const body = [
    `# evidence/${t.log}`,
    `# exitCode=${res.code}`,
    '',
    '----- STDOUT -----',
    res.out.trim(),
    '',
    '----- STDERR -----',
    res.err.trim()
  ].join('\n')
  const logPath = path.join(evidenceDir, t.log)
  await fs.writeFile(logPath, body, 'utf8')
  checksums.push(`${sha256(Buffer.from(body))}  ${t.log}`)
  if (res.code !== 0) {
    console.error(`Task ${t.name} failed with code ${res.code}`)
    hasFailed = true
  }
}

if (hasFailed) {
  console.error('\nOne or more tasks failed. Exiting with error.')
  process.exit(1)
}

await fs.writeFile(path.join(evidenceDir, 'sha256sums.txt'), checksums.join('\n') + '\n', 'utf8')

const summary = {
  timestamp: new Date().toISOString(),
  outcomes: Object.fromEntries(tasks.map((t) => [t.name, `evidence/${t.log}`])),
  checksums: 'evidence/sha256sums.txt'
}
await fs.writeFile(path.join(evidenceDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8')
console.log('Evidence generated.')
