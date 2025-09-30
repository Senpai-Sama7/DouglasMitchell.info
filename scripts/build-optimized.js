#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const { performance } = require('perf_hooks');

// Build configuration
const BUILD_CONFIG = {
  cleanDirs: ['out', 'deploy', '.next'],
  staticFiles: [
    'index.html',
    'manifest.webmanifest', 
    'styles.css',
    'script.js',
    '.nojekyll',
    'robots.txt'
  ],
  buildTimeout: 300000, // 5 minutes
  retries: 2
};

class BuildOptimizer {
  constructor() {
    this.startTime = performance.now();
    this.logs = [];
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, ...data };
    this.logs.push(logEntry);
    
    const icon = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️' }[level] || 'ℹ️';
    console.log(`${icon} [${timestamp}] ${message}`);
    
    if (data && Object.keys(data).length > 0) {
      console.log('   ', data);
    }
  }

  async cleanPreviousBuilds() {
    this.log('info', 'Starting build cleanup...');
    
    for (const dir of BUILD_CONFIG.cleanDirs) {
      if (fs.existsSync(dir)) {
        try {
          fs.rmSync(dir, { recursive: true, force: true });
          this.log('success', `Cleaned directory: ${dir}`);
        } catch (error) {
          this.log('warn', `Failed to clean ${dir}`, { error: error.message });
        }
      }
    }
  }

  async executeCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        child.kill();
        reject(new Error(`Command timed out after ${BUILD_CONFIG.buildTimeout}ms`));
      }, BUILD_CONFIG.buildTimeout);

      const child = spawn('npm', ['run', 'build'], {
        env: { ...process.env, NODE_ENV: 'production' },
        stdio: 'pipe',
        ...options
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('exit', (code) => {
        clearTimeout(timeoutId);
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed with exit code ${code}\nstderr: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
    });
  }

  async buildWithRetry() {
    this.log('info', 'Building Next.js application...');
    
    for (let attempt = 1; attempt <= BUILD_CONFIG.retries; attempt++) {
      try {
        const startTime = performance.now();
        await this.executeCommand('build');
        const duration = Math.round(performance.now() - startTime);
        
        this.log('success', 'Next.js build completed', { 
          attempt, 
          durationMs: duration 
        });
        return;
      } catch (error) {
        this.log('error', `Build attempt ${attempt} failed`, { 
          error: error.message,
          attempt 
        });
        
        if (attempt === BUILD_CONFIG.retries) {
          throw new Error(`Build failed after ${BUILD_CONFIG.retries} attempts: ${error.message}`);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  async prepareDeployment() {
    this.log('info', 'Preparing deployment structure...');
    
    try {
      // Create deployment directory
      fs.mkdirSync('deploy', { recursive: true });

      // Copy static files
      let copiedFiles = 0;
      for (const file of BUILD_CONFIG.staticFiles) {
        if (fs.existsSync(file)) {
          fs.copyFileSync(file, path.join('deploy', file));
          copiedFiles++;
          this.log('success', `Copied static file: ${file}`);
        }
      }

      // Copy assets directory
      if (fs.existsSync('assets')) {
        fs.cpSync('assets', 'deploy/assets', { recursive: true });
        this.log('success', 'Copied assets directory');
      }

      // Copy Next.js output to /app subdirectory
      if (fs.existsSync('out')) {
        fs.mkdirSync('deploy/app', { recursive: true });
        fs.cpSync('out', 'deploy/app', { recursive: true });
        this.log('success', 'Copied Next.js app to /app');
      } else {
        this.log('warn', 'No Next.js output directory found');
      }

      // Ensure .nojekyll exists
      fs.writeFileSync('deploy/.nojekyll', '');
      
      this.log('success', 'Deployment structure ready', { 
        staticFilesCopied: copiedFiles 
      });

    } catch (error) {
      this.log('error', 'Failed to prepare deployment', { error: error.message });
      throw error;
    }
  }

  async generateBuildReport() {
    const totalTime = Math.round(performance.now() - this.startTime);
    
    const report = {
      timestamp: new Date().toISOString(),
      success: true,
      totalDurationMs: totalTime,
      deploymentPath: './deploy',
      logs: this.logs,
      structure: this.getDirectoryStructure('deploy')
    };

    // Write build report
    fs.writeFileSync('logs/build-report.json', JSON.stringify(report, null, 2));
    
    this.log('success', 'Build completed successfully!', {
      totalDurationMs: totalTime,
      reportPath: 'logs/build-report.json'
    });

    // Show deployment structure
    console.log('\n📂 Deployment structure:');
    this.showDirectoryStructure('deploy', '', 2);
    
    return report;
  }

  getDirectoryStructure(dir, maxDepth = 3) {
    try {
      return this._buildStructureTree(dir, maxDepth);
    } catch (error) {
      return { error: error.message };
    }
  }

  _buildStructureTree(dir, maxDepth, currentDepth = 0) {
    if (currentDepth >= maxDepth || !fs.existsSync(dir)) {
      return null;
    }

    const items = fs.readdirSync(dir);
    const structure = {};

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        structure[item] = this._buildStructureTree(itemPath, maxDepth, currentDepth + 1) || {};
      } else {
        structure[item] = { size: stats.size, type: 'file' };
      }
    }

    return structure;
  }

  showDirectoryStructure(dir, prefix = '', maxDepth = 2, currentDepth = 0) {
    if (currentDepth >= maxDepth || !fs.existsSync(dir)) return;

    try {
      const items = fs.readdirSync(dir);
      items.forEach((item, index) => {
        const itemPath = path.join(dir, item);
        const isLast = index === items.length - 1;
        const connector = isLast ? '└── ' : '├── ';

        console.log(prefix + connector + item);

        if (fs.statSync(itemPath).isDirectory() && currentDepth < maxDepth - 1) {
          const newPrefix = prefix + (isLast ? '    ' : '│   ');
          this.showDirectoryStructure(itemPath, newPrefix, maxDepth, currentDepth + 1);
        }
      });
    } catch (err) {
      console.log(prefix + '└── (error reading directory)');
    }
  }
}

// Main execution
async function main() {
  const builder = new BuildOptimizer();
  
  try {
    await builder.cleanPreviousBuilds();
    await builder.buildWithRetry();
    await builder.prepareDeployment();
    const report = await builder.generateBuildReport();
    
    process.exit(0);
  } catch (error) {
    builder.log('error', 'Build process failed', { error: error.message });
    
    // Write error report
    const errorReport = {
      timestamp: new Date().toISOString(),
      success: false,
      error: error.message,
      logs: builder.logs
    };
    
    fs.mkdirSync('logs', { recursive: true });
    fs.writeFileSync('logs/build-error.json', JSON.stringify(errorReport, null, 2));
    
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}