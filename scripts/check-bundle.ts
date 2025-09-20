import { promises as fs } from 'node:fs'
import path from 'node:path'

const manifestPath = path.join('.next', 'build-manifest.json')
const baselinePath = path.join('benchmarks', 'bundle-baseline.json')
const logsDir = path.join(process.cwd(), 'logs')
const outputPath = path.join(logsDir, 'bundle-size.json')

const THRESHOLD_PERCENT = Number(process.env.BUNDLE_DELTA_THRESHOLD ?? 0.05)

async function fileSize(bytesPath: string) {
  const stats = await fs.stat(bytesPath)
  return stats.size
}

async function sumChunkSizes(rootFiles: string[]) {
  const sizes = await Promise.all(
    rootFiles.map(file => fileSize(path.join('.next', file)))
  )

  return sizes.reduce((total, value) => total + value, 0)
}

async function run() {
  await fs.access(manifestPath)
  await fs.access(baselinePath)

  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
  const baseline = JSON.parse(await fs.readFile(baselinePath, 'utf8'))

  const totalBytes = await sumChunkSizes(manifest.rootMainFiles ?? [])
  const baselineBytes = baseline.rootMainBytes

  if (typeof baselineBytes !== 'number' || baselineBytes <= 0) {
    throw new Error('Invalid baseline rootMainBytes in benchmarks/bundle-baseline.json')
  }

  const delta = totalBytes - baselineBytes
  const deltaPercent = delta / baselineBytes

  await fs.mkdir(logsDir, { recursive: true })
  await fs.writeFile(
    outputPath,
    JSON.stringify(
      {
        measuredBytes: totalBytes,
        baselineBytes,
        delta,
        deltaPercent,
        threshold: THRESHOLD_PERCENT
      },
      null,
      2
    ),
    'utf8'
  )

  console.table({ totalBytes, baselineBytes, delta, deltaPercent })

  if (Math.abs(deltaPercent) > THRESHOLD_PERCENT) {
    throw new Error(
      `Bundle size regression detected: ${(deltaPercent * 100).toFixed(2)}% (threshold ${(THRESHOLD_PERCENT * 100).toFixed(2)}%)`
    )
  }
}

run().catch(error => {
  console.error('Bundle size check failed', error)
  process.exitCode = 1
})
