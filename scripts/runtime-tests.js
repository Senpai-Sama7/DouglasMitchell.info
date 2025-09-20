#!/usr/bin/env node

/**
 * Runtime Tests for Static Site
 * Validates critical functionality without full browser testing
 */

const fs = require('fs');
const path = require('path');

class RuntimeTester {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '✓',
      warn: '⚠',
      error: '✗'
    }[type];

    console.log(`[${timestamp}] ${prefix} ${message}`);

    if (type === 'error') {
      this.errors.push(message);
      this.results.failed++;
    } else if (type === 'warn') {
      this.warnings.push(message);
      this.results.warnings++;
    } else {
      this.results.passed++;
    }
  }

  async runTests() {
    console.log('🧪 Starting Runtime Tests\n');

    await this.testFileStructure();
    await this.testHTMLValidation();
    await this.testCSSValidation();
    await this.testJavaScriptValidation();
    await this.testAssetOptimization();
    await this.testConfigurationFiles();
    await this.testSecurityHeaders();
    await this.testPerformanceOptimizations();

    this.generateReport();
  }

  async testFileStructure() {
    console.log('📁 Testing File Structure...');

    const requiredFiles = [
      'index.html',
      'styles.css',
      'script.js',
      'manifest.webmanifest',
      'assets/icon.svg'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        this.log(`Required file exists: ${file}`);
      } else {
        this.log(`Missing required file: ${file}`, 'error');
      }
    }

    // Check for unwanted files
    const unwantedPatterns = [
      '.DS_Store',
      'Thumbs.db',
      'desktop.ini',
      '*.tmp',
      '*.log'
    ];

    const checkUnwanted = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          checkUnwanted(filePath);
        } else {
          unwantedPatterns.forEach(pattern => {
            if (file.includes(pattern.replace('*', ''))) {
              this.log(`Found unwanted file: ${filePath}`, 'warn');
            }
          });
        }
      });
    };

    try {
      checkUnwanted(process.cwd());
    } catch (error) {
      this.log(`Error checking unwanted files: ${error.message}`, 'warn');
    }
  }

  async testHTMLValidation() {
    console.log('📄 Testing HTML Validation...');

    const indexPath = path.join(process.cwd(), 'index.html');
    if (!fs.existsSync(indexPath)) {
      this.log('index.html not found for validation', 'error');
      return;
    }

    const html = fs.readFileSync(indexPath, 'utf8');

    // Basic HTML structure validation
    const htmlChecks = [
      {
        test: /<!doctype html>/i,
        message: 'DOCTYPE declaration present'
      },
      {
        test: /<html[^>]*lang=/,
        message: 'HTML lang attribute present'
      },
      {
        test: /<meta[^>]*charset=/,
        message: 'Charset meta tag present'
      },
      {
        test: /<meta[^>]*viewport=/,
        message: 'Viewport meta tag present'
      },
      {
        test: /<title>/,
        message: 'Title tag present'
      },
      {
        test: /<meta[^>]*description=/,
        message: 'Description meta tag present'
      }
    ];

    htmlChecks.forEach(({ test, message }) => {
      if (test.test(html)) {
        this.log(message);
      } else {
        this.log(`Missing: ${message}`, 'error');
      }
    });

    // Accessibility checks
    const accessibilityChecks = [
      {
        test: /class="skip"/,
        message: 'Skip link present'
      },
      {
        test: /aria-label=/,
        message: 'ARIA labels present'
      },
      {
        test: /alt=/,
        message: 'Alt attributes present (if images exist)'
      }
    ];

    accessibilityChecks.forEach(({ test, message }) => {
      if (test.test(html)) {
        this.log(message);
      } else {
        this.log(`Accessibility concern: ${message}`, 'warn');
      }
    });

    // Check for potential issues
    const issues = [
      {
        test: /javascript:/,
        message: 'javascript: URLs found (security risk)',
        type: 'error'
      },
      {
        test: /onclick=/,
        message: 'Inline onclick handlers found',
        type: 'warn'
      },
      {
        test: /style=/,
        message: 'Inline styles found',
        type: 'warn'
      }
    ];

    issues.forEach(({ test, message, type }) => {
      if (test.test(html)) {
        this.log(message, type);
      }
    });
  }

  async testCSSValidation() {
    console.log('🎨 Testing CSS Validation...');

    const cssPath = path.join(process.cwd(), 'styles.css');
    if (!fs.existsSync(cssPath)) {
      this.log('styles.css not found for validation', 'error');
      return;
    }

    const css = fs.readFileSync(cssPath, 'utf8');

    // CSS best practices
    const cssChecks = [
      {
        test: /:root\s*{/,
        message: 'CSS custom properties defined'
      },
      {
        test: /@media/,
        message: 'Responsive design media queries present'
      },
      {
        test: /box-sizing:\s*border-box/,
        message: 'Border-box sizing used'
      },
      {
        test: /clamp\(/,
        message: 'Fluid typography with clamp() used'
      }
    ];

    cssChecks.forEach(({ test, message }) => {
      if (test.test(css)) {
        this.log(message);
      } else {
        this.log(`CSS best practice: ${message}`, 'warn');
      }
    });

    // Check for potential issues
    const cssIssues = [
      {
        test: /!important/g,
        message: '!important usage found',
        type: 'warn'
      },
      {
        test: /position:\s*fixed/g,
        message: 'Fixed positioning used (check mobile compatibility)',
        type: 'warn'
      }
    ];

    cssIssues.forEach(({ test, message, type }) => {
      const matches = css.match(test);
      if (matches) {
        this.log(`${message} (${matches.length} occurrences)`, type);
      }
    });

    // File size check
    const stats = fs.statSync(cssPath);
    const sizeKB = Math.round(stats.size / 1024);
    if (sizeKB > 50) {
      this.log(`CSS file is large: ${sizeKB}KB`, 'warn');
    } else {
      this.log(`CSS file size acceptable: ${sizeKB}KB`);
    }
  }

  async testJavaScriptValidation() {
    console.log('⚡ Testing JavaScript Validation...');

    const jsPath = path.join(process.cwd(), 'script.js');
    if (!fs.existsSync(jsPath)) {
      this.log('script.js not found for validation', 'error');
      return;
    }

    const js = fs.readFileSync(jsPath, 'utf8');

    // JavaScript best practices
    const jsChecks = [
      {
        test: /addEventListener/,
        message: 'Event listeners properly attached'
      },
      {
        test: /\?\./,
        message: 'Optional chaining used for safety'
      },
      {
        test: /try\s*{|catch\s*\(/,
        message: 'Error handling present'
      }
    ];

    jsChecks.forEach(({ test, message }) => {
      if (test.test(js)) {
        this.log(message);
      } else {
        this.log(`JavaScript best practice: ${message}`, 'warn');
      }
    });

    // Check for potential issues
    const jsIssues = [
      {
        test: /console\.(log|warn|error)/g,
        message: 'Console statements found (remove for production)',
        type: 'warn'
      },
      {
        test: /eval\(/,
        message: 'eval() usage found (security risk)',
        type: 'error'
      },
      {
        test: /innerHTML\s*=/,
        message: 'innerHTML usage found (potential XSS risk)',
        type: 'warn'
      }
    ];

    jsIssues.forEach(({ test, message, type }) => {
      const matches = js.match(test);
      if (matches) {
        this.log(`${message} (${matches.length} occurrences)`, type);
      }
    });

    // File size check
    const stats = fs.statSync(jsPath);
    const sizeKB = Math.round(stats.size / 1024);
    if (sizeKB > 10) {
      this.log(`JavaScript file is large: ${sizeKB}KB`, 'warn');
    } else {
      this.log(`JavaScript file size acceptable: ${sizeKB}KB`);
    }
  }

  async testAssetOptimization() {
    console.log('🖼️ Testing Asset Optimization...');

    const assetsDir = path.join(process.cwd(), 'assets');
    if (!fs.existsSync(assetsDir)) {
      this.log('Assets directory not found', 'warn');
      return;
    }

    const assets = fs.readdirSync(assetsDir);

    assets.forEach(asset => {
      const assetPath = path.join(assetsDir, asset);
      const stats = fs.statSync(assetPath);
      const sizeKB = Math.round(stats.size / 1024);

      if (asset.endsWith('.svg')) {
        if (sizeKB > 50) {
          this.log(`SVG file is large: ${asset} (${sizeKB}KB)`, 'warn');
        } else {
          this.log(`SVG file size acceptable: ${asset} (${sizeKB}KB)`);
        }
      } else if (asset.match(/\.(jpg|jpeg|png|webp)$/)) {
        if (sizeKB > 500) {
          this.log(`Image file is large: ${asset} (${sizeKB}KB)`, 'warn');
        } else {
          this.log(`Image file size acceptable: ${asset} (${sizeKB}KB)`);
        }
      }
    });
  }

  async testConfigurationFiles() {
    console.log('⚙️ Testing Configuration Files...');

    const configFiles = [
      {
        file: 'manifest.webmanifest',
        required: true,
        checks: [
          { test: /"name"/, message: 'App name defined' },
          { test: /"icons"/, message: 'Icons defined' },
          { test: /"start_url"/, message: 'Start URL defined' }
        ]
      },
      {
        file: '.nojekyll',
        required: true,
        message: 'Jekyll bypass file present'
      }
    ];

    configFiles.forEach(({ file, required, checks, message }) => {
      const filePath = path.join(process.cwd(), file);

      if (fs.existsSync(filePath)) {
        if (message) {
          this.log(message);
        }

        if (checks) {
          const content = fs.readFileSync(filePath, 'utf8');
          checks.forEach(({ test, message }) => {
            if (test.test(content)) {
              this.log(message);
            } else {
              this.log(`Missing in ${file}: ${message}`, 'warn');
            }
          });
        }
      } else if (required) {
        this.log(`Missing required config file: ${file}`, 'error');
      }
    });
  }

  async testSecurityHeaders() {
    console.log('🔒 Testing Security Considerations...');

    const indexPath = path.join(process.cwd(), 'index.html');
    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf8');

      // Security checks
      const securityChecks = [
        {
          test: /<meta[^>]*http-equiv="Content-Security-Policy"/,
          message: 'CSP meta tag found',
          optional: true
        },
        {
          test: /<meta[^>]*http-equiv="X-Content-Type-Options"/,
          message: 'X-Content-Type-Options header found',
          optional: true
        }
      ];

      securityChecks.forEach(({ test, message, optional }) => {
        if (test.test(html)) {
          this.log(message);
        } else if (optional) {
          this.log(`Optional security feature: ${message}`, 'warn');
        } else {
          this.log(`Missing security feature: ${message}`, 'error');
        }
      });
    }
  }

  async testPerformanceOptimizations() {
    console.log('🚀 Testing Performance Optimizations...');

    const indexPath = path.join(process.cwd(), 'index.html');
    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf8');

      // Performance checks
      const perfChecks = [
        {
          test: /defer/,
          message: 'Script defer attribute used'
        },
        {
          test: /preload/,
          message: 'Resource preloading used',
          optional: true
        },
        {
          test: /rel="dns-prefetch"/,
          message: 'DNS prefetch used',
          optional: true
        }
      ];

      perfChecks.forEach(({ test, message, optional }) => {
        if (test.test(html)) {
          this.log(message);
        } else if (optional) {
          this.log(`Optional optimization: ${message}`, 'warn');
        }
      });
    }

    // Check total payload size
    const files = ['index.html', 'styles.css', 'script.js'];
    let totalSize = 0;

    files.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }
    });

    const totalKB = Math.round(totalSize / 1024);
    if (totalKB > 100) {
      this.log(`Total payload is large: ${totalKB}KB`, 'warn');
    } else {
      this.log(`Total payload size acceptable: ${totalKB}KB`);
    }
  }

  generateReport() {
    console.log('\n📊 Runtime Test Report');
    console.log('========================');
    console.log(`✓ Passed: ${this.results.passed}`);
    console.log(`⚠ Warnings: ${this.results.warnings}`);
    console.log(`✗ Failed: ${this.results.failed}`);

    if (this.errors.length > 0) {
      console.log('\n🚨 Errors:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    const success = this.results.failed === 0;
    console.log(`\n${success ? '🎉' : '❌'} Runtime tests ${success ? 'PASSED' : 'FAILED'}`);

    process.exit(success ? 0 : 1);
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new RuntimeTester();
  tester.runTests().catch(error => {
    console.error('Runtime test failed:', error);
    process.exit(1);
  });
}

module.exports = RuntimeTester;