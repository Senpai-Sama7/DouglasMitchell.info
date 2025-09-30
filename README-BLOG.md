# Personal Blog Setup Guide

## Quick Start

1. **Set up Sanity CMS**:
   ```bash
   npm install -g @sanity/cli
   sanity init
   ```
   - Choose "Create new project"
   - Select "Blog" template
   - Note your Project ID

2. **Configure Environment**:
   ```bash
   cp .env.example .env.local
   # Add your Sanity Project ID and Dataset
   ```

3. **Start Development**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/blog
   ```

4. **Access CMS Studio**:
   ```bash
   cd sanity-studio && npm run dev
   # Visit http://localhost:3333
   ```

## Drag-and-Drop Content Management

### Creating Blog Posts
1. Open Sanity Studio at `http://localhost:3333`
2. Click "Blog Posts" → "Create"
3. Drag and drop images, videos, code snippets
4. Use rich text editor with visual blocks
5. Set categories, tags, and featured status
6. Publish instantly

### Media Management
- Upload images, videos, documents
- Organize with tags and categories
- Automatic optimization and CDN delivery
- Drag media into blog posts

### Bento Grid Layout
The blog automatically arranges posts in a dynamic Bento grid:
- Featured posts get larger tiles
- Mixed sizes create visual interest
- Responsive across all devices
- Hover effects and smooth animations

## Visual LLM Integration

### Using the Visual Assistant
1. Click the floating wand icon (bottom-right)
2. Choose "Visual Edit" or "Code Edit"
3. Describe changes in natural language
4. AI applies changes automatically

### Example Commands
- "Make the header more colorful"
- "Add a dark mode toggle"
- "Increase spacing between blog cards"
- "Change the accent color to green"

## GitHub Deployment

### Automatic Deployment
- Push to `main` branch triggers deployment
- Built site deploys to GitHub Pages
- CDN-optimized static files
- Zero-downtime updates

### Manual Deployment
```bash
npm run build
npm run export
# Upload `out/` folder to any static host
```

## Customization

### Design System
- Halcyon-inspired glassmorphism
- Cyan/purple gradient accents
- Backdrop blur effects
- Smooth micro-interactions

### Adding New Content Types
1. Create schema in `sanity/schemas/`
2. Add to `index.ts`
3. Update queries in `lib/sanity.ts`
4. Build components in `components/`

### Performance
- Automatic image optimization
- Lazy loading
- Progressive enhancement
- Sub-2s load times maintained

## Hosting Options

### Recommended: Vercel + Sanity
- Zero-config deployment
- Edge CDN
- Automatic HTTPS
- Preview deployments

### Alternative: GitHub Pages
- Free hosting
- Custom domains
- Automatic SSL
- Git-based workflow

### Self-Hosted Options
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Support

For issues or questions:
1. Check Sanity documentation
2. Review Next.js guides
3. Open GitHub issue
4. Use Visual LLM assistant for quick fixes
