# Create the main Next.js configuration for GitHub Pages deployment
nextjs_config = '''// next.config.js - GitHub Pages optimized configuration
/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'
const repoName = 'your-blog-repo' // Replace with your actual repo name

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? `/${repoName}/` : '',
  basePath: isProd ? `/${repoName}` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repoName}` : '',
    NEXT_PUBLIC_BUILDER_API_KEY: process.env.NEXT_PUBLIC_BUILDER_API_KEY,
    NEXT_PUBLIC_ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig'''

print("Next.js configuration created for GitHub Pages deployment!")

# Create package.json for the project
package_json = '''{
  "name": "bento-blog-github",
  "version": "1.0.0",
  "description": "AI-powered bento grid blog with Builder.io CMS and GitHub hosting",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export",
    "deploy": "npm run build && touch out/.nojekyll && gh-pages -d out -t true",
    "setup": "node scripts/setup-builder.js"
  },
  "dependencies": {
    "@builder.io/react": "^3.2.7",
    "@builder.io/sdk": "^3.0.0",
    "@anthropic-ai/sdk": "^0.24.3",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.263.0",
    "clsx": "^2.0.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.45.0",
    "eslint-config-next": "^14.0.0",
    "gh-pages": "^6.0.0",
    "postcss": "^8.4.0",
    "typescript": "^5.0.0"
  }
}'''

print("Package.json created with all dependencies!")

# Create GitHub Actions workflow for automated deployment
github_workflow = '''name: Deploy Blog to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_BUILDER_API_KEY: ${{ secrets.BUILDER_API_KEY }}
        NEXT_PUBLIC_ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: ./out
        
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v3'''

print("GitHub Actions workflow created for automatic deployment!")

# Save files
with open('next.config.js', 'w') as f:
    f.write(nextjs_config)

with open('package.json', 'w') as f:
    f.write(package_json)

with open('deploy.yml', 'w') as f:
    f.write(github_workflow)

print("✅ GitHub hosting configuration files created!")
print("\nFiles generated:")
print("- next.config.js (GitHub Pages configuration)")
print("- package.json (Dependencies and scripts)")  
print("- deploy.yml (GitHub Actions workflow)")