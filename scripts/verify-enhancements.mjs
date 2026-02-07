#!/usr/bin/env node

/**
 * Production Enhancements Verification Script
 * 
 * Checks that all critical enhancements are properly implemented
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const checks = {
  passed: [],
  failed: [],
  warnings: [],
};

function checkFile(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  if (fs.existsSync(fullPath)) {
    checks.passed.push(`✅ ${description}`);
    return true;
  } else {
    checks.failed.push(`❌ ${description}`);
    return false;
  }
}

function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(rootDir, filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(searchString)) {
      checks.passed.push(`✅ ${description}`);
      return true;
    } else {
      checks.failed.push(`❌ ${description}`);
      return false;
    }
  } else {
    checks.failed.push(`❌ ${description} (file not found)`);
    return false;
  }
}

function warn(message) {
  checks.warnings.push(`⚠️  ${message}`);
}

console.log('\n🔍 Verifying Production Enhancements...\n');

// Critical Components
console.log('📦 Checking Critical Components:');
checkFile('components/AnimatedCounter.tsx', 'AnimatedCounter component exists');
checkFile('components/GitHubRepos.tsx', 'GitHubRepos component exists');
checkFile('components/WebVitals.tsx', 'WebVitals monitoring component exists');

// API Routes
console.log('\n🔌 Checking API Routes:');
checkFile('app/api/github/repos/route.ts', 'GitHub repos API endpoint exists');
checkFile('app/api/vitals/route.ts', 'Web vitals API endpoint exists');

// Configuration Files
console.log('\n⚙️  Checking Configuration:');
checkFile('next.config.js', 'Next.js config exists');
checkFile('middleware.ts', 'Middleware exists');
checkFileContent('next.config.js', 'image/avif', 'Image optimization with AVIF configured');
checkFileContent('middleware.ts', 'Content-Security-Policy', 'Security headers in middleware');

// Documentation
console.log('\n📚 Checking Documentation:');
checkFile('docs/PRODUCTION_ENHANCEMENTS.md', 'Enhancement documentation exists');
checkFile('.env.production.example', 'Environment variables template exists');

// Security Checks
console.log('\n🔒 Security Verification:');
checkFileContent('middleware.ts', 'X-Frame-Options', 'X-Frame-Options header configured');
checkFileContent('middleware.ts', 'Strict-Transport-Security', 'HSTS header configured');
checkFileContent('middleware.ts', 'X-Content-Type-Options', 'X-Content-Type-Options configured');

// Performance Checks
console.log('\n⚡ Performance Configuration:');
checkFileContent('next.config.js', 'swcMinify', 'SWC minification enabled');
checkFileContent('next.config.js', 'compress', 'Compression enabled');
checkFileContent('next.config.js', 'optimizeCss', 'CSS optimization configured');

// Build Checks
console.log('\n🏗️  Build Configuration:');
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')
  );
  
  if (packageJson.dependencies?.['next']) {
    checks.passed.push('✅ Next.js dependency present');
  } else {
    checks.failed.push('❌ Next.js dependency missing');
  }
  
  if (packageJson.dependencies?.['framer-motion']) {
    checks.passed.push('✅ Framer Motion for animations present');
  } else {
    warn('Framer Motion not installed (optional for enhanced animations)');
  }
} catch (error) {
  checks.failed.push('❌ Could not read package.json');
}

// Environment Variables Check
console.log('\n🌍 Environment Variables:');
if (fs.existsSync(path.join(rootDir, '.env.local'))) {
  checks.passed.push('✅ .env.local exists (development config)');
} else {
  warn('.env.local not found (create from .env.example)');
}

if (process.env.GITHUB_TOKEN) {
  checks.passed.push('✅ GITHUB_TOKEN configured (higher rate limits)');
} else {
  warn('GITHUB_TOKEN not set (API rate limit will be 60/hour instead of 5000/hour)');
}

// Print Results
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION RESULTS');
console.log('='.repeat(60) + '\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSED CHECKS:');
  checks.passed.forEach((check) => console.log(`   ${check}`));
  console.log('');
}

if (checks.warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  checks.warnings.forEach((warning) => console.log(`   ${warning}`));
  console.log('');
}

if (checks.failed.length > 0) {
  console.log('❌ FAILED CHECKS:');
  checks.failed.forEach((check) => console.log(`   ${check}`));
  console.log('');
}

console.log('='.repeat(60));
console.log('SUMMARY:');
console.log(`  ✅ Passed: ${checks.passed.length}`);
console.log(`  ⚠️  Warnings: ${checks.warnings.length}`);
console.log(`  ❌ Failed: ${checks.failed.length}`);
console.log('='.repeat(60) + '\n');

if (checks.failed.length > 0) {
  console.log('❌ Some checks failed. Please review the issues above.\n');
  process.exit(1);
} else if (checks.warnings.length > 0) {
  console.log('⚠️  All critical checks passed, but there are warnings to address.\n');
  process.exit(0);
} else {
  console.log('✅ All checks passed! Production enhancements verified.\n');
  process.exit(0);
}
