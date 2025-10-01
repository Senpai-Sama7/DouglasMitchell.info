#!/usr/bin/env node
import { build } from 'esbuild'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { performance } from 'node:perf_hooks'
import { cpus } from 'node:os'

const projectRoot = process.cwd()
const testGlobRoot = path.join(projectRoot, 'tests', 'unit')
const outDir = path.join(projectRoot, '.tmp', 'tests', 'unit')

// Enhanced configuration
const TEST_CONFIG = {
  maxWorkers: Math.min(cpus().length, 4),
  buildTarget: 'node20',
  timeout: 60000,  // Increased timeout
  retries: 1,
  reportFormats: ['json', 'console'],
  coverage: {
    threshold: 75,
    include: ['lib/**', 'app/**'],
    exclude: ['.tmp/**', 'tests/**', 'scripts/**', '*.config.*', 'coverage/**']
  }
}

class TestRunner {
  constructor() {
    this.startTime = performance.now()
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      tests: []
    }
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString()
    const icon = { info: '🔍', success: '✅', error: '❌', warn: '⚠️' }[level] || '🔍'
    console.log(`${icon} [${timestamp}] ${message}`)
    
    if (data && Object.keys(data).length > 0) {
      console.log('   ', data)
    }
  }

  async collectTests(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const tests = []
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        tests.push(...await this.collectTests(fullPath))
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        tests.push(fullPath)
      }
    }
    return tests
  }

  async buildTests(entryPoints) {
    this.log('info', `Building ${entryPoints.length} test files...`, {
      workers: TEST_CONFIG.maxWorkers,
      target: TEST_CONFIG.buildTarget
    })

    await fs.rm(outDir, { recursive: true, force: true })
    await fs.mkdir(outDir, { recursive: true })

    try {
      await build({
        entryPoints,
        outdir: outDir,
        bundle: true,
        platform: 'node',
        format: 'cjs',
        target: TEST_CONFIG.buildTarget,
        sourcemap: 'inline',
        logLevel: 'warning',
        tsconfig: path.join(projectRoot, 'tsconfig.json'),
        external: ['node:*'],
        define: {
          'process.env.NODE_ENV': '"test"'
        },
        plugins: [{
          name: 'test-build-progress',
          setup(build) {
            let count = 0
            build.onEnd(() => {
              count++
              if (count % 5 === 0) {
                console.log(`   Built ${count}/${entryPoints.length} test files`)
              }
            })
          }
        }]
      })

      this.log('success', 'Test compilation completed')
      return true
    } catch (error) {
      this.log('error', 'Test compilation failed', { error: error.message })
      throw error
    }
  }

  async executeTests(compiledFiles, enableCoverage) {
    const args = ['--test']
    
    // Note: --test-concurrency is not available in Node 20, using default concurrency
    args.push(...compiledFiles)

    return new Promise((resolve, reject) => {
      let child

      if (enableCoverage) {
        const c8Args = [
          'c8',
          '--reporter=text',
          '--reporter=html', 
          '--reporter=json',
          '--reports-dir=coverage',
          `--exclude=${TEST_CONFIG.coverage.exclude.join(',')}`,
          `--include=${TEST_CONFIG.coverage.include.join(',')}`,
          '--check-coverage',
          `--lines=${TEST_CONFIG.coverage.threshold}`,
          process.execPath,
          ...args
        ]
        
        child = spawn('npx', c8Args, {
          cwd: projectRoot,
          stdio: 'pipe'
        })
      } else {
        child = spawn(process.execPath, args, {
          cwd: projectRoot,
          stdio: 'pipe'
        })
      }

      let stdout = ''
      let stderr = ''

      child.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      child.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      const timeout = setTimeout(() => {
        child.kill()
        reject(new Error(`Tests timed out after ${TEST_CONFIG.timeout}ms`))
      }, TEST_CONFIG.timeout)

      child.on('exit', (code) => {
        clearTimeout(timeout)
        
        // Parse test results from output
        this.parseTestResults(stdout, stderr)
        
        if (code === 0) {
          resolve({ stdout, stderr, success: true })
        } else {
          resolve({ stdout, stderr, success: false, exitCode: code })
        }
      })

      child.on('error', (error) => {
        clearTimeout(timeout)
        reject(error)
      })
    })
  }

  parseTestResults(stdout, stderr) {
    const lines = stdout.split('\n')
    let testsFromSummary = false
    let passCount = 0
    let failCount = 0
    let testCount = -1

    for (const rawLine of lines) {
      const line = rawLine.trim()

      const summaryMatch = line.match(/^#\s+(tests|pass|fail)\s+(\d+)/i)
      if (summaryMatch) {
        testsFromSummary = true
        const [, key, value] = summaryMatch
        const count = Number.parseInt(value, 10) || 0
        if (key.toLowerCase() === 'tests') {
          testCount = count
        } else if (key.toLowerCase() === 'pass') {
          passCount = count
        } else if (key.toLowerCase() === 'fail') {
          failCount = count
        }
        continue
      }

      if (line.startsWith('ok ')) {
        passCount++
        testCount++
        continue
      }

      if (line.startsWith('not ok')) {
        failCount++
        testCount++
        continue
      }

      if (line.startsWith('✓ ')) {
        passCount++
        testCount++
        continue
      }

      if (line.startsWith('✗ ')) {
        failCount++
        testCount++
        continue
      }
    }

    if (testsFromSummary && testCount === -1) {
      testCount = passCount + failCount
    } else if (testCount === -1) {
      testCount = 0
    }

    this.results.total = testCount
    this.results.passed = passCount
    this.results.failed = failCount
    this.results.duration = Math.round(performance.now() - this.startTime)
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      config: TEST_CONFIG,
      success: this.results.failed === 0,
      coverage: await this.getCoverageReport()
    }

    // Ensure logs directory exists
    await fs.mkdir('logs', { recursive: true })

    // Write JSON report
    await fs.writeFile(
      'logs/test-results.json', 
      JSON.stringify(report, null, 2)
    )

    // Console summary
    this.log('info', 'Test Summary', {
      total: this.results.total,
      passed: this.results.passed,
      failed: this.results.failed,
      duration: `${this.results.duration}ms`,
      success: report.success
    })

    return report
  }

  async getCoverageReport() {
    try {
      const coveragePath = path.join(projectRoot, 'coverage', 'coverage-summary.json')
      if (await fs.access(coveragePath).then(() => true).catch(() => false)) {
        const coverage = JSON.parse(await fs.readFile(coveragePath, 'utf8'))
        return coverage.total
      }
    } catch (error) {
      this.log('warn', 'Could not read coverage report', { error: error.message })
    }
    return null
  }
}

async function main() {
  const runner = new TestRunner()
  const filters = process.argv.slice(2).filter(arg => !arg.startsWith('--'))
  const enableCoverage = process.env.COVERAGE === 'true' || process.argv.includes('--coverage')

  try {
    runner.log('info', 'Starting enhanced test runner...', {
      coverage: enableCoverage,
      filters: filters.length > 0 ? filters : 'none',
      workers: TEST_CONFIG.maxWorkers
    })

    let entryPoints = await runner.collectTests(testGlobRoot)

    if (filters.length > 0) {
      entryPoints = entryPoints.filter(testPath =>
        filters.some(filter => testPath.includes(filter))
      )
    }

    if (entryPoints.length === 0) {
      const scope = filters.length > 0 ? ` matching filters: ${filters.join(', ')}` : ''
      runner.log('warn', `No test files found under tests/unit${scope}`)
      return
    }

    // Build tests
    await runner.buildTests(entryPoints)

    // Prepare compiled file paths
    const compiledFiles = entryPoints.map(testPath => {
      const relative = path.relative(testGlobRoot, testPath)
      const jsName = relative.replace(/\.ts$/, '.js')
      return path.join(outDir, jsName)
    })

    // Execute tests
    runner.log('info', `Executing ${compiledFiles.length} test files...`)
    const testResult = await runner.executeTests(compiledFiles, enableCoverage)

    // Generate report
    const report = await runner.generateReport()

    if (!testResult.success) {
      runner.log('error', 'Tests failed', { 
        exitCode: testResult.exitCode,
        failed: runner.results.failed 
      })
      process.exitCode = 1
    } else {
      runner.log('success', 'All tests passed!', {
        total: runner.results.total,
        duration: `${runner.results.duration}ms`
      })
    }

  } catch (error) {
    runner.log('error', 'Test execution failed', { error: error.message })
    process.exitCode = 1
  }
}

main().catch(error => {
  console.error('[unit-tests] Failed to run', error)
  process.exitCode = 1
})
