#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 Starting optimized build process...');

// Clean previous builds
if (fs.existsSync('out')) {
  fs.rmSync('out', { recursive: true, force: true });
}
if (fs.existsSync('deploy')) {
  fs.rmSync('deploy', { recursive: true, force: true });
}

console.log('🧹 Cleaned previous builds');

// Build Next.js app
console.log('📦 Building Next.js application...');
exec('npm run build', { env: { ...process.env, NODE_ENV: 'production' } }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Next.js build failed:', error);
    process.exit(1);
  }

  console.log('✅ Next.js build completed');
  console.log('📁 Preparing deployment structure...');

  // Create deployment directory
  fs.mkdirSync('deploy', { recursive: true });

  // Copy static files
  const staticFiles = [
    'index.html',
    'manifest.webmanifest',
    'styles.css',
    'script.js',
    '.nojekyll',
    'robots.txt'
  ];

  staticFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('deploy', file));
      console.log(`📄 Copied ${file}`);
    }
  });

  // Copy assets directory
  if (fs.existsSync('assets')) {
    fs.cpSync('assets', 'deploy/assets', { recursive: true });
    console.log('🖼️  Copied assets directory');
  }

  // Copy Next.js output to /app subdirectory
  if (fs.existsSync('out')) {
    fs.mkdirSync('deploy/app', { recursive: true });
    fs.cpSync('out', 'deploy/app', { recursive: true });
    console.log('⚛️  Copied Next.js app to /app');
  }

  // Ensure .nojekyll exists
  fs.writeFileSync('deploy/.nojekyll', '');

  console.log('✅ Deployment structure ready in ./deploy');
  console.log('🎉 Build process completed successfully!');

  // Show deployment structure
  console.log('\n📂 Deployment structure:');
  showDirectoryStructure('deploy', '', 2);
});

function showDirectoryStructure(dir, prefix = '', maxDepth = 2, currentDepth = 0) {
  if (currentDepth >= maxDepth) return;

  try {
    const items = fs.readdirSync(dir);
    items.forEach((item, index) => {
      const itemPath = path.join(dir, item);
      const isLast = index === items.length - 1;
      const connector = isLast ? '└── ' : '├── ';

      console.log(prefix + connector + item);

      if (fs.statSync(itemPath).isDirectory() && currentDepth < maxDepth - 1) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        showDirectoryStructure(itemPath, newPrefix, maxDepth, currentDepth + 1);
      }
    });
  } catch (err) {
    console.log(prefix + '└── (error reading directory)');
  }
}