#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'app');
const tempApiDir = path.join(process.cwd(), '.temp-api-backup');

function moveApiRoutes() {
  const apiDir = path.join(appDir, 'api');
  
  if (fs.existsSync(apiDir)) {
    // Create backup directory
    fs.mkdirSync(tempApiDir, { recursive: true });
    
    // Move API directory to temp location
    fs.renameSync(apiDir, path.join(tempApiDir, 'api'));
    console.log('✅ API routes temporarily moved for static export');
    return true;
  }
  
  return false;
}

function restoreApiRoutes() {
  const tempApiPath = path.join(tempApiDir, 'api');
  
  if (fs.existsSync(tempApiPath)) {
    // Move API directory back
    fs.renameSync(tempApiPath, path.join(appDir, 'api'));
    
    // Clean up temp directory  
    fs.rmSync(tempApiDir, { recursive: true, force: true });
    console.log('✅ API routes restored');
    return true;
  }
  
  return false;
}

function cleanBuildArtifacts() {
  const artifactsToClean = [
    '.next',
    'out',
    '.temp-api-backup'
  ];
  
  for (const artifact of artifactsToClean) {
    const artifactPath = path.join(process.cwd(), artifact);
    if (fs.existsSync(artifactPath)) {
      fs.rmSync(artifactPath, { recursive: true, force: true });
      console.log(`✅ Cleaned ${artifact}`);
    }
  }
}

const command = process.argv[2];

if (command === 'move') {
  moveApiRoutes();
} else if (command === 'restore') {
  restoreApiRoutes();
} else if (command === 'clean') {
  cleanBuildArtifacts();
} else {
  console.error('Usage: node exclude-api-routes.js [move|restore|clean]');
  process.exit(1);
}